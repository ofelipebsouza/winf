import { db } from "../lib/firebase";
import { doc, runTransaction, getDoc, setDoc } from "firebase/firestore";
import { calcularTetoConsumoOST } from "../components/ModuleWinfChain";

export interface DadosConsumoOS {
  unidadeId: string;
  osId: string;
  areaTeoricaM2: number;
  consumoRealM2: number;
  metodoCorte: "DIGITAL_PLOTTER" | "MANUAL_LINEAR";
  nivelComplexidade: "ARQUITETONICO_PLANO" | "AUTOMOTIVO_PADRAO" | "AUTOMOTIVO_COMPLEXO" | "COMPLEXO_AUTOMOTIVO";
  linhaFilme: "BlackShield" | "DiamondView" | "PhantomStrike";
  justificativaQuebra?: string;
}

/**
 * Executa a liquidação da OS no Ledger da Nuvem com Trava Digital ativa
 */
export async function liquidarOrdemServicoOST(dados: DadosConsumoOS): Promise<string> {
  const unidadeRef = doc(db, "unidades", dados.unidadeId);
  const osRef = doc(db, "ordens_servico", dados.osId);
  const ledgerRef = doc(db, "ledger_transacoes", `TX_${dados.osId}`);

  // Normalização de COMPLEXO_AUTOMOTIVO -> AUTOMOTIVO_COMPLEXO para compatibilidade com o motor
  const nivelComplexidadeNormalizado = dados.nivelComplexidade === "COMPLEXO_AUTOMOTIVO" 
    ? "AUTOMOTIVO_COMPLEXO" 
    : dados.nivelComplexidade;

  // 1. Calcula o teto dinâmico permitido pelo motor de precisão
  const tetoPermitido = calcularTetoConsumoOST({
    areaTeoricaM2: dados.areaTeoricaM2,
    metodoCorte: dados.metodoCorte,
    nivelComplexidade: nivelComplexidadeNormalizado as "ARQUITETONICO_PLANO" | "AUTOMOTIVO_PADRAO" | "AUTOMOTIVO_COMPLEXO"
  });

  // Garantia de auto-cura: Se o documento da unidade não existir, vamos criá-lo para evitar erros iniciais no sandbox.
  const checkSnap = await getDoc(unidadeRef);
  if (!checkSnap.exists()) {
    await setDoc(unidadeRef, {
      id: dados.unidadeId,
      name: `Unidade Franqueada #${dados.unidadeId.substring(0, 5).toUpperCase()}`,
      partnerEmail: "marketing.advanced.windowfilm@gmail.com",
      walletM2: 250.0,
      saldoM2: 250.0,
      warningsCount: 0,
      status: "NORMAL",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // 2. Executa a transação atômica no banco de dados do Firestore
  return await runTransaction(db, async (transaction) => {
    const unidadeDoc = await transaction.get(unidadeRef);
    
    if (!unidadeDoc.exists()) {
      throw new Error("Unidade operacional não localizada no ecossistema.");
    }

    const docData = unidadeDoc.data();
    // Leitura tolerante de saldo para compatibilidade de chaves
    const saldoAtualM2 = (docData.walletM2 !== undefined ? docData.walletM2 : (docData.saldoM2 !== undefined ? docData.saldoM2 : 250.0));

    // Validação de estoque crítico
    if (saldoAtualM2 < dados.consumoRealM2) {
      throw new Error(`Saldo de m² insuficiente para esta operação (Saldo atual: ${saldoAtualM2}m², Necessário: ${dados.consumoRealM2}m²). Bloqueio Nível 1.`);
    }

    // Validação da Trava Digital (Guarda Falso Positivo)
    if (dados.consumoRealM2 > tetoPermitido && !dados.justificativaQuebra) {
      throw new Error(`Consumo (${dados.consumoRealM2}m²) acima do teto permitido (${tetoPermitido}m²) para esta geometria. Requer justificativa técnica.`);
    }

    // 3. Atualiza o saldo da carteira digital da unidade
    const novoSaldoM2 = Number((saldoAtualM2 - dados.consumoRealM2).toFixed(2));
    const updates: Record<string, any> = {
      walletM2: novoSaldoM2,
      saldoM2: novoSaldoM2,
      updatedAt: new Date()
    };
    
    if (dados.justificativaQuebra) {
      updates.warningsCount = (docData.warningsCount || 0) + 1;
      if (updates.warningsCount >= 3) {
        updates.status = "AUDITORIA";
      }
    }
    
    transaction.update(unidadeRef, updates);

    // 4. Cria a Ordem de Serviço liquidada
    const newOsData = {
      id: dados.osId,
      unidadeId: dados.unidadeId,
      user_id: docData.user_id || docData.id || dados.unidadeId,
      areaTeoricaM2: dados.areaTeoricaM2,
      actualM2: dados.consumoRealM2,
      metodoCorte: dados.metodoCorte,
      nivelComplexidade: nivelComplexidadeNormalizado,
      justification: dados.justificativaQuebra || "",
      tetoCalculadoM2: tetoPermitido,
      linhaFilme: dados.linhaFilme,
      status: dados.justificativaQuebra ? "EXCEPTION" : "SEALED",
      createdAt: new Date()
    };
    transaction.set(osRef, newOsData);

    // 5. Injeta o registro no livro-razão imutável (Lastro para o Certificado)
    const dadosLedger = {
      id: `TX_${dados.osId}`,
      unidadeId: dados.unidadeId,
      user_id: docData.user_id || docData.id || dados.unidadeId,
      hash: "WxF" + Math.random().toString(16).substring(2, 18).toUpperCase(),
      type: "OS_SETTLE",
      tipo: "SAIDA_OPERACIONAL",
      osId: dados.osId,
      quantidadeM2: dados.consumoRealM2,
      m2Change: -dados.consumoRealM2,
      details: dados.justificativaQuebra 
        ? `Consumo Excedente Reconciliado: ${dados.justificativaQuebra}` 
        : `Consumo Normal Liquidado`,
      linhaFilme: dados.linhaFilme,
      status: dados.justificativaQuebra ? "EXCEPTION" : "SEALED",
      createdAt: new Date()
    };
    transaction.set(ledgerRef, dadosLedger);

    // Retorna o ID da transação do ledger para uso no futuro certificado
    return ledgerRef.id;
  });
}
