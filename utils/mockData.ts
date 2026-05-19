import { HistoryEntry, FineTuningParameters, WellBeingData, PredefinedScenario, FAQItem, PolicyScenarioCategory } from '../types';
import { INDIAN_STATES } from '../constants';

const generateStateWellBeing = (base: number, variance: number): WellBeingData[] => {
    return INDIAN_STATES.map(state => ({
        state,
        impactScore: parseFloat((base + (Math.random() - 0.5) * variance).toFixed(2))
    }));
};

const defaultFineTuning: FineTuningParameters = {
    economicModel: 'Neutral',
    socialAdoptionRate: 60,
    climateImpact: 30,
    marketVolatility: 40,
    blackSwanEvents: false,
};

export const MOCK_HISTORY_DATA: HistoryEntry[] = [
    {
        id: new Date('2025-09-15T10:00:00Z').toISOString(),
        timestamp: new Date('2025-09-15T10:00:00Z').toLocaleString(),
        status: 'draft',
        inputs: {
            policyName: "Fertiliser subsidy",
            policyType: "Tax Reform",
            policyDescription: "Changes in subsidies",
            parameters: { budgetAllocation: 25000, targetCoverage: 30, implementationTimeline: '5 years', geographicScope: 'National' },
            fineTuning: {
                ...defaultFineTuning,
                economicModel: 'Pessimistic'
            }
        },
        results: {
            economicImpact: -0.5,
            socialImpact: 0.3,
            environmentalImpact: 0.1,
            confidence: 1,
            summary: "Initial modeling shows a potential negative economic impact and very low social impact. Confidence is extremely low due to undefined parameters.",
            detailedMetrics: []
        }
    },
    {
        id: new Date('2025-09-15T09:00:00Z').toISOString(),
        timestamp: new Date('2025-09-15T09:00:00Z').toLocaleString(),
        status: 'completed',
        inputs: {
            policyName: "Fertilizer Subsidy Reform 2024",
            policyType: "Agricultural Policy",
            policyDescription: "Reform the current fertilizer subsidy system to provide direct benefit transfers to farmers while reducing market distortions and environmental impact.",
            parameters: { budgetAllocation: 75000, targetCoverage: 100, implementationTimeline: '1 year', geographicScope: 'National' },
            fineTuning: defaultFineTuning,
        },
        results: {
            economicImpact: 2.3,
            socialImpact: 7.2,
            environmentalImpact: 1.1,
            confidence: 87,
            summary: "The reform is projected to significantly boost rural consumption and farmer income. Direct transfers enhance financial stability and reduce corruption, leading to positive environmental outcomes through more efficient fertilizer use.",
            detailedMetrics: [
                {
                    title: 'Predicted Farmer Income (5 Years)', type: 'line-chart', unit: 'k INR',
                    data: [ { year: 2024, value: 75.5 }, { year: 2025, value: 78.2 }, { year: 2026, value: 80.1 }, { year: 2027, value: 82.3 }, { year: 2028, value: 84.0 }],
                    lines: [{ dataKey: 'value', name: 'Farmer Income', color: '#10b981' }]
                },
                {
                    title: 'Citizen Well-being Index Impact', type: 'heatmap',
                    data: generateStateWellBeing(7, 4),
                }
            ]
        }
    },
    {
        id: new Date('2024-07-21T11:00:00Z').toISOString(),
        timestamp: new Date('2024-07-21T11:00:00Z').toLocaleString(),
        status: 'running',
        inputs: {
            policyName: "National Rooftop Solar Initiative",
            policyType: "Environmental Policy",
            policyDescription: "Promote the installation of rooftop solar panels on residential buildings through subsidies and tax incentives.",
            parameters: { budgetAllocation: 25000, targetCoverage: 30, implementationTimeline: '5 years', geographicScope: 'National' },
            fineTuning: {
                ...defaultFineTuning,
                economicModel: 'Optimistic'
            }
        }
    },
];

export const POLICY_FEED_DATA: { name: string, type: string, id: string }[] = [
    { id: 'pf-1', name: "National Digital Health Mission", type: "Healthcare Policy" },
    { id: 'pf-2', name: "EV Adoption Subsidy Phase II", type: "Environmental Policy" },
    { id: 'pf-3', name: "Gig Worker Social Security Bill", type: "Social Policy" },
    { id: 'pf-4', name: "Semiconductor Manufacturing Grant", type: "Industrial Policy" },
    { id: 'pf-5', name: "AI Skilling Program for Youth", type: "Education Policy" },
];

