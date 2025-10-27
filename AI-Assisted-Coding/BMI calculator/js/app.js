// Main App Module
document.addEventListener('DOMContentLoaded', function() {
    const bmiForm = document.getElementById('bmiForm');
    const resultsSection = document.getElementById('resultsSection');
    const bmiValueElement = document.getElementById('bmiValue');
    const bmiCategoryElement = document.getElementById('bmiCategory');
    const categoryDescriptionElement = document.getElementById('categoryDescription');

    // Initialize chart when page loads
    BMIChart.initChart();

    // Handle form submission
    bmiForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);

        // Validate inputs
        const validationErrors = BMICalculator.validateInputs(age, gender, height, weight);

        if (validationErrors.length > 0) {
            alert('Please correct the following errors:\n' + validationErrors.join('\n'));
            return;
        }

        // Calculate BMI
        const bmi = BMICalculator.calculateBMI(weight, height);
        const categoryInfo = BMICalculator.getBMICategory(bmi);

        // Display results
        bmiValueElement.textContent = bmi.toFixed(1);
        bmiCategoryElement.textContent = categoryInfo.category;
        bmiCategoryElement.style.color = categoryInfo.color;
        categoryDescriptionElement.textContent = categoryInfo.description;

        // Highlight category in chart
        BMIChart.highlightCategory(bmi);

        // Show results section
        resultsSection.style.display = 'block';

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Add input validation feedback
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.checkValidity()) {
                this.style.borderColor = '#10b981'; // green
            } else {
                this.style.borderColor = '#ef4444'; // red
            }
        });
    });
});