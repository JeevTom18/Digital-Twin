import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/ui/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { HistoryEntry } from '../../types';
import Button from '../../components/ui/Button';
import { generatePdfReport } from '../../utils/pdfGenerator';

const ReportsLibraryPage: React.FC = () => {
    const [history] = useLocalStorage<HistoryEntry[]>('simulationHistory', []);
    const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
    
    const completedSimulations = history.filter(h => h.status === 'completed');

    const handleDownload = async (sim: HistoryEntry) => {
        if (!sim.results) {
            alert("This simulation has no results to generate a report.");
            return;
        }
        setGeneratingPdfId(sim.id);
        // Give the UI a moment to update before blocking the thread with PDF generation
        await new Promise(resolve => setTimeout(resolve, 50)); 
        try {
            generatePdfReport(sim);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Sorry, there was an error generating the PDF report.");
        } finally {
            setGeneratingPdfId(null);
        }
    };

    return (
        <div>
            <PageHeader
                title="Public Simulation Reports"
                subtitle="Browse a view-only list of published simulation analyses."
            />

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Policy Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Policy Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Completion Date</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Confidence</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Download</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {completedSimulations.map(sim => (
                                <tr key={sim.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{sim.inputs.policyName}</div>
                                        <div className="text-sm text-slate-500 truncate max-w-xs">{sim.inputs.policyDescription}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {sim.inputs.policyType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {new Date(sim.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center font-semibold">
                                        {sim.results?.confidence}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => handleDownload(sim)}
                                            disabled={generatingPdfId === sim.id}
                                        >
                                            {generatingPdfId === sim.id ? 'Generating...' : 'Download PDF'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {completedSimulations.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No published reports available yet.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ReportsLibraryPage;