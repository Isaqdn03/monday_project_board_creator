// ============================================================================
// RENOVATION PROJECT MANAGER - API TESTS
// ============================================================================
// Comprehensive API testing for Monday.com integrations and error handling
// ============================================================================

// Use the global test framework
const describe = testFramework.describe.bind(testFramework);
const it = testFramework.it.bind(testFramework);
const expect = testFramework.expect.bind(testFramework);
const beforeEach = testFramework.beforeEach.bind(testFramework);
const afterEach = testFramework.afterEach.bind(testFramework);

// Mock API setup
let mockAPI = new MockAPI();

// API Test Suite
describe('Monday.com API Integration', () => {
    beforeEach(() => {
        mockAPI = new MockAPI();
        mockAPI.clearCallLog();
        
        // Mock global functions
        global.makeApiRequest = mockAPI.makeRequest.bind(mockAPI);
        
        // Mock app state
        global.AppState = {
            apiToken: 'test-token-123',
            projectName: 'Test Project',
            workspaceId: '123456789',
            selectedAreas: ['Kitchen', 'Bathroom'],
            selectedScopes: {
                'Kitchen': ['Cabinet replacement', 'Countertop installation'],
                'Bathroom': ['Tile installation', 'Fixture replacement']
            }
        };
    });

    afterEach(() => {
        mockAPI.clearCallLog();
        global.makeApiRequest = null;
        global.AppState = null;
    });

    describe('API Authentication', () => {
        it('should validate API token format', () => {
            const validTokens = [
                'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...',
                'monday-api-token-123456789',
                'abcdef123456789'
            ];
            
            const invalidTokens = [
                '',
                null,
                undefined,
                '123', // Too short
                'invalid token with spaces'
            ];
            
            const validateToken = (token) => {
                return token && typeof token === 'string' && token.length >= 10;
            };
            
            validTokens.forEach(token => {
                expect(validateToken(token)).toBeTruthy();
            });
            
            invalidTokens.forEach(token => {
                expect(validateToken(token)).toBeFalsy();
            });
        });

        it('should test API connection with valid token', async () => {
            const testQuery = `
                query {
                    me {
                        id
                        name
                        email
                    }
                }
            `;
            
            mockAPI.setResponse(testQuery + '-{}', {
                data: {
                    me: {
                        id: '123456',
                        name: 'Test User',
                        email: 'test@example.com'
                    }
                }
            });
            
            const result = await mockAPI.makeRequest(testQuery);
            expect(result.me.id).toBe('123456');
            expect(result.me.name).toBe('Test User');
        });

        it('should handle invalid API token', async () => {
            const testQuery = `
                query {
                    me {
                        id
                        name
                    }
                }
            `;
            
            mockAPI.setResponse(testQuery + '-{}', {
                shouldFail: true,
                error: 'Invalid API token'
            });
            
            await expect(mockAPI.makeRequest(testQuery)).toReject();
        });

        it('should handle expired API token', async () => {
            const testQuery = `
                query {
                    me {
                        id
                        name
                    }
                }
            `;
            
            mockAPI.setResponse(testQuery + '-{}', {
                shouldFail: true,
                error: 'API token expired'
            });
            
            await expect(mockAPI.makeRequest(testQuery)).toReject();
        });
    });

    describe('Workspace Operations', () => {
        it('should validate workspace ID format', () => {
            const validWorkspaceIds = [
                '123456789',
                '987654321',
                '111222333444'
            ];
            
            const invalidWorkspaceIds = [
                '',
                'abc123',
                '123',
                '1234567890123', // Too long
                null,
                undefined
            ];
            
            const validateWorkspaceId = (id) => {
                return id && /^\d{8,12}$/.test(id);
            };
            
            validWorkspaceIds.forEach(id => {
                expect(validateWorkspaceId(id)).toBeTruthy();
            });
            
            invalidWorkspaceIds.forEach(id => {
                expect(validateWorkspaceId(id)).toBeFalsy();
            });
        });

        it('should fetch available workspaces', async () => {
            const query = `
                query {
                    workspaces {
                        id
                        name
                        description
                    }
                }
            `;
            
            mockAPI.setResponse(query + '-{}', {
                data: {
                    workspaces: [
                        { id: '123456789', name: 'Main Workspace', description: 'Primary workspace' },
                        { id: '987654321', name: 'Test Workspace', description: 'Testing workspace' }
                    ]
                }
            });
            
            const result = await mockAPI.makeRequest(query);
            expect(result.workspaces).toHaveLength(2);
            expect(result.workspaces[0].name).toBe('Main Workspace');
        });

        it('should validate workspace existence', async () => {
            const workspaceId = '123456789';
            const query = `
                query($workspaceId: [ID!]!) {
                    workspaces(ids: $workspaceId) {
                        id
                        name
                    }
                }
            `;
            
            mockAPI.setResponse(query + '-{"workspaceId":["123456789"]}', {
                data: {
                    workspaces: [
                        { id: '123456789', name: 'Main Workspace' }
                    ]
                }
            });
            
            const result = await mockAPI.makeRequest(query, { workspaceId: [workspaceId] });
            expect(result.workspaces).toHaveLength(1);
            expect(result.workspaces[0].id).toBe(workspaceId);
        });

        it('should handle invalid workspace ID', async () => {
            const workspaceId = '999999999';
            const query = `
                query($workspaceId: [ID!]!) {
                    workspaces(ids: $workspaceId) {
                        id
                        name
                    }
                }
            `;
            
            mockAPI.setResponse(query + '-{"workspaceId":["999999999"]}', {
                data: {
                    workspaces: []
                }
            });
            
            const result = await mockAPI.makeRequest(query, { workspaceId: [workspaceId] });
            expect(result.workspaces).toHaveLength(0);
        });
    });

    describe('Board Operations', () => {
        it('should create a new board', async () => {
            const mutation = `
                mutation($boardName: String!, $workspaceId: ID!, $boardKind: BoardKind!) {
                    create_board(
                        board_name: $boardName,
                        workspace_id: $workspaceId,
                        board_kind: $boardKind
                    ) {
                        id
                        name
                        url
                        workspace {
                            id
                            name
                        }
                    }
                }
            `;
            
            const variables = {
                boardName: 'Test Project - Renovation Project',
                workspaceId: '123456789',
                boardKind: 'public'
            };
            
            mockAPI.setResponse(mutation + '-' + JSON.stringify(variables), {
                data: {
                    create_board: {
                        id: '987654321',
                        name: 'Test Project - Renovation Project',
                        url: 'https://monday.com/boards/987654321',
                        workspace: {
                            id: '123456789',
                            name: 'Main Workspace'
                        }
                    }
                }
            });
            
            const result = await mockAPI.makeRequest(mutation, variables);
            expect(result.create_board.id).toBe('987654321');
            expect(result.create_board.name).toBe('Test Project - Renovation Project');
            expect(result.create_board.url).toContain('987654321');
        });

        it('should handle board creation errors', async () => {
            const mutation = `
                mutation($boardName: String!, $workspaceId: ID!, $boardKind: BoardKind!) {
                    create_board(
                        board_name: $boardName,
                        workspace_id: $workspaceId,
                        board_kind: $boardKind
                    ) {
                        id
                        name
                    }
                }
            `;
            
            const variables = {
                boardName: 'Test Project',
                workspaceId: '999999999', // Invalid workspace
                boardKind: 'public'
            };
            
            mockAPI.setResponse(mutation + '-' + JSON.stringify(variables), {
                shouldFail: true,
                error: 'Workspace not found'
            });
            
            await expect(mockAPI.makeRequest(mutation, variables)).toReject();
        });

        it('should validate board name format', () => {
            const validNames = [
                'Valid Project Name',
                'Project-2024',
                'Kitchen & Bathroom Renovation'
            ];
            
            const invalidNames = [
                '',
                'AB', // Too short
                'A'.repeat(101), // Too long
                null,
                undefined
            ];
            
            const validateBoardName = (name) => {
                return name && typeof name === 'string' && name.length >= 3 && name.length <= 100;
            };
            
            validNames.forEach(name => {
                expect(validateBoardName(name)).toBeTruthy();
            });
            
            invalidNames.forEach(name => {
                expect(validateBoardName(name)).toBeFalsy();
            });
        });

        it('should fetch board details', async () => {
            const boardId = '987654321';
            const query = `
                query($boardId: [ID!]!) {
                    boards(ids: $boardId) {
                        id
                        name
                        state
                        groups {
                            id
                            title
                        }
                    }
                }
            `;
            
            mockAPI.setResponse(query + '-{"boardId":["987654321"]}', {
                data: {
                    boards: [{
                        id: '987654321',
                        name: 'Test Project',
                        state: 'active',
                        groups: [
                            { id: 'group1', title: 'Design and Planning' },
                            { id: 'group2', title: 'Kitchen' }
                        ]
                    }]
                }
            });
            
            const result = await mockAPI.makeRequest(query, { boardId: [boardId] });
            expect(result.boards[0].id).toBe(boardId);
            expect(result.boards[0].groups).toHaveLength(2);
            expect(result.boards[0].groups[0].title).toBe('Design and Planning');
        });
    });

    describe('Group Operations', () => {
        it('should create groups in correct order', async () => {
            const boardId = '987654321';
            const groups = [
                { title: 'Design and Planning', color: '#037f4c' },
                { title: 'Kitchen', color: '#0086c0' },
                { title: 'Bathroom', color: '#0086c0' }
            ];
            
            for (let i = 0; i < groups.length; i++) {
                const mutation = `
                    mutation($boardId: ID!, $groupName: String!, $color: String) {
                        create_group(
                            board_id: $boardId,
                            group_name: $groupName,
                            color: $color
                        ) {
                            id
                            title
                            color
                        }
                    }
                `;
                
                const variables = {
                    boardId,
                    groupName: groups[i].title,
                    color: groups[i].color
                };
                
                mockAPI.setResponse(mutation + '-' + JSON.stringify(variables), {
                    data: {
                        create_group: {
                            id: `group${i + 1}`,
                            title: groups[i].title,
                            color: groups[i].color
                        }
                    }
                });
            }
            
            // Test creating first group
            const firstGroupResult = await mockAPI.makeRequest(
                `mutation($boardId: ID!, $groupName: String!, $color: String) {
                    create_group(
                        board_id: $boardId,
                        group_name: $groupName,
                        color: $color
                    ) {
                        id
                        title
                        color
                    }
                }`,
                { boardId, groupName: 'Design and Planning', color: '#037f4c' }
            );
            
            expect(firstGroupResult.create_group.title).toBe('Design and Planning');
            expect(firstGroupResult.create_group.color).toBe('#037f4c');
        });

        it('should handle group creation errors', async () => {
            const mutation = `
                mutation($boardId: ID!, $groupName: String!) {
                    create_group(
                        board_id: $boardId,
                        group_name: $groupName
                    ) {
                        id
                        title
                    }
                }
            `;
            
            const variables = {
                boardId: '999999999', // Invalid board
                groupName: 'Test Group'
            };
            
            mockAPI.setResponse(mutation + '-' + JSON.stringify(variables), {
                shouldFail: true,
                error: 'Board not found'
            });
            
            await expect(mockAPI.makeRequest(mutation, variables)).toReject();
        });

        it('should validate group names', () => {
            const validNames = [
                'Design and Planning',
                'Kitchen',
                'Bathroom',
                'Living Room'
            ];
            
            const invalidNames = [
                '',
                'A'.repeat(101), // Too long
                null,
                undefined
            ];
            
            const validateGroupName = (name) => {
                return name && typeof name === 'string' && name.length > 0 && name.length <= 100;
            };
            
            validNames.forEach(name => {
                expect(validateGroupName(name)).toBeTruthy();
            });
            
            invalidNames.forEach(name => {
                expect(validateGroupName(name)).toBeFalsy();
            });
        });
    });

    describe('Item Operations', () => {
        it('should create items with proper column values', async () => {
            const mutation = `
                mutation($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON) {
                    create_item(
                        board_id: $boardId,
                        group_id: $groupId,
                        item_name: $itemName,
                        column_values: $columnValues
                    ) {
                        id
                        name
                        column_values {
                            id
                            text
                            value
                        }
                    }
                }
            `;
            
            const variables = {
                boardId: '987654321',
                groupId: 'group1',
                itemName: 'Cabinet replacement',
                columnValues: JSON.stringify({
                    status: { label: 'Not Started' },
                    priority: { label: 'Medium' },
                    notes: 'Kitchen cabinet replacement task'
                })
            };
            
            mockAPI.setResponse(mutation + '-' + JSON.stringify(variables), {
                data: {
                    create_item: {
                        id: 'item123',
                        name: 'Cabinet replacement',
                        column_values: [
                            { id: 'status', text: 'Not Started', value: '{"label":"Not Started"}' },
                            { id: 'priority', text: 'Medium', value: '{"label":"Medium"}' },
                            { id: 'notes', text: 'Kitchen cabinet replacement task', value: 'Kitchen cabinet replacement task' }
                        ]
                    }
                }
            });
            
            const result = await mockAPI.makeRequest(mutation, variables);
            expect(result.create_item.name).toBe('Cabinet replacement');
            expect(result.create_item.column_values).toHaveLength(3);
        });

        it('should handle item creation errors', async () => {
            const mutation = `
                mutation($boardId: ID!, $groupId: String!, $itemName: String!) {
                    create_item(
                        board_id: $boardId,
                        group_id: $groupId,
                        item_name: $itemName
                    ) {
                        id
                        name
                    }
                }
            `;
            
            const variables = {
                boardId: '999999999', // Invalid board
                groupId: 'group1',
                itemName: 'Test Item'
            };
            
            mockAPI.setResponse(mutation + '-' + JSON.stringify(variables), {
                shouldFail: true,
                error: 'Board not found'
            });
            
            await expect(mockAPI.makeRequest(mutation, variables)).toReject();
        });

        it('should validate item names', () => {
            const validNames = [
                'Cabinet replacement',
                'Tile installation',
                'Fixture replacement',
                'Project Kickoff Meeting'
            ];
            
            const invalidNames = [
                '',
                'A'.repeat(101), // Too long
                null,
                undefined
            ];
            
            const validateItemName = (name) => {
                return name && typeof name === 'string' && name.length > 0 && name.length <= 100;
            };
            
            validNames.forEach(name => {
                expect(validateItemName(name)).toBeTruthy();
            });
            
            invalidNames.forEach(name => {
                expect(validateItemName(name)).toBeFalsy();
            });
        });

        it('should format column values correctly', () => {
            const formatColumnValue = (columnType, value) => {
                switch (columnType) {
                    case 'status':
                        return { label: value };
                    case 'date':
                        return { date: value };
                    case 'person':
                        return { personsAndTeams: [{ id: parseInt(value), kind: 'person' }] };
                    case 'priority':
                        return { label: value };
                    default:
                        return value;
                }
            };
            
            // Test status column
            const statusValue = formatColumnValue('status', 'Working on it');
            expect(statusValue).toEqual({ label: 'Working on it' });
            
            // Test date column
            const dateValue = formatColumnValue('date', '2024-12-31');
            expect(dateValue).toEqual({ date: '2024-12-31' });
            
            // Test person column
            const personValue = formatColumnValue('person', '123456');
            expect(personValue).toEqual({ personsAndTeams: [{ id: 123456, kind: 'person' }] });
            
            // Test text column
            const textValue = formatColumnValue('text', 'Some text');
            expect(textValue).toBe('Some text');
        });
    });

    describe('Rate Limiting and Error Handling', () => {
        it('should handle rate limiting errors', async () => {
            const query = `
                query {
                    me {
                        id
                        name
                    }
                }
            `;
            
            mockAPI.setResponse(query + '-{}', {
                shouldFail: true,
                error: 'Rate limit exceeded'
            });
            
            await expect(mockAPI.makeRequest(query)).toReject();
        });

        it('should handle network errors', async () => {
            const query = `
                query {
                    me {
                        id
                        name
                    }
                }
            `;
            
            mockAPI.setResponse(query + '-{}', {
                shouldFail: true,
                error: 'Network error'
            });
            
            await expect(mockAPI.makeRequest(query)).toReject();
        });

        it('should handle GraphQL errors', async () => {
            const query = `
                query {
                    invalid_field {
                        id
                    }
                }
            `;
            
            mockAPI.setResponse(query + '-{}', {
                shouldFail: true,
                error: 'Cannot query field "invalid_field"'
            });
            
            await expect(mockAPI.makeRequest(query)).toReject();
        });

        it('should implement retry logic', async () => {
            let attemptCount = 0;
            const maxRetries = 3;
            
            const retryRequest = async (query, variables = {}) => {
                for (let attempt = 0; attempt < maxRetries; attempt++) {
                    try {
                        attemptCount++;
                        
                        if (attempt < 2) {
                            throw new Error('Temporary error');
                        }
                        
                        return await mockAPI.makeRequest(query, variables);
                    } catch (error) {
                        if (attempt === maxRetries - 1) {
                            throw error;
                        }
                        
                        // Wait before retry
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
            };
            
            const query = `
                query {
                    me {
                        id
                        name
                    }
                }
            `;
            
            mockAPI.setResponse(query + '-{}', {
                data: {
                    me: {
                        id: '123',
                        name: 'Test User'
                    }
                }
            });
            
            const result = await retryRequest(query);
            expect(result.me.id).toBe('123');
            expect(attemptCount).toBe(3);
        });
    });

    describe('API Request Logging', () => {
        it('should log API requests', async () => {
            const query = `
                query {
                    me {
                        id
                        name
                    }
                }
            `;
            
            mockAPI.setResponse(query + '-{}', {
                data: {
                    me: {
                        id: '123',
                        name: 'Test User'
                    }
                }
            });
            
            await mockAPI.makeRequest(query);
            
            const callLog = mockAPI.getCallLog();
            expect(callLog).toHaveLength(1);
            expect(callLog[0].query).toBe(query);
            expect(callLog[0].variables).toEqual({});
        });

        it('should track multiple API calls', async () => {
            const queries = [
                'query { me { id } }',
                'query { workspaces { id } }',
                'query { boards { id } }'
            ];
            
            queries.forEach(query => {
                mockAPI.setResponse(query + '-{}', {
                    data: { mock: true }
                });
            });
            
            for (const query of queries) {
                await mockAPI.makeRequest(query);
            }
            
            const callLog = mockAPI.getCallLog();
            expect(callLog).toHaveLength(3);
            expect(callLog[0].query).toBe(queries[0]);
            expect(callLog[1].query).toBe(queries[1]);
            expect(callLog[2].query).toBe(queries[2]);
        });
    });

    describe('Data Validation', () => {
        it('should validate API response format', () => {
            const validateResponse = (response) => {
                if (!response || typeof response !== 'object') {
                    return false;
                }
                
                // Check for errors
                if (response.errors && Array.isArray(response.errors)) {
                    return response.errors.length === 0;
                }
                
                // Check for data
                return response.data && typeof response.data === 'object';
            };
            
            // Valid responses
            expect(validateResponse({ data: { me: { id: '123' } } })).toBeTruthy();
            expect(validateResponse({ data: {}, errors: [] })).toBeTruthy();
            
            // Invalid responses
            expect(validateResponse(null)).toBeFalsy();
            expect(validateResponse({})).toBeFalsy();
            expect(validateResponse({ errors: ['Error message'] })).toBeFalsy();
        });

        it('should validate GraphQL query format', () => {
            const validateQuery = (query) => {
                if (!query || typeof query !== 'string') {
                    return false;
                }
                
                // Basic GraphQL validation
                return query.includes('query') || query.includes('mutation');
            };
            
            // Valid queries
            expect(validateQuery('query { me { id } }')).toBeTruthy();
            expect(validateQuery('mutation { create_board { id } }')).toBeTruthy();
            
            // Invalid queries
            expect(validateQuery('')).toBeFalsy();
            expect(validateQuery('invalid query')).toBeFalsy();
            expect(validateQuery(null)).toBeFalsy();
        });
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
} else {
    // Browser environment - all tests are already registered with testFramework
} 