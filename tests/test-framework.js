// ============================================================================
// RENOVATION PROJECT MANAGER - TEST FRAMEWORK
// ============================================================================
// Comprehensive testing framework for production readiness validation
// ============================================================================

class TestFramework {
    constructor() {
        this.tests = [];
        this.currentSuite = null;
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            pending: 0,
            startTime: null,
            endTime: null
        };
        this.logger = new TestLogger();
        this.isRunning = false;
    }

    // Test organization methods
    describe(suiteName, callback) {
        const suite = {
            name: suiteName,
            tests: [],
            beforeEach: null,
            afterEach: null,
            beforeAll: null,
            afterAll: null
        };

        this.currentSuite = suite;
        callback();
        this.tests.push(suite);
        this.currentSuite = null;
    }

    it(testName, callback) {
        if (!this.currentSuite) {
            throw new Error('Tests must be defined within a describe block');
        }

        const test = {
            name: testName,
            callback,
            status: 'pending',
            error: null,
            startTime: null,
            endTime: null,
            duration: 0
        };

        this.currentSuite.tests.push(test);
    }

    // Setup and teardown methods
    beforeEach(callback) {
        if (this.currentSuite) {
            this.currentSuite.beforeEach = callback;
        }
    }

    afterEach(callback) {
        if (this.currentSuite) {
            this.currentSuite.afterEach = callback;
        }
    }

    beforeAll(callback) {
        if (this.currentSuite) {
            this.currentSuite.beforeAll = callback;
        }
    }

    afterAll(callback) {
        if (this.currentSuite) {
            this.currentSuite.afterAll = callback;
        }
    }

    // Assertion methods
    expect(actual) {
        return new Assertion(actual, this.logger);
    }

    // Test execution methods
    async runAllTests() {
        if (this.isRunning) {
            this.logger.warn('Tests are already running');
            return;
        }

        this.isRunning = true;
        this.results.startTime = Date.now();
        this.results.total = this.getTotalTestCount();
        this.results.passed = 0;
        this.results.failed = 0;
        this.results.pending = 0;

        this.logger.info(`Starting test execution - ${this.results.total} tests`);
        this.updateProgress(0);

        try {
            let testCount = 0;
            
            for (const suite of this.tests) {
                await this.runTestSuite(suite);
                
                // Update progress
                testCount += suite.tests.length;
                const progress = Math.round((testCount / this.results.total) * 100);
                this.updateProgress(progress);
            }

            this.results.endTime = Date.now();
            this.generateReport();
            
        } catch (error) {
            this.logger.error('Test execution failed:', error);
        } finally {
            this.isRunning = false;
        }
    }

    async runTestSuite(suite) {
        this.logger.info(`Running test suite: ${suite.name}`);
        this.createSuiteUI(suite);

        try {
            // Run beforeAll
            if (suite.beforeAll) {
                await suite.beforeAll();
            }

            // Run individual tests
            for (const test of suite.tests) {
                await this.runSingleTest(suite, test);
            }

            // Run afterAll
            if (suite.afterAll) {
                await suite.afterAll();
            }

        } catch (error) {
            this.logger.error(`Suite ${suite.name} failed:`, error);
        }
    }

    async runSingleTest(suite, test) {
        test.startTime = Date.now();
        test.status = 'running';
        
        this.updateTestUI(suite.name, test);
        this.logger.info(`Running test: ${test.name}`);

        try {
            // Run beforeEach
            if (suite.beforeEach) {
                await suite.beforeEach();
            }

            // Run the test
            await test.callback();

            // Test passed
            test.status = 'passed';
            test.endTime = Date.now();
            test.duration = test.endTime - test.startTime;
            this.results.passed++;
            
            this.logger.success(`✓ ${test.name} (${test.duration}ms)`);

            // Run afterEach
            if (suite.afterEach) {
                await suite.afterEach();
            }

        } catch (error) {
            // Test failed
            test.status = 'failed';
            test.error = error;
            test.endTime = Date.now();
            test.duration = test.endTime - test.startTime;
            this.results.failed++;
            
            this.logger.error(`✗ ${test.name} (${test.duration}ms)`, error);
        }

        this.updateTestUI(suite.name, test);
    }

    // Test filtering methods
    async runTestsByCategory(category) {
        const filteredTests = this.tests.filter(suite => 
            suite.name.toLowerCase().includes(category.toLowerCase())
        );

        if (filteredTests.length === 0) {
            this.logger.warn(`No tests found for category: ${category}`);
            return;
        }

        this.logger.info(`Running ${category} tests`);
        
        const originalTests = this.tests;
        this.tests = filteredTests;
        
        await this.runAllTests();
        
        this.tests = originalTests;
    }

    // Utility methods
    getTotalTestCount() {
        return this.tests.reduce((count, suite) => count + suite.tests.length, 0);
    }

    updateProgress(percentage) {
        const progressBar = document.getElementById('test-progress');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.textContent = `${percentage}%`;
        }
    }

    createSuiteUI(suite) {
        const resultsContainer = document.getElementById('test-results');
        
        const suiteElement = document.createElement('div');
        suiteElement.className = 'test-category';
        suiteElement.id = `suite-${suite.name.replace(/\s+/g, '-').toLowerCase()}`;
        
        const headerElement = document.createElement('div');
        headerElement.className = 'test-category-header';
        headerElement.innerHTML = `
            <span>${suite.name}</span>
            <span class="collapse-icon">▼</span>
        `;
        
        headerElement.addEventListener('click', () => {
            suiteElement.classList.toggle('expanded');
        });
        
        const bodyElement = document.createElement('div');
        bodyElement.className = 'test-category-body';
        
        suite.tests.forEach(test => {
            const testElement = document.createElement('div');
            testElement.className = 'test-case';
            testElement.id = `test-${suite.name}-${test.name}`.replace(/\s+/g, '-').toLowerCase();
            testElement.innerHTML = `
                <div>
                    <div>${test.name}</div>
                    <div class="test-description">Testing ${test.name.toLowerCase()}</div>
                </div>
                <div class="test-status pending">Pending</div>
            `;
            bodyElement.appendChild(testElement);
        });
        
        suiteElement.appendChild(headerElement);
        suiteElement.appendChild(bodyElement);
        resultsContainer.appendChild(suiteElement);
    }

    updateTestUI(suiteName, test) {
        const testId = `test-${suiteName}-${test.name}`.replace(/\s+/g, '-').toLowerCase();
        const testElement = document.getElementById(testId);
        
        if (testElement) {
            const statusElement = testElement.querySelector('.test-status');
            statusElement.className = `test-status ${test.status}`;
            statusElement.textContent = test.status.charAt(0).toUpperCase() + test.status.slice(1);
            
            if (test.status === 'failed' && test.error) {
                const errorElement = document.createElement('div');
                errorElement.className = 'test-error-details';
                errorElement.textContent = test.error.message || test.error.toString();
                testElement.appendChild(errorElement);
            }
        }
    }

    generateReport() {
        const duration = this.results.endTime - this.results.startTime;
        
        // Update summary cards
        document.getElementById('total-tests').textContent = this.results.total;
        document.getElementById('passed-tests').textContent = this.results.passed;
        document.getElementById('failed-tests').textContent = this.results.failed;
        document.getElementById('execution-time').textContent = `${(duration / 1000).toFixed(2)}s`;
        
        // Generate detailed report
        const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
        
        this.logger.info(`Test execution completed in ${duration}ms`);
        this.logger.info(`Results: ${this.results.passed}/${this.results.total} passed (${passRate}%)`);
        
        if (this.results.failed > 0) {
            this.logger.error(`${this.results.failed} tests failed`);
        } else {
            this.logger.success('All tests passed!');
        }
    }

    clearResults() {
        document.getElementById('test-results').innerHTML = '';
        document.getElementById('test-log').innerHTML = '<div class="test-log-entry info">Test results cleared. Ready to run tests.</div>';
        
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            pending: 0,
            startTime: null,
            endTime: null
        };
        
        this.updateProgress(0);
        document.getElementById('total-tests').textContent = '0';
        document.getElementById('passed-tests').textContent = '0';
        document.getElementById('failed-tests').textContent = '0';
        document.getElementById('execution-time').textContent = '0s';
    }
}

