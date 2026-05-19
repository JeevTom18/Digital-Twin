import React from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/ui/Card';
import Accordion from '../../components/ui/Accordion';
import { MOCK_FAQ_DATA } from '../../utils/mockData';
// FIX: Import missing icons SettingsIcon and ImpactIcon.
import { BookOpenIcon, LightbulbIcon, SettingsIcon, ImpactIcon } from '../../components/icons';

const LearnPage: React.FC = () => {
    return (
        <div>
            <PageHeader
                title="Learn About Policy Simulation"
                subtitle="Understanding the fundamentals of data-driven governance."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Frequently Asked Questions</h2>
                        <p className="text-sm text-slate-500 mb-6">Find answers to common questions about our platform and process.</p>
                        <Accordion>
                            {MOCK_FAQ_DATA.map((item, index) => (
                                <Accordion.Item key={index} title={item.question}>
                                    <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">How Our Simulation Works</h2>
                         <ol className="relative border-l border-slate-200 space-y-6 pl-4">
                            <li className="ml-4">
                                <div className="absolute w-3 h-3 bg-slate-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                <h3 className="text-lg font-semibold text-slate-800">1. Data Input</h3>
                                <p className="text-sm text-slate-600">The process starts with comprehensive, anonymized data from official sources, forming the baseline reality of our digital twin.</p>
                            </li>
                            <li className="ml-4">
                                <div className="absolute w-3 h-3 bg-slate-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                <h3 className="text-lg font-semibold text-slate-800">2. Policy Configuration</h3>
                                <p className="text-sm text-slate-600">A policymaker defines the parameters of a new policy, such as its budget, target demographic, and timeline.</p>
                            </li>
                            <li className="ml-4">
                                <div className="absolute w-3 h-3 bg-slate-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                <h3 className="text-lg font-semibold text-slate-800">3. AI Analysis</h3>
                                <p className="text-sm text-slate-600">Our advanced AI model processes the policy against the baseline data, forecasting complex chain reactions across different sectors of the economy and society.</p>
                            </li>
                             <li className="ml-4">
                                <div className="absolute w-3 h-3 bg-slate-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                <h3 className="text-lg font-semibold text-slate-800">4. Results Generation</h3>
                                <p className="text-sm text-slate-600">The output includes high-level impact scores, detailed visualizations, and a qualitative summary, providing a multi-faceted view of the potential outcomes.</p>
                            </li>
                        </ol>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                         <h2 className="text-xl font-bold text-slate-800 mb-4">Key Concepts</h2>
                         <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="flex-shrink-0 text-blue-600 bg-blue-100 p-2 rounded-lg mr-3"><SettingsIcon /></div>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Policy Parameters</h3>
                                    <p className="text-sm text-slate-600">The basic inputs of a policy, like budget and timeline, that define its scope.</p>
                                </div>
                            </li>
                             <li className="flex items-start">
                                <div className="flex-shrink-0 text-green-600 bg-green-100 p-2 rounded-lg mr-3"><ImpactIcon /></div>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Impact Metrics</h3>
                                    <p className="text-sm text-slate-600">The outputs measuring predicted effects on the economy, society, and environment.</p>
                                </div>
                            </li>
                             <li className="flex items-start">
                                <div className="flex-shrink-0 text-yellow-600 bg-yellow-100 p-2 rounded-lg mr-3"><LightbulbIcon /></div>
                                <div>
                                    <h3 className="font-semibold text-slate-700">Confidence Score</h3>
                                    <p className="text-sm text-slate-600">Represents the AI's confidence in its forecast based on available data quality.</p>
                                </div>
                            </li>
                         </ul>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">The Role of AI</h2>
                        <p className="text-sm text-slate-600">
                            Artificial Intelligence is at the core of this platform. It allows us to analyze vast, complex datasets and identify patterns that would be impossible for humans to see. The AI helps provide an unbiased, data-driven forecast, reducing the influence of political bias and focusing on the potential outcomes for citizens. It's a tool to augment, not replace, human expertise in policy-making.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LearnPage;