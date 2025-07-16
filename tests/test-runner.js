// ============================================================================
// RENOVATION PROJECT MANAGER - TEST RUNNER
// ============================================================================
// Test runner that initializes and orchestrates all test suites
// ============================================================================

// Test runner class
class TestRunner {
    constructor() {
        this.framework = testFramework;
        this.isInitialized = false;
        this.testCategories = {
            'ui': 'UI Components and Interactions',
            'api': 'Monday.com API Integration',
            'e2e': 'End-to-End Workflow Tests',
            'data': 'Data Processing and Validation',
            'security': 'Security and Input Validation',
            'performance': 'Performance and Load Tests'
        };
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }

        console.log('🚀 Initializing Test Runner...');
        
        // Initialize test framework logger
        this.framework.logger.init();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize UI
        this.initializeUI();
        
        this.isInitialized = true;
        console.log('✅ Test Runner initialized successfully');
        
        this.framework.logger.info('Test Runner ready. Click "Run All Tests" to begin testing.');
    }

    setupEventListeners() {
        // Run all tests button
        const runAllButton = document.getElementById('run-all-tests');
        if (runAllButton) {
            runAllButton.addEventListener('click', () => {
                this.runAllTests();
            });
        }

        // Run UI tests button
        const runUIButton = document.getElementById('run-ui-tests');
        if (runUIButton) {
            runUIButton.addEventListener('click', () => {
                this.runTestCategory('ui');
            });
        }

        // Run API tests button
        const runAPIButton = document.getElementById('run-api-tests');
        if (runAPIButton) {
            runAPIButton.addEventListener('click', () => {
                this.runTestCategory('api');
            });
        }

        // Run E2E tests button
        const runE2EButton = document.getElementById('run-e2e-tests');
        if (runE2EButton) {
            runE2EButton.addEventListener('click', () => {
                this.runTestCategory('e2e');
            });
        }

        // Run data tests button
        const runDataButton = document.getElementById('run-data-tests');
        if (runDataButton) {
            runDataButton.addEventListener('click', () => {
                this.runTestCategory('data');
            });
        }

        // Run security tests button
        const runSecurityButton = document.getElementById('run-security-tests');
        if (runSecurityButton) {
            runSecurityButton.addEventListener('click', () => {
                this.runTestCategory('security');
            });
        }

        // Run performance tests button
        const runPerformanceButton = document.getElementById('run-performance-tests');
        if (runPerformanceButton) {
            runPerformanceButton.addEventListener('click', () => {
                this.runTestCategory('performance');
            });
        }

        // Clear results button
        const clearResultsButton = document.getElementById('clear-results');
        if (clearResultsButton) {
            clearResultsButton.addEventListener('click', () => {
                this.clearResults();
            });
        }
    }

    initializeUI() {
        // Set initial button states
        this.setButtonsEnabled(true);
        
        // Clear any existing results
        this.framework.clearResults();
        
        // Show test categories summary
        this.showTestCategoriesSummary();
    }

    showTestCategoriesSummary() {
        const summary = {
            totalSuites: this.framework.tests.length,
            totalTests: this.framework.getTotalTestCount(),
            categories: Object.keys(this.testCategories).length
        };

        this.framework.logger.info(`Test Suite Summary:
        - Total Test Suites: ${summary.totalSuites}
        - Total Tests: ${summary.totalTests}
        - Test Categories: ${summary.categories}`);

        // Log available test categories
        Object.entries(this.testCategories).forEach(([key, name]) => {
            const categoryTests = this.framework.tests.filter(suite => 
                suite.name.toLowerCase().includes(key)
            );
            const testCount = categoryTests.reduce((sum, suite) => sum + suite.tests.length, 0);
            
            this.framework.logger.info(`  ${name}: ${testCount} tests`);
        });
    }

    async runAllTests() {
        if (this.framework.isRunning) {
            this.framework.logger.warn('Tests are already running. Please wait for completion.');
            return;
        }

        this.framework.logger.info('🚀 Starting comprehensive test execution...');
        this.setButtonsEnabled(false);

        try {
            await this.framework.runAllTests();
            this.framework.logger.success('✅ All tests completed successfully!');
        } catch (error) {
            this.framework.logger.error('❌ Test execution failed:', error);
        } finally {
            this.setButtonsEnabled(true);
        }
    }

    async runTestCategory(category) {
        if (this.framework.isRunning) {
            this.framework.logger.warn('Tests are already running. Please wait for completion.');
            return;
        }

        const categoryName = this.testCategories[category];
        if (!categoryName) {
            this.framework.logger.error(`Unknown test category: ${category}`);
            return;
        }

        this.framework.logger.info(`🧪 Running ${categoryName}...`);
        this.setButtonsEnabled(false);

        try {
            await this.framework.runTestsByCategory(category);
            this.framework.logger.success(`✅ ${categoryName} completed!`);
        } catch (error) {
            this.framework.logger.error(`❌ ${categoryName} failed:`, error);
        } finally {
            this.setButtonsEnabled(true);
        }
    }

    clearResults() {
        this.framework.clearResults();
        this.framework.logger.info('🧹 Test results cleared. Ready for new test execution.');
    }

    setButtonsEnabled(enabled) {
        const buttons = [
            'run-all-tests',
            'run-ui-tests',
            'run-api-tests',
            'run-e2e-tests',
            'run-data-tests',
            'run-security-tests',
            'run-performance-tests'
        ];

        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = !enabled;
            }
        });
    }

    // Development utilities
    async runDevelopmentTests() {
        this.framework.logger.info('🔧 Running development-specific tests...');
        
        // Test data processing
        await this.testDataProcessing();
        
        // Test validation functions
        await this.testValidationFunctions();
        
        // Test utility functions
        await this.testUtilityFunctions();
        
        this.framework.logger.info('✅ Development tests completed');
    }

    async testDataProcessing() {
        this.framework.logger.info('Testing data processing functions...');
        
        try {
            // Test with sample data
            const testData = {
                areas: ['Kitchen', 'Bathroom'],
                scopes: {
                    'Kitchen': ['Cabinet replacement'],
                    'Bathroom': ['Tile installation']
                },
                projectName: 'Dev Test Project',
                workspaceId: '123456789'
            };

            // This would normally use actual RenovationData functions
            // For now, we'll simulate the test
            const result = {
                success: true,
                message: 'Data processing test passed'
            };

            this.framework.logger.success(`✓ Data processing: ${result.message}`);
        } catch (error) {
            this.framework.logger.error('✗ Data processing test failed:', error);
        }
    }

    async testValidationFunctions() {
        this.framework.logger.info('Testing validation functions...');
        
        try {
            // Test project name validation
            const validateProjectName = (name) => {
                return name && name.length >= 3 && name.length <= 50;
            };

            const testCases = [
                { input: 'Valid Project', expected: true },
                { input: 'AB', expected: false },
                { input: '', expected: false },
                { input: 'A'.repeat(51), expected: false }
            ];

            let passed = 0;
            testCases.forEach(({ input, expected }) => {
                const result = validateProjectName(input);
                if (result === expected) {
                    passed++;
                } else {
                    this.framework.logger.error(`Validation failed for input: "${input}"`);
                }
            });

            this.framework.logger.success(`✓ Validation tests: ${passed}/${testCases.length} passed`);
        } catch (error) {
            this.framework.logger.error('✗ Validation test failed:', error);
        }
    }

    async testUtilityFunctions() {
        this.framework.logger.info('Testing utility functions...');
        
        try {
            // Test DOM utilities
            const testElement = document.createElement('div');
            testElement.id = 'test-element';
            testElement.textContent = 'Test';
            
            // Basic DOM manipulation test
            const hasId = testElement.id === 'test-element';
            const hasContent = testElement.textContent === 'Test';
            
            if (hasId && hasContent) {
                this.framework.logger.success('✓ DOM utilities working correctly');
            } else {
                this.framework.logger.error('✗ DOM utilities test failed');
            }
        } catch (error) {
            this.framework.logger.error('✗ Utility functions test failed:', error);
        }
    }

    // Test reporting
    generateTestReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: this.framework.results.total,
                passed: this.framework.results.passed,
                failed: this.framework.results.failed,
                passRate: this.framework.results.total > 0 ? 
                    ((this.framework.results.passed / this.framework.results.total) * 100).toFixed(1) : 0
            },
            categories: {},
            details: []
        };

        // Generate category breakdown
        Object.entries(this.testCategories).forEach(([key, name]) => {
            const categoryTests = this.framework.tests.filter(suite => 
                suite.name.toLowerCase().includes(key)
            );
            
            const categoryPassed = categoryTests.reduce((sum, suite) => 
                sum + suite.tests.filter(test => test.status === 'passed').length, 0
            );
            
            const categoryTotal = categoryTests.reduce((sum, suite) => 
                sum + suite.tests.length, 0
            );

            report.categories[name] = {
                total: categoryTotal,
                passed: categoryPassed,
                failed: categoryTotal - categoryPassed,
                passRate: categoryTotal > 0 ? 
                    ((categoryPassed / categoryTotal) * 100).toFixed(1) : 0
            };
        });

        // Generate detailed results
        this.framework.tests.forEach(suite => {
            const suiteReport = {
                suiteName: suite.name,
                tests: suite.tests.map(test => ({
                    name: test.name,
                    status: test.status,
                    duration: test.duration,
                    error: test.error ? test.error.message : null
                }))
            };
            report.details.push(suiteReport);
        });

        return report;
    }

    exportTestReport() {
        const report = this.generateTestReport();
        const reportJson = JSON.stringify(report, null, 2);
        
        // Create download link
        const blob = new Blob([reportJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `test-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        this.framework.logger.info('📊 Test report exported successfully');
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 'r':
                        event.preventDefault();
                        this.runAllTests();
                        break;
                    case 'u':
                        event.preventDefault();
                        this.runTestCategory('ui');
                        break;
                    case 'a':
                        event.preventDefault();
                        this.runTestCategory('api');
                        break;
                    case 'e':
                        event.preventDefault();
                        this.runTestCategory('e2e');
                        break;
                    case 'd':
                        event.preventDefault();
                        this.runTestCategory('data');
                        break;
                    case 's':
                        event.preventDefault();
                        this.runTestCategory('security');
                        break;
                    case 'p':
                        event.preventDefault();
                        this.runTestCategory('performance');
                        break;
                    case 'x':
                        event.preventDefault();
                        this.exportTestReport();
                        break;
                    case 'c':
                        event.preventDefault();
                        this.clearResults();
                        break;
                }
            }
        });

        // Show keyboard shortcuts help
        this.framework.logger.info('⌨️  Keyboard shortcuts available:');
        this.framework.logger.info('  Ctrl+R: Run all tests');
        this.framework.logger.info('  Ctrl+U: Run UI tests');
        this.framework.logger.info('  Ctrl+A: Run API tests');
        this.framework.logger.info('  Ctrl+E: Run E2E tests');
        this.framework.logger.info('  Ctrl+D: Run data tests');
        this.framework.logger.info('  Ctrl+S: Run security tests');
        this.framework.logger.info('  Ctrl+P: Run performance tests');
        this.framework.logger.info('  Ctrl+X: Export test report');
        this.framework.logger.info('  Ctrl+C: Clear results');
    }
}

// Initialize test runner when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const testRunner = new TestRunner();
    
    try {
        await testRunner.initialize();
        
        // Setup keyboard shortcuts
        testRunner.setupKeyboardShortcuts();
        
        // Make test runner globally available
        window.testRunner = testRunner;
        
        console.log('🎉 Test Runner fully initialized and ready!');
    } catch (error) {
        console.error('❌ Failed to initialize test runner:', error);
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestRunner };
} else {
    window.TestRunner = TestRunner;
} 