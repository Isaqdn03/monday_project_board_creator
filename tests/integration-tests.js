// ============================================================================
// RENOVATION PROJECT MANAGER - INTEGRATION TESTS
// ============================================================================
// End-to-end integration tests for complete workflows and data flow
// ============================================================================

// Use the global test framework
const describe = testFramework.describe.bind(testFramework);
const it = testFramework.it.bind(testFramework);
const expect = testFramework.expect.bind(testFramework);
const beforeEach = testFramework.beforeEach.bind(testFramework);
const afterEach = testFramework.afterEach.bind(testFramework);

// Mock API and DOM setup
let mockAPI = new MockAPI();
let mockAppState = {};

describe('End-to-End Integration Tests', () => {
    beforeEach(() => {
        mockAPI = new MockAPI();
        mockAPI.clearCallLog();
        
        // Setup mock app state
        mockAppState = {
            currentStep: 'project-setup',
            apiToken: 'test-token-123',
            projectName: '',
            workspaceId: '',
            selectedAreas: [],
            selectedScopes: {},
            boardStructure: null,
            createdBoardId: null,
            createdBoardUrl: null
        };
        
        // Mock global functions
        global.makeApiRequest = mockAPI.makeRequest.bind(mockAPI);
        global.AppState = mockAppState;
        
        // Mock renovation data
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
                },
                validateScopeSelection: (scopes) => {
                    const hasScopes = Object.values(scopes).some(arr => arr.length > 0);
                    return { valid: hasScopes, message: hasScopes ? 'Valid' : 'No scopes selected' };
                }
            }
        };
    });

    afterEach(() => {
        mockAPI.clearCallLog();
        global.makeApiRequest = null;
        global.AppState = null;
        global.RenovationData = null;
    });

    describe('Complete Board Creation Workflow', () => {
        it('should complete full workflow from project setup to board creation', async () => {
            // Step 1: Project Setup
            mockAppState.projectName = 'Test Renovation Project';
            mockAppState.workspaceId = '123456789';
            
            // Validate project setup
            const projectValid = mockAppState.projectName.length >= 3 && 
                               mockAppState.workspaceId.length >= 8;
            expect(projectValid).toBeTruthy();
            
            // Step 2: Area Selection
            mockAppState.selectedAreas = ['Kitchen', 'Bathroom'];
            
            // Validate area selection
            const areaValid = mockAppState.selectedAreas.length > 0;
            expect(areaValid).toBeTruthy();
            
            // Step 3: Scope Selection
            mockAppState.selectedScopes = {
                'Kitchen': ['Cabinet replacement', 'Countertop installation'],
                'Bathroom': ['Tile installation', 'Fixture replacement']
            };
            
            // Validate scope selection
            const scopeValidation = global.RenovationData.DataHelper.validateScopeSelection(mockAppState.selectedScopes);
            expect(scopeValidation.valid).toBeTruthy();
            
            // Step 4: Generate Board Structure
            const boardStructure = global.RenovationData.DataHelper.generateBoardStructure(
                mockAppState.projectName,
                mockAppState.selectedScopes
            );
            
            expect(boardStructure.board_name).toBe('Test Renovation Project');
            expect(boardStructure.groups.length).toBe(3); // Design + Planning + 2 areas
            expect(boardStructure.items.length).toBe(9); // 5 planning + 4 scope items
            
            // Step 5: Create Board via API
            const createBoardMutation = `
                mutation($boardName: String!, $workspaceId: ID!, $boardKind: BoardKind!) {
                    create_board(
                        board_name: $boardName,
                        workspace_id: $workspaceId,
                        board_kind: $boardKind
                    ) {
                        id
                        name
                        url
                    }
                }
            `;
            
            const boardVariables = {
                boardName: boardStructure.board_name,
                workspaceId: mockAppState.workspaceId,
                boardKind: 'public'
            };
            
            mockAPI.setResponse(createBoardMutation + '-' + JSON.stringify(boardVariables), {
                data: {
                    create_board: {
                        id: '987654321',
                        name: 'Test Renovation Project',
                        url: 'https://monday.com/boards/987654321'
                    }
                }
            });
            
            const boardResult = await mockAPI.makeRequest(createBoardMutation, boardVariables);
            expect(boardResult.create_board.id).toBe('987654321');
            mockAppState.createdBoardId = boardResult.create_board.id;
            mockAppState.createdBoardUrl = boardResult.create_board.url;
            
            // Step 6: Create Groups
            const groupIds = {};
            for (const group of boardStructure.groups) {
                const createGroupMutation = `
                    mutation($boardId: ID!, $groupName: String!, $color: String) {
                        create_group(
                            board_id: $boardId,
                            group_name: $groupName,
                            color: $color
                        ) {
                            id
                            title
                        }
                    }
                `;
                
                const groupVariables = {
                    boardId: mockAppState.createdBoardId,
                    groupName: group.title,
                    color: group.color
                };
                
                mockAPI.setResponse(createGroupMutation + '-' + JSON.stringify(groupVariables), {
                    data: {
                        create_group: {
                            id: `group-${group.title.replace(/\s+/g, '-').toLowerCase()}`,
                            title: group.title
                        }
                    }
                });
                
                const groupResult = await mockAPI.makeRequest(createGroupMutation, groupVariables);
                groupIds[group.title] = groupResult.create_group.id;
            }
            
            expect(Object.keys(groupIds).length).toBe(3);
            expect(groupIds['Design and Planning']).toBeDefined();
            expect(groupIds['Kitchen']).toBeDefined();
            expect(groupIds['Bathroom']).toBeDefined();
            
            // Step 7: Create Items
            let itemCount = 0;
            for (const item of boardStructure.items) {
                const createItemMutation = `
                    mutation($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON) {
                        create_item(
                            board_id: $boardId,
                            group_id: $groupId,
                            item_name: $itemName,
                            column_values: $columnValues
                        ) {
                            id
                            name
                        }
                    }
                `;
                
                const itemVariables = {
                    boardId: mockAppState.createdBoardId,
                    groupId: groupIds[item.group],
                    itemName: item.name,
                    columnValues: JSON.stringify(item.column_values)
                };
                
                mockAPI.setResponse(createItemMutation + '-' + JSON.stringify(itemVariables), {
                    data: {
                        create_item: {
                            id: `item-${itemCount++}`,
                            name: item.name
                        }
                    }
                });
                
                const itemResult = await mockAPI.makeRequest(createItemMutation, itemVariables);
                expect(itemResult.create_item.name).toBe(item.name);
            }
            
            // Verify complete workflow
            const apiCalls = mockAPI.getCallLog();
            expect(apiCalls.length).toBe(13); // 1 board + 3 groups + 9 items
            
            // Verify final state
            expect(mockAppState.createdBoardId).toBe('987654321');
            expect(mockAppState.createdBoardUrl).toContain('987654321');
        });

        it('should handle workflow with single area selection', async () => {
            // Setup single area workflow
            mockAppState.projectName = 'Kitchen Only Project';
            mockAppState.workspaceId = '123456789';
            mockAppState.selectedAreas = ['Kitchen'];
            mockAppState.selectedScopes = {
                'Kitchen': ['Cabinet replacement', 'Countertop installation', 'Appliance upgrades']
            };
            
            // Process and validate
            const processedData = global.RenovationData.DataHelper.processUserSelections(
                mockAppState.selectedAreas,
                mockAppState.selectedScopes,
                mockAppState.projectName,
                mockAppState.workspaceId
            );
            
            expect(processedData.selectedAreas.length).toBe(1);
            expect(processedData.metadata.totalAreas).toBe(1);
            expect(processedData.metadata.totalScopes).toBe(3);
            
            // Generate board structure
            const boardStructure = global.RenovationData.DataHelper.generateBoardStructure(
                mockAppState.projectName,
                mockAppState.selectedScopes
            );
            
            expect(boardStructure.groups.length).toBe(2); // Design + Planning + Kitchen
            expect(boardStructure.items.length).toBe(8); // 5 planning + 3 kitchen items
            
            // Verify group structure
            const groupTitles = boardStructure.groups.map(g => g.title);
            expect(groupTitles).toContain('Design and Planning');
            expect(groupTitles).toContain('Kitchen');
            expect(groupTitles).not.toContain('Bathroom');
        });

        it('should handle workflow with maximum area selection', async () => {
            // Setup maximum area workflow
            const allAreas = Object.keys(global.RenovationData.RENOVATION_AREAS);
            mockAppState.projectName = 'Complete Renovation Project';
            mockAppState.workspaceId = '123456789';
            mockAppState.selectedAreas = allAreas;
            
            // Select all scopes for all areas
            mockAppState.selectedScopes = {};
            allAreas.forEach(area => {
                mockAppState.selectedScopes[area] = global.RenovationData.RENOVATION_AREAS[area];
            });
            
            // Process and validate
            const processedData = global.RenovationData.DataHelper.processUserSelections(
                mockAppState.selectedAreas,
                mockAppState.selectedScopes,
                mockAppState.projectName,
                mockAppState.workspaceId
            );
            
            expect(processedData.selectedAreas.length).toBe(allAreas.length);
            expect(processedData.metadata.totalAreas).toBe(allAreas.length);
            
            // Generate board structure
            const boardStructure = global.RenovationData.DataHelper.generateBoardStructure(
                mockAppState.projectName,
                mockAppState.selectedScopes
            );
            
            expect(boardStructure.groups.length).toBe(allAreas.length + 1); // All areas + Design & Planning
            
            // Verify all areas are represented
            const groupTitles = boardStructure.groups.map(g => g.title);
            expect(groupTitles).toContain('Design and Planning');
            allAreas.forEach(area => {
                expect(groupTitles).toContain(area);
            });
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle API errors gracefully during board creation', async () => {
            // Setup valid state
            mockAppState.projectName = 'Test Project';
            mockAppState.workspaceId = '123456789';
            mockAppState.selectedAreas = ['Kitchen'];
            mockAppState.selectedScopes = {
                'Kitchen': ['Cabinet replacement']
            };
            
            // Mock API error
            const createBoardMutation = `
                mutation($boardName: String!, $workspaceId: ID!, $boardKind: BoardKind!) {
                    create_board(
                        board_name: $boardName,
                        workspace_id: $workspaceId,
                        board_kind: $boardKind
                    ) {
                        id
                        name
                        url
                    }
                }
            `;
            
            const boardVariables = {
                boardName: 'Test Project',
                workspaceId: '123456789',
                boardKind: 'public'
            };
            
            mockAPI.setResponse(createBoardMutation + '-' + JSON.stringify(boardVariables), {
                shouldFail: true,
                error: 'Workspace not found'
            });
            
            // Test error handling
            try {
                await mockAPI.makeRequest(createBoardMutation, boardVariables);
                expect(false).toBeTruthy(); // Should not reach here
            } catch (error) {
                expect(error.message).toBe('Workspace not found');
            }
        });

        it('should handle partial failures during item creation', async () => {
            // Setup board creation success
            mockAppState.createdBoardId = '987654321';
            
            const items = [
                { name: 'Item 1', group: 'Kitchen' },
                { name: 'Item 2', group: 'Kitchen' },
                { name: 'Item 3', group: 'Kitchen' }
            ];
            
            const groupIds = { 'Kitchen': 'group-kitchen' };
            
            // Mock first item success, second item failure, third item success
            items.forEach((item, index) => {
                const createItemMutation = `
                    mutation($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON) {
                        create_item(
                            board_id: $boardId,
                            group_id: $groupId,
                            item_name: $itemName,
                            column_values: $columnValues
                        ) {
                            id
                            name
                        }
                    }
                `;
                
                const itemVariables = {
                    boardId: mockAppState.createdBoardId,
                    groupId: groupIds[item.group],
                    itemName: item.name,
                    columnValues: JSON.stringify({})
                };
                
                if (index === 1) {
                    // Second item fails
                    mockAPI.setResponse(createItemMutation + '-' + JSON.stringify(itemVariables), {
                        shouldFail: true,
                        error: 'Item creation failed'
                    });
                } else {
                    // Other items succeed
                    mockAPI.setResponse(createItemMutation + '-' + JSON.stringify(itemVariables), {
                        data: {
                            create_item: {
                                id: `item-${index}`,
                                name: item.name
                            }
                        }
                    });
                }
            });
            
            // Test partial failure handling
            let successCount = 0;
            let errorCount = 0;
            
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const createItemMutation = `
                    mutation($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON) {
                        create_item(
                            board_id: $boardId,
                            group_id: $groupId,
                            item_name: $itemName,
                            column_values: $columnValues
                        ) {
                            id
                            name
                        }
                    }
                `;
                
                const itemVariables = {
                    boardId: mockAppState.createdBoardId,
                    groupId: groupIds[item.group],
                    itemName: item.name,
                    columnValues: JSON.stringify({})
                };
                
                try {
                    await mockAPI.makeRequest(createItemMutation, itemVariables);
                    successCount++;
                } catch (error) {
                    errorCount++;
                }
            }
            
            expect(successCount).toBe(2);
            expect(errorCount).toBe(1);
        });
    });

    describe('Data Validation Integration', () => {
        it('should validate complete data flow', async () => {
            // Test invalid project name
            const invalidProjectData = {
                projectName: 'AB', // Too short
                workspaceId: '123456789',
                selectedAreas: ['Kitchen'],
                selectedScopes: { 'Kitchen': ['Cabinet replacement'] }
            };
            
            try {
                global.RenovationData.DataHelper.processUserSelections(
                    invalidProjectData.selectedAreas,
                    invalidProjectData.selectedScopes,
                    invalidProjectData.projectName,
                    invalidProjectData.workspaceId
                );
                expect(false).toBeTruthy(); // Should not reach here
            } catch (error) {
                expect(error.message).toContain('at least 3 characters');
            }
            
            // Test invalid workspace ID
            const invalidWorkspaceData = {
                projectName: 'Valid Project',
                workspaceId: '123', // Too short
                selectedAreas: ['Kitchen'],
                selectedScopes: { 'Kitchen': ['Cabinet replacement'] }
            };
            
            try {
                global.RenovationData.DataHelper.processUserSelections(
                    invalidWorkspaceData.selectedAreas,
                    invalidWorkspaceData.selectedScopes,
                    invalidWorkspaceData.projectName,
                    invalidWorkspaceData.workspaceId
                );
                expect(false).toBeTruthy(); // Should not reach here
            } catch (error) {
                expect(error.message).toContain('8-12 digits');
            }
            
            // Test missing scopes
            const missingScopesData = {
                projectName: 'Valid Project',
                workspaceId: '123456789',
                selectedAreas: ['Kitchen', 'Bathroom'],
                selectedScopes: { 'Kitchen': ['Cabinet replacement'] } // Missing Bathroom scopes
            };
            
            try {
                global.RenovationData.DataHelper.processUserSelections(
                    missingScopesData.selectedAreas,
                    missingScopesData.selectedScopes,
                    missingScopesData.projectName,
                    missingScopesData.workspaceId
                );
                expect(false).toBeTruthy(); // Should not reach here
            } catch (error) {
                expect(error.message).toContain('Missing scopes');
            }
        });

        it('should validate board structure integrity', async () => {
            const validData = {
                projectName: 'Valid Project',
                workspaceId: '123456789',
                selectedAreas: ['Kitchen'],
                selectedScopes: { 'Kitchen': ['Cabinet replacement'] }
            };
            
            // Process valid data
            const processedData = global.RenovationData.DataHelper.processUserSelections(
                validData.selectedAreas,
                validData.selectedScopes,
                validData.projectName,
                validData.workspaceId
            );
            
            // Generate board structure
            const boardStructure = global.RenovationData.DataHelper.generateBoardStructure(
                processedData.projectName,
                processedData.selectedScopes
            );
            
            // Validate structure integrity
            expect(boardStructure.board_name).toBe(validData.projectName);
            expect(boardStructure.groups.length).toBeGreaterThan(0);
            expect(boardStructure.items.length).toBeGreaterThan(0);
            
            // Verify Design and Planning group exists
            const designPlanningGroup = boardStructure.groups.find(g => g.title === 'Design and Planning');
            expect(designPlanningGroup).toBeDefined();
            expect(designPlanningGroup.color).toBe('#037f4c');
            
            // Verify planning items exist
            const planningItems = boardStructure.items.filter(item => item.group === 'Design and Planning');
            expect(planningItems.length).toBe(5); // Standard planning tasks
            
            // Verify area-specific items exist
            const kitchenItems = boardStructure.items.filter(item => item.group === 'Kitchen');
            expect(kitchenItems.length).toBe(1); // One scope selected
            expect(kitchenItems[0].name).toBe('Cabinet replacement');
        });
    });

    describe('Performance Integration', () => {
        it('should handle large project efficiently', async () => {
            const startTime = Date.now();
            
            // Create large project with all areas and scopes
            const allAreas = Object.keys(global.RenovationData.RENOVATION_AREAS);
            const allScopes = {};
            allAreas.forEach(area => {
                allScopes[area] = global.RenovationData.RENOVATION_AREAS[area];
            });
            
            mockAppState.projectName = 'Large Renovation Project';
            mockAppState.workspaceId = '123456789';
            mockAppState.selectedAreas = allAreas;
            mockAppState.selectedScopes = allScopes;
            
            // Process data
            const processedData = global.RenovationData.DataHelper.processUserSelections(
                mockAppState.selectedAreas,
                mockAppState.selectedScopes,
                mockAppState.projectName,
                mockAppState.workspaceId
            );
            
            // Generate board structure
            const boardStructure = global.RenovationData.DataHelper.generateBoardStructure(
                mockAppState.projectName,
                mockAppState.selectedScopes
            );
            
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            
            // Verify performance (should be under 100ms for data processing)
            expect(processingTime).toBeLessThan(100);
            
            // Verify completeness
            expect(boardStructure.groups.length).toBe(allAreas.length + 1);
            expect(boardStructure.items.length).toBeGreaterThan(5); // At least planning tasks
        });

        it('should validate API call batching efficiency', async () => {
            // Setup for multiple API calls
            const itemCount = 20;
            const items = Array.from({ length: itemCount }, (_, i) => ({
                name: `Item ${i + 1}`,
                group: 'Kitchen'
            }));
            
            // Mock all API calls
            items.forEach((item, index) => {
                const createItemMutation = `
                    mutation($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON) {
                        create_item(
                            board_id: $boardId,
                            group_id: $groupId,
                            item_name: $itemName,
                            column_values: $columnValues
                        ) {
                            id
                            name
                        }
                    }
                `;
                
                const itemVariables = {
                    boardId: '987654321',
                    groupId: 'group-kitchen',
                    itemName: item.name,
                    columnValues: JSON.stringify({})
                };
                
                mockAPI.setResponse(createItemMutation + '-' + JSON.stringify(itemVariables), {
                    data: {
                        create_item: {
                            id: `item-${index}`,
                            name: item.name
                        }
                    }
                });
            });
            
            // Simulate batched API calls
            const startTime = Date.now();
            const batchSize = 5;
            
            for (let i = 0; i < items.length; i += batchSize) {
                const batch = items.slice(i, i + batchSize);
                
                // Process batch sequentially (to simulate rate limiting)
                for (const item of batch) {
                    const createItemMutation = `
                        mutation($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON) {
                            create_item(
                                board_id: $boardId,
                                group_id: $groupId,
                                item_name: $itemName,
                                column_values: $columnValues
                            ) {
                                id
                                name
                            }
                        }
                    `;
                    
                    const itemVariables = {
                        boardId: '987654321',
                        groupId: 'group-kitchen',
                        itemName: item.name,
                        columnValues: JSON.stringify({})
                    };
                    
                    await mockAPI.makeRequest(createItemMutation, itemVariables);
                }
                
                // Brief pause between batches
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            
            // Verify all calls were made
            const apiCalls = mockAPI.getCallLog();
            expect(apiCalls.length).toBe(itemCount);
            
            // Verify reasonable processing time
            expect(totalTime).toBeLessThan(1000); // Under 1 second
        });
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
} else {
    // Browser environment - all tests are already registered with testFramework
} 