// Assertion class for test expectations
class Assertion {
    constructor(actual, logger) {
        this.actual = actual;
        this.logger = logger;
    }

    toBe(expected) {
        if (this.actual !== expected) {
            throw new Error(`Expected ${this.actual} to be ${expected}`);
        }
        return this;
    }

    toEqual(expected) {
        if (JSON.stringify(this.actual) !== JSON.stringify(expected)) {
            throw new Error(`Expected ${JSON.stringify(this.actual)} to equal ${JSON.stringify(expected)}`);
        }
        return this;
    }

    toBeNull() {
        if (this.actual !== null) {
            throw new Error(`Expected ${this.actual} to be null`);
        }
        return this;
    }

    toBeDefined() {
        if (this.actual === undefined) {
            throw new Error(`Expected value to be defined`);
        }
        return this;
    }

    toBeUndefined() {
        if (this.actual !== undefined) {
            throw new Error(`Expected ${this.actual} to be undefined`);
        }
        return this;
    }

    toBeTruthy() {
        if (!this.actual) {
            throw new Error(`Expected ${this.actual} to be truthy`);
        }
        return this;
    }

    toBeFalsy() {
        if (this.actual) {
            throw new Error(`Expected ${this.actual} to be falsy`);
        }
        return this;
    }

    toContain(expected) {
        if (typeof this.actual === 'string') {
            if (!this.actual.includes(expected)) {
                throw new Error(`Expected "${this.actual}" to contain "${expected}"`);
            }
        } else if (Array.isArray(this.actual)) {
            if (!this.actual.includes(expected)) {
                throw new Error(`Expected array to contain ${expected}`);
            }
        } else {
            throw new Error(`toContain() can only be used with strings or arrays`);
        }
        return this;
    }

