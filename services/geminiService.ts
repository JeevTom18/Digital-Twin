import { GoogleGenAI, Type } from "@google/genai";
import { SimulationInput, SimulationResult, Metric, LineChartDataPoint, BarChartDataPoint, WellBeingData, MultiLineChartDataPoint } from '../types';
import { INDIAN_STATES } from '../constants';

const ai = new GoogleGenAI({ apiKey: "AIzaSyDk1Oqj5QLOk9SsbgW2tP2IvHgbuzDU4K0" as string });

const getPolicySpecificMetrics = (policyType: string) => {
    let promptFragment = '';
    let schemaProperties: any = {};
    let metricTransformers: any = {};

    const wellBeingPrompt = `Citizen well-being index impact for ALL of the following Indian states: ${INDIAN_STATES.join(', ')}.`;
    const wellBeingSchema = {
        type: Type.ARRAY,
        description: "Impact on citizen well-being index for all Indian states.",
        items: {
            type: Type.OBJECT,
            properties: {
                state: { type: Type.STRING },
                impactScore: { type: Type.NUMBER, description: "A score from -10 to +10." }
            }
        }
    };
     metricTransformers.stateWellBeing = (data: WellBeingData[]) => ({
        title: 'Citizen Well-being Index Impact',
        type: 'heatmap',
        data,
    });


    switch (policyType) {
        case 'Agriculture & Rural Development':
            promptFragment = `
                1. Annual farmer income over the next 5 years.
                2. Food price inflation across major categories.
                3. ${wellBeingPrompt}
            `;
            schemaProperties = {
                farmerIncome: {
                    type: Type.ARRAY, description: "Predicted annual farmer income in thousands of INR over 5 years.",
                    items: { type: Type.OBJECT, properties: { year: { type: Type.INTEGER }, value: { type: Type.NUMBER } } }
                },
                foodInflation: {
                    type: Type.ARRAY, description: "Projected food price inflation for key categories.",
                    items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, value: { type: Type.NUMBER } } }
                },
                stateWellBeing: wellBeingSchema,
            };
            metricTransformers.farmerIncome = (data: LineChartDataPoint[]) => ({ title: 'Predicted Farmer Income (5 Years)', type: 'line-chart', data, unit: 'k INR', lines: [{ dataKey: 'value', name: 'Farmer Income', color: '#10b981' }] });
            metricTransformers.foodInflation = (data: BarChartDataPoint[]) => ({ title: 'Projected Food Price Inflation', type: 'bar-chart', data, unit: '%', color: '#3b82f6' });
            break;

        case 'Healthcare & Family Welfare':
            promptFragment = `
                1. Projected national life expectancy over 5 years, with separate projections for 'Urban' and 'Rural' demographics.
                2. Predicted healthcare accessibility score across key demographics (e.g., Urban, Rural).
                3. ${wellBeingPrompt}
            `;
            schemaProperties = {
                lifeExpectancy: {
                    type: Type.ARRAY, description: "Projected national life expectancy over 5 years for Urban and Rural populations.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            year: { type: Type.INTEGER },
                            urban: { type: Type.NUMBER, description: "Life expectancy for Urban population" },
                            rural: { type: Type.NUMBER, description: "Life expectancy for Rural population" }
                        }
                    }
                },
                healthcareAccessibility: {
                    type: Type.ARRAY, description: "Predicted healthcare accessibility score across demographics.",
                    items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, value: { type: Type.NUMBER } } }
                },
                stateWellBeing: wellBeingSchema,
            };
            metricTransformers.lifeExpectancy = (data: MultiLineChartDataPoint[]) => ({
                title: 'Projected Life Expectancy (Urban vs. Rural)',
                type: 'line-chart',
                data,
                unit: 'years',
                lines: [
                    { dataKey: 'urban', name: 'Urban', color: '#3b82f6' },
                    { dataKey: 'rural', name: 'Rural', color: '#10b981' },
                ]
            });
            metricTransformers.healthcareAccessibility = (data: BarChartDataPoint[]) => ({ title: 'Healthcare Accessibility Score', type: 'bar-chart', data, unit: '/100', color: '#10b981' });
            break;
        
        case 'Education & Skilling':
             promptFragment = `
                1. Projected national literacy rate over 5 years.
                2. Student enrollment ratio in higher education by gender.
                3. ${wellBeingPrompt}
            `;
            schemaProperties = {
                literacyRate: {
                    type: Type.ARRAY, description: "Projected national literacy rate over 5 years.",
                    items: { type: Type.OBJECT, properties: { year: { type: Type.INTEGER }, value: { type: Type.NUMBER } } }
                },
                studentEnrollment: {
                    type: Type.ARRAY, description: "Student enrollment ratio in higher education by gender.",
                    items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, value: { type: Type.NUMBER } } }
                },
                stateWellBeing: wellBeingSchema,
            };
            metricTransformers.literacyRate = (data: LineChartDataPoint[]) => ({ title: 'Projected National Literacy Rate', type: 'line-chart', data, unit: '%', lines: [{ dataKey: 'value', name: 'Literacy Rate', color: '#10b981' }] });
            metricTransformers.studentEnrollment = (data: BarChartDataPoint[]) => ({ title: 'Higher Education Enrollment Ratio', type: 'bar-chart', data, unit: '%', color: '#10b981' });
            break;

        case 'Environment & Climate Change':
             promptFragment = `
                1. Projected CO2 emissions reduction over 5 years.
                2. Renewable energy adoption rate as a percentage of total energy consumption.
                3. ${wellBeingPrompt}
            `;
            schemaProperties = {
                co2Emissions: {
                    type: Type.ARRAY, description: "Projected CO2 emissions reduction over 5 years in million tonnes.",
                    items: { type: Type.OBJECT, properties: { year: { type: Type.INTEGER }, value: { type: Type.NUMBER } } }
                },
                renewableAdoption: {
                    type: Type.ARRAY, description: "Renewable energy adoption rate.",
                    items: { type: Type.OBJECT, properties: { category: { type: Type.STRING, description: "e.g., Solar, Wind" }, value: { type: Type.NUMBER } } }
                },
                stateWellBeing: wellBeingSchema,
            };
            metricTransformers.co2Emissions = (data: LineChartDataPoint[]) => ({ title: 'Projected CO2 Emissions Reduction', type: 'line-chart', data, unit: 'Mt', lines: [{ dataKey: 'value', name: 'CO2 Emissions', color: '#f59e0b' }] });
            metricTransformers.renewableAdoption = (data: BarChartDataPoint[]) => ({ title: 'Renewable Energy Adoption Rate', type: 'bar-chart', data, unit: '%', color: '#f59e0b' });
            break;

        case 'Economic & Financial Policy':
             promptFragment = `
                1. Projected annual GDP growth rate for the next 5 years.
                2. Projected annual CPI inflation rate for the next 5 years.
                3. ${wellBeingPrompt}
            `;
            schemaProperties = {
                gdpGrowth: {
                    type: Type.ARRAY, description: "Projected annual GDP growth rate over 5 years.",
                    items: { type: Type.OBJECT, properties: { year: { type: Type.INTEGER }, value: { type: Type.NUMBER } } }
                },
                cpiInflation: {
                    type: Type.ARRAY, description: "Projected annual CPI inflation rate over 5 years.",
                    items: { type: Type.OBJECT, properties: { year: { type: Type.INTEGER }, value: { type: Type.NUMBER } } }
                },
                stateWellBeing: wellBeingSchema,
            };
            metricTransformers.gdpGrowth = (data: LineChartDataPoint[]) => ({ title: 'Projected GDP Growth Rate', type: 'line-chart', data, unit: '%', lines: [{ dataKey: 'value', name: 'GDP Growth', color: '#3b82f6' }] });
            metricTransformers.cpiInflation = (data: LineChartDataPoint[]) => ({ title: 'Projected CPI Inflation Rate', type: 'line-chart', data, unit: '%', lines: [{ dataKey: 'value', name: 'CPI Inflation', color: '#3b82f6' }] });
            break;

        case 'Infrastructure & Urban Development':
             promptFragment = `
                1. Increase in Urban Housing availability (in percentage) across Tier 1, Tier 2, and Tier 3 cities.
                2. Public transport ridership growth over 5 years.
                3. ${wellBeingPrompt}
            `;
            schemaProperties = {
                urbanHousing: {
                    type: Type.ARRAY, description: "Increase in urban housing availability.",
                    items: { type: Type.OBJECT, properties: { category: { type: Type.STRING, description: "e.g., Tier 1, Tier 2" }, value: { type: Type.NUMBER } } }
                },
                publicTransportRidership: {
                    type: Type.ARRAY, description: "Projected public transport ridership growth over 5 years.",
                    items: { type: Type.OBJECT, properties: { year: { type: Type.INTEGER }, value: { type: Type.NUMBER } } }
                },
                stateWellBeing: wellBeingSchema,
            };
            metricTransformers.urbanHousing = (data: BarChartDataPoint[]) => ({ title: 'Urban Housing Availability Increase', type: 'bar-chart', data, unit: '%', color: '#10b981' });
            metricTransformers.publicTransportRidership = (data: LineChartDataPoint[]) => ({ title: 'Public Transport Ridership Growth', type: 'line-chart', data, unit: '%', lines: [{ dataKey: 'value', name: 'Ridership Growth', color: '#10b981' }] });
            break;

        default:
            promptFragment = `1. ${wellBeingPrompt}`;
            schemaProperties = { stateWellBeing: wellBeingSchema };
            break;
    }

    return { promptFragment, schemaProperties, metricTransformers };
};


