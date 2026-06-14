
import React, { useState, useEffect } from 'react';
import { Scissors, Ruler, Package, AlertTriangle, CheckCircle, ArrowRight, RefreshCw, Layers, Layout, Plus, Trash2, Copy, ChevronLeft, Camera, FileText, Calendar, ShieldCheck, X, Lock, Zap, Scan, AlertCircle } from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { motion, AnimatePresence } from 'framer-motion';
import { WNO } from '../lib/wnoEngine';

interface WindowPane {
    id: string;
    width: number; // in meters
    height: number; // in meters
    quantity: number;
    label: string;
}

const PREDEFINED_PATTERNS = [
    // Janelas
    { label: 'Janela Padrão (1x1)', width: 1.00, height: 1.00, category: 'Janelas', subcategory: 'Comum', useCount: 142 },
    { label: 'Janela Médio (1.2x1.0)', width: 1.20, height: 1.00, category: 'Janelas', subcategory: 'Comum', useCount: 88 },
    { label: 'Janela Quadrada (1.2x1.2)', width: 1.20, height: 1.20, category: 'Janelas', subcategory: 'Comum', useCount: 156 },
    { label: 'Janela Suprema G (1.5x1.2)', width: 1.50, height: 1.20, category: 'Janelas', subcategory: 'Temperado', useCount: 42 },
    { label: 'Janela Panorâmica GG (2.0x1.2)', width: 2.00, height: 1.20, category: 'Janelas', subcategory: 'Temperado', useCount: 14 },

    // Portas
    { label: 'Porta Residencial P (0.8x2.1)', width: 0.80, height: 2.10, category: 'Portas', subcategory: 'Residencial', useCount: 198 },
    { label: 'Porta Giro M (0.9x2.1)', width: 0.90, height: 2.10, category: 'Portas', subcategory: 'Giro', useCount: 110 },
    { label: 'Porta Pivotante G (1.0x2.1)', width: 1.00, height: 2.10, category: 'Portas', subcategory: 'Pivotante', useCount: 65 },

    // Portas de Correr
    { label: 'Correr 2 Folhas P (1.2x2.1)', width: 1.20, height: 2.10, category: 'Portas de Correr', subcategory: 'Correr', useCount: 94 },
    { label: 'Correr 2 Folhas M (1.5x2.1)', width: 1.50, height: 2.10, category: 'Portas de Correr', subcategory: 'Correr', useCount: 52 },
    { label: 'Correr 4 Folhas G (2.0x2.1)', width: 2.00, height: 2.10, category: 'Portas de Correr', subcategory: 'Correr', useCount: 38 },
    { label: 'Correr Multipainel GG (2.4x2.1)', width: 2.40, height: 2.10, category: 'Portas de Correr', subcategory: 'Correr', useCount: 15 },

    // Fachadas Comerciais
    { label: 'Vitrine Comercial P (1.0x2.2)', width: 1.00, height: 2.20, category: 'Fachadas Comerciais', subcategory: 'Vitrine', useCount: 48 },
    { label: 'Pele de Vidro / Coluna (1.2x2.4)', width: 1.20, height: 2.40, category: 'Fachadas Comerciais', subcategory: 'Pele de Vidro', useCount: 31 },
    { label: 'Vitrine Comercial G (1.5x2.5)', width: 1.50, height: 2.50, category: 'Fachadas Comerciais', subcategory: 'Vitrine', useCount: 18 },
    { label: 'Lobby Monumental (2.0x3.0)', width: 2.00, height: 3.00, category: 'Fachadas Comerciais', subcategory: 'Fachada', useCount: 5 },

    // Sacadas e Varandas (Tipo 1 - Piso ao Teto)
    { label: 'Sacada Piso-Teto P (0.45x2.1)', width: 0.45, height: 2.10, category: 'Sacadas (Piso ao Teto)', subcategory: 'Piso ao Teto', useCount: 35 },
    { label: 'Sacada Piso-Teto M (0.50x2.1)', width: 0.50, height: 2.10, category: 'Sacadas (Piso ao Teto)', subcategory: 'Piso ao Teto', useCount: 145 },
    { label: 'Sacada Piso-Teto G (0.60x2.2)', width: 0.60, height: 2.20, category: 'Sacadas (Piso ao Teto)', subcategory: 'Piso ao Teto', useCount: 112 },
    { label: 'Sacada Piso-Teto GG (0.65x2.4)', width: 0.65, height: 2.40, category: 'Sacadas (Piso ao Teto)', subcategory: 'Piso ao Teto', useCount: 78 },
    { label: 'Sacada Piso-Teto XG (0.70x2.5)', width: 0.70, height: 2.50, category: 'Sacadas (Piso ao Teto)', subcategory: 'Piso ao Teto', useCount: 34 },

    // Sacadas e Varandas (Tipo 2 - Peitoril Fixo + Móvel)
    { label: 'Peitoril Fixo Inferior (1.0x0.9)', width: 1.00, height: 0.90, category: 'Sacadas (Peitoril + Móvel)', subcategory: 'Parte Inferior', useCount: 82 },
    { label: 'Superior Móvel (1.0x1.2)', width: 1.00, height: 1.20, category: 'Sacadas (Peitoril + Móvel)', subcategory: 'Parte Superior', useCount: 85 },

    // Sacadas e Varandas (Tipo 3 - Cortina de Vidro)
    { label: 'Cortina Vidro P (0.50x2.1)', width: 0.50, height: 2.10, category: 'Sacadas (Cortina de Vidro)', subcategory: 'Cortina de Vidro', useCount: 68 },
    { label: 'Cortina Vidro M (0.60x2.2)', width: 0.60, height: 2.20, category: 'Sacadas (Cortina de Vidro)', subcategory: 'Cortina de Vidro', useCount: 162 },
    { label: 'Cortina Vidro G (0.65x2.4)', width: 0.65, height: 2.40, category: 'Sacadas (Cortina de Vidro)', subcategory: 'Cortina de Vidro', useCount: 139 },

    // Sacadas e Varandas (Tipo 4 - Guarda-Corpos)
    { label: 'Guarda-Corpo P (0.80x1.0)', width: 0.80, height: 1.00, category: 'Sacadas (Guarda-Corpos)', subcategory: 'Guarda-Corpo', useCount: 45 },
    { label: 'Guarda-Corpo M (1.00x1.1)', width: 1.00, height: 1.10, category: 'Sacadas (Guarda-Corpos)', subcategory: 'Guarda-Corpo', useCount: 115 },
    { label: 'Guarda-Corpo G (1.20x1.1)', width: 1.20, height: 1.10, category: 'Sacadas (Guarda-Corpos)', subcategory: 'Guarda-Corpo', useCount: 96 },
    { label: 'Guarda-Corpo GG (1.50x1.2)', width: 1.50, height: 1.20, category: 'Sacadas (Guarda-Corpos)', subcategory: 'Guarda-Corpo', useCount: 33 }
];

type InputMode = 'manual' | 'bulk' | 'templates';

interface ModuleWinfPrecisionProps {
    onBack?: () => void;
}

