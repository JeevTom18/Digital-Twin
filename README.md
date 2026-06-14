# DigiTwin of Democracy – AI Policy Simulator for India

## Project Description

DigiTwin of Democracy is an AI-powered policy simulation platform designed for policymakers and citizens to explore the potential impacts of government policies on India's economy, society, and environment. The system combines Google Gemini AI, data visualization, and interactive interfaces to help users simulate policy scenarios, analyze outcomes, and make informed decisions.

The platform provides two distinct experiences:

**For Policymakers (Government Users)**: A comprehensive suite of tools to design custom policies, run simulations with fine-tuned parameters (budget allocation, target coverage, geographic scope), analyze historical trends, and understand how different stakeholder groups would be affected.

**For Public Users**: An accessible interface to explore predefined policy scenarios, visualize potential impacts through interactive charts, access transparent policy impact reports, and learn about policy-making processes.

Built with React, TypeScript, Vite, and Google Gemini AI APIs, DigiTwin of Democracy bridges the gap between complex policy analysis and accessible decision-making tools. The platform enables evidence-based policy formulation by providing AI-generated predictions and confidence metrics for proposed initiatives.

---

## Features

### Policymaker Dashboard
- **Custom Policy Simulator**: Create and configure policy scenarios with detailed parameters
- **Impact Analysis**: AI-generated predictions for economic, social, and environmental outcomes
- **Historical Analysis**: Compare policy impacts against historical economic and social data
- **Stakeholder Reports**: Understand how policies affect different population groups (farmers, urban workers, MSMEs, etc.)
- **Real-time Simulations**: Run multiple simulations and track their status
- **Data Visualization**: Interactive charts for metrics like GDP growth, employment, inflation, literacy, and healthcare access

### Public Portal
- **Policy Explorer**: Browse predefined policy scenarios across different domains
- **Impact Visualizations**: See projected outcomes for citizens
- **Reports Library**: Access transparent, easy-to-understand policy impact summaries
- **Learn Hub**: Educational resources about policy-making and economic indicators

### Core Technologies
- Google Gemini AI integration for simulation predictions
- Interactive Recharts visualizations
- Tailwind CSS responsive design
- TypeScript type safety
- Single-page application routing
- **New: Scenario Comparison Mode** - Compare multiple policy simulations side-by-side

---

## Technologies Used

### Frontend
- **React** 19.x - UI framework
- **TypeScript** 5.8.x - Type-safe development
- **Vite** 6.2.x - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Recharts** 2.12.x - Chart visualization library

### AI & Integration
- **@google/genai** 1.19.x - Google Gemini API client
- **Vite** - Development server and bundler

---

## Installation

```bash
git clone <repository-link>
cd digitwin-of-democracy
npm install
npm run dev
```

The application will start on `http://localhost:5173` by default.

---

## Project Structure

```
digitwin-of-democracy/
├── pages/                    # Main page components
│   ├── DashboardPage.tsx             # Policymaker dashboard
│   ├── PolicySimulatorPage.tsx       # Custom policy simulation
│   ├── ImpactAnalysisPage.tsx        # AI impact predictions
│   ├── HistoricalAnalysisPage.tsx    # Historical data comparison
│   ├── StakeholderReportsPage.tsx    # Affected groups analysis
│   └── public/                       # Public-facing pages
│       ├── PublicDashboardPage.tsx
│       ├── PolicyExplorerPage.tsx
│       ├── ReportsLibraryPage.tsx
│       └── LearnPage.tsx
├── components/               # Reusable UI components
│   ├── Login.tsx             # Role selection (Policymaker/Public)
│   ├── Sidebar.tsx           # Navigation menu
│   ├── charts/               # Chart components
│   ├── ui/                   # Basic UI components
│   └── icons.tsx             # SVG icons
├── services/                 # API and service integrations
│   └── aiService.ts          # Google Gemini AI integration
├── hooks/                    # Custom React hooks
├── utils/                    # Utility functions
├── types.ts                  # TypeScript type definitions
├── constants.ts              # App-wide constants
└── vite.config.ts            # Vite configuration
```

---

## User Roles & Authentication

The application uses a simple but effective role-based access system:

1. **Login Page**: Users select their role at startup
2. **Policymaker Access**: Full simulation capabilities, historical data, stakeholder analysis
3. **Public Access**: Predefined scenarios, educational content, transparent reports

---

## Simulation Parameters

### Policy Parameters
- **Budget Allocation**: In Crores (INR)
- **Target Coverage**: Percentage of population to benefit
- **Implementation Timeline**: e.g., "1 year", "3 years"
- **Geographic Scope**: Regional, State, or National

### Fine-Tuning Parameters
- **Economic Model**: Optimistic, Neutral, or Pessimistic projections
- **Social Adoption Rate**: Expected citizen participation percentage
- **Climate Impact**: Score on 0-100 scale
- **Market Volatility**: Economic stability factor
- **Black Swan Events**: Enable/disable unlikely but impactful scenarios

---

## Output Metrics

Each simulation produces:
- **Economic Impact**: Percentage change in GDP, employment, etc.
- **Social Impact**: Score on 0-10 scale
- **Environmental Impact**: Percentage change in key indicators
- **Confidence Level**: AI's prediction confidence percentage
- **Detailed Metrics**: Timelines and charts for individual indicators

---

## Environment Setup

1. Create a `.env.local` file in the project root
2. Add your Google AI API key (configured in `services/aiService.ts`)
3. Run `npm install` to install dependencies
4. Start with `npm run dev`

---

## Future Enhancements

- Multi-language support for broader accessibility
- Export simulations as PDF reports
- Integration with real economic datasets
- Advanced scenario comparison tools
- Mobile application support
- Collaborative policy design features
- Machine learning model refinement with historical accuracy data

---

## License

This project is developed for educational and government use.

---

## Conclusion

DigiTwin of Democracy demonstrates how artificial intelligence and modern web technologies can transform policy-making into a transparent, data-driven, and participatory process. By making complex economic modeling accessible to both experts and citizens, the platform supports more informed and effective governance for India.
