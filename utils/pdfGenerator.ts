import { HistoryEntry, Metric, LineChartDataPoint, BarChartDataPoint, WellBeingData, MultiLineChartDataPoint } from '../types';

// jsPDF is loaded from a script tag in index.html, so it's available on the window object.
declare const jspdf: any;

// A helper function to add text and manage Y position, including page breaks.
const addTextWithPageBreaks = (doc: any, text: string | string[], x: number, y: number, options: any, lineSpacing: number = 7) => {
    let currentY = y;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    const lines = Array.isArray(text) ? text : [text];

    for (const line of lines) {
        if (currentY > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
        }
        doc.text(line, x, currentY, options);
        currentY += lineSpacing;
    }
    return currentY;
}

export const generatePdfReport = (entry: HistoryEntry) => {
    if (!entry.results) {
        alert("Cannot generate report: Simulation results are missing.");
        return;
    }

    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    const { inputs, results } = entry;
    const pageW = doc.internal.pageSize.getWidth();
    let y = 20;

    // --- Header ---
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text("Policy Simulation Report", pageW / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageW / 2, y, { align: 'center' });
    y += 15;

    // --- Policy Details ---
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("1. Policy Details", 14, y);
    doc.setLineWidth(0.5);
    doc.line(14, y + 2, pageW - 14, y + 2);
    y += 12;

    const addDetail = (label: string, value: string | undefined) => {
        if (!value) return;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        y = addTextWithPageBreaks(doc, label, 14, y, {}, 5);

        doc.setFont(undefined, 'normal');
        const splitValue = doc.splitTextToSize(value, pageW - 48); // 14 margin left, 34 for text
        y = addTextWithPageBreaks(doc, splitValue, 20, y, {}, 5);
        y += 4;
    };

    addDetail("Policy Name:", inputs.policyName);
    addDetail("Policy Type:", inputs.policyType);
    addDetail("Description:", inputs.policyDescription);
    addDetail("Budget Allocation:", `₹${inputs.parameters.budgetAllocation.toLocaleString()} Crores`);
    addDetail("Target Coverage:", `${inputs.parameters.targetCoverage}%`);
    addDetail("Implementation Timeline:", inputs.parameters.implementationTimeline);
    addDetail("Geographic Scope:", inputs.parameters.geographicScope);

    if (inputs.fineTuning) {
        y += 5;
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text("Fine-Tuning Assumptions", 14, y);
        doc.setFont(undefined, 'normal');
        y += 10;
        
        const fineTuningDetails = [
            {
                label: "Economic Model:",
                value: inputs.fineTuning.economicModel,
                description: "The underlying macroeconomic forecast used (e.g., optimistic, neutral)."
            },
            {
                label: "Social Adoption Rate:",
                value: `${inputs.fineTuning.socialAdoptionRate}%`,
                description: "The assumed speed at which the public will adopt and adapt to the policy."
            },
            {
                label: "Climate Impact:",
                value: `${inputs.fineTuning.climateImpact}/100`,
                description: "The severity of climate-related disruptions factored into the model."
            },
            {
                label: "Market Volatility:",
                value: `${inputs.fineTuning.marketVolatility}/100`,
                description: "The level of assumed stability or volatility in the financial markets."
            },
            {
                label: "Black Swan Events:",
                value: inputs.fineTuning.blackSwanEvents ? 'Yes' : 'No',
                description: "Whether the model includes the possibility of rare, unpredictable, high-impact events."
            }
        ];

        fineTuningDetails.forEach(detail => {
            if (y > 260) { doc.addPage(); y = 20; }
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(detail.label, 20, y);
            doc.setFont(undefined, 'normal');
            doc.text(detail.value, 80, y);
            y += 5;

            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            doc.setTextColor(150);
            const splitDescription = doc.splitTextToSize(detail.description, pageW - 34);
            y = addTextWithPageBreaks(doc, splitDescription, 20, y, {}, 4);
            
            // Reset styles and add spacing
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0);
            y += 5;
        });
    }
    
    // --- Simulation Results ---
    y += 10;
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFontSize(18);
    doc.text("2. Simulation Results", 14, y);
    doc.line(14, y + 2, pageW - 14, y + 2);
    y += 12;

    addDetail("AI Summary:", results.summary);
    
    y += 5;
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.text("Overall Impact Scores", 14, y);
    y += 10;
    
    // Impact Scores
    const scores = [
        { label: "Economic Impact:", value: `${results.economicImpact > 0 ? '+' : ''}${results.economicImpact.toFixed(1)}%` },
        { label: "Social Impact:", value: `${results.socialImpact.toFixed(1)}/10` },
        { label: "Environmental Impact:", value: `${results.environmentalImpact > 0 ? '+' : ''}${results.environmentalImpact.toFixed(1)}%` },
        { label: "Confidence:", value: `${results.confidence}%` }
    ];
    doc.setFontSize(12);
    scores.forEach(score => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.setFont(undefined, 'bold');
        doc.text(score.label, 20, y);
        doc.setFont(undefined, 'normal');
        doc.text(score.value, 80, y);
        y += 8;
    });

    // --- Detailed Metrics ---
    if (results.detailedMetrics.length > 0) {
        y += 10;
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(18);
        doc.text("3. Detailed Metrics", 14, y);
        doc.line(14, y + 2, pageW - 14, y + 2);
        y += 12;

        results.detailedMetrics.forEach(metric => {
            if (y > 260) { doc.addPage(); y = 20; }
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(metric.title, 14, y);
            y += 8;
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            metric.data.forEach((dataPoint: any) => {
                if (y > 280) { doc.addPage(); y = 20; }
                let text = '';
                if (metric.type === 'line-chart') {
                    const point = dataPoint as (LineChartDataPoint | MultiLineChartDataPoint);
                    const values = Object.keys(point).filter(k => k !== 'year').map(k => `${k}: ${point[k]}`).join(', ');
                    text = `Year ${point.year}: ${values}`;
                } else if (metric.type === 'bar-chart') {
                    const point = dataPoint as BarChartDataPoint;
                    text = `${point.category}: ${point.value}${metric.unit || ''}`;
                } else if (metric.type === 'heatmap') {
                    const point = dataPoint as WellBeingData;
                    text = `${point.state}: Impact Score ${point.impactScore}`;
                }

                if (text) {
                    y = addTextWithPageBreaks(doc, text, 20, y, {}, 5);
                }
            });
            y += 7; // spacing between metrics
        });
    }
    
    doc.save(`report-${inputs.policyName.replace(/[\s/]/g, '_')}.pdf`);
};
