// ============================================================================
// RENOVATION PROJECT MANAGER - COMPREHENSIVE API TESTS
// ============================================================================
// Complete API integration testing for Monday.com GraphQL API
// ============================================================================

// Enhanced Mock API for comprehensive testing
class EnhancedMockAPI extends MockAPI {
    constructor() {
        super();
        this.rateLimitTracker = {
            requests: 0,
            windowStart: Date.now(),
            limit: 35, // 35 requests per minute
            windowDuration: 60000 // 1 minute
        };
        this.networkErrorRate = 0; // 0-1, probability of network errors
        this.authToken = null;
    }

    setAuthToken(token) {
        this.authToken = token;
    }

    simulateNetworkErrors(errorRate) {
        this.networkErrorRate = errorRate;
    }

    checkRateLimit() {
        const now = Date.now();
        
        // Reset window if needed
        if (now - this.rateLimitTracker.windowStart > this.rateLimitTracker.windowDuration) {
            this.rateLimitTracker.requests = 0;
            this.rateLimitTracker.windowStart = now;
        }
        
        this.rateLimitTracker.requests++;
        return this.rateLimitTracker.requests <= this.rateLimitTracker.limit;
    }

    async makeRequest(query, variables = {}) {
        // Simulate network errors
        if (Math.random() < this.networkErrorRate) {
            throw new Error('Network error: Connection timeout');
        }

        // Check authentication
        if (!this.authToken) {
            throw new Error('Authentication required: No API token provided');
        }

        // Check rate limiting
        if (!this.checkRateLimit()) {
            const retryAfter = Math.ceil((this.rateLimitTracker.windowDuration - 
                (Date.now() - this.rateLimitTracker.windowStart)) / 1000);
            throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
        }

        // Call parent method
        return super.makeRequest(query, variables);
    }

    getRateLimitStatus() {
        return {
            requests: this.rateLimitTracker.requests,
            limit: this.rateLimitTracker.limit,
            remainingRequests: Math.max(0, this.rateLimitTracker.limit - this.rateLimitTracker.requests),
            resetTime: this.rateLimitTracker.windowStart + this.rateLimitTracker.windowDuration
        };
    }

    reset() {
        this.clearCallLog();
        this.rateLimitTracker.requests = 0;
        this.rateLimitTracker.windowStart = Date.now();
        this.networkErrorRate = 0;
        this.authToken = null;
    }
}

// API Response Templates
const APIResponseTemplates = {
    validTokenResponse: {
        data: {
            me: {
                id: "123456789",
                name: "Test User",
                email: "test@example.com"
            }
        }
    },

    invalidTokenResponse: {
        errors: [{
            message: "Invalid authentication token",
            locations: [{ line: 1, column: 1 }]
        }]
    },

    workspacesResponse: {
        data: {
            workspaces: [
                {
                    id: "987654321",
                    name: "Main Workspace",
                    description: "Primary workspace for projects"
                },
                {
                    id: "123456789",
                    name: "Secondary Workspace", 
                    description: "Secondary workspace"
                }
            ]
        }
    },

    boardCreationResponse: {
        data: {
            create_board: {
                id: "555444333",
                name: "Kitchen Renovation 2025",
                url: "https://mycompany.monday.com/boards/555444333",
                workspace: {
                    id: "123456789"
                }
            }
        }
    },

    groupCreationResponse: {
        data: {
            create_group: {
                id: "new_group_123",
                title: "Design and Planning",
                color: "#037f4c"
            }
        }
    },

    itemCreationResponse: {
        data: {
            create_item: {
                id: "777888999",
                name: "Construction Contract Executed",
                board: {
                    id: "555444333"
                }
            }
        }
    }
};

// Rate Limiting Helper
class RateLimitHelper {
    constructor() {
        this.requestTimes = [];
        this.maxRequestsPerMinute = 35;
    }

    canMakeRequest() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Remove requests older than 1 minute
        this.requestTimes = this.requestTimes.filter(time => time > oneMinuteAgo);
        
        return this.requestTimes.length < this.maxRequestsPerMinute;
    }

    recordRequest() {
        this.requestTimes.push(Date.now());
    }

    getWaitTime() {
        if (this.requestTimes.length === 0) return 0;
        
        const oldestRequest = Math.min(...this.requestTimes);
        const waitTime = oldestRequest + 60000 - Date.now();
        
        return Math.max(0, waitTime);
    }

    reset() {
        this.requestTimes = [];
    }
}

