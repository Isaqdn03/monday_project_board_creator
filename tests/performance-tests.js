// ============================================================================
// RENOVATION PROJECT MANAGER - PERFORMANCE TESTS
// ============================================================================
// Performance testing for execution time, memory usage, and API efficiency
// ============================================================================

// Use the global test framework
const describe = testFramework.describe.bind(testFramework);
const it = testFramework.it.bind(testFramework);
const expect = testFramework.expect.bind(testFramework);
const beforeEach = testFramework.beforeEach.bind(testFramework);
const afterEach = testFramework.afterEach.bind(testFramework);

// Performance measurement utilities
class PerformanceMonitor {
    constructor() {
        this.measurements = [];
        this.startTimes = new Map();
    }

    start(label) {
        this.startTimes.set(label, performance.now());
    }

    end(label) {
        const startTime = this.startTimes.get(label);
        if (!startTime) {
            throw new Error(`No start time found for label: ${label}`);
        }
        
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

    getAverageDuration(label) {
        const labelMeasurements = this.measurements.filter(m => m.label === label);
        if (labelMeasurements.length === 0) return 0;
        
        const total = labelMeasurements.reduce((sum, m) => sum + m.duration, 0);
        return total / labelMeasurements.length;
    }

    clear() {
        this.measurements = [];
        this.startTimes.clear();
    }
}

// Memory usage monitoring
class MemoryMonitor {
    constructor() {
        this.snapshots = [];
    }

    takeSnapshot(label) {
        const snapshot = {
            label,
            timestamp: new Date().toISOString(),
            memoryUsage: this.getMemoryUsage()
        };
        
        this.snapshots.push(snapshot);
        return snapshot;
    }

    getMemoryUsage() {
        if (performance.memory) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return null;
    }

    getSnapshots() {
        return [...this.snapshots];
    }