export const MOCK_EXPLORER_SCENARIOS: PolicyScenarioCategory[] = [
    {
        policyType: 'Agriculture & Rural Development',
        description: 'Policies related to farming, food security, and rural infrastructure.',
        scenarios: [
            {
                id: 'scenario-agri-1',
                title: 'What if fertilizer subsidies are increased by 10%?',
                description: 'This scenario explores the short-term economic and environmental effects of a 10% increase in the national budget for fertilizer subsidies.',
                results: {
                    economicImpact: 1.2,
                    socialImpact: 6.5,
                    environmentalImpact: -2.3,
                    confidence: 90,
                    summary: "An increase in subsidies would likely boost agricultural output and farmer income in the short term. However, it could lead to overuse of fertilizers, causing negative environmental effects like soil degradation and water pollution.",
                    detailedMetrics: [
                         {
                            title: 'Projected Agricultural GDP Growth', type: 'line-chart', unit: '%',
                            data: [ { year: 2024, value: 3.1 }, { year: 2025, value: 3.5 }, { year: 2026, value: 3.4 }, { year: 2027, value: 3.3 }, { year: 2028, value: 3.2 }],
                            lines: [{ dataKey: 'value', name: 'Agri GDP Growth', color: '#10b981' }]
                        },
                        {
                            title: 'Projected Soil Nutrient Depletion', type: 'bar-chart', unit: '% increase',
                            data: [ { category: 'Nitrogen', value: 8 }, { category: 'Phosphorus', value: 5 }, { category: 'Potassium', value: 6 }],
                            color: '#f59e0b'
                        }
                    ]
                }
            },
            {
                id: 'scenario-agri-2',
                title: 'What if a ₹20,000 Cr fund is created for crop diversification?',
                description: 'This scenario models the impact of a significant government fund aimed at helping farmers shift from traditional crops to more profitable and sustainable alternatives.',
                results: {
                    economicImpact: 1.8,
                    socialImpact: 7.2,
                    environmentalImpact: 2.5,
                    confidence: 82,
                    summary: 'The fund would likely improve farmer resilience and income over the medium term. It would also promote biodiversity and reduce water usage, leading to positive environmental outcomes. Initial economic growth might be slow as farmers adapt.',
                    detailedMetrics: [
                         {
                            title: 'Projected Farmer Income (5 Years)', type: 'line-chart', unit: 'k INR',
                            data: [ { year: 2024, value: 75.5 }, { year: 2025, value: 77.1 }, { year: 2026, value: 80.3 }, { year: 2027, value: 83.4 }, { year: 2028, value: 86.0 }],
                            lines: [{ dataKey: 'value', name: 'Farmer Income', color: '#10b981' }]
                        },
                        {
                            title: 'Water Usage Reduction in Agriculture', type: 'bar-chart', unit: '%',
                            data: [ { category: 'Punjab', value: 12 }, { category: 'Haryana', value: 15 }, { category: 'Maharashtra', value: 10 }],
                            color: '#f59e0b'
                        }
                    ]
                }
            }
        ]
    },
    {
        policyType: 'Environment & Climate Change',
        description: 'Policies focused on renewable energy, pollution control, and conservation.',
        scenarios: [
            {
                id: 'scenario-env-1',
                title: 'What if India invests ₹50,000 Cr in rooftop solar?',
                description: 'This scenario simulates the impact of a significant national investment in promoting rooftop solar panel installations for residential properties.',
                results: {
                    economicImpact: 2.5,
                    socialImpact: 7.8,
                    environmentalImpact: 4.1,
                    confidence: 85,
                    summary: "A major push for rooftop solar would create green jobs, reduce household electricity bills, and significantly cut carbon emissions. The primary challenges would be grid integration and ensuring equitable access to subsidies.",
                    detailedMetrics: [
                         {
                            title: 'Projected CO2 Emissions Reduction', type: 'line-chart', unit: 'Mt',
                            data: [ { year: 2024, value: 15 }, { year: 2025, value: 35 }, { year: 2026, value: 60 }, { year: 2027, value: 90 }, { year: 2028, value: 125 }],
                            lines: [{ dataKey: 'value', name: 'CO2 Reduction', color: '#f59e0b' }]
                        },
                        {
                            title: 'Citizen Well-being Index Impact', type: 'heatmap',
                            data: generateStateWellBeing(6, 3),
                        }
                    ]
                }
            },
            {
                id: 'scenario-env-2',
                title: 'What if single-use plastic is banned nationwide?',
                description: 'Simulates the effects of a complete ban on the production, sale, and use of single-use plastic items across India.',
                results: {
                    economicImpact: -0.4,
                    socialImpact: 6.9,
                    environmentalImpact: 8.5,
                    confidence: 88,
                    summary: 'A nationwide ban would dramatically reduce plastic pollution, with huge environmental benefits. There would be a short-term negative economic impact on the plastics industry, but this would be offset by growth in sustainable alternatives. Socially, it would improve public health and cleanliness.',
                    detailedMetrics: [
                         {
                            title: 'Projected Reduction in Plastic Waste', type: 'line-chart', unit: 'Million Tonnes',
                            data: [ { year: 2024, value: 0.5 }, { year: 2025, value: 2.1 }, { year: 2026, value: 3.5 }, { year: 2027, value: 4.8 }, { year: 2028, value: 6.0 }],
                            lines: [{ dataKey: 'value', name: 'Plastic Waste Reduction', color: '#f59e0b' }]
                        },
                        {
                            title: 'Citizen Well-being Index Impact', type: 'heatmap',
                            data: generateStateWellBeing(5, 2),
                        }
                    ]
                }
            }
        ]
    }
];

