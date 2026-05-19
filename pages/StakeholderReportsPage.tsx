import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import { StakeholderData } from '../types';
import SensitivityPieChart from '../components/charts/SensitivityPieChart';


const mockStakeholderData: StakeholderData[] = [
    {
        id: 'small_farmers',
        name: 'Small and Marginal Farmers',
        population: '86.2M',
        policyImpacts: {
            policyName: 'Fertilizer Subsidy Reform 2024',
            impactScore: 8.1,
            summary: 'Direct cash transfers will provide more flexibility and reduce dependency on intermediaries, leading to better resource allocation.'
        },
        sensitivityFactors: [
            { name: 'Crop Prices', value: 40, color: '#3b82f6' },
            { name: 'Input Costs', value: 30, color: '#10b981' },
            { name: 'Weather', value: 20, color: '#f59e0b' },
            { name: 'Credit', value: 10, color: '#ef4444' }
        ]
    },
    {
        id: 'urban_poor',
        name: 'Urban Poor',
        population: '80M',
        policyImpacts: {
            policyName: 'GST Tax Rate Change',
            impactScore: -4.5,
            summary: 'Changes in GST could increase the price of essential goods, disproportionately affecting the urban poor with limited disposable income.'
        },
        sensitivityFactors: [
            { name: 'Food Prices', value: 50, color: '#3b82f6' },
            { name: 'Employment', value: 25, color: '#10b981' },
            { name: 'Housing', value: 15, color: '#f59e0b' },
            { name: 'Transport', value: 10, color: '#ef4444' }
        ]
    }
];


const StakeholderReportsPage: React.FC = () => {
  const [selectedStakeholderId, setSelectedStakeholderId] = useState(mockStakeholderData[0].id);
  
  const selectedData = mockStakeholderData.find(s => s.id === selectedStakeholderId);

  return (
    <div>
      <PageHeader
        title="Stakeholder Reports"
        subtitle="Analyze policy effects on different population groups"
      />
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <Select 
                label="Select Stakeholder Group:"
                name="stakeholderGroup"
                value={selectedStakeholderId}
                onChange={e => setSelectedStakeholderId(e.target.value)}
                className="w-full sm:w-80"
            >
                {mockStakeholderData.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                ))}
            </Select>
            <div className="mt-3 sm:mt-0 text-left sm:text-right">
                <p className="text-sm text-slate-500">Population Size</p>
                <p className="text-xl font-bold text-slate-800">{selectedData?.population}</p>
            </div>
        </div>
      </Card>

    {selectedData ? (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Policy Impacts on: {selectedData.name}</h3>
                <Card className="bg-slate-50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-base text-slate-700">{selectedData.policyImpacts.policyName}</h4>
                            <p className="text-sm text-slate-600 mt-2">{selectedData.policyImpacts.summary}</p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-xs text-slate-500">Impact</p>
                             <p className={`text-2xl font-bold ${selectedData.policyImpacts.impactScore > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedData.policyImpacts.impactScore > 0 ? '+' : ''}{selectedData.policyImpacts.impactScore}
                            </p>
                        </div>
                    </div>
                </Card>
            </Card>
        </div>
        <div>
            <Card className="h-full">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Sensitivity Factors for {selectedData.name}</h3>
                <p className="text-sm text-slate-600 mb-4">This group's well-being is most sensitive to changes in the following areas:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedData.sensitivityFactors.map(factor => (
                         <span key={factor.name} className="px-2 py-1 text-xs font-medium rounded-full" style={{backgroundColor: factor.color + '20', color: factor.color}}>{factor.name}</span>
                    ))}
                </div>
                <SensitivityPieChart data={selectedData.sensitivityFactors} />
            </Card>
        </div>
      </div>
       ) : (
        <Card>
            <div className="text-center py-20">
            <h3 className="text-lg font-semibold text-slate-700">No data available</h3>
            <p className="text-sm text-slate-500 mt-2">Could not find data for the selected stakeholder group.</p>
            </div>
        </Card>
       )}
    </div>
  );
};

export default StakeholderReportsPage;