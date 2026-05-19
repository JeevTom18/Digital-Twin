import React, { useState } from 'react';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-200">
            <h2>
                <button
                    type="button"
                    className="flex justify-between items-center w-full p-5 font-medium text-left text-slate-700 hover:bg-slate-100"
                    onClick={onClick}
                    aria-expanded={isOpen}
                >
                    <span>{title}</span>
                    <svg className={`w-3 h-3 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                    </svg>
                </button>
            </h2>
            <div className={`p-5 border-t border-slate-200 ${isOpen ? 'block' : 'hidden'}`}>
                <div className="text-slate-600 space-y-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface AccordionProps {
    children: React.ReactElement<AccordionItemProps>[];
}

const Accordion: React.FC<AccordionProps> & { Item: React.FC<Omit<AccordionItemProps, 'isOpen' | 'onClick'>> } = ({ children }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="border border-slate-200 rounded-lg">
            {React.Children.map(children, (child, index) => {
                return React.cloneElement(child, {
                    isOpen: openIndex === index,
                    onClick: () => handleClick(index)
                });
            })}
        </div>
    );
};

Accordion.Item = (props: Omit<AccordionItemProps, 'isOpen' | 'onClick'>) => <AccordionItem {...props} isOpen={false} onClick={() => {}} />;

export default Accordion;