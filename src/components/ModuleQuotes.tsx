import React from 'react';
import ArchitectureCalculator from './ArchitectureCalculator';
import { ViewState } from '../types';

const ModuleQuotes: React.FC<{onBack: () => void; onNavigate?: (view: ViewState) => void}> = ({ onBack }) => {
  return <ArchitectureCalculator onBack={onBack} />;
};

export default ModuleQuotes;