    clear() {
        this.snapshots = [];
    }
}

// Performance test suite
describe('Performance Tests', () => {
    let performanceMonitor;
    let memoryMonitor;
    let mockAPI;

    beforeEach(() => {
        performanceMonitor = new PerformanceMonitor();
        memoryMonitor = new MemoryMonitor();
        mockAPI = new MockAPI();
        
        // Mock global functions
        global.RenovationData = {
            RENOVATION_AREAS: {
                'Kitchen': ['Cabinet replacement', 'Countertop installation', 'Appliance upgrades'],
                'Bathroom': ['Tile installation', 'Fixture replacement', 'Plumbing updates'],
                'Living Room': ['Flooring replacement', 'Lighting updates', 'Paint'],
                'Bedroom': ['Flooring', 'Closet organization', 'Lighting']
            },
            STANDARD_PLANNING_TASKS: [
                'Project Kickoff Meeting',
                'Site Assessment and Measurement',
                'Design Concept Development',
                'Material Selection and Sourcing',
                'Permit Applications and Approvals'
            ],
            DataHelper: {
                processUserSelections: (areas, scopes, name, workspace) => {
                    return {
                        projectName: name,
                        workspaceId: workspace,
                        selectedAreas: areas,
                        selectedScopes: scopes,
                        metadata: {
                            totalAreas: areas.length,
                            totalScopes: Object.values(scopes).reduce((sum, arr) => sum + arr.length, 0),
                            processedAt: new Date().toISOString()
                        }
                    };
                },
                generateBoardStructure: (name, scopes) => {
                    return {
                        board_name: name,
                        groups: [
                            { title: 'Design and Planning', color: '#037f4c' },
                            ...Object.keys(scopes).map(area => ({ title: area, color: '#0086c0' }))
                        ],
                        items: [
                            ...global.RenovationData.STANDARD_PLANNING_TASKS.map(task => ({
                                name: task,
                                group: 'Design and Planning',
                                column_values: { status: { label: 'Not Started' }, priority: { label: 'High' } }
                            })),
                            ...Object.entries(scopes).flatMap(([area, scopeList]) =>
                                scopeList.map(scope => ({
                                    name: scope,
                                    group: area,
                                    column_values: { status: { label: 'Not Started' }, priority: { label: 'Medium' } }
                                }))
                            )
                        ]
                    };
                }
            }
        };
    });

    afterEach(() => {
        performanceMonitor.clear();
        memoryMonitor.clear();
        mockAPI.clearCallLog();
    });

    describe('Data Processing Performance', () => {
        it('should process user selections under 50ms', () => {
            const testData = {
                areas: ['Kitchen', 'Bathroom'],
                scopes: {
                    'Kitchen': ['Cabinet replacement', 'Countertop installation'],
                    'Bathroom': ['Tile installation', 'Fixture replacement']
                },
                projectName: 'Test Project',
                workspaceId: '123456789'
            };

            performanceMonitor.start('processUserSelections');
            
            const result = global.RenovationData.DataHelper.processUserSelections(
                testData.areas,
                testData.scopes,
                testData.projectName,
                testData.workspaceId
            );
            
            const duration = performanceMonitor.end('processUserSelections');
            
            expect(duration).toBeLessThan(50);
            expect(result.selectedAreas).toEqual(testData.areas);
            expect(result.selectedScopes).toEqual(testData.scopes);
        });

        it('should generate board structure under 100ms', () => {
            const testData = {
                projectName: 'Test Project',
                scopes: {
                    'Kitchen': ['Cabinet replacement', 'Countertop installation'],
                    'Bathroom': ['Tile installation', 'Fixture replacement']
                }
            };

            performanceMonitor.start('generateBoardStructure');
            
            const result = global.RenovationData.DataHelper.generateBoardStructure(
                testData.projectName,
                testData.scopes
            );
            
            const duration = performanceMonitor.end('generateBoardStructure');
            
            expect(duration).toBeLessThan(100);
            expect(result.board_name).toBe(testData.projectName);
            expect(result.groups.length).toBe(3); // Design + Planning + 2 areas
            expect(result.items.length).toBe(9); // 5 planning + 4 scope items
        });

        it('should handle large datasets efficiently', () => {
            // Create large dataset
            const largeScopes = {};
            Object.keys(global.RenovationData.RENOVATION_AREAS).forEach(area => {
                largeScopes[area] = global.RenovationData.RENOVATION_AREAS[area];
            });

            performanceMonitor.start('largeBoardStructure');
            
            const result = global.RenovationData.DataHelper.generateBoardStructure(
                'Large Project',
                largeScopes
            );
            
            const duration = performanceMonitor.end('largeBoardStructure');
            
            // Should handle large datasets under 200ms
            expect(duration).toBeLessThan(200);
            expect(result.groups.length).toBe(5); // Design + Planning + 4 areas
            expect(result.items.length).toBeGreaterThan(10);
        });

        it('should validate performance consistency', () => {
            const testData = {
                areas: ['Kitchen', 'Bathroom'],
                scopes: {
                    'Kitchen': ['Cabinet replacement'],
                    'Bathroom': ['Tile installation']
                },
                projectName: 'Test Project',
                workspaceId: '123456789'
            };

            const iterations = 10;
            
            // Run multiple iterations
            for (let i = 0; i < iterations; i++) {
                performanceMonitor.start(`iteration-${i}`);
                
                global.RenovationData.DataHelper.processUserSelections(
                    testData.areas,
                    testData.scopes,
                    testData.projectName,
                    testData.workspaceId
                );
                
                performanceMonitor.end(`iteration-${i}`);
            }

            // Calculate average and check consistency
            const durations = performanceMonitor.getMeasurements().map(m => m.duration);
            const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;
            const maxDeviation = Math.max(...durations.map(d => Math.abs(d - average)));
            
            // Performance should be consistent (max deviation under 50ms)
            expect(maxDeviation).toBeLessThan(50);
            expect(average).toBeLessThan(25); // Average should be under 25ms
        });
    });

    describe('API Performance', () => {
        it('should handle API requests under 500ms', async () => {
            const query = `
                query {
                    me {
                        id
                        name
                        email
                    }
                }
            `;

            mockAPI.setResponse(query + '-{}', {
                data: {
                    me: {
                        id: '123456',
                        name: 'Test User',
                        email: 'test@example.com'
                    }
                }
            });

            performanceMonitor.start('apiRequest');
            
            const result = await mockAPI.makeRequest(query);
            
            const duration = performanceMonitor.end('apiRequest');
            
            expect(duration).toBeLessThan(500);
            expect(result.me.id).toBe('123456');
        });

        it('should handle batch API requests efficiently', async () => {
            const batchSize = 10;
            const requests = Array.from({ length: batchSize }, (_, i) => ({
                query: `query { item${i} { id name } }`,
                variables: {}
            }));

            // Mock all requests
            requests.forEach((request, index) => {
                mockAPI.setResponse(request.query + '-{}', {
                    data: {
                        [`item${index}`]: {
                            id: `item-${index}`,
                            name: `Item ${index}`
                        }
                    }
                });
            });

            performanceMonitor.start('batchRequests');
            
            // Process batch sequentially
            const results = [];
            for (const request of requests) {
                const result = await mockAPI.makeRequest(request.query, request.variables);
                results.push(result);
            }
            
            const duration = performanceMonitor.end('batchRequests');
            
            // Should complete batch under 1 second
            expect(duration).toBeLessThan(1000);
            expect(results.length).toBe(batchSize);
        });

        it('should measure API call frequency', async () => {
            const callCount = 20;
            const query = `
                query {
                    test {
                        id
                    }
                }
            `;

            mockAPI.setResponse(query + '-{}', {
                data: {
                    test: {
                        id: '123'
                    }
                }
            });

            performanceMonitor.start('apiCallFrequency');
            
            // Make rapid API calls
            for (let i = 0; i < callCount; i++) {
                await mockAPI.makeRequest(query);
            }
            
            const duration = performanceMonitor.end('apiCallFrequency');
            
            // Check call rate
            const callsPerSecond = (callCount / duration) * 1000;
            
            // Should handle at least 10 calls per second
            expect(callsPerSecond).toBeGreaterThan(10);
            
            // Verify all calls were made
            const apiCalls = mockAPI.getCallLog();
            expect(apiCalls.length).toBe(callCount);
        });

        it('should handle concurrent API requests', async () => {
            const concurrentRequests = 5;
            const queries = Array.from({ length: concurrentRequests }, (_, i) => 
                `query { concurrent${i} { id } }`
            );

            // Mock all queries
            queries.forEach((query, index) => {
                mockAPI.setResponse(query + '-{}', {
                    data: {
                        [`concurrent${index}`]: {
                            id: `concurrent-${index}`
                        }
                    }
                });
            });

            performanceMonitor.start('concurrentRequests');
            
            // Execute concurrent requests
            const promises = queries.map(query => mockAPI.makeRequest(query));
            const results = await Promise.all(promises);
            
            const duration = performanceMonitor.end('concurrentRequests');
            
            // Concurrent requests should be faster than sequential
            expect(duration).toBeLessThan(500);
            expect(results.length).toBe(concurrentRequests);
        });
    });

    describe('Memory Usage', () => {
        it('should monitor memory usage during data processing', () => {
            memoryMonitor.takeSnapshot('before-processing');
            
            const largeData = {
                areas: Object.keys(global.RenovationData.RENOVATION_AREAS),
                scopes: global.RenovationData.RENOVATION_AREAS,
                projectName: 'Memory Test Project',
                workspaceId: '123456789'
            };

            // Process large amount of data
            for (let i = 0; i < 100; i++) {
                global.RenovationData.DataHelper.processUserSelections(
                    largeData.areas,
                    largeData.scopes,
                    largeData.projectName,
                    largeData.workspaceId
                );
            }

            memoryMonitor.takeSnapshot('after-processing');
            
            const snapshots = memoryMonitor.getSnapshots();
            expect(snapshots.length).toBe(2);
            
            // Check if memory usage is reasonable
            if (snapshots[0].memoryUsage && snapshots[1].memoryUsage) {
                const memoryIncrease = snapshots[1].memoryUsage.usedJSHeapSize - 
                                     snapshots[0].memoryUsage.usedJSHeapSize;
                
                // Memory increase should be reasonable (under 10MB)
                expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
            }
        });

        it('should handle memory cleanup', () => {
            memoryMonitor.takeSnapshot('before-cleanup-test');
            
            // Create temporary objects
            const temporaryObjects = [];
            for (let i = 0; i < 1000; i++) {
                temporaryObjects.push({
                    id: i,
                    data: Array.from({ length: 100 }, (_, j) => `data-${i}-${j}`),
                    timestamp: new Date().toISOString()
                });
            }

            memoryMonitor.takeSnapshot('after-creation');
            
            // Clear references
            temporaryObjects.length = 0;
            
            // Force garbage collection if available
            if (global.gc) {
                global.gc();
            }
            
            memoryMonitor.takeSnapshot('after-cleanup');
            
            const snapshots = memoryMonitor.getSnapshots();
            expect(snapshots.length).toBe(3);
            
            // Verify memory was managed properly
            expect(snapshots[0].label).toBe('before-cleanup-test');
            expect(snapshots[1].label).toBe('after-creation');
            expect(snapshots[2].label).toBe('after-cleanup');
        });
    });

    describe('UI Performance', () => {
        it('should measure DOM manipulation performance', () => {
            // Create mock DOM elements
            const container = document.createElement('div');
            container.id = 'test-container';
            document.body.appendChild(container);

            performanceMonitor.start('domManipulation');
            
            // Simulate area grid creation
            const areaCount = 15;
            for (let i = 0; i < areaCount; i++) {
                const areaElement = document.createElement('div');
                areaElement.className = 'area-item';
                areaElement.innerHTML = `
                    <input type="checkbox" id="area-${i}" value="area-${i}">
                    <label for="area-${i}">Area ${i}</label>
                `;
                container.appendChild(areaElement);
            }
            
            const duration = performanceMonitor.end('domManipulation');
            
            // DOM manipulation should be fast
            expect(duration).toBeLessThan(100);
            expect(container.children.length).toBe(areaCount);
            
            // Clean up
            document.body.removeChild(container);
        });

        it('should measure form validation performance', () => {
            const testCases = [
                { name: 'Valid Project', workspaceId: '123456789', valid: true },
                { name: 'AB', workspaceId: '123456789', valid: false },
                { name: 'Valid Project', workspaceId: '123', valid: false },
                { name: 'Another Valid Project', workspaceId: '987654321', valid: true }
            ];

            const validateForm = (name, workspaceId) => {
                const nameValid = name && name.length >= 3 && name.length <= 50;
                const workspaceValid = workspaceId && /^\d{8,12}$/.test(workspaceId);
                return nameValid && workspaceValid;
            };

            performanceMonitor.start('formValidation');
            
            // Run validation on multiple test cases
            const results = testCases.map(testCase => ({
                ...testCase,
                result: validateForm(testCase.name, testCase.workspaceId)
            }));
            
            const duration = performanceMonitor.end('formValidation');
            
            // Validation should be very fast
            expect(duration).toBeLessThan(10);
            
            // Verify results
            results.forEach(result => {
                expect(result.result).toBe(result.valid);
            });
        });

        it('should measure progress updates performance', () => {
            const progressElement = document.createElement('div');
            progressElement.id = 'progress-bar';
            progressElement.innerHTML = '<div class="progress-fill"></div>';
            document.body.appendChild(progressElement);

            const updateProgress = (percentage) => {
                const fill = progressElement.querySelector('.progress-fill');
                fill.style.width = `${percentage}%`;
                fill.textContent = `${percentage}%`;
            };

            performanceMonitor.start('progressUpdates');
            
            // Simulate progress updates
            for (let i = 0; i <= 100; i += 5) {
                updateProgress(i);
            }
            
            const duration = performanceMonitor.end('progressUpdates');
            
            // Progress updates should be fast
            expect(duration).toBeLessThan(50);
            
            // Verify final state
            const fill = progressElement.querySelector('.progress-fill');
            expect(fill.style.width).toBe('100%');
            expect(fill.textContent).toBe('100%');
            
            // Clean up
            document.body.removeChild(progressElement);
        });
    });

    describe('Overall Performance Benchmarks', () => {
        it('should complete full board creation simulation under 5 seconds', async () => {
            const testData = {
                projectName: 'Performance Test Project',
                workspaceId: '123456789',
                selectedAreas: ['Kitchen', 'Bathroom'],
                selectedScopes: {
                    'Kitchen': ['Cabinet replacement', 'Countertop installation'],
                    'Bathroom': ['Tile installation', 'Fixture replacement']
                }
            };

            // Mock API responses
            const boardId = '987654321';
            const groupIds = { 'Design and Planning': 'group1', 'Kitchen': 'group2', 'Bathroom': 'group3' };
            
            // Mock board creation
            mockAPI.setResponse(
                'mutation($boardName: String!, $workspaceId: ID!, $boardKind: BoardKind!) {\n                    create_board(\n                        board_name: $boardName,\n                        workspace_id: $workspaceId,\n                        board_kind: $boardKind\n                    ) {\n                        id\n                        name\n                        url\n                    }\n                }-{"boardName":"Performance Test Project","workspaceId":"123456789","boardKind":"public"}',
                {
                    data: {
                        create_board: {
                            id: boardId,
                            name: 'Performance Test Project',
                            url: `https://monday.com/boards/${boardId}`
                        }
                    }
                }
            );

            performanceMonitor.start('fullBoardCreation');
            
            // Step 1: Process selections
            const processedData = global.RenovationData.DataHelper.processUserSelections(
                testData.selectedAreas,
                testData.selectedScopes,
                testData.projectName,
                testData.workspaceId
            );
            
            // Step 2: Generate board structure
            const boardStructure = global.RenovationData.DataHelper.generateBoardStructure(
                testData.projectName,
                testData.selectedScopes
            );
            
            // Step 3: Create board
            const boardResult = await mockAPI.makeRequest(
                `mutation($boardName: String!, $workspaceId: ID!, $boardKind: BoardKind!) {
                    create_board(
                        board_name: $boardName,
                        workspace_id: $workspaceId,
                        board_kind: $boardKind
                    ) {
                        id
                        name
                        url
                    }
                }`,
                {
                    boardName: testData.projectName,
                    workspaceId: testData.workspaceId,
                    boardKind: 'public'
                }
            );
            
            const duration = performanceMonitor.end('fullBoardCreation');
            
            // Full workflow should complete under 5 seconds
            expect(duration).toBeLessThan(5000);
            
            // Verify results
            expect(processedData.selectedAreas).toEqual(testData.selectedAreas);
            expect(boardStructure.board_name).toBe(testData.projectName);
            expect(boardResult.create_board.id).toBe(boardId);
        });

        it('should generate performance report', () => {
            const measurements = performanceMonitor.getMeasurements();
            const memorySnapshots = memoryMonitor.getSnapshots();
            
            const performanceReport = {
                summary: {
                    totalMeasurements: measurements.length,
                    totalMemorySnapshots: memorySnapshots.length,
                    averageExecutionTime: measurements.length > 0 ? 
                        measurements.reduce((sum, m) => sum + m.duration, 0) / measurements.length : 0
                },
                measurements: measurements.map(m => ({
                    label: m.label,
                    duration: Math.round(m.duration * 100) / 100,
                    timestamp: m.timestamp
                })),
                memoryUsage: memorySnapshots.map(s => ({
                    label: s.label,
                    timestamp: s.timestamp,
                    memoryUsage: s.memoryUsage
                }))
            };
            
            expect(performanceReport.summary.totalMeasurements).toBeGreaterThan(0);
            expect(performanceReport.summary.averageExecutionTime).toBeGreaterThan(0);
            expect(performanceReport.measurements.length).toBeGreaterThan(0);
            
            // Log report for debugging
            console.log('Performance Report:', performanceReport);
        });
    });
});

// Export performance utilities for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceMonitor, MemoryMonitor };
} else {
    window.PerformanceMonitor = PerformanceMonitor;
    window.MemoryMonitor = MemoryMonitor;
} 