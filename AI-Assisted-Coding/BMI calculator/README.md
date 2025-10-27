# BMI Calculator

A responsive single-page web application for calculating Body Mass Index (BMI) with visual chart representation.

## Features

- **BMI Calculation**: Calculates BMI based on height and weight
- **Category Classification**: Displays BMI category (Underweight, Normal, Overweight, Obese)
- **Visual Chart**: Interactive Chart.js chart showing BMI ranges with user's category highlighted
- **Responsive Design**: Works on both desktop and mobile devices
- **Input Validation**: Client-side validation for all inputs
- **Modular Architecture**: Separated concerns for better maintainability

## Technologies Used

- HTML5
- CSS3 (with responsive design)
- JavaScript (ES6+)
- Chart.js for data visualization

## File Structure

```
BMI-calculator/
├── index.html          # Main HTML page
├── css/
│   └── styles.css      # Styles and responsive design
└── js/
    ├── app.js          # Main application logic and event handling
    ├── calculator.js   # BMI calculation and categorization logic
    └── chart.js        # Chart initialization and updates
```

## Usage

1. Open `index.html` in a web browser
2. Enter your age, gender, height (in cm), and weight (in kg)
3. Click "Calculate BMI"
4. View your BMI value, category, and the highlighted chart

## BMI Categories

- **Underweight**: BMI < 18.5
- **Normal**: BMI 18.5 - 24.9
- **Overweight**: BMI 25 - 29.9
- **Obese**: BMI ≥ 30

## Development

The application uses a modular design with separate JavaScript modules for:
- **BMICalculator**: Handles BMI calculations and category determination
- **BMIChart**: Manages the Chart.js visualization
- **App**: Coordinates user interactions and updates the UI

## Browser Support

Works in all modern browsers that support ES6 features and Canvas API.

## Disclaimer

BMI is a screening tool and not a diagnostic tool. This calculator is for informational purposes only. Please consult a healthcare professional for personalized medical advice.