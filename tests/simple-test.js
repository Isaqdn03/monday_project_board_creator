// Mock API class for testing
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
        
        element.click = () => {
            const event = new Event('click', { bubbles: true });
            element.dispatchEvent(event);
        };
        
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
}

// Performance monitoring class for tests
class PerformanceMonitor {
    constructor() {
        this.measurements = [];
        this.startTimes = new Map();
        this.metrics = {};
    }

    start(label) {
        this.startTimes.set(label, performance.now());
    }

    end(label) {
        const startTime = this.startTimes.get(label);
        if (!startTime) return 0;
        
        const duration = performance.now() - startTime;
        this.measurements.push({
            label,
            duration,
            timestamp: new Date().toISOString()
        });
        
        this.startTimes.delete(label);
        return duration;
    }

    getMeasurements() {
        return [...this.measurements];
    }

    recordMetric(type, value) {
        if (!this.metrics[type]) {
            this.metrics[type] = [];
        }
        this.metrics[type].push({
            value: value,
            timestamp: Date.now()
        });
    }

    getAverageMetric(type) {
        const metric = this.metrics[type];
        if (!metric || metric.length === 0) return 0;
        
        const sum = metric.reduce((acc, item) => acc + item.value, 0);
        return sum / metric.length;
    }
}

// Simple test to verify the framework works
function initializeSimpleTests() {
    if (typeof testFramework === 'undefined') {
        console.error('testFramework not available');
        return;
    }

    // Basic test to verify framework works
    testFramework.describe('Basic Framework Test', () => {
        testFramework.it('should have testFramework available', () => {
            testFramework.expect(testFramework).toBeDefined();
        });

        testFramework.it('should be able to run basic assertions', () => {
            testFramework.expect(1 + 1).toBe(2);
            testFramework.expect('hello').toContain('ell');
            testFramework.expect([1, 2, 3]).toHaveLength(3);
        });

        testFramework.it('should handle boolean assertions', () => {
            testFramework.expect(true).toBeTruthy();
            testFramework.expect(false).toBeFalsy();
            testFramework.expect(null).toBeNull();
        });
    });

    // Test the renovation data structure
    testFramework.describe('Renovation Data Structure', () => {
        testFramework.it('should have renovation areas defined', () => {
            // Mock renovation data for testing
            const mockRenovationAreas = {
                'Kitchen': ['Cabinet replacement', 'Countertop installation'],
                'Bathroom': ['Tile installation', 'Fixture replacement'],
                'Living Room': ['Flooring replacement', 'Lighting updates'],
                'Bedroom': ['Flooring', 'Closet organization']
            };

            testFramework.expect(Object.keys(mockRenovationAreas).length).toBe(4);
            testFramework.expect(mockRenovationAreas['Kitchen']).toContain('Cabinet replacement');
            testFramework.expect(mockRenovationAreas['Bathroom']).toContain('Tile installation');
        });

        testFramework.it('should validate project names', () => {
            const validateProjectName = (name) => {
                return name && name.length >= 3 && name.length <= 50;
            };

            testFramework.expect(validateProjectName('Test Project')).toBeTruthy();
            testFramework.expect(validateProjectName('AB')).toBeFalsy();
            testFramework.expect(validateProjectName('')).toBeFalsy();
        });

        testFramework.it('should validate workspace IDs', () => {
            const validateWorkspaceId = (id) => {
                return id && /^\d{8,12}$/.test(id);
            };

            testFramework.expect(validateWorkspaceId('123456789')).toBeTruthy();
            testFramework.expect(validateWorkspaceId('123')).toBeFalsy();
            testFramework.expect(validateWorkspaceId('abc123')).toBeFalsy();
        });
    });

    // Test mock API functionality
    testFramework.describe('Mock API Testing', () => {
        testFramework.it('should create mock API instance', () => {
            const mockAPI = new MockAPI();
            testFramework.expect(mockAPI).toBeDefined();
            testFramework.expect(typeof mockAPI.makeRequest).toBe('function');
        });

        testFramework.it('should handle mock API responses', async () => {
            const mockAPI = new MockAPI();
            const testQuery = 'query { test { id } }';
            
            mockAPI.setResponse(testQuery + '-{}', {
                data: { test: { id: '123' } }
            });

            const result = await mockAPI.makeRequest(testQuery);
            testFramework.expect(result.test.id).toBe('123');
        });
    });

    // Test UI utility functions
    testFramework.describe('UI Testing Utilities', () => {
        testFramework.it('should create DOM elements', () => {
            const element = DOMUtils.createElement('div', { id: 'test' }, 'Hello');
            testFramework.expect(element.tagName).toBe('DIV');
            testFramework.expect(element.id).toBe('test');
            testFramework.expect(element.textContent).toBe('Hello');
        });

        testFramework.it('should simulate user interactions', () => {
            const button = DOMUtils.createMockElement('button', 'test-button');
            let clicked = false;
            
            button.addEventListener('click', () => {
                clicked = true;
            });

            DOMUtils.simulateClick(button);
            testFramework.expect(clicked).toBeTruthy();
        });
    });

    // Test performance monitoring
    testFramework.describe('Performance Monitoring', () => {
        testFramework.it('should track execution time', () => {
            const monitor = new PerformanceMonitor();
            
            monitor.start('test-operation');
            // Simulate some work
            for (let i = 0; i < 1000; i++) {
                Math.random();
            }
            const duration = monitor.end('test-operation');
            
            testFramework.expect(duration).toBeGreaterThan(0);
            testFramework.expect(monitor.getMeasurements().length).toBe(1);
        });

        testFramework.it('should calculate average durations', () => {
            const monitor = new PerformanceMonitor();
            
            // Add some measurements
            monitor.recordMetric('testMetric', 100);
            monitor.recordMetric('testMetric', 200);
            monitor.recordMetric('testMetric', 300);
            
            const average = monitor.getAverageMetric('testMetric');
            testFramework.expect(average).toBe(200);
        });
    });

    console.log('Simple tests initialized successfully!');
}

// Make classes available globally
window.MockAPI = MockAPI;
window.DOMUtils = DOMUtils;
window.PerformanceMonitor = PerformanceMonitor;

// Initialize tests when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSimpleTests);
} else {
    initializeSimpleTests();
} 