// Retry Logic Helper
class RetryHelper {
    static async withExponentialBackoff(operation, maxRetries = 3) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxRetries) {
                    break;
                }
                
                // Exponential backoff: 1s, 2s, 4s
                const delay = Math.pow(2, attempt - 1) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        throw lastError;
    }
}

// Initialize comprehensive API tests
function initializeAPITests() {
    if (typeof testFramework === 'undefined') {
        console.error('TestFramework not available for API tests');
        return;
    }

    // Authentication and Token Management Tests
    testFramework.describe('API - Authentication and Token Management', () => {
        let mockAPI;

        testFramework.beforeEach(() => {
            mockAPI = new EnhancedMockAPI();
        });

        testFramework.it('should validate API token successfully', async () => {
            const validToken = 'valid_token_123456789';
            mockAPI.setAuthToken(validToken);
            mockAPI.setResponse('query { me { id name email } }-{}', APIResponseTemplates.validTokenResponse);

            const result = await mockAPI.makeRequest('query { me { id name email } }');
            
            testFramework.expect(result.me.id).toBe('123456789');
            testFramework.expect(result.me.name).toBe('Test User');
            testFramework.expect(result.me.email).toBe('test@example.com');
        });

        testFramework.it('should reject invalid API token', async () => {
            const invalidToken = 'invalid_token';
            mockAPI.setAuthToken(invalidToken);
            mockAPI.setResponse('query { me { id name email } }-{}', APIResponseTemplates.invalidTokenResponse);

            try {
                await mockAPI.makeRequest('query { me { id name email } }');
                testFramework.expect(true).toBeFalsy(); // Should not reach here
            } catch (error) {
                testFramework.expect(error.message).toContain('Invalid authentication');
            }
        });

        testFramework.it('should require authentication token', async () => {
            // No token set
            try {
                await mockAPI.makeRequest('query { me { id } }');
                testFramework.expect(true).toBeFalsy(); // Should not reach here
            } catch (error) {
                testFramework.expect(error.message).toContain('Authentication required');
            }
        });

        testFramework.it('should handle token storage and retrieval', () => {
            const token = 'test_token_123';
            
            // Mock localStorage
            const mockStorage = {
                data: {},
                setItem(key, value) { this.data[key] = value; },
                getItem(key) { return this.data[key] || null; },
                removeItem(key) { delete this.data[key]; }
            };

            // Test token storage
            mockStorage.setItem('monday_api_token', token);
            testFramework.expect(mockStorage.getItem('monday_api_token')).toBe(token);

            // Test token removal
            mockStorage.removeItem('monday_api_token');
            testFramework.expect(mockStorage.getItem('monday_api_token')).toBeNull();
        });
    });

    // Workspace Validation Tests
    testFramework.describe('API - Workspace Validation', () => {
        let mockAPI;

        testFramework.beforeEach(() => {
            mockAPI = new EnhancedMockAPI();
            mockAPI.setAuthToken('valid_token');
        });

        testFramework.it('should fetch available workspaces', async () => {
            mockAPI.setResponse('query { workspaces { id name description } }-{}', APIResponseTemplates.workspacesResponse);

            const result = await mockAPI.makeRequest('query { workspaces { id name description } }');
            
            testFramework.expect(result.workspaces).toHaveLength(2);
            testFramework.expect(result.workspaces[0].id).toBe('987654321');
            testFramework.expect(result.workspaces[1].id).toBe('123456789');
        });

        testFramework.it('should validate workspace ID exists', async () => {
            mockAPI.setResponse('query { workspaces { id name description } }-{}', APIResponseTemplates.workspacesResponse);

            const result = await mockAPI.makeRequest('query { workspaces { id name description } }');
            const workspaceIds = result.workspaces.map(w => w.id);
            
            testFramework.expect(workspaceIds).toContain('123456789');
            testFramework.expect(workspaceIds).toContain('987654321');
            testFramework.expect(workspaceIds).not.toContain('invalid_id');
        });

        testFramework.it('should handle workspace validation errors', async () => {
            const errorResponse = {
                errors: [{
                    message: "Workspace not found or access denied",
                    locations: [{ line: 1, column: 1 }]
                }]
            };
            
            mockAPI.setResponse('query { workspaces { id } }-{}', errorResponse);

            try {
                await mockAPI.makeRequest('query { workspaces { id } }');
                testFramework.expect(true).toBeFalsy(); // Should not reach here
            } catch (error) {
                testFramework.expect(error.message).toContain('Mock API error');
            }
        });

        testFramework.it('should implement workspace fallback logic', async () => {
            mockAPI.setResponse('query { workspaces { id name } }-{}', APIResponseTemplates.workspacesResponse);

            const result = await mockAPI.makeRequest('query { workspaces { id name } }');
            const fallbackWorkspace = result.workspaces[0]; // Use first available
            
            testFramework.expect(fallbackWorkspace.id).toBe('987654321');
            testFramework.expect(fallbackWorkspace.name).toBe('Main Workspace');
        });
    });

    // Board Creation Tests
    testFramework.describe('API - Board Creation', () => {
        let mockAPI;

        testFramework.beforeEach(() => {
            mockAPI = new EnhancedMockAPI();
            mockAPI.setAuthToken('valid_token');
        });

        testFramework.it('should create board successfully', async () => {
            const mutation = 'mutation { create_board(board_name: "Kitchen Renovation 2025", workspace_id: 123456789) { id name url workspace { id } } }';
            mockAPI.setResponse(mutation + '-{}', APIResponseTemplates.boardCreationResponse);

            const result = await mockAPI.makeRequest(mutation);
            
            testFramework.expect(result.create_board.id).toBe('555444333');
            testFramework.expect(result.create_board.name).toBe('Kitchen Renovation 2025');
            testFramework.expect(result.create_board.url).toContain('555444333');
        });

        testFramework.it('should handle board creation with timestamps', () => {
            const projectName = 'Kitchen Renovation';
            const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
            const boardName = `${projectName} - ${timestamp}`;
            
            testFramework.expect(boardName).toContain('Kitchen Renovation');
            testFramework.expect(boardName).toContain('-');
        });

        testFramework.it('should validate board name requirements', () => {
            const validateBoardName = (name) => {
                return name && name.length > 0 && name.length <= 255;
            };

            testFramework.expect(validateBoardName('Valid Board Name')).toBeTruthy();
            testFramework.expect(validateBoardName('')).toBeFalsy();
            testFramework.expect(validateBoardName('A'.repeat(256))).toBeFalsy();
        });

        testFramework.it('should handle board creation errors', async () => {
            const errorResponse = {
                errors: [{
                    message: "Board creation failed: insufficient permissions",
                    locations: [{ line: 1, column: 1 }]
                }]
            };

            const mutation = 'mutation { create_board(board_name: "Test", workspace_id: 123) { id } }';
            mockAPI.setResponse(mutation + '-{}', errorResponse);

            try {
                await mockAPI.makeRequest(mutation);
                testFramework.expect(true).toBeFalsy(); // Should not reach here
            } catch (error) {
                testFramework.expect(error.message).toContain('Mock API error');
            }
        });
    });

    // Group Creation Tests
    testFramework.describe('API - Group Creation', () => {
        let mockAPI;

        testFramework.beforeEach(() => {
            mockAPI = new EnhancedMockAPI();
            mockAPI.setAuthToken('valid_token');
        });

        testFramework.it('should create Design and Planning group first', async () => {
            const mutation = 'mutation { create_group(board_id: 555444333, group_name: "Design and Planning") { id title color } }';
            mockAPI.setResponse(mutation + '-{}', APIResponseTemplates.groupCreationResponse);

            const result = await mockAPI.makeRequest(mutation);
            
            testFramework.expect(result.create_group.title).toBe('Design and Planning');
            testFramework.expect(result.create_group.color).toBe('#037f4c');
        });

        testFramework.it('should create groups for selected renovation areas', async () => {
            const renovationAreas = ['Kitchen', 'Bathroom', 'Living Room'];
            const boardId = '555444333';
            
            const groupPromises = renovationAreas.map(area => {
                const mutation = `mutation { create_group(board_id: ${boardId}, group_name: "${area}") { id title } }`;
                mockAPI.setResponse(mutation + '-{}', {
                    data: {
                        create_group: {
                            id: `group_${area.toLowerCase()}`,
                            title: area
                        }
                    }
                });
                return mockAPI.makeRequest(mutation);
            });

            const results = await Promise.all(groupPromises);
            testFramework.expect(results).toHaveLength(3);
            testFramework.expect(results[0].create_group.title).toBe('Kitchen');
        });

        testFramework.it('should handle group creation with proper ordering', () => {
            const groupOrder = ['Design and Planning'];
            const selectedAreas = ['Kitchen', 'Bathroom'];
            
            const finalOrder = [...groupOrder, ...selectedAreas];
            
            testFramework.expect(finalOrder[0]).toBe('Design and Planning');
            testFramework.expect(finalOrder[1]).toBe('Kitchen');
            testFramework.expect(finalOrder[2]).toBe('Bathroom');
        });

        testFramework.it('should apply color coding to groups', () => {
            const groupColors = {
                'Design and Planning': '#037f4c', // Green
                'Kitchen': '#0073ea',              // Blue
                'Bathroom': '#0073ea',             // Blue
                'Living Room': '#0073ea'           // Blue
            };

            testFramework.expect(groupColors['Design and Planning']).toBe('#037f4c');
            testFramework.expect(groupColors['Kitchen']).toBe('#0073ea');
        });
    });

    // Item Creation Tests
    testFramework.describe('API - Item Creation', () => {
        let mockAPI;

        testFramework.beforeEach(() => {
            mockAPI = new EnhancedMockAPI();
            mockAPI.setAuthToken('valid_token');
        });

        testFramework.it('should create standard planning tasks', async () => {
            const planningTasks = [
                'Construction Contract Executed',
                'Architectural Plan Development',
                'Interior Design and Selections'
            ];

            const boardId = '555444333';
            const groupId = 'planning_group';

            const itemPromises = planningTasks.map(task => {
                const mutation = `mutation { create_item(board_id: ${boardId}, group_id: "${groupId}", item_name: "${task}") { id name } }`;
                mockAPI.setResponse(mutation + '-{}', {
                    data: {
                        create_item: {
                            id: `item_${task.replace(/\s+/g, '_')}`,
                            name: task
                        }
                    }
                });
                return mockAPI.makeRequest(mutation);
            });

            const results = await Promise.all(itemPromises);
            testFramework.expect(results).toHaveLength(3);
            testFramework.expect(results[0].create_item.name).toBe('Construction Contract Executed');
        });

        testFramework.it('should create renovation scope items', async () => {
            const scopeItems = [
                'Cabinet replacement/refacing',
                'Countertop installation (granite, quartz, marble)',
                'Appliance upgrades'
            ];

            const boardId = '555444333';
            const groupId = 'kitchen_group';

            for (const scope of scopeItems) {
                const mutation = `mutation { create_item(board_id: ${boardId}, group_id: "${groupId}", item_name: "${scope}") { id name } }`;
                mockAPI.setResponse(mutation + '-{}', {
                    data: {
                        create_item: {
                            id: `item_${scope.slice(0, 10)}`,
                            name: scope
                        }
                    }
                });

                const result = await mockAPI.makeRequest(mutation);
                testFramework.expect(result.create_item.name).toBe(scope);
            }
        });

        testFramework.it('should set default column values for items', () => {
            const defaultColumnValues = {
                status: 'Not Started',
                priority: 'Medium',
                due_date: null,
                assignee: null,
                notes: ''
            };

            testFramework.expect(defaultColumnValues.status).toBe('Not Started');
            testFramework.expect(defaultColumnValues.priority).toBe('Medium');
            testFramework.expect(defaultColumnValues.due_date).toBeNull();
        });

        testFramework.it('should handle item creation batch processing', async () => {
            const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
            const batchSize = 3;
            const batches = [];

            for (let i = 0; i < items.length; i += batchSize) {
                batches.push(items.slice(i, i + batchSize));
            }

            testFramework.expect(batches).toHaveLength(2);
            testFramework.expect(batches[0]).toHaveLength(3);
            testFramework.expect(batches[1]).toHaveLength(2);
        });
    });

    // Rate Limiting Tests
    testFramework.describe('API - Rate Limiting', () => {
        let mockAPI;
        let rateLimitHelper;

        testFramework.beforeEach(() => {
            mockAPI = new EnhancedMockAPI();
            mockAPI.setAuthToken('valid_token');
            rateLimitHelper = new RateLimitHelper();
        });

        testFramework.it('should track request rate correctly', () => {
            for (let i = 0; i < 10; i++) {
                testFramework.expect(rateLimitHelper.canMakeRequest()).toBeTruthy();
                rateLimitHelper.recordRequest();
            }

            testFramework.expect(rateLimitHelper.requestTimes).toHaveLength(10);
        });

        testFramework.it('should enforce rate limits', async () => {
            // Make maximum requests
            for (let i = 0; i < 35; i++) {
                mockAPI.setResponse(`query${i}-{}`, { data: { success: true } });
                await mockAPI.makeRequest(`query${i}`);
            }

            // Next request should fail
            try {
                await mockAPI.makeRequest('query36');
                testFramework.expect(true).toBeFalsy(); // Should not reach here
            } catch (error) {
                testFramework.expect(error.message).toContain('Rate limit exceeded');
            }
        });

        testFramework.it('should provide rate limit status', () => {
            const status = mockAPI.getRateLimitStatus();
            
            testFramework.expect(status.limit).toBe(35);
            testFramework.expect(status.remainingRequests).toBeGreaterThan(0);
            testFramework.expect(status.resetTime).toBeGreaterThan(Date.now());
        });

        testFramework.it('should calculate wait time correctly', () => {
            // Simulate full rate limit
            for (let i = 0; i < 35; i++) {
                rateLimitHelper.recordRequest();
            }

            testFramework.expect(rateLimitHelper.canMakeRequest()).toBeFalsy();
            
            const waitTime = rateLimitHelper.getWaitTime();
            testFramework.expect(waitTime).toBeGreaterThan(0);
        });
    });

    // Error Handling and Retry Tests
    testFramework.describe('API - Error Handling and Retry Logic', () => {
        let mockAPI;

        testFramework.beforeEach(() => {
            mockAPI = new EnhancedMockAPI();
            mockAPI.setAuthToken('valid_token');
        });

        testFramework.it('should handle network errors', async () => {
            mockAPI.simulateNetworkErrors(1.0); // 100% error rate

            try {
                await mockAPI.makeRequest('query { test }');
                testFramework.expect(true).toBeFalsy(); // Should not reach here
            } catch (error) {
                testFramework.expect(error.message).toContain('Network error');
            }
        });

        testFramework.it('should implement exponential backoff', async () => {
            let attemptCount = 0;
            
            const failingOperation = async () => {
                attemptCount++;
                if (attemptCount < 3) {
                    throw new Error('Temporary failure');
                }
                return { success: true };
            };

            const result = await RetryHelper.withExponentialBackoff(failingOperation, 3);
            
            testFramework.expect(attemptCount).toBe(3);
            testFramework.expect(result.success).toBeTruthy();
        });

        testFramework.it('should handle GraphQL errors', () => {
            const graphqlError = {
                errors: [{
                    message: "Field 'invalid_field' doesn't exist on type 'Board'",
                    locations: [{ line: 1, column: 15 }],
                    path: ["create_board", "invalid_field"]
                }]
            };

            testFramework.expect(graphqlError.errors).toHaveLength(1);
            testFramework.expect(graphqlError.errors[0].message).toContain("doesn't exist");
        });

        testFramework.it('should provide user-friendly error messages', () => {
            const errorTranslator = (error) => {
                if (error.message.includes('Rate limit')) {
                    return 'Too many requests. Please wait a moment and try again.';
                }
                if (error.message.includes('Authentication')) {
                    return 'Please check your API token and try again.';
                }
                if (error.message.includes('Network')) {
                    return 'Connection error. Please check your internet connection.';
                }
                return 'An unexpected error occurred. Please try again.';
            };

            testFramework.expect(errorTranslator(new Error('Rate limit exceeded')))
                .toBe('Too many requests. Please wait a moment and try again.');
            testFramework.expect(errorTranslator(new Error('Authentication failed')))
                .toBe('Please check your API token and try again.');
        });

        testFramework.it('should handle partial failures gracefully', async () => {
            const operations = [
                () => Promise.resolve({ success: true, id: '1' }),
                () => Promise.reject(new Error('Operation 2 failed')),
                () => Promise.resolve({ success: true, id: '3' })
            ];

            const results = await Promise.allSettled(operations.map(op => op()));
            
            const successful = results.filter(r => r.status === 'fulfilled');
            const failed = results.filter(r => r.status === 'rejected');
            
            testFramework.expect(successful).toHaveLength(2);
            testFramework.expect(failed).toHaveLength(1);
        });
    });

    console.log('✅ API Comprehensive Tests initialized successfully!');
}

// Initialize API tests when framework is ready
if (typeof testFramework !== 'undefined') {
    initializeAPITests();
} else {
    // Wait for framework to be available
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeAPITests, 200);
    });
}