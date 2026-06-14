import { useState, useEffect, useMemo } from 'react';

export function useProductivityMonitor(quotes: any[] = []) {
    const { totalM2Sold, totalRevenue } = useMemo(() => {
        let sqM = 0;
        let rev = 0;
        
        // We only compute for Won/Approved project styles
        quotes.forEach((q: any) => {
            if (q.status === 'Aprovado' || q.status === 'Agendado' || q.status === 'Concluído' || q.status === 'Novo') {
                rev += q.totalAmount || 0;
                if (q.measurements && typeof q.measurements === 'string') {
                    const match = q.measurements.match(/([\d.]+)/);
                    if (match && match[1]) {
                        const parsed = parseFloat(match[1]);
                        if (!isNaN(parsed)) {
                            sqM += parsed;
                        }
                    }
                }
            }
        });

        // Provide baseline visual fallback (demo mode) if no approved quotes yet, so UI isn't completely empty.
        if (sqM === 0 && rev === 0) {
            sqM = 35.5; 
            rev = 4970; 
        }

        return { totalM2Sold: sqM, totalRevenue: rev };
    }, [quotes]);

    const [isTurboActivated, setIsTurboActivated] = useState(() => {
        try {
            return localStorage.getItem('winf_turbo_activated') === 'true';
        } catch {
            return false;
        }
    });

    const isAdvancedLevel = totalM2Sold >= 150 || isTurboActivated;
    let assetLightTargetM2 = isAdvancedLevel ? 400 : 200;
    let metricsPct = Math.min(100, Math.round((totalM2Sold / assetLightTargetM2) * 100));
    if (isNaN(metricsPct)) metricsPct = 0;

    const toggleTurbo = () => {
        setIsTurboActivated(prev => {
            const next = !prev;
            try {
                localStorage.setItem('winf_turbo_activated', String(next));
            } catch {}
            return next;
        });
    };

    const [showTrafficRecommendation, setShowTrafficRecommendation] = useState(false);

    useEffect(() => {
        try {
            if (totalM2Sold >= 150 && !localStorage.getItem('winf_traffic_alert_shown')) {
                setShowTrafficRecommendation(true);
                localStorage.setItem('winf_traffic_alert_shown', 'true');
            }
        } catch {}
    }, [totalM2Sold]);

    return {
        totalM2Sold,
        totalRevenue,
        isAdvancedLevel,
        isTurboActivated,
        assetLightTargetM2,
        metricsPct,
        showTrafficRecommendation,
        dismissTrafficRecommendation: () => setShowTrafficRecommendation(false), // Will allow closing the alert
        toggleTurbo
    };
}
