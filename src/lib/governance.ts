// --- WINF OS™ // GOVERNANCE CORE v1.119 ---
export interface GovernanceToken {
  uid: string;
  role: 'LEVEL_ALPHA_ROOT' | 'LEVEL_BETA_AUDIT' | 'LEVEL_GAMMA_OP' | string;
  email?: string;
  name?: string;
}

const Governance = {
  hierarchy: {
    FOUNDER: "LEVEL_ALPHA_ROOT" as const,
    INVESTOR: "LEVEL_BETA_AUDIT" as const,
    LICENSEE: "LEVEL_GAMMA_OP" as const
  },
    
  // Trava de segurança baseada no documento 15 (Manual de Operações)
  validateAccess: (token: GovernanceToken | null | undefined, requiredLevel: 'LEVEL_ALPHA_ROOT' | 'LEVEL_BETA_AUDIT' | 'LEVEL_GAMMA_OP' | string) => {
    if (!token) return { granted: false, error: "AUTH_REQUIRED" };
    
    // Hierarchy checking: alpha root has power over everything, beta audit has power over beta & gamma, gamma has power only over gamma
    const roleValues: Record<string, number> = {
      'LEVEL_ALPHA_ROOT': 3,
      'LEVEL_BETA_AUDIT': 2,
      'LEVEL_GAMMA_OP': 1
    };

    const userPower = roleValues[token.role] || 0;
    const requiredPower = roleValues[requiredLevel] || 0;

    if (userPower >= requiredPower) {
      return { granted: true, level: token.role };
    }

    return { granted: false, error: "ACCESS_DENIED", userLevel: token.role, requiredLevel };
  },

  checkPermission: (role: string | null | undefined, requiredLevel: 'LEVEL_ALPHA_ROOT' | 'LEVEL_BETA_AUDIT' | 'LEVEL_GAMMA_OP' | string = 'LEVEL_GAMMA_OP'): boolean => {
    if (!role) return false;
    const roleValues: Record<string, number> = {
      'LEVEL_ALPHA_ROOT': 3,
      'LEVEL_BETA_AUDIT': 2,
      'LEVEL_GAMMA_OP': 1
    };
    const userPower = roleValues[role] || 0;
    const requiredPower = roleValues[requiredLevel] || 0;
    return userPower >= requiredPower;
  }
};

export default Governance;
