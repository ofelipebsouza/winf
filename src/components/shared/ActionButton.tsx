import React from 'react';
import Governance from '../../lib/governance';
import { useWinf } from '../../contexts/WinfContext';

interface ActionButtonProps {
  id: string; // The permission level identifier or user context role
  actionType: string; // Ex: 'AUDITAR', 'LIBERAR', 'RECOMPRA'
  onClick: () => void;
  requiredLevel?: 'LEVEL_ALPHA_ROOT' | 'LEVEL_BETA_AUDIT' | 'LEVEL_GAMMA_OP' | string;
  className?: string;
}

/**
 * ActionButton - High-governance component for executing operations
 * Verifies role permissions via Governance before rendering.
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  id,
  actionType,
  onClick,
  requiredLevel = 'LEVEL_GAMMA_OP',
  className = ''
}) => {
  const { user } = useWinf();
  
  // Use user's role from context (e.g., LEVEL_ALPHA_ROOT), or fallback to string id provided
  const userRole = user?.role || id;

  // Security gate verification before rendering
  if (!Governance.checkPermission(userRole, requiredLevel)) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={`winf-btn px-6 py-3 bg-white text-black hover:bg-zinc-200 uppercase font-black tracking-widest text-[11px] font-mono transition-all duration-200 active:scale-95 select-none ${className}`}
      style={{ border: 'none', cursor: 'pointer' }}
    >
      {actionType.toUpperCase()}
    </button>
  );
};

// Also expose a raw string generator to align matching dynamic HTML snippets exactly with user examples
export const getLegacyActionButtonHtml = (id: string, actionType: string, requiredLevel = 'LEVEL_GAMMA_OP'): string | null => {
  if (!Governance.checkPermission(id, requiredLevel)) {
    return null;
  }

  return `
    <button class="winf-btn" onclick="execute('${actionType}')">
        ${actionType.toUpperCase()}
    </button>
  `;
};

export default ActionButton;