    toHaveLength(expected) {
        if (!this.actual || typeof this.actual.length !== 'number') {
            throw new Error(`Expected value to have a length property`);
        }
        if (this.actual.length !== expected) {
            throw new Error(`Expected length ${this.actual.length} to be ${expected}`);
        }
        return this;
    }

    toBeGreaterThan(expected) {
        if (this.actual <= expected) {
            throw new Error(`Expected ${this.actual} to be greater than ${expected}`);
        }
        return this;
    }

    toBeLessThan(expected) {
        if (this.actual >= expected) {
            throw new Error(`Expected ${this.actual} to be less than ${expected}`);
        }
        return this;
    }

    toThrow(expectedError) {
        if (typeof this.actual !== 'function') {
            throw new Error(`Expected a function to test for thrown errors`);
        }

        let threwError = false;
        let actualError = null;

        try {
            this.actual();
        } catch (error) {
            threwError = true;
            actualError = error;
        }

        if (!threwError) {
            throw new Error(`Expected function to throw an error`);
        }

        if (expectedError && actualError.message !== expectedError) {
            throw new Error(`Expected error message "${actualError.message}" to be "${expectedError}"`);
        }

        return this;
    }

    async toResolve() {
        if (!this.actual || typeof this.actual.then !== 'function') {
            throw new Error(`Expected a Promise to test for resolution`);
        }

        try {
            await this.actual;
        } catch (error) {
            throw new Error(`Expected promise to resolve but it rejected with: ${error.message}`);
        }

        return this;
    }

    async toReject() {
        if (!this.actual || typeof this.actual.then !== 'function') {
            throw new Error(`Expected a Promise to test for rejection`);
        }

        try {
            await this.actual;
            throw new Error(`Expected promise to reject but it resolved`);
        } catch (error) {
            // This is expected
        }

        return this;
    }
}

// Test Logger class for consistent logging
class TestLogger {
    constructor() {
        this.logContainer = null;
    }

