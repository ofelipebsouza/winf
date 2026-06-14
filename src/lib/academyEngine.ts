// --- WINF OS™ // WINF ACADEMY ENGINE ---

export interface AcademyCertificationCriteria {
  precisaoAcabamento: number;
  zeroBolhas: number;
  conformidadeDigital: number;
  organizacaoBaia: number;
}

const AcademyEngine = {
  // Critérios de avaliação conforme Documento 17, pág 3
  criteriosCertificacao: {
    precisaoAcabamento: 0.30,
    zeroBolhas: 0.40,
    conformidadeDigital: 0.10,
    organizacaoBaia: 0.20
  } as AcademyCertificationCriteria,

  // Processa a aprovação e libera a chave de API territorial
  finalizarCertificacao: async (alunoId: string, score: number) => {
    if (score >= 0.90) { // Mínimo de 90% para homologação
      console.log(`[WINF ACADEMY] Certificado emitido para: ${alunoId}`);
      
      // Integração automática com o Territory Gate:
      // Ao certificar, o sistema libera a autorização para rodar a API da praça
      return { certificado: true, status: "HOMOLOGADO" as const };
    } else {
      return { certificado: false, status: "RECICLAGEM_TECNICA_NECESSARIA" as const };
    }
  }
};

export default AcademyEngine;
