// BMI Chart Module
const BMIChart = {
    chart: null,

    // Initialize chart
    initChart: function() {
        const ctx = document.getElementById('bmiChart').getContext('2d');

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
                datasets: [{
                    label: 'BMI Range',
                    data: [18.5, 24.9, 29.9, 40], // Representative values for visualization, increased for bigger chart
                    backgroundColor: [
                        '#3b82f6', // blue
                        '#10b981', // green
                        '#f59e0b', // amber
                        '#ef4444'  // red
                    ],
                    borderColor: [
                        '#2563eb',
                        '#059669',
                        '#d97706',
                        '#dc2626'
                    ],
                    borderWidth: 2,
                    barThickness: 80, // Adjusted bar width
                    maxBarThickness: 100
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const ranges = ['< 18.5', '18.5 - 24.9', '25 - 29.9', '≥ 30'];
                                return `BMI Range: ${ranges[context.dataIndex]}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 45, // More reasonable scale for BMI values
                        title: {
                            display: true,
                            text: 'BMI Value',
                            font: {
                                size: 18 // Adjusted font size
                            },
                            padding: {
                                top: 10,
                                bottom: 10
                            }
                        },
                        ticks: {
                            font: {
                                size: 16 // Adjusted font size
                            },
                            stepSize: 5, // Show ticks every 5 units
                            callback: function(value) {
                                return value;
                            }
                        }
                    },
                        x: {
                        title: {
                            display: true,
                            text: 'BMI Categories',
                            font: {
                                size: 18 // Adjusted font size
                            },
                            padding: {
                                top: 10,
                                bottom: 10
                            }
                        },
                        ticks: {
                            font: {
                                size: 16 // Adjusted font size
                            }
                        }
                    }
                }
            }
        });
    },

    // Update chart to highlight user's category
    highlightCategory: function(userBMI) {
        if (!this.chart) return;

        let highlightIndex = -1;

        if (userBMI < 18.5) {
            highlightIndex = 0;
        } else if (userBMI >= 18.5 && userBMI < 25) {
            highlightIndex = 1;
        } else if (userBMI >= 25 && userBMI < 30) {
            highlightIndex = 2;
        } else {
            highlightIndex = 3;
        }

        // Reset all bars
        this.chart.data.datasets[0].backgroundColor = [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444'
        ];

        // Highlight the user's category
        if (highlightIndex >= 0) {
            this.chart.data.datasets[0].backgroundColor[highlightIndex] += '80'; // Add transparency
        }

        this.chart.update();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BMIChart;
}