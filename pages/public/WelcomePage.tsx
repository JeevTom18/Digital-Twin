import React from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/ui/Card';
import { Logo } from '../../components/icons';
import Button from '../../components/ui/Button';

const WelcomePage: React.FC = () => {
    return (
        <div>
            <PageHeader
                title="Welcome to the Public Portal"
                subtitle="Understanding policy-making through data and simulation."
            />
            <Card>
                <div className="flex flex-col items-center text-center p-8">
                    <div className="mb-4">
                        <Logo className="w-24 h-24" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">The DigiTwin of Democracy</h2>
                    <p className="mt-4 max-w-3xl text-slate-600">
                        This platform is a pioneering initiative by the Government of India to bring transparency and data-driven insights into the policy-making process. Using advanced AI simulations, we can forecast the potential impacts of new policies before they are implemented.
                    </p>
                    <p className="mt-4 max-w-3xl text-slate-600">
                        As a citizen, you can explore these simulations, understand the complex trade-offs involved in governance, and see how different policies might affect our nation's economy, society, and environment.
                    </p>
                    <div className="mt-8">
                        <Button onClick={() => window.location.hash = 'impact-overview'}>
                            Explore Policy Scenarios
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
                <Card>
                    <h3 className="font-bold text-lg mb-2">Explore Scenarios</h3>
                    <p className="text-sm text-slate-600">View simplified results of key policy simulations and understand their potential effects on different aspects of the country.</p>
                </Card>
                 <Card>
                    <h3 className="font-bold text-lg mb-2">Learn About Policy</h3>
                    <p className="text-sm text-slate-600">Get clear, simple explanations of complex government policies and the factors that influence their success.</p>
                </Card>
                 <Card>
                    <h3 className="font-bold text-lg mb-2">Access Reports</h3>
                    <p className="text-sm text-slate-600">Browse through a library of published simulation reports to see the detailed analysis behind policy decisions.</p>
                </Card>
            </div>
        </div>
    );
};

export default WelcomePage;