// FIX: Export a flattened list of scenarios for use in components that need a simple list.
export const MOCK_PREDEFINED_SCENARIOS: PredefinedScenario[] = MOCK_EXPLORER_SCENARIOS.flatMap(category => category.scenarios);

export const MOCK_FAQ_DATA: FAQItem[] = [
    {
        question: "What is a 'Digital Twin'?",
        answer: "Think of the Digital Twin as a sophisticated, virtual mirror of India's complex socio-economic systems. It's a dynamic simulation environment built on a vast foundation of national data, including economic trends, demographic statistics, and social indicators. For policymakers, it acts as a 'sandbox'—a safe, virtual space where they can introduce a new policy and observe its potential ripple effects across the country over several years. This allows them to identify benefits, foresee unintended consequences, and understand complex trade-offs, ultimately reducing risks before a policy is enacted in the real world."
    },
    {
        question: "How accurate are these simulations?",
        answer: "Simulations are data-driven forecasts, not infallible predictions of the future. Their accuracy depends heavily on the quality of the input data and the assumptions made. To be transparent about this, every simulation comes with a 'Confidence Score'. A high score (e.g., 90%) means the AI's forecast is based on robust, historical data for a well-understood issue. A lower score might indicate a novel policy area with high uncertainty or limited data. The goal is not to predict the future perfectly, but to highlight probable outcomes, potential risks, and key variables, enabling more informed and evidence-based decision-making."
    },
    {
        question: "Where does the data for the simulation come from?",
        answer: "Our platform is built on anonymized, aggregated data from a wide array of official and trusted sources. This includes, but is not limited to, the National Sample Survey Office (NSSO), the Reserve Bank of India (RBI), Census of India data, and various ministries (e.g., Finance, Health, Agriculture). We combine economic indicators (like GDP growth and inflation), demographic statistics (like population density and literacy rates), and social trends to create a comprehensive and realistic model of India. All data is handled with strict privacy protocols to ensure individual identities are protected."
    },
    {
        question: "What does the 'Social Impact' score mean?",
        answer: "The 'Social Impact' score is a composite metric (rated 0-10) designed to measure a policy's effect on citizen well-being beyond just economic figures. It synthesizes multiple factors to provide a holistic view of societal change, including: effects on equity and access to essential services (like healthcare and education) for vulnerable groups; changes in livelihood indicators like employment and poverty rates; and shifts in quality of life metrics such as public health and safety. A higher score signifies a policy that is projected to create a more equitable and positive outcome for society as a whole."
    },
    {
        question: "Can I suggest a policy to be simulated?",
        answer: "Absolutely. Public participation is a cornerstone of a vibrant democracy. While government bodies are the primary users of the simulation engine, we strongly encourage you to share your ideas and concerns. Please use the 'Feedback' page on this portal to submit your suggestions. This public input is invaluable—it helps us understand citizen priorities and can influence the 'what-if' scenarios we develop and feature in the Policy Explorer for everyone to see."
    }
];
