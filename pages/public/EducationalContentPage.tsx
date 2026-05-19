import React from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/ui/Card';
import Accordion from '../../components/ui/Accordion';
import { MOCK_FAQ_DATA } from '../../utils/mockData';

const EducationalContentPage: React.FC = () => {
    return (
        <div>
            <PageHeader
                title="Learn About Policy Simulation"
                subtitle="Understanding the fundamentals of data-driven governance."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
                        <Accordion>
                            {MOCK_FAQ_DATA.map((item, index) => (
                                <Accordion.Item key={index} title={item.question}>
                                    <p>{item.answer}</p>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                         <h2 className="text-xl font-bold text-slate-800 mb-4">Key Concepts</h2>
                         <ul className="space-y-4">
                            <li>
                                <h3 className="font-semibold text-slate-700">Policy Parameters</h3>
                                <p className="text-sm text-slate-600">These are the basic inputs of a policy, like budget, target population, and timeline. They define the scale and scope of the initiative.</p>
                            </li>
                             <li>
                                <h3 className="font-semibold text-slate-700">Impact Metrics</h3>
                                <p className="text-sm text-slate-600">These are the outputs of the simulation. They measure the predicted effects on different areas, such as Economic Impact (e.g., GDP change), Social Impact (e.g., well-being score), and Environmental Impact (e.g., emissions change).</p>
                            </li>
                             <li>
                                <h3 className="font-semibold text-slate-700">Confidence Score</h3>
                                <p className="text-sm text-slate-600">This percentage represents the AI's confidence in its own forecast. A higher score means the simulation is based on more complete and reliable data.</p>
                            </li>
                         </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EducationalContentPage;