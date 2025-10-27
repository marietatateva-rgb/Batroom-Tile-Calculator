// BMI Calculator Module
const BMICalculator = {
    // Calculate BMI
    calculateBMI: function(weight, height) {
        // Convert height from cm to meters
        const heightInMeters = height / 100;
        return weight / (heightInMeters * heightInMeters);
    },

    // Get BMI category and description
    getBMICategory: function(bmi) {
        if (bmi < 18.5) {
            return {
                category: 'Underweight',
                description: 'Below healthy weight range',
                color: '#3b82f6' // blue
            };
        } else if (bmi >= 18.5 && bmi < 25) {
            return {
                category: 'Normal',
                description: 'Healthy weight range',
                color: '#10b981' // green
            };
        } else if (bmi >= 25 && bmi < 30) {
            return {
                category: 'Overweight',
                description: 'Above healthy weight range',
                color: '#f59e0b' // amber
            };
        } else {
            return {
                category: 'Obese',
                description: 'Significantly above healthy weight',
                color: '#ef4444' // red
            };
        }
    },

    // Validate inputs
    validateInputs: function(age, gender, height, weight) {
        const errors = [];

        if (!age || age < 1 || age > 120) {
            errors.push('Please enter a valid age (1-120)');
        }

        if (!gender) {
            errors.push('Please select a gender');
        }

        if (!height || height < 50 || height > 250) {
            errors.push('Please enter a valid height (50-250 cm)');
        }

        if (!weight || weight < 1 || weight > 300) {
            errors.push('Please enter a valid weight (1-300 kg)');
        }

        return errors;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BMICalculator;
}