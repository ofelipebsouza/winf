import { TechEngine, ProjetoCorte } from './techEngine';
import { BusinessCore } from './businessCore';

/* --- WINF OS™ // INTEGRATION SCRIPT: TECH_ENGINE_TO_CORE --- */

export interface ProjetoCorteOS extends ProjetoCorte {
    sku: string;
    quantidade: number;
}

export const IntegrationEngine = {
    processarCorteECompletarOS: async (projeto: ProjetoCorteOS, osId: string) => {
        console.log(`[CORE] Iniciando automação para OS: ${osId}`);

        // 1. Executa a Inteligência de Corte
        const resultadoCorte = TechEngine.otimizarCorte(projeto);
        console.log(`[TECH] Eficiência de corte: ${resultadoCorte.aproveitamento}`);

        // 2. Blindagem: Validação de Eficiência (Regra de Ouro)
        if (parseFloat(resultadoCorte.aproveitamento) < 90) {
            console.warn("[ALERT] Eficiência abaixo de 90%. Bloqueando Lastro.");
            return { status: "BLOQUEADO", motivo: "DESPERDICIO_ALTO" };
        }

        // 3. Integração com Business Core (Baixa Automática e Auditoria)
        const lastro = await BusinessCore.sincronizarLastro(
            projeto.sku,
            projeto.quantidade,
            `HASH_${Date.now()}_${osId}`
        );

        console.log(`[CORE] Lastro sincronizado com sucesso: ${lastro.hash}`);
        return { status: "OS_CONCLUIDA", hash: lastro.hash };
    }
};

export default IntegrationEngine;