    init() {
        this.logContainer = document.getElementById('test-log');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `test-log-entry ${type}`;
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        if (this.logContainer) {
            this.logContainer.appendChild(logEntry);
            this.logContainer.scrollTop = this.logContainer.scrollHeight;
        }
        
        // Also log to console
        console.log(`[TEST] ${message}`);
    }

    info(message) {
        this.log(message, 'info');
    }

    success(message) {
        this.log(message, 'success');
    }

    error(message, error = null) {
        const fullMessage = error ? `${message}: ${error.message || error}` : message;
        this.log(fullMessage, 'error');
    }

    warn(message) {
        this.log(message, 'warning');
    }
}

// Mock objects for testing
class MockAPI {
    constructor() {
        this.responses = new Map();
        this.callLog = [];
    }

    setResponse(endpoint, response) {
        this.responses.set(endpoint, response);
    }

    async makeRequest(query, variables = {}) {
        const key = `${query}-${JSON.stringify(variables)}`;
        this.callLog.push({ query, variables, timestamp: Date.now() });
        
        const response = this.responses.get(key);
        if (response) {
            if (response.shouldFail) {
                throw new Error(response.error || 'Mock API error');
            }
            return response.data;
        }
        
        // Default response
        return { data: { mock: true } };
    }

    getCallLog() {
        return this.callLog;
    }

    clearCallLog() {
        this.callLog = [];
    }
}

// DOM utilities for testing
class DOMUtils {
    static createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    static createMockElement(tag, id, attributes = {}) {
        const element = this.createElement(tag, { id, ...attributes });
        
        // Add common methods
        element.click = () => {
            const event = new Event('click', { bubbles: true });
            element.dispatchEvent(event);
        };
        
        // Enhanced attribute handling for better mock DOM simulation
        // Ensure attributes are accessible as both properties and via getAttribute
        Object.entries(attributes).forEach(([key, value]) => {
            // Set as property for direct access (e.g., element.maxlength)
            if (key === 'maxlength') {
                element.maxlength = value;
            } else if (key === 'placeholder') {
                element.placeholder = value;
            } else if (key === 'type') {
                element.type = value;
            } else if (key === 'pattern') {
                element.pattern = value;
            } else if (key === 'disabled') {
                element.disabled = value === 'true' || value === true;
            } else if (key === 'multiple') {
                element.multiple = value === 'true' || value === true;
            }
        });
        
        // Special handling for select elements
        if (tag.toLowerCase() === 'select') {
            // Initialize empty mock options array (using custom property to avoid conflicts)
            element._mockOptions = [];
            
            // Add helper method to simulate setting options (real HTMLSelectElement.options is read-only)
            element.setMockOptions = function(optionArray) {
                if (Array.isArray(optionArray)) {
                    this._mockOptions = [...optionArray];
                }
            };
            
            // Add helper method to get mock options that behaves like the real options property
            element.getMockOptions = function() {
                return this._mockOptions;
            };
            
            // For compatibility with existing test logic, add a custom options property that doesn't conflict
            Object.defineProperty(element, 'mockOptions', {
                get() {
                    return this._mockOptions;
                },
                set(value) {
                    if (Array.isArray(value)) {
                        this._mockOptions = [...value];
                    }
                }
            });
        }
        
        return element;
    }

    static simulateClick(element) {
        if (element && typeof element.click === 'function') {
            element.click();
        }
    }

    static simulateInput(element, value) {
        if (element) {
            element.value = value;
            const event = new Event('input', { bubbles: true });
            element.dispatchEvent(event);
        }
    }

    static simulateChange(element, value) {
        if (element) {
            element.value = value;
            const event = new Event('change', { bubbles: true });
            element.dispatchEvent(event);
        }
    }

    static waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(checkElement, 100);
                }
            };
            
            checkElement();
        });
    }
}

// Global test framework instance
const testFramework = new TestFramework();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestFramework, Assertion, TestLogger, MockAPI, DOMUtils };
} else {
    window.TestFramework = TestFramework;
    window.Assertion = Assertion;
    window.TestLogger = TestLogger;
    window.MockAPI = MockAPI;
    window.DOMUtils = DOMUtils;
    window.testFramework = testFramework;
} 