export const simulatePolicyImpact = async (inputs: SimulationInput): Promise<SimulationResult> => {
    let fineTuningPromptSection = '';
    if (inputs.fineTuning) {
        fineTuningPromptSection = `
        Fine-tuning Parameters (Model Assumptions):
        - Economic Model Assumption: ${inputs.fineTuning.economicModel}
        - Social Adoption Rate Assumption: ${inputs.fineTuning.socialAdoptionRate}%
        - Climate Change Impact Severity Assumption: ${inputs.fineTuning.climateImpact}/100
        - Market Volatility Assumption: ${inputs.fineTuning.marketVolatility}/100
        - Consider Black Swan Events: ${inputs.fineTuning.blackSwanEvents ? 'Yes' : 'No'}
        `;
    }

    const { promptFragment, schemaProperties, metricTransformers } = getPolicySpecificMetrics(inputs.policyType);

    const baseSchema = {
        economicImpact: { type: Type.NUMBER, description: "Projected economic impact as a percentage (e.g., +2.1 for 2.1%)." },
        socialImpact: { type: Type.NUMBER, description: "Projected social impact score from 0 to 10." },
        environmentalImpact: { type: Type.NUMBER, description: "Projected environmental impact as a percentage (e.g., +1.1 for 1.1%)." },
        confidence: { type: Type.NUMBER, description: "Confidence level of the simulation from 0 to 100." },
        summary: { type: Type.STRING, description: "A brief summary of the policy's predicted impact." },
    };

    const responseSchema = {
        type: Type.OBJECT,
        properties: { ...baseSchema, ...schemaProperties },
        required: ["economicImpact", "socialImpact", "environmentalImpact", "confidence", "summary", ...Object.keys(schemaProperties)]
    };

  const prompt = `
    You are an expert economic and social policy simulator for the government of India.
    Your task is to generate a realistic 5-year forecast and impact assessment for the following policy.
    
    Policy Details:
    - Policy Name: ${inputs.policyName}
    - Policy Type: ${inputs.policyType}
    - Description: ${inputs.policyDescription}
    - Budget Allocation: ${inputs.parameters.budgetAllocation} Crore INR
    - Target Coverage: ${inputs.parameters.targetCoverage}% of the intended population/sector
    - Implementation Timeline: ${inputs.parameters.implementationTimeline}
    - Geographic Scope: ${inputs.parameters.geographicScope}

    ${fineTuningPromptSection}

    Based on this policy, generate a comprehensive simulation result.
    Provide a concise summary and key impact scores.
    Also, generate detailed data for the aforestated metrics:
    ${promptFragment}

    Provide the output ONLY in the specified JSON format. Do not add any introductory text, explanations, or markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    const detailedMetrics: Metric[] = Object.keys(metricTransformers)
      .filter(key => result[key])
      .map(key => metricTransformers[key](result[key]));

    return {
        economicImpact: result.economicImpact,
        socialImpact: result.socialImpact,
        environmentalImpact: result.environmentalImpact,
        confidence: result.confidence,
        summary: result.summary,
        detailedMetrics,
    };
  } catch (error) {
    console.error("Error calling Gemini AI:", error);
    throw new Error("Failed to simulate policy impact. The AI model may be temporarily unavailable. Please try again later.");
  }
};