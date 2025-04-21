# Name Prediction System

A machine learning-based web application for demographic analysis and name prediction. This system uses advanced ML techniques to analyze and predict demographic patterns based on names.

## Features

- **Name Prediction**: Input names and get demographic predictions
- **Model Training**: Train and fine-tune the prediction model
- **Dataset Analysis**: Analyze and visualize demographic patterns
- **Performance Metrics**: Track and monitor model performance
- **Interactive Dashboard**: User-friendly interface with real-time updates

## Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Data Visualization**: Chart.js, D3.js, Recharts
- **State Management**: React Query
- **Database**: Supabase
- **Build Tool**: Vite

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd name-prediction-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/         # React components
│   ├── Dashboard.tsx
│   ├── PredictionForm.tsx
│   ├── ModelTraining.tsx
│   ├── DatasetAnalysis.tsx
│   └── PerformanceMetrics.tsx
├── App.tsx            # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite
- Powered by Supabase
- Styled with Tailwind CSS
- Data visualization with Chart.js and D3.js 