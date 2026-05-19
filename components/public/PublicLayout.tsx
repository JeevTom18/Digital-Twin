import React from 'react';
import PublicHeader from './PublicHeader';
import WelcomePage from '../../pages/public/WelcomePage';
import ImpactOverviewPage from '../../pages/public/ImpactOverviewPage';
import EducationalContentPage from '../../pages/public/EducationalContentPage';
import PublicReportsPage from '../../pages/public/PublicReportsPage';
import FeedbackPage from '../../pages/public/FeedbackPage';

interface PublicLayoutProps {
    onLogout: () => void;
    page: string;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ onLogout, page }) => {

    const renderPage = () => {
        const publicPages = new Set(['welcome', 'impact-overview', 'learn', 'reports', 'feedback']);
        if (!publicPages.has(page)) {
             // If a public user lands on an unknown or policymaker-only URL, default to welcome
            return <WelcomePage />;
        }

        switch (page) {
            case 'welcome':
                return <WelcomePage />;
            case 'impact-overview':
                return <ImpactOverviewPage />;
            case 'learn':
                return <EducationalContentPage />;
            case 'reports':
                return <PublicReportsPage />;
            case 'feedback':
                return <FeedbackPage />;
            default:
                return <WelcomePage />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader currentPage={page} onLogout={onLogout} />
            <main className="flex-1 bg-slate-100 p-6 sm:p-8 lg:p-10">
                {renderPage()}
            </main>
             <footer className="bg-white border-t border-slate-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                        <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} DigiTwin of Democracy. A Government of India Initiative.</p>
                        <div className="flex space-x-4">
                            <a href="#welcome" className="hover:text-blue-600">About</a>
                            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
                            <a href="#feedback" className="hover:text-blue-600">Contact Us</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;