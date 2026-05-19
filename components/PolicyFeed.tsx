import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import { BroadcastIcon } from './icons';
import { POLICY_FEED_DATA } from '../utils/mockData';

const PolicyFeed: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % POLICY_FEED_DATA.length);
        }, 4000); // Change policy every 4 seconds

        return () => clearInterval(interval);
    }, []);

    const currentPolicy = POLICY_FEED_DATA[currentIndex];
    
    // Policy type to color mapping
    const typeColorMap: { [key: string]: string } = {
        'Healthcare Policy': 'bg-red-100 text-red-700',
        'Environmental Policy': 'bg-green-100 text-green-700',
        'Social Policy': 'bg-yellow-100 text-yellow-700',
        'Industrial Policy': 'bg-purple-100 text-purple-700',
        'Education Policy': 'bg-blue-100 text-blue-700',
    };

    return (
        <Card>
            <div className="flex items-center mb-4">
                <BroadcastIcon className="text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800 ml-2">Live Policy Feed</h2>
            </div>
            <div className="relative h-16 overflow-hidden">
                <div
                    key={currentPolicy.id}
                    className="absolute w-full flex flex-col justify-center h-full animate-slide-in-up"
                >
                    <p className="font-semibold text-base text-slate-800 truncate">{currentPolicy.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                        <span className={`capitalize font-medium px-1.5 py-0.5 rounded ${typeColorMap[currentPolicy.type] || 'bg-slate-100 text-slate-700'}`}>
                            {currentPolicy.type}
                        </span>
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default PolicyFeed;