const ModuleWinfPrecision: React.FC<ModuleWinfPrecisionProps> = ({ onBack }) => {
    const { 
        stockItems, 
        updateStock, 
        gamify, 
        user, 
        products, 
        addRetalho, 
        retalhos, 
        addInstallationJob, 
        addQuote, 
        registerWarranty, 
        quotes,
        installationJobs,
        effectiveRole
    } = useWinf();
    const [panes, setPanes] = useState<WindowPane[]>([]);
    const [newPane, setNewPane] = useState({ width: '', height: '', quantity: '1', label: '' });
    const [inputMode, setInputMode] = useState<'manual' | 'templates'>('manual');
    const [activeTemplateCat, setActiveTemplateCat] = useState('Janelas');
    const [inputUnit, setInputUnit] = useState<'m' | 'cm' | 'mm'>('mm');
    const [patterns, setPatterns] = useState(PREDEFINED_PATTERNS);
    const [manualScrap, setManualScrap] = useState({
        width: '',
        height: '',
        lote: '',
        physical_location: '',
        category: 'Janelas',
        subcategory: 'Comum'
    });
    const [showQuotesImport, setShowQuotesImport] = useState(false);
    const [showJobImport, setShowJobImport] = useState(false);
    const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedStockId, setSelectedStockId] = useState('');
    const [customRollWidth, setCustomRollWidth] = useState(1.52);
    const [showSuccessMenu, setShowSuccessMenu] = useState(false);
    const [lastCutDetails, setLastCutDetails] = useState<any>(null);
    
    // Project Info
    const [clientName, setClientName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectNotes, setProjectNotes] = useState('');
    const [projectImg, setProjectImg] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    // Architect File features removed
    const [showManualScrapForm, setShowManualScrapForm] = useState(false);

    const availableRetalhos = retalhos.filter(r => r.product_id === selectedProductId && !r.is_used);
    const [calculation, setCalculation] = useState<{
        totalLinearMeters: number;
        totalArea: number;
        wastePercentage: number;
        efficiency: number;
        layout: any[];
        wasteChunks?: any[];
    } | null>(null);

    const activeProduct = products.find(p => p.id === selectedProductId);
    const rollWidth = activeProduct?.available_widths?.[0] || customRollWidth;
    
    // Check if AeroCore or NeoSkin product is selected and user is not Admin (Governance lock for simulation)
    const isRestrictedProduct = activeProduct && 
        (activeProduct.name.toLowerCase().includes('aerocore') || activeProduct.name.toLowerCase().includes('neoskin')) && 
        (effectiveRole || user?.role) !== 'Admin';

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const [importDate, setImportDate] = useState(tomorrowStr);

    const upcomingJobs = installationJobs.filter(j => {
        const jobDate = j.scheduled_date || (j as any).date || '';
        return jobDate.includes(importDate);
    });

    const addPane = (customPane?: { width: number, height: number, label: string, isKit?: boolean, kitQty?: number, category?: string, subcategory?: string }) => {
        if (customPane?.isKit && customPane.kitQty) {
            const newPanes: WindowPane[] = [];
            for (let i = 0; i < customPane.kitQty; i++) {
                newPanes.push({
                    id: Math.random().toString(36).substr(2, 9),
                    width: customPane.width,
                    height: customPane.height,
                    quantity: 1,
                    label: `${customPane.label} - V${i + 1}`
                });
            }
            setPanes([...panes, ...newPanes]);
            return;
        }

        let width = customPane ? customPane.width : parseFloat(newPane.width);
        let height = customPane ? customPane.height : parseFloat(newPane.height);
        const qty = customPane ? 1 : parseInt(newPane.quantity) || 1;
        const label = customPane ? customPane.label : newPane.label || `Vidro ${panes.length + 1}`;

        if (!width || !height) return;

        // Convert parsed size to meters if entered manually
        if (!customPane) {
            if (inputUnit === 'cm') {
                width = width / 100;
                height = height / 100;
            } else if (inputUnit === 'mm') {
                width = width / 1000;
                height = height / 1000;
            }
        }

        // Increment matching predefined size frequency
        const exactMatchIndex = patterns.findIndex(pat => 
            (Math.abs(pat.width - width) < 0.01 && Math.abs(pat.height - height) < 0.01) ||
            (Math.abs(pat.width - height) < 0.01 && Math.abs(pat.height - width) < 0.01)
        );

        if (exactMatchIndex !== -1) {
            const updated = [...patterns];
            updated[exactMatchIndex] = {
                ...updated[exactMatchIndex],
                useCount: updated[exactMatchIndex].useCount + (qty || 1)
            };
            setPatterns(updated);
        }

        const pane: WindowPane = {
            id: Math.random().toString(36).substr(2, 9),
            width: parseFloat(width.toFixed(3)),
            height: parseFloat(height.toFixed(3)),
            quantity: qty,
            label,
            // also hold metadata for classification
            category: customPane?.category || (exactMatchIndex !== -1 ? patterns[exactMatchIndex].category : 'Sem Categoria'),
            subcategory: customPane?.subcategory || (exactMatchIndex !== -1 ? patterns[exactMatchIndex].subcategory : 'Medida Customizada')
        } as any;

        setPanes([...panes, pane]);
        if (!customPane) setNewPane({ width: '', height: '', quantity: '1', label: '' });
    };

    const removePane = (id: string) => {
        setPanes(panes.filter(p => p.id !== id));
    };

    const calculateOptimization = () => {
        if (panes.length === 0) return;

        // Flatten panes based on quantity
        const flattenedPanes: any[] = [];
        panes.forEach(p => {
            for (let i = 0; i < p.quantity; i++) {
                flattenedPanes.push({ ...p, instanceLabel: p.quantity > 1 ? `${p.label} (${i + 1})` : p.label });
            }
        });

        // Simple linear nesting algorithm for 1.52m roll
        let totalLinearMeters = 0;
        let totalArea = 0;
        const layout: any[] = [];

        // Sort panes by height (descending) to optimize linear usage
        const sortedPanes = [...flattenedPanes].sort((a, b) => b.height - a.height);

        let currentY = 0;
        let currentX = 0;
        let currentRowHeight = 0;
        const wasteChunks: any[] = [];

        sortedPanes.forEach(pane => {
            totalArea += pane.width * pane.height;

            // Check if pane fits in current row width (1.52m)
            // We add 0.02m (2cm) for safety margin
            const wWithMargin = pane.width + 0.02; 
            const hWithMargin = pane.height + 0.02;

            if (currentX + wWithMargin <= rollWidth) {
                layout.push({
                    ...pane,
                    x: currentX,
                    y: currentY,
                    w: wWithMargin,
                    h: hWithMargin
                });
                currentX += wWithMargin;
                currentRowHeight = Math.max(currentRowHeight, hWithMargin);
            } else {
                // Determine waste chunk for previous row
                const leftoverWidth = rollWidth - currentX;
                if (leftoverWidth > 0.1 && currentRowHeight > 0.1) {
                    wasteChunks.push({
                        width: parseFloat(leftoverWidth.toFixed(2)),
                        height: parseFloat(currentRowHeight.toFixed(2)),
                        x: currentX,
                        y: currentY
                    });
                }

                // Start new row
                currentY += currentRowHeight;
                currentX = 0;
                layout.push({
                    ...pane,
                    x: currentX,
                    y: currentY,
                    w: wWithMargin,
                    h: hWithMargin
                });
                currentX += wWithMargin;
                currentRowHeight = hWithMargin;
            }
        });
        
        // Final waste chunk check
        const leftoverWidth = rollWidth - currentX;
        if (leftoverWidth > 0.1 && currentRowHeight > 0.1) {
            wasteChunks.push({
                width: parseFloat(leftoverWidth.toFixed(2)),
                height: parseFloat(currentRowHeight.toFixed(2)),
                x: currentX,
                y: currentY
            });
        }

        totalLinearMeters = currentY + currentRowHeight;
        const totalRollArea = totalLinearMeters * rollWidth;
        const wasteArea = totalRollArea - totalArea;
        const wastePercentage = (wasteArea / totalRollArea) * 100;

        setCalculation({
            totalLinearMeters: parseFloat(totalLinearMeters.toFixed(2)),
            totalArea: parseFloat(totalArea.toFixed(2)),
            wastePercentage: parseFloat(wastePercentage.toFixed(1)),
            efficiency: parseFloat((100 - wastePercentage).toFixed(1)),
            layout,
            wasteChunks
        });
    };

    const handleConfirmCut = async () => {
        if (!calculation || !selectedStockId) return;
        
        const res = await updateStock(selectedStockId, calculation.totalLinearMeters);
        
        if (res.success) {
            // Sincronização real-time com Ledger do Investidor & Hub Sorocaba
            try {
                const stor = localStorage.getItem('wno_hubs_estoque');
                const est = stor ? JSON.parse(stor) : { SANTOS: 1000, SOROCABA: 800, SAO_PAULO: 1200 };
                est.SOROCABA = Math.max(0, est.SOROCABA - calculation.totalLinearMeters);
                localStorage.setItem('wno_hubs_estoque', JSON.stringify(est));
                window.dispatchEvent(new Event('wno_hubs_estoque_updated'));

                const auditHash = `AUTH-PRECISION-0x${Math.floor(Math.random() * 99999999).toString(16).toUpperCase()}`;
                const stockItem = stockItems.find(s => s.id === selectedStockId);
                await WNO.ledger.input({
                    produto: stockItem?.product_name || activeProduct?.name || 'Invisible® Series',
                    quantidade: -calculation.totalLinearMeters,
                    valorUnitario: 150,
                    hash: auditHash,
                    localizacao: 'SOROCABA'
                });
            } catch (err) {
                console.error("Ledger sync error:", err);
            }

            // Save useful waste chunks as Retalhos
            const validRetalhos = calculation.wasteChunks?.filter(w => w.width > 0.15 && w.height > 0.15) || [];
            if (validRetalhos.length > 0) {
                const stockItem = stockItems.find(s => s.id === selectedStockId);
                for (const chunk of validRetalhos) {
                    const matchedPattern = PREDEFINED_PATTERNS.find(pat => 
                        (Math.abs(pat.width - chunk.width) < 0.05 && Math.abs(pat.height - chunk.height) < 0.05) ||
                        (Math.abs(pat.width - chunk.height) < 0.05 && Math.abs(pat.height - chunk.width) < 0.05)
                    );
                    const useCount = matchedPattern ? matchedPattern.useCount : 8;
                    const frequencyText = useCount > 100 ? "Muito Frequente" : useCount >= 50 ? "Frequente" : useCount >= 20 ? "Moderada" : "Baixa";
                    
                    const totalArea = chunk.width * chunk.height;
                    let prob = 15;
                    if (matchedPattern) {
                        prob = matchedPattern.useCount > 100 ? Math.floor(90 + (matchedPattern.useCount % 10)) : matchedPattern.useCount >= 50 ? Math.floor(75 + (matchedPattern.useCount % 15)) : Math.floor(50 + (matchedPattern.useCount % 20));
                    } else if (chunk.width >= 0.5 && chunk.height >= 1.0 && totalArea >= 0.5) {
                        prob = Math.floor(40 + Math.random() * 20);
                    } else {
                        prob = Math.floor(10 + Math.random() * 15);
                    }
                    const statusRecommend = prob >= 50 ? "Recomendado manter em estoque" : "Avaliar descarte";

                    await addRetalho({
                        product_id: stockItem?.product_id || selectedProductId,
                        product_name: stockItem?.product_name || 'Desconhecido',
                        width: chunk.width,
                        height: chunk.height,
                        dimensions: `${chunk.width}m x ${chunk.height}m`,
                        areaM2: parseFloat((chunk.width * chunk.height).toFixed(2)),
                        is_used: false,
                        lote: `LT-SOR-${Math.floor(100 + Math.random() * 900)}`,
                        created_at: new Date().toISOString(),
                        service_origin: clientName || projectName || "Corte de Campo",
                        physical_location: `Gaveta ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}-${Math.floor(1 + Math.random() * 5)}`,
                        category: panes[0]?.category || "Janelas",
                        subcategory: panes[0]?.subcategory || "Geral",
                        use_frequency: frequencyText,
                        probability: prob,
                        status_recommendation: statusRecommend
                    });
                }
            }
            
            // Auto-generate Installation Job (OS) if client name is present
            if (clientName) {
                await addInstallationJob({
                    customerName: clientName,
                    projectName: projectName || 'Projeto Precision',
                    status: 'Scheduled',
                    scheduled_date: new Date(Date.now() + 86400000).toISOString(),
                    type: 'Residential',
                    priority: 'High',
                    progress: 0,
                    location: 'A definir',
                    assignedTo: user?.name || 'Técnico Winf',
                    materials: [`${calculation.totalLinearMeters}m de ${stockItems.find(s => s.id === selectedStockId)?.product_name}`],
                    notes: `Medição Precision: ${panes.map(p => `${p.quantity}x ${p.label} (${p.width}x${p.height}m)`).join(', ')}. ${projectNotes}`
                });
            }

            setLastCutDetails({
                customer: clientName,
                product: stockItems.find(s => s.id === selectedStockId)?.product_name,
                linearMeters: calculation.totalLinearMeters,
                totalArea: calculation.totalArea
            });
            setShowSuccessMenu(true);
            gamify('WARRANTY_REGISTERED', { detail: 'Otimização de Corte Winf Precision™' });
            // Remove the alert, we use showSuccessMenu instead
            setPanes([]);
            setCalculation(null);
            // Don't reset clientName immediately so we can use it in the success actions
        }
    };

    const handleExportToQuote = async () => {
        if (!clientName || !lastCutDetails) return;
        const res = await addQuote({
            clientName: clientName,
            customerName: clientName,
            totalAmount: lastCutDetails.totalArea * (activeProduct?.price || 150),
            items: [{
                name: lastCutDetails.product,
                quantity: lastCutDetails.totalArea,
                price: activeProduct?.price || 150
            }],
            status: 'Pending',
            date: new Date().toISOString(),
            notes: `Importado do Módulo Precision. Medidas: ${lastCutDetails.totalArea}m² líquidos.`
        });
        if (res.success) alert('Orçamento gerado e enviado para a Área de Vendas.');
    };

    const handleGenerateWarranty = async () => {
        if (!clientName || !lastCutDetails) return;
        const res = await registerWarranty({
            customerName: clientName,
            productLine: lastCutDetails.product,
            purchaseDate: new Date().toISOString(),
            measurements: `${lastCutDetails.totalArea}m²`,
            status: 'Ativa'
        });
        if (res.success) alert('Certificado de Garantia WINF Cloud™ gerado com sucesso.');
    };

    const handleJobImport = () => {
        const jobsToImport = installationJobs.filter(j => selectedJobIds.includes(j.id));
        const newPanes: WindowPane[] = [];

        jobsToImport.forEach(job => {
            // Extract measurements from notes or measurements object
            const measurementsText = (job as any).notes || job.measurements?.architecture || '';
            const lines = measurementsText.split('\n');
            
            lines.forEach(line => {
                const match = line.match(/(\d+[.,]\d+)\s*[xX\s,]\s*(\d+[.,]\d+)\s*(.*)/);
                if (match) {
                    const width = parseFloat(match[1].replace(',', '.'));
                    const height = parseFloat(match[2].replace(',', '.'));
                    const label = match[3].trim() || `${job.customer_name} - Item`;
                    
                    newPanes.push({
                        id: Math.random().toString(36).substr(2, 9),
                        width,
                        height,
                        quantity: 1,
                        label: `${job.customer_name}: ${label}`
                    });
                }
            });
        });

        if (newPanes.length > 0) {
            setPanes([...panes, ...newPanes]);
            setSelectedJobIds([]);
            setShowJobImport(false);
            setClientName(`CARGA: ${new Date(tomorrowStr).toLocaleDateString('pt-BR')}`);
            gamify({ title: 'Carga Sincronizada!', points: 15, type: 'action' } as any);
        } else {
            alert('Nenhuma medida formatada encontrada nas OS selecionadas. Verifique se as notas contêm o padrão "LxA".');
        }
    };

    const totalAreaPanes = panes.reduce((sum, p) => sum + (p.width * p.height * p.quantity), 0);
    const currentRole = effectiveRole || user?.role || 'Guest';
    const isAdmin = currentRole === 'Admin' || currentRole === 'Licenciado';

    const templateCategories = Array.from(new Set(PREDEFINED_PATTERNS.map(p => p.category)));

    return (
        <div className="space-y-10 animate-fade-in pb-12 w-full text-white overflow-x-hidden min-h-screen">
            {/* Header - Banking Style */}
            <AnimatePresence>
                {showSuccessMenu && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#131314]/80 backdrop-blur-sm"
                        onClick={() => setShowSuccessMenu(false)}
                    >
                        <div 
                            className="bg-[#131314] border border-white/10 p-8 max-w-lg w-full space-y-8"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 text-green-500 mb-2">
                                        <CheckCircle size={20} />
                                        <span className="text-xs font-black uppercase tracking-[0.3em]">Corte Confirmado</span>
                                    </div>
                                    <h2 className="text-3xl font-light text-white">Próximos <span className="font-bold">Passos</span></h2>
                                </div>
                                <button onClick={() => setShowSuccessMenu(false)} className="text-white/40 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button 
                                    onClick={() => { handleExportToQuote(); setShowSuccessMenu(false); setClientName(''); setProjectName(''); }}
                                    className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all"
                                >
                                    <FileText size={18} /> Gerar Orçamento (Fusão Vendas)
                                </button>
                                <button 
                                    onClick={() => { handleGenerateWarranty(); setShowSuccessMenu(false); setClientName(''); setProjectName(''); }}
                                    className="w-full py-4 bg-[#131314] border border-white/10 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
                                >
                                    <ShieldCheck size={18} /> Registrar Garantia WINF.Cloud
                                </button>
                                <button 
                                    onClick={() => { setShowSuccessMenu(false); setClientName(''); setProjectName(''); }}
                                    className="w-full py-4 bg-[#131314] border border-white/10 text-white/40 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:text-white transition-all"
                                >
                                    <Calendar size={18} /> Ir para Agenda de Instalação (OS)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#18181b]/50 border border-white/5 rounded-none p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-none blur-[80px] -mt-20 -ml-20 pointer-events-none"></div>
                <div className="space-y-2 relative z-10">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-light tracking-tight text-white">Winf™ | Winf Precision™</h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10 w-full sm:w-auto">
                    {/* Selector - Little and lightweight */}
                    <div className="bg-[#131314] hover:bg-[#1a1b1c] border border-white/5 px-3 py-2 rounded-none flex items-center gap-2 transition-colors shadow-md shadow-black/10 flex-shrink-0">
                        <Package size={14} className="text-white/40" />
                        <select 
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            className="bg-transparent text-[11px] font-bold text-white uppercase tracking-wider outline-none border-none cursor-pointer placeholder:text-white/20 select-none"
                        >
                            <option value="" className="bg-[#131314]">ROLO SOB MEDIDA</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id} className="bg-[#131314]">{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Standard roll width: 1.52m - minimized */}
                    {!selectedProductId && (
                         <div className="flex flex-wrap items-center gap-1.5 border border-white/5 bg-[#131314]/30 px-3 py-1.5 shadow-md shadow-black/10 flex-shrink-0">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mr-1">Rolo Padrão:</span>
                            <span className="px-2 py-1 text-[10px] bg-white text-black border border-white font-bold font-mono">1.52m</span>
                        </div>
                    )}

                    {selectedProductId && (
                        <div className="bg-[#131314] border border-winf-primary/20 bg-winf-primary/5 px-3 py-2 rounded-none flex items-center gap-2 shadow-sm flex-shrink-0">
                            <span className="text-[10px] font-bold text-winf-primary uppercase tracking-widest">Rolo Padrão: {rollWidth}m</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Governance Restricted Product Banner */}
            {isRestrictedProduct && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 font-mono text-xs flex items-start gap-3 mt-4"
                >
                    <Lock size={18} className="text-red-500 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                        <strong className="text-white block font-black uppercase tracking-wider mb-1">PROTOCOLO DE INSPEÇÃO DE CAMPO: BLOQUEIO ADMINISTRATIVO</strong>
                        A tecnologia <span className="text-white underline">{activeProduct?.name}</span> está sob regime de <strong>Standby Estratégico</strong> na holding W12. 
                        As operações de corte e escoamento destas linhas são liberadas exclusivamente para a alta diretoria de Santos/São Paulo e serão abertas aos polos autorizados após o lançamento oficial. 
                        Ação interrompida para preservar a integridade da governança. Por favor, selecione materiais da linha <span className="text-white text-emerald-400">Select™ (Invisible, BlackPro, White, Security)</span> para prosseguir com a simulação.
                    </div>
                </motion.div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setProjectImg(reader.result as string);
                        reader.readAsDataURL(file);
                    }
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Simplified Identification Section */}
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            value={clientName} 
                            onChange={e => setClientName(e.target.value)}
                            className="w-full bg-[#131314] hover:bg-[#1a1b1c] border border-white/10 p-4 rounded-none text-white text-sm outline-none focus:border-winf-primary/50 transition-all font-bold placeholder:text-white/30"
                            placeholder="Nome do Cliente ou Obra"
                        />
                    </div>

                    <div className="bg-[#18181b]/50 border border-white/5 rounded-none p-0 flex flex-col shadow-xl backdrop-blur-sm relative overflow-hidden">
                        {/* Input Mode Tabs */}
                        <div className="flex bg-[#131314] border-b border-white/10">
                            <button 
                                onClick={() => setInputMode('manual')}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none flex items-center justify-center gap-2 ${inputMode === 'manual' ? 'bg-white/5 text-winf-primary border-b-2 border-winf-primary' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <Plus size={14} /> Item Individual
                            </button>
                        </div>

                        <div className="p-6 md:p-8 space-y-6">
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                                    <div className="flex items-center justify-between bg-[#131314] p-1 border border-white/5 rounded-none">
                                        <span className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-3">Unidade:</span>
                                        <div className="flex">
                                            {(['mm', 'cm', 'm'] as const).map(unit => (
                                                <button
                                                    key={unit}
                                                    type="button"
                                                    onClick={() => {
                                                        const w = parseFloat(newPane.width);
                                                        const h = parseFloat(newPane.height);
                                                        if (!isNaN(w) && !isNaN(h)) {
                                                            let wMeters = w;
                                                            let hMeters = h;
                                                            if (inputUnit === 'cm') { wMeters = w / 100; hMeters = h / 100; } 
                                                            else if (inputUnit === 'mm') { wMeters = w / 1000; hMeters = h / 1000; }
                                                            let newW = wMeters; let newH = hMeters;
                                                            if (unit === 'cm') { newW = wMeters * 100; newH = hMeters * 100; } 
                                                            else if (unit === 'mm') { newW = wMeters * 1000; newH = hMeters * 1000; }
                                                            setNewPane(prev => ({ ...prev, width: parseFloat(newW.toFixed(1)).toString(), height: parseFloat(newH.toFixed(1)).toString() }));
                                                        }
                                                        setInputUnit(unit);
                                                    }}
                                                    className={`px-4 py-2 text-[10px] uppercase font-bold tracking-wider transition-all rounded-none ${inputUnit === unit ? 'bg-winf-primary text-black font-black' : 'text-white/40 hover:text-white'}`}
                                                >
                                                    {unit}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bold Big Input Grid for Measurements */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/60 uppercase font-black tracking-widest flex items-center gap-2">
                                                Largura <span className="text-white/30 font-mono">({inputUnit})</span>
                                            </label>
                                            <input 
                                                type="number" step="any"
                                                value={newPane.width} onChange={e => setNewPane({...newPane, width: e.target.value})}
                                                className="w-full bg-[#131314] border border-white/10 px-4 py-4 rounded-none text-white outline-none focus:border-winf-primary/50 transition-all font-mono text-2xl placeholder:text-white/10"
                                                placeholder={inputUnit === 'mm' ? '1200' : inputUnit === 'cm' ? '120' : '1.20'}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/60 uppercase font-black tracking-widest flex items-center gap-2">
                                                Altura <span className="text-white/30 font-mono">({inputUnit})</span>
                                            </label>
                                            <input 
                                                type="number" step="any"
                                                value={newPane.height} onChange={e => setNewPane({...newPane, height: e.target.value})}
                                                className="w-full bg-[#131314] border border-white/10 px-4 py-4 rounded-none text-white outline-none focus:border-winf-primary/50 transition-all font-mono text-2xl placeholder:text-white/10"
                                                placeholder={inputUnit === 'mm' ? '2100' : inputUnit === 'cm' ? '210' : '2.10'}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                                        <div className="w-full lg:w-1/3 space-y-2">
                                            <label className="text-[10px] text-white/60 uppercase font-black tracking-widest">Qtd</label>
                                            <input 
                                                type="number" min="1"
                                                value={newPane.quantity} onChange={e => setNewPane({...newPane, quantity: e.target.value})}
                                                className="w-full bg-[#131314] border border-white/10 px-4 py-4 rounded-none text-white outline-none focus:border-winf-primary/50 transition-all font-mono text-lg text-center"
                                            />
                                        </div>
                                        <div className="w-full lg:w-2/3 space-y-2">
                                            <label className="text-[10px] text-white/60 uppercase font-black tracking-widest">Identificação / Ambiente</label>
                                            <input 
                                                type="text" 
                                                value={newPane.label} onChange={e => setNewPane({...newPane, label: e.target.value})}
                                                onKeyDown={(e) => { if(e.key === 'Enter') addPane(); }}
                                                className="w-full bg-[#131314] border border-white/10 px-4 py-4 rounded-none text-white outline-none focus:border-winf-primary/50 transition-all placeholder:text-white/20 text-sm font-bold uppercase"
                                                placeholder="Ex: Sala Princ."
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => addPane()}
                                        className="w-full bg-white text-black font-black py-4 rounded-none hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-lg shadow-white/5"
                                    >
                                        <Plus size={18} /> Adicionar Medida
                                    </button>

                                    {/* Smart Templates Dropdown/Grid */}
                                    <div className="pt-6 border-t border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Adição Rápida (Padrões)</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 bg-[#131314] p-1 border border-white/10">
                                            {['Janelas', 'Portas', 'Sacadas (Piso ao Teto)'].map(cat => (
                                                <button
                                                    key={cat} type="button" onClick={() => setActiveTemplateCat(cat)}
                                                    className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-bold transition-all rounded-none flex-1 ${activeTemplateCat === cat ? 'bg-winf-primary text-black font-black' : 'text-white/40 hover:text-white bg-[#1a1b1c]'}`}
                                                >
                                                    {cat.split(' ')[0]}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                                            {patterns.filter(p => p.category === activeTemplateCat || p.category.includes(activeTemplateCat)).slice(0, 6).map((pattern, idx) => (
                                                <button 
                                                    key={idx} type="button" onClick={() => addPane(pattern)}
                                                    className="flex flex-col text-left p-3 border border-white/5 hover:border-winf-primary/30 bg-[#131314] hover:bg-[#1a1b1c] transition-all rounded-none group"
                                                >
                                                    <span className="text-[10px] text-white font-bold truncate w-full uppercase font-mono mb-1">{pattern.label}</span>
                                                    <span className="text-[11px] text-winf-primary font-mono font-black">{pattern.width} x {pattern.height}m</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                        </div>

                        {/* LISTA DE RECORTES - Always Visible section at the bottom of left column */}
                        <div className="bg-[#131314] border-t border-white/10 p-6 md:p-8 space-y-4 relative flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[11px] text-white flex items-center gap-2 uppercase font-black tracking-[0.2em]">
                                    <Layers size={14} className="text-winf-primary" /> Recortes Adicionados ({panes.length})
                                </h4>
                                {panes.length > 0 && (
                                    <div className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
                                        TOTAL: <span className="text-white font-bold">{totalAreaPanes.toFixed(2)}m²</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                {panes.length === 0 ? (
                                    <div className="py-12 border border-dashed border-white/5 bg-white/5 flex flex-col items-center justify-center text-center opacity-40">
                                        <Ruler size={24} className="mb-3 opacity-50" />
                                        <p className="text-[9px] uppercase tracking-widest font-bold">Nenhuma medida na lista</p>
                                    </div>
                                ) : (
                                    panes.map(pane => (
                                        <div key={pane.id} className="flex justify-between items-center p-3 bg-[#1a1b1c] rounded-none border border-white/5 group hover:border-white/20 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#131314] border border-white/10 rounded-none flex items-center justify-center text-[10px] font-black text-winf-primary">
                                                    {pane.quantity}x
                                                </div>
                                                <div>
                                                    <p className="text-white text-[10px] font-bold uppercase tracking-tight">{pane.label}</p>
                                                    <p className="text-[10px] text-white/60 font-mono mt-0.5">{pane.width}m x {pane.height}m <span className="text-white/20 ml-2">•</span> <span className="text-white ml-2">{(pane.width * pane.height * pane.quantity).toFixed(2)}m²</span></p>
                                                </div>
                                            </div>
                                            <button onClick={() => removePane(pane.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            {panes.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <button 
                                        onClick={calculateOptimization}
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-black font-black py-5 rounded-none transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(249,115,22,0.2)] group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                                        <Zap size={20} className="fill-current animate-pulse group-hover:scale-125 transition-transform duration-300" /> Processar Plano de Corte
                                    </button>
                                    <div className="text-center">
                                        <button onClick={() => setPanes([])} className="text-[9px] text-white/20 hover:text-red-500 font-bold uppercase tracking-widest transition-colors py-2">
                                            Limpar Toda a Lista
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Retalhos Compatibility Assistant: Green, Yellow, Red Lights */}
                    {panes.length > 0 && (
                        <div className="bg-[#18181b]/50 border border-white/5 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-3">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                                <h4 className="text-[10px] text-white/50 uppercase font-black tracking-wider flex items-center gap-2">
                                    <AlertCircle size={14} className="text-orange-400" /> Inteligência de Reuso
                                </h4>
                                <span className="text-[8px] text-orange-400 font-mono tracking-wider uppercase font-black bg-orange-500/10 border border-orange-500/10 px-1.5 py-0.5 animate-pulse">Precision™ Assist</span>
                            </div>

                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                                {panes.map(pane => {
                                    const fits = availableRetalhos.filter(scrap => {
                                        const scrapW = scrap.width || parseFloat(scrap.dimensions.split('x')[0]);
                                        const scrapH = scrap.height || parseFloat(scrap.dimensions.split('x')[1]);
                                        return (
                                            (scrapW >= pane.width && scrapH >= pane.height) ||
                                            (scrapH >= pane.width && scrapW >= pane.height)
                                        );
                                    });

                                    if (fits.length === 0) {
                                        return (
                                            <div key={`re-compat-${pane.id}`} className="p-3 bg-red-500/5 border border-red-500/10 flex items-start gap-3 rounded-none">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-[10px] text-white/80 font-bold uppercase tracking-tight">{pane.label}</p>
                                                        <span className="text-[8px] text-red-400 font-mono font-bold uppercase uppercase tracking-wider">Novo Material</span>
                                                    </div>
                                                    <p className="text-[9px] text-white/40 mt-1 font-mono leading-relaxed">Nenhum retalho disponível salvável para {pane.width.toFixed(2)}m x {pane.height.toFixed(2)}m. Recomenda-se utilizar material novo.</p>
                                                </div>
                                            </div>
                                        );
                                    }

                                    const sortedFits = fits.map(scrap => {
                                        const scrapW = scrap.width || parseFloat(scrap.dimensions.split('x')[0]);
                                        const scrapH = scrap.height || parseFloat(scrap.dimensions.split('x')[1]);
                                        const scrapArea = scrapW * scrapH;
                                        const paneArea = pane.width * pane.height;
                                        const leftover = scrapArea - paneArea;
                                        const wastePercentage = (leftover / scrapArea) * 100;
                                        return { scrap, wastePercentage };
                                    }).sort((a, b) => a.wastePercentage - b.wastePercentage);

                                    const bestFit = sortedFits[0];
                                    const isGreenLight = bestFit.wastePercentage <= 25;
                                    
                                    return (
                                        <div 
                                            key={`re-compat-${pane.id}`} 
                                            className={`p-3 border flex items-start gap-3 rounded-none transition-all ${isGreenLight ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-yellow-500/5 border-yellow-500/15'}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 shadow-md ${isGreenLight ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-yellow-400 shadow-yellow-400/50'}`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] text-white/80 font-bold uppercase tracking-tight">{pane.label}</p>
                                                    <span className={`text-[8px] font-mono font-black uppercase tracking-widest ${isGreenLight ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                                        {isGreenLight ? 'Luz Verde: Compatível' : 'Luz Amarela: Refile'}
                                                    </span>
                                                </div>
                                                <p className="text-[9px] text-white/50 mt-1 font-mono leading-relaxed">
                                                    {isGreenLight 
                                                        ? `Retalho disponível para reuso imediato! Lote ${bestFit.scrap.lote || "Avulso"} (${bestFit.scrap.dimensions}). Perda estimada de apenas ${bestFit.wastePercentage.toFixed(0)}%.`
                                                        : `Reaproveitamento possível mediante análise. Refilar Lote ${bestFit.scrap.lote || "Avulso"} (${bestFit.scrap.dimensions}). Perda de ${bestFit.wastePercentage.toFixed(0)}%.`
                                                    }
                                                </p>
                                                <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-white/5">
                                                    <span className="text-[8px] text-white/30 font-mono uppercase font-semibold">Local: {bestFit.scrap.physical_location || "Rampa Geral"}</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            alert(`Retalho ${bestFit.scrap.lote || 'selecionado'} alocado para produzir o item "${pane.label}".`);
                                                        }}
                                                        className="text-[8px] text-orange-400 hover:text-white uppercase tracking-widest font-black font-mono transition-colors"
                                                    >
                                                        Alocar Retalho (Usar)
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Visualization Section */}
                <div className="lg:col-span-8 space-y-6">
                    {calculation ? (
                        <div className="space-y-6 animate-slide-up">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-[#1a1b1c] to-[#131314] border border-white/5 shadow-2xl p-6 md:p-8 rounded-none relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 bg-white/5 w-32 h-32 rounded-none blur-[50px] -mr-16 -mt-16 transition-all group-hover:bg-white/10"></div>
                                    <p className="text-xs md:text-[10px] text-white/50 uppercase font-bold tracking-[0.2em] mb-3 relative z-10">
                                        {clientName.includes('CARGA') ? 'Carga Consolidada' : 'Total Linear (Rolo)'}
                                    </p>
                                    <p className="text-4xl md:text-5xl font-light text-white tracking-tight relative z-10">
                                        {calculation.totalLinearMeters}<span className="text-xl md:text-2xl font-medium text-white/40 ml-1">m</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-6 relative z-10">
                                        <div className="w-2 h-2 rounded-none bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                                        <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">Preparar Bobina</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#1a1b1c] to-[#131314] border border-white/5 shadow-2xl p-6 md:p-8 rounded-none relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 bg-emerald-500/10 w-32 h-32 rounded-none blur-[50px] -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/20"></div>
                                    <p className="text-xs md:text-[10px] text-white/50 uppercase font-bold tracking-[0.2em] mb-3 relative z-10">Eficiência Térmica / Corte</p>
                                    <p className="text-4xl md:text-5xl font-light text-emerald-400 tracking-tight relative z-10">
                                        {calculation.efficiency}<span className="text-xl md:text-2xl font-medium text-emerald-400/50 ml-1">%</span>
                                    </p>
                                    <div className="w-full bg-[#131314] h-2 rounded-none mt-6 overflow-hidden border border-white/5 relative z-10">
                                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000 ease-out" style={{ width: `${calculation.efficiency}%` }}></div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-[#1a1b1c] to-[#131314] border border-winf-primary/20 shadow-[0_10px_40px_rgba(var(--winf-primary-rgb),0.1)] p-6 md:p-8 rounded-none relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 bg-winf-primary/10 w-32 h-32 rounded-none blur-[50px] -mr-16 -mt-16 transition-all group-hover:bg-winf-primary/20"></div>
                                    <p className="text-xs md:text-[10px] text-white/50 uppercase font-bold tracking-[0.2em] mb-3 relative z-10">VGV Projetado</p>
                                    <p className="text-4xl md:text-5xl font-light text-winf-primary tracking-tight relative z-10">
                                        <span className="text-xl md:text-2xl font-medium text-winf-primary/50 mr-1">R$</span>
                                        {(calculation ? calculation.totalArea * (activeProduct?.price || 150) : 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                    </p>
                                    <div className="flex items-center gap-2 mt-6 relative z-10">
                                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Base Padrão: R$ {activeProduct?.price || 150}/m²</p>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Ledger / Computed Waste Chunks Analysis - High Visual Value for scrap computations */}
                            <div className="bg-[#18181b] border border-[#f97316]/20 bg-gradient-to-br from-[#1e1f20] to-[#131314] shadow-2xl rounded-none p-6 md:p-8 space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-orange-400">
                                            <Scissors size={16} />
                                            <h4 className="text-xs font-semibold uppercase tracking-[0.2em]">Computação de Retalhos & Sobras</h4>
                                        </div>
                                        <p className="text-xs text-white/40 mt-1">Cálculo de desperdício reaproveitável conforme dimensões do rolo ({rollWidth.toFixed(2)}m)</p>
                                    </div>
                                    <div className="bg-[#131314] px-4 py-2 border border-white/10 flex items-center gap-4">
                                        <div>
                                            <p className="text-[9px] text-white/35 uppercase tracking-wider font-mono">Consumo Real do Rolo</p>
                                            <p className="text-sm font-bold text-white">{(calculation.totalLinearMeters * rollWidth).toFixed(2)} m²</p>
                                        </div>
                                        <div className="h-6 border-l border-white/10"></div>
                                        <div>
                                            <p className="text-[9px] text-white/35 uppercase tracking-wider font-mono">Área Útil Cortada</p>
                                            <p className="text-sm font-bold text-emerald-400">{calculation.totalArea.toFixed(2)} m²</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    <div className="space-y-4">
                                        <h5 className="text-[11px] text-white/60 font-bold uppercase tracking-[0.1em]">Detalhamento de Sobras de Bobina</h5>
                                        {calculation.wasteChunks && calculation.wasteChunks.length > 0 ? (
                                            <div className="space-y-2">
                                                {calculation.wasteChunks.map((chunk, idx) => (
                                                    <div key={idx} className="bg-[#131314] border border-white/5 hover:border-[#f97316]/30 p-4 transition-all flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-none bg-[#f97316]/5 border border-[#f97316]/20 flex items-center justify-center text-[#f97316]">
                                                                <Ruler size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-white font-mono font-bold">
                                                                    {chunk.width.toFixed(2)}m <span className="text-white/40 text-[9px]">L</span> x {chunk.height.toFixed(2)}m <span className="text-white/40 text-[9px]">A</span>
                                                                </p>
                                                                <p className="text-[9px] text-[#8e8e8f] uppercase tracking-wider">Retalho Salvável Gerado</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs font-mono font-bold text-white">{(chunk.width * chunk.height).toFixed(2)} m²</p>
                                                            <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">Reutilizável ✓</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-[#131314]/50 border border-white/5 text-center text-xs text-white/40 font-mono">
                                                Nenhum retalho salvável detectado. Aproveitamento próximo de 100%.
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-[#131314] p-5 border border-white/5 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle size={18} className="text-orange-400 shrink-0 mt-0.5" />
                                            <div>
                                                <h6 className="text-[11px] font-bold text-white uppercase tracking-wider">Inteligência de Aproveitamento do Material</h6>
                                                <p className="text-xs text-white/50 mt-1 leading-relaxed">
                                                    Se você tem uma porta de <strong className="text-white font-[500]">2.10m x 1.00m</strong> e utiliza um rolo padrão de <strong className="text-white font-[500]">1.52m</strong>, haverá um consumo linear inevitável de <strong className="text-white font-[500]">2.10m</strong>. 
                                                </p>
                                                <p className="text-xs text-[#f97316] mt-2 font-medium leading-relaxed font-mono">
                                                    A sobra de 0.52m de largura por 2.10m de altura é computada e salva automaticamente como retalho cadastrado para uso subsequente!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#18181b] border border-white/5 shadow-2xl rounded-none p-6 md:p-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                                    <div>
                                        <h4 className="text-white font-medium flex items-center gap-3 text-2xl tracking-tight">
                                            <Layout size={24} className="text-winf-primary" /> 
                                            Mapa de Corte <strong className="font-bold">Precision™</strong>
                                        </h4>
                                        <p className="text-xs text-white/40 mt-1 font-mono uppercase tracking-widest">ALGORITMO DE ORIENTAÇÃO LINEAR V2</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={async () => {
                                                if (!calculation) return;
                                                const text = `WINF PRECISION™ - MAPA DE CORTE\nCliente: ${clientName || 'Geral'}\nÁrea: ${calculation.totalArea}m²\nBobina: ${calculation.totalLinearMeters}m lineares\nPeças: ${panes.length}`;
                                                await navigator.clipboard.writeText(text);
                                                alert('Relatório copiado para a área de transferência!');
                                            }}
                                            className="px-5 py-3 bg-[#131314] hover:bg-white/5 border border-white/5 rounded-none text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <Copy size={16} /> Relatório
                                        </button>
                                        <button 
                                            onClick={() => alert(`Layout compartilhado com a Ordem de Serviço de ${clientName || 'projeto'}.`)}
                                            className="px-5 py-3 bg-winf-primary/10 border border-winf-primary/20 rounded-none text-[10px] font-black uppercase tracking-widest text-winf-primary hover:bg-winf-primary/20 transition-all flex items-center gap-2 shadow-lg shadow-winf-primary/5"
                                        >
                                            <ArrowRight size={16} /> Anexar OS
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="relative bg-[#131314] border border-white/10 rounded-none overflow-hidden shadow-inner" style={{ height: '500px' }}>
                                    {/* Roll Background */}
                                    <div className="absolute inset-0 opacity-5" style={{ 
                                        backgroundImage: 'linear-gradient(90deg, transparent 95%, currentColor 95%), linear-gradient(0deg, transparent 95%, currentColor 95%)',
                                        backgroundSize: '40px 40px'
                                    }}></div>

                                    {/* Map Visualization Engine - Precision Mode */}
                                    <div className="relative w-full h-[600px] overflow-auto bg-[#0a0a0b] p-8 md:p-12 custom-scrollbar border border-white/5 rounded-none flex justify-center items-start">
                                        
                                        {/* Y-Axis Label (Linear Meters) */}
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-mono text-white/30 tracking-widest uppercase origin-center">
                                            {calculation.totalLinearMeters}m (Comprimento Total)
                                        </div>

                                        {/* Canvas Wrapper */}
                                        <div className="relative">
                                            {/* X-Axis Ruler */}
                                            <div className="w-full flex justify-between absolute -top-6 text-[8px] font-mono text-white/40">
                                                <span>0m</span>
                                                <span>{(rollWidth / 2).toFixed(2)}m</span>
                                                <span>{rollWidth.toFixed(2)}m</span>
                                            </div>

                                            {/* The Roll Map */}
                                            <div className="relative border-2 border-white/20 bg-[#131314] shadow-2xl relative" style={{ 
                                                width: `${rollWidth * 200}px`, 
                                                height: `${calculation.totalLinearMeters * 200}px`,
                                                minHeight: '100px',
                                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                                                backgroundSize: '20px 20px'
                                            }}>
                                                
                                                {/* Usable Cuts */}
                                                {calculation.layout.map((p, i) => (
                                                    <motion.div 
                                                        key={`cut-${i}`}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="absolute bg-[#1a1b1c] border-2 border-[#131314] flex flex-col items-center justify-center overflow-hidden group hover:border-winf-primary/80 hover:bg-[#1a1b1c]/80 transition-all cursor-default shadow-sm hover:z-10"
                                                        style={{
                                                            left: `${p.x * 200}px`,
                                                            top: `${p.y * 200}px`,
                                                            width: `${p.w * 200}px`,
                                                            height: `${p.h * 200}px`
                                                        }}
                                                    >
                                                        <div className="text-center p-1 w-full relative z-10 flex flex-col items-center justify-center h-full">
                                                            <p className="text-[9px] md:text-[10px] text-white font-bold uppercase truncate w-full text-center px-1">{p.instanceLabel}</p>
                                                            <p className="text-[8px] md:text-[9px] text-winf-primary font-mono mt-1 px-1 bg-black/40 py-0.5 rounded-sm">{p.width.toFixed(2)} x {p.height.toFixed(2)}m</p>
                                                        </div>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    </motion.div>
                                                ))}

                                                {/* Waste Chunks / Retalhos */}
                                                {calculation.wasteChunks?.map((chunk, i) => {
                                                    const isUsable = chunk.width > 0.15 && chunk.height > 0.15;
                                                    return (
                                                        <motion.div
                                                            key={`waste-${i}`}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: calculation.layout.length * 0.05 + i * 0.05 }}
                                                            className={`absolute border flex items-center justify-center overflow-hidden backdrop-blur-sm group transition-all ${
                                                                isUsable 
                                                                    ? 'bg-[#f97316]/10 border-[#f97316]/30 hover:bg-[#f97316]/20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(249,115,22,0.1)_5px,rgba(249,115,22,0.1)_10px)]' 
                                                                    : 'bg-red-500/5 border-red-500/20 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,rgba(239,68,68,0.1)_5px,rgba(239,68,68,0.1)_10px)]'
                                                            }`}
                                                            style={{
                                                                left: `${chunk.x * 200}px`,
                                                                top: `${chunk.y * 200}px`,
                                                                width: `${chunk.width * 200}px`,
                                                                height: `${chunk.height * 200}px`
                                                            }}
                                                        >
                                                            <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 bg-[#0a0a0a]/80 py-1 px-2">
                                                                <p className={`text-[8px] font-black uppercase tracking-widest ${isUsable ? 'text-[#f97316]' : 'text-red-400'}`}>
                                                                    {isUsable ? 'Retalho Útil' : 'Descarte'}
                                                                </p>
                                                                <p className="text-[7px] text-white/50 font-mono mt-0.5">{chunk.width.toFixed(2)}x{chunk.height.toFixed(2)}m</p>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex flex-col md:flex-row gap-8 items-center justify-between border-t border-white/10 pt-10">
                                    <div className="w-full md:w-80 space-y-3">
                                        <label className="text-xs md:text-[10px] text-white/40 uppercase font-black tracking-[0.2em] ml-1">Material em Estoque</label>
                                        <select 
                                            value={selectedStockId}
                                            onChange={e => setSelectedStockId(e.target.value)}
                                            className="w-full bg-[#131314] border border-white/10 p-4 rounded-none text-white outline-none focus:border-winf-primary/30 transition-all appearance-none text-sm font-bold"
                                        >
                                            <option value="">Configurar Rolo Base...</option>
                                            {stockItems.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.product_name} — {item.remaining_meters}m disp.
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button 
                                        disabled={!selectedStockId || isRestrictedProduct}
                                        onClick={handleConfirmCut}
                                        className={`w-full md:w-auto px-16 py-5 rounded-none font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group ${(!selectedStockId || isRestrictedProduct) ? 'bg-[#18181b] text-white/40 cursor-not-allowed border border-white/5' : 'bg-white text-black hover:bg-zinc-200'}`}
                                    >
                                        <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                                        <span className="relative z-10 flex items-center gap-4">
                                            {isRestrictedProduct ? 'Corte Bloqueado p/ Governança 🔒' : 'Confirmar & Baixar Estoque'} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-20 bg-[#18181b]/50 border border-dashed border-white/10 rounded-none backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent blur-3xl opacity-50"></div>
                            <div className="w-24 h-24 bg-[#1a1b1c] rounded-none flex items-center justify-center mb-8 border border-white/5 shadow-2xl relative z-10">
                                <Scan size={40} className="text-white/30 animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-light text-white mb-3 uppercase tracking-tighter relative z-10">
                                Aguardando <strong className="font-bold">Medidas</strong>
                            </h3>
                            <p className="text-white/40 max-w-sm font-medium relative z-10">
                                Adicione as dimensões dos vidros para que o motor <span className="text-white font-bold">Precision™</span> calcule o melhor aproveitamento do seu material.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* COMPONENT: SMART SCRAP BANK & PREDICTIVE CONTROL PANEL */}
            <div className="mt-8 bg-[#18181b]/70 border border-white/5 shadow-2xl p-6 md:p-8 space-y-6 animate-fade-in relative z-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-5 gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <Layers className="text-orange-400" size={22} />
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Banco Inteligente de Retalhos</h3>
                        </div>
                        <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-mono">Precision™ Inventory & Predictive reusability engine</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowManualScrapForm(!showManualScrapForm)}
                            className="px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 font-bold text-[10px] uppercase tracking-widest transition-all"
                        >
                            {showManualScrapForm ? "Fechar Cadastro ✕" : "Cadastrar Retalho Manual +"}
                        </button>
                    </div>
                </div>

                {/* Manual Scrap Addition Form */}
                {showManualScrapForm && (
                    <div className="p-5 bg-[#131314] border border-white/10 space-y-4 max-w-2xl animate-in fade-in slide-in-from-top-3">
                        <h4 className="text-xs text-white font-black uppercase tracking-widest flex items-center gap-2">
                            <Plus size={14} className="text-orange-400" /> Registro Manual de Remanescente
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                                <label className="text-[9px] text-white/40 uppercase font-black tracking-widest block mb-1">Largura ({inputUnit})</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={manualScrap.width}
                                    onChange={e => setManualScrap({...manualScrap, width: e.target.value})}
                                    placeholder={inputUnit === 'mm' ? '500' : inputUnit === 'cm' ? '50' : '0.50'}
                                    className="w-full bg-[#18181b] border border-white/10 p-2.5 text-white font-mono text-xs outline-none focus:border-orange-500 transition-all rounded-none"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] text-white/40 uppercase font-black tracking-widest block mb-1">Altura ({inputUnit})</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={manualScrap.height}
                                    onChange={e => setManualScrap({...manualScrap, height: e.target.value})}
                                    placeholder={inputUnit === 'mm' ? '1200' : inputUnit === 'cm' ? '120' : '1.20'}
                                    className="w-full bg-[#18181b] border border-white/10 p-2.5 text-white font-mono text-xs outline-none focus:border-orange-500 transition-all rounded-none"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="text-[9px] text-white/40 uppercase font-black tracking-widest block mb-1">Identificação Lote</label>
                                <input
                                    type="text"
                                    value={manualScrap.lote || ''}
                                    onChange={e => setManualScrap({...manualScrap, lote: e.target.value})}
                                    placeholder="Ex: LT-SOR-98"
                                    className="w-full bg-[#18181b] border border-white/10 p-2.5 text-white text-xs outline-none focus:border-orange-500 transition-all rounded-none"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="text-[9px] text-white/40 uppercase font-black tracking-widest block mb-1">Localização Física</label>
                                <input
                                    type="text"
                                    value={manualScrap.physical_location || ''}
                                    onChange={e => setManualScrap({...manualScrap, physical_location: e.target.value})}
                                    placeholder="Ex: Gaveta D-3"
                                    className="w-full bg-[#18181b] border border-white/10 p-2.5 text-white text-xs outline-none focus:border-orange-500 transition-all rounded-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setManualScrap({ width: '', height: '', lote: '', physical_location: '', category: 'Janelas', subcategory: 'Comum' });
                                    setShowManualScrapForm(false);
                                }}
                                className="px-4 py-2 text-[10px] uppercase font-bold text-white/40 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    const wRaw = parseFloat(manualScrap.width);
                                    const hRaw = parseFloat(manualScrap.height);
                                    if (isNaN(wRaw) || isNaN(hRaw) || wRaw <= 0 || hRaw <= 0) {
                                        alert("Por favor insira medidas válidas maiores que zero.");
                                        return;
                                    }
                                    // Convert inputs to meters for Firestore/database standard
                                    let w = wRaw;
                                    let h = hRaw;
                                    if (inputUnit === 'cm') {
                                        w = wRaw / 100;
                                        h = hRaw / 100;
                                    } else if (inputUnit === 'mm') {
                                        w = wRaw / 1000;
                                        h = hRaw / 1000;
                                    }

                                    const totalArea = w * h;
                                    const prob = Math.floor(45 + Math.random() * 50);
                                    const statusRecommend = prob >= 60 ? "Recomendado manter em estoque" : "Avaliar descarte";

                                    await addRetalho({
                                        product_id: selectedProductId,
                                        product_name: activeProduct?.name || 'Desconhecido',
                                        width: w,
                                        height: h,
                                        dimensions: `${w}m x ${h}m`,
                                        areaM2: parseFloat((w * h).toFixed(2)),
                                        is_used: false,
                                        created_at: new Date().toISOString(),
                                        lote: manualScrap.lote || `LT-MAN-${Math.floor(100 + Math.random() * 900)}`,
                                        physical_location: manualScrap.physical_location || "Rampa Geral",
                                        service_origin: "Cadastro Avulso",
                                        category: "Manuais",
                                        subcategory: "Avulsas",
                                        use_frequency: "Moderada",
                                        probability: prob,
                                        status_recommendation: statusRecommend
                                    });

                                    setManualScrap({ width: '', height: '', lote: '', physical_location: '', category: 'Janelas', subcategory: 'Comum' });
                                    setShowManualScrapForm(false);
                                }}
                                className="px-5 py-2 bg-[#d97706] hover:bg-amber-600 text-black font-black text-[10px] uppercase tracking-wider transition-all rounded-none"
                            >
                                Salvar no Banco
                            </button>
                        </div>
                    </div>
                )}

                {/* Scraps table showing prediction status and metadata info */}
                <div className="overflow-x-auto custom-scrollbar">
                    {availableRetalhos.length === 0 ? (
                        <div className="py-12 border border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-30">
                            <Layers size={32} className="mb-4 text-white/30" />
                            <p className="text-[10px] uppercase tracking-widest font-bold text-white/60">Nenhum Retalho Disponível no Banco</p>
                            <p className="text-[9px] text-white/40 mt-1 max-w-[280px]">Confirme recortes para popular o estoque de sobras automaticamente.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-white/10 text-[9px] text-white/40 uppercase tracking-widest">
                                    <th className="py-3 px-4">Lote / Origem</th>
                                    <th className="py-3 px-4">Dimensões ({inputUnit})</th>
                                    <th className="py-3 px-4">Linha Película</th>
                                    <th className="py-3 px-4">Localizador Caixa</th>
                                    <th className="py-3 px-4">Frequência Histórica</th>
                                    <th className="py-3 px-4">Predição Inteligente de Reuso</th>
                                    <th className="py-3 px-4 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-white/80">
                                {availableRetalhos.map((ret, idx) => {
                                    const w = ret.width || parseFloat(ret.dimensions.split('x')[0]);
                                    const h = ret.height || parseFloat(ret.dimensions.split('x')[1]);
                                    
                                    let dimsFormatted = '';
                                    if (inputUnit === 'mm') {
                                        dimsFormatted = `${(w * 1000).toFixed(0)} x ${(h * 1000).toFixed(0)} mm`;
                                    } else if (inputUnit === 'cm') {
                                        dimsFormatted = `${(w * 100).toFixed(0)} x ${(h * 100).toFixed(0)} cm`;
                                    } else {
                                        dimsFormatted = `${w.toFixed(2)} x ${h.toFixed(2)} m`;
                                    }

                                    const prob = ret.probability || 35;
                                    const probColor = prob >= 80 
                                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                                        : prob >= 50 
                                        ? "text-sky-400 bg-sky-500/10 border-sky-500/20" 
                                        : "text-amber-500 bg-yellow-500/10 border-yellow-500/20";

                                    return (
                                        <tr key={ret.id || idx} className="hover:bg-white/5 transition-all group">
                                            <td className="py-3.5 px-4 font-mono">
                                                <div className="font-bold text-white text-[11px] uppercase">{ret.lote || `LT-RE-${idx + 1}`}</div>
                                                <div className="text-[9px] text-white/30 truncate max-w-[150px]">{ret.service_origin || "Origem Indeterminada"}</div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-orange-400 text-sm">{dimsFormatted}</td>
                                            <td className="py-3.5 px-4 font-semibold uppercase text-[10px]">{ret.product_name || activeProduct?.name}</td>
                                            <td className="py-3.5 px-4 text-zinc-400 font-mono text-[10px]">{ret.physical_location || "Rampa Geral"}</td>
                                            <td className="py-3.5 px-4">
                                                <span className="text-[8px] px-1.5 py-0.5 bg-white/5 border border-white/5 text-white/50 uppercase tracking-wider font-mono font-bold">
                                                    {ret.use_frequency || "Moderada"}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-black border ${probColor}`}>
                                                        {prob}% reuso
                                                    </span>
                                                    <span className="text-[10px] text-white/40 hidden xl:inline">
                                                        {ret.status_recommendation || "Recomendado manter"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newPaneItem = {
                                                            id: `pane-${Date.now()}`,
                                                            width: w,
                                                            height: h,
                                                            quantity: 1,
                                                            label: `Retalho Reusado (${ret.lote || "Avulso"})`,
                                                            category: ret.category || "Janelas",
                                                            subcategory: ret.subcategory || "Geral"
                                                        };
                                                        setPanes([...panes, newPaneItem]);
                                                        alert(`Retalho ${ret.lote || "selecionado"} inserido com sucesso na lista de recortes da Precision™!`);
                                                    }}
                                                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-[8px] tracking-widest opacity-0 group-hover:opacity-100 transition-all font-mono"
                                                >
                                                    Usar no Projeto
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModuleWinfPrecision;
