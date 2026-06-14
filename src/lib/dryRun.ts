// --- SCRIPT DE DRY RUN (VALIDAÇÃO DE PONTAS) ---
import RayEngine from './wnoEngine';
import BlackShopEngine from './blackShopEngine';

export async function runDryRun(): Promise<{ sucesso: boolean; message: string; data?: any }> {
  console.log("--- INICIANDO DRY RUN WINF OS™ ---");
  
  try {
    // 1. W-NO processa a venda
    const venda = await RayEngine.processarVenda(
      { id: "LEAD_001", name: "Lead Teste Dry Run", city: "Santos_SP" }, 
      "SELECT_INVISIBLE", 
      15
    );
    
    // 2. BlackShop abate estoque
    const estoque = await BlackShopEngine.abaterEstoque("SELECT_INVISIBLE", 15);
    
    // 3. Validação final
    if (venda.hash && estoque.sucesso) {
      const message = "✅ SISTEMA INTEGRADO COM SUCESSO. LASTRO AUDITADO.";
      console.log(message);
      return {
        sucesso: true,
        message,
        data: { venda, estoque }
      };
    } else {
      const message = "❌ FALHA NA INTEGRAÇÃO. VERIFICAR LOGS.";
      console.error(message);
      return {
        sucesso: false,
        message,
        data: { venda, estoque }
      };
    }
  } catch (error: any) {
    const errorMsg = `❌ ERRO EXCEPCIONAL DURANTE DRY RUN: ${error?.message || error}`;
    console.error(errorMsg);
    return {
      sucesso: false,
      message: errorMsg
    };
  }
}

// Permitir execução via console ou importações externas
if (typeof window !== 'undefined') {
  (window as any).runWinfDryRun = runDryRun;
}
