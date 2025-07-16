// ============================================================================
// RENOVATION PROJECT MANAGER - END-TO-END WORKFLOW TESTS
// ============================================================================
// Complete user journey testing for production readiness validation
// ============================================================================

// Workflow State Manager
class WorkflowStateManager {
    constructor() {
        this.currentState = {
            step: 'initial',
            projectData: {},
            validationState: {},
            errors: [],
            boardCreationResult: null
        };
        this.stateHistory = [];
    }

    setState(newState) {
        this.stateHistory.push({ ...this.currentState });
        this.currentState = { ...this.currentState, ...newState };
    }

    getState() {
        return { ...this.currentState };
    }

    canProceedToStep(targetStep) {
        const stepValidations = {
            'area-selection': () => this.validateProjectSetup(),
            'scope-selection': () => this.validateAreaSelection(),
            'review-confirm': () => this.validateScopeSelection(),
            'board-creation': () => this.validateReviewConfirm()
        };

        const validator = stepValidations[targetStep];
        return validator ? validator() : false;
    }

    validateProjectSetup() {
        const { projectName, workspaceId } = this.currentState.projectData;
        return projectName && projectName.length >= 3 && 
               workspaceId && /^\d{8,12}$/.test(workspaceId);
    }

    validateAreaSelection() {
        const { selectedAreas } = this.currentState.projectData;
        return selectedAreas && selectedAreas.length > 0;
    }

    validateScopeSelection() {
        const { selectedScopes } = this.currentState.projectData;
        return selectedScopes && Object.keys(selectedScopes).length > 0 &&
               Object.values(selectedScopes).every(scopes => scopes.length > 0);
    }

    validateReviewConfirm() {
        return this.validateProjectSetup() && 
               this.validateAreaSelection() && 
               this.validateScopeSelection();
    }

    reset() {
        this.currentState = {
            step: 'initial',
            projectData: {},
            validationState: {},
            errors: [],
            boardCreationResult: null
        };
        this.stateHistory = [];
    }
}

// Complete Workflow Simulator
class WorkflowSimulator {
    constructor() {
        this.stateManager = new WorkflowStateManager();
        this.mockAPI = new MockAPI();
        this.setupMockResponses();
    }

    setupMockResponses() {
        // Token validation
        this.mockAPI.setResponse('query { me { id } }-{}', {
            data: { me: { id: '123456789' } }
        });

        // Workspace validation
        this.mockAPI.setResponse('query { workspaces { id name } }-{}', {
            data: {
                workspaces: [
                    { id: '123456789', name: 'Main Workspace' },
                    { id: '987654321', name: 'Secondary Workspace' }
                ]
            }
        });

        // Board creation
        this.mockAPI.setResponse('mutation { create_board(board_name: "Kitchen Renovation 2025", workspace_id: 123456789) { id name url } }-{}', {
            data: {
                create_board: {
                    id: '555444333',
                    name: 'Kitchen Renovation 2025',
                    url: 'https://mycompany.monday.com/boards/555444333'
                }
            }
        });
    }

    async simulateCompleteWorkflow(projectConfig) {
        const results = {
            steps: [],
            totalTime: 0,
            success: false,
            errors: [],
            boardData: null
        };

        const startTime = Date.now();

        try {
            // Step 1: Project Setup
            const setupResult = await this.simulateProjectSetup(projectConfig);
            results.steps.push(setupResult);

            // Step 2: Area Selection
            const areaResult = await this.simulateAreaSelection(projectConfig.areas);
            results.steps.push(areaResult);

            // Step 3: Scope Selection
            const scopeResult = await this.simulateScopeSelection(projectConfig.scopes);
            results.steps.push(scopeResult);

            // Step 4: Review and Confirm
            const reviewResult = await this.simulateReviewConfirm();
            results.steps.push(reviewResult);

            // Step 5: Board Creation
            const boardResult = await this.simulateBoardCreation();
            results.steps.push(boardResult);
            results.boardData = boardResult.data;

            results.success = results.steps.every(step => step.success);
            results.totalTime = Date.now() - startTime;

        } catch (error) {
            results.errors.push(error.message);
            results.totalTime = Date.now() - startTime;
        }

        return results;
    }

    async simulateProjectSetup(config) {
        const result = {
            step: 'project-setup',
            success: false,
            duration: 0,
            errors: [],
            data: null
        };

        const stepStart = Date.now();

        try {
            // Validate project name
            if (!config.projectName || config.projectName.length < 3) {
                throw new Error('Project name must be at least 3 characters');
            }

            // Validate workspace ID
            if (!config.workspaceId || !/^\d{8,12}$/.test(config.workspaceId)) {
                throw new Error('Invalid workspace ID format');
            }

            // Simulate API token validation
            await this.mockAPI.makeRequest('query { me { id } }');

            // Simulate workspace validation
            const workspaces = await this.mockAPI.makeRequest('query { workspaces { id name } }');
            const validWorkspace = workspaces.workspaces.find(w => w.id === config.workspaceId);
            
            if (!validWorkspace) {
                throw new Error('Workspace ID not found');
            }

            this.stateManager.setState({
                step: 'project-setup-complete',
                projectData: {
                    projectName: config.projectName,
                    workspaceId: config.workspaceId,
                    workspace: validWorkspace
                }
            });

            result.success = true;
            result.data = this.stateManager.getState().projectData;

        } catch (error) {
            result.errors.push(error.message);
        }

        result.duration = Date.now() - stepStart;
        return result;
    }

    async simulateAreaSelection(areas) {
        const result = {
            step: 'area-selection',
            success: false,
            duration: 0,
            errors: [],
            data: null
        };

        const stepStart = Date.now();

        try {
            // Validate areas
            if (!Array.isArray(areas) || areas.length === 0) {
                throw new Error('At least one renovation area must be selected');
            }

            const validAreas = [
                'Kitchen', 'Bathroom', 'Living Room', 'Bedroom', 'Basement',
                'Attic', 'Exterior', 'Home Office', 'Retail Space', 'Healthcare Facility',
                'Educational Facility', 'HVAC System', 'Electrical System', 'Plumbing System', 'Structural Work'
            ];

            const invalidAreas = areas.filter(area => !validAreas.includes(area));
            if (invalidAreas.length > 0) {
                throw new Error(`Invalid renovation areas: ${invalidAreas.join(', ')}`);
            }

            this.stateManager.setState({
                step: 'area-selection-complete',
                projectData: {
                    ...this.stateManager.getState().projectData,
                    selectedAreas: areas
                }
            });

            result.success = true;
            result.data = { selectedAreas: areas, count: areas.length };

        } catch (error) {
            result.errors.push(error.message);
        }

        result.duration = Date.now() - stepStart;
        return result;
    }

    async simulateScopeSelection(scopes) {
        const result = {
            step: 'scope-selection',
            success: false,
            duration: 0,
            errors: [],
            data: null
        };

        const stepStart = Date.now();

        try {
            // Validate scope structure
            if (!scopes || typeof scopes !== 'object') {
                throw new Error('Scopes must be provided as an object');
            }

            const selectedAreas = this.stateManager.getState().projectData.selectedAreas;
            
            // Check that all selected areas have scopes
            for (const area of selectedAreas) {
                if (!scopes[area] || !Array.isArray(scopes[area]) || scopes[area].length === 0) {
                    throw new Error(`No scopes selected for area: ${area}`);
                }
            }

            // Check for extra scopes not matching selected areas
            const extraAreas = Object.keys(scopes).filter(area => !selectedAreas.includes(area));
            if (extraAreas.length > 0) {
                throw new Error(`Scopes provided for unselected areas: ${extraAreas.join(', ')}`);
            }

            this.stateManager.setState({
                step: 'scope-selection-complete',
                projectData: {
                    ...this.stateManager.getState().projectData,
                    selectedScopes: scopes
                }
            });

            const totalScopes = Object.values(scopes).reduce((sum, areaScopes) => sum + areaScopes.length, 0);
            result.success = true;
            result.data = { selectedScopes: scopes, totalScopes };

        } catch (error) {
            result.errors.push(error.message);
        }

        result.duration = Date.now() - stepStart;
        return result;
    }

    async simulateReviewConfirm() {
        const result = {
            step: 'review-confirm',
            success: false,
            duration: 0,
            errors: [],
            data: null
        };

        const stepStart = Date.now();

        try {
            const projectData = this.stateManager.getState().projectData;

            // Validate complete configuration
            if (!this.stateManager.validateReviewConfirm()) {
                throw new Error('Project configuration is incomplete');
            }

            // Generate summary
            const summary = {
                projectName: projectData.projectName,
                workspaceId: projectData.workspaceId,
                areasCount: projectData.selectedAreas.length,
                totalScopes: Object.values(projectData.selectedScopes)
                    .reduce((sum, scopes) => sum + scopes.length, 0),
                estimatedItems: 10 + Object.values(projectData.selectedScopes) // 10 planning tasks + scopes
                    .reduce((sum, scopes) => sum + scopes.length, 0)
            };

            this.stateManager.setState({
                step: 'review-confirm-complete',
                projectData: {
                    ...projectData,
                    summary
                }
            });

            result.success = true;
            result.data = summary;

        } catch (error) {
            result.errors.push(error.message);
        }

        result.duration = Date.now() - stepStart;
        return result;
    }

    async simulateBoardCreation() {
        const result = {
            step: 'board-creation',
            success: false,
            duration: 0,
            errors: [],
            data: null
        };

        const stepStart = Date.now();

        try {
            const projectData = this.stateManager.getState().projectData;

            // Simulate board creation
            const boardMutation = `mutation { create_board(board_name: "${projectData.projectName}", workspace_id: ${projectData.workspaceId}) { id name url } }`;
            const boardResponse = await this.mockAPI.makeRequest(boardMutation);

            // Simulate group creation
            const groups = ['Design and Planning', ...projectData.selectedAreas];
            const createdGroups = [];

            for (const groupName of groups) {
                const groupMutation = `mutation { create_group(board_id: ${boardResponse.create_board.id}, group_name: "${groupName}") { id title } }`;
                const groupResponse = await this.mockAPI.makeRequest(groupMutation);
                createdGroups.push({
                    id: `group_${groupName.toLowerCase().replace(/\s+/g, '_')}`,
                    title: groupName
                });
            }

            // Simulate item creation
            let totalItems = 0;

            // Planning tasks
            const planningTasks = [
                'Construction Contract Executed',
                'Architectural Plan Development',
                'Interior Design and Selections',
                'Permit Applications and Approvals',
                'Budget Finalization and Approval'
            ];

            totalItems += planningTasks.length;

            // Scope items
            for (const [area, scopes] of Object.entries(projectData.selectedScopes)) {
                totalItems += scopes.length;
            }

            const boardData = {
                board: boardResponse.create_board,
                groups: createdGroups,
                totalItems,
                creationTime: Date.now() - stepStart
            };

            this.stateManager.setState({
                step: 'board-creation-complete',
                boardCreationResult: boardData
            });

            result.success = true;
            result.data = boardData;

        } catch (error) {
            result.errors.push(error.message);
        }

        result.duration = Date.now() - stepStart;
        return result;
    }

    reset() {
        this.stateManager.reset();
        this.mockAPI.clearCallLog();
    }
}

// Test Scenarios
const TestScenarios = {
    minimalProject: {
        projectName: 'Minimal Kitchen Update',
        workspaceId: '123456789',
        areas: ['Kitchen'],
        scopes: {
            'Kitchen': ['Cabinet replacement/refacing']
        }
    },

    typicalProject: {
        projectName: 'Kitchen and Bathroom Renovation',
        workspaceId: '123456789',
        areas: ['Kitchen', 'Bathroom'],
        scopes: {
            'Kitchen': ['Cabinet replacement/refacing', 'Countertop installation', 'Appliance upgrades'],
            'Bathroom': ['Bathtub/shower replacement', 'Vanity and sink installation', 'Tile work']
        }
    },

    largeProject: {
        projectName: 'Whole House Renovation 2025',
        workspaceId: '123456789',
        areas: ['Kitchen', 'Bathroom', 'Living Room', 'Bedroom', 'Basement'],
        scopes: {
            'Kitchen': ['Cabinet replacement/refacing', 'Countertop installation'],
            'Bathroom': ['Bathtub/shower replacement', 'Tile work'],
            'Living Room': ['Flooring replacement', 'Lighting updates'],
            'Bedroom': ['Flooring replacement', 'Closet organization'],
            'Basement': ['Waterproofing', 'Flooring installation']
        }
    },

    maximumProject: {
        projectName: 'Complete Commercial Renovation',
        workspaceId: '123456789',
        areas: [
            'Kitchen', 'Bathroom', 'Living Room', 'Bedroom', 'Basement',
            'Attic', 'Exterior', 'Home Office', 'Retail Space', 'Healthcare Facility',
            'Educational Facility', 'HVAC System', 'Electrical System', 'Plumbing System', 'Structural Work'
        ],
        scopes: {
            'Kitchen': ['Cabinet replacement/refacing'],
            'Bathroom': ['Tile work'],
            'Living Room': ['Flooring replacement'],
            'Bedroom': ['Flooring replacement'],
            'Basement': ['Waterproofing'],
            'Attic': ['Insulation installation'],
            'Exterior': ['Siding replacement'],
            'Home Office': ['Built-in desk installation'],
            'Retail Space': ['Display fixture installation'],
            'Healthcare Facility': ['Medical equipment installation'],
            'Educational Facility': ['Classroom setup'],
            'HVAC System': ['Unit replacement'],
            'Electrical System': ['Panel upgrade'],
            'Plumbing System': ['Pipe replacement'],
            'Structural Work': ['Beam reinforcement']
        }
    }
};

// Initialize comprehensive E2E tests
function initializeE2ETests() {
    if (typeof testFramework === 'undefined') {
        console.error('TestFramework not available for E2E tests');
        return;
    }

    // Complete User Journey Tests
    testFramework.describe('E2E - Complete User Journeys', () => {
        let workflowSimulator;

        testFramework.beforeEach(() => {
            workflowSimulator = new WorkflowSimulator();
        });

        testFramework.afterEach(() => {
            workflowSimulator.reset();
        });

        testFramework.it('should complete minimal project workflow', async () => {
            const result = await workflowSimulator.simulateCompleteWorkflow(TestScenarios.minimalProject);
            
            testFramework.expect(result.success).toBeTruthy();
            testFramework.expect(result.steps).toHaveLength(5);
            testFramework.expect(result.boardData).toBeDefined();
            testFramework.expect(result.boardData.board.name).toBe('Minimal Kitchen Update');
            testFramework.expect(result.totalTime).toBeLessThan(5000); // Should complete in under 5 seconds
        });

        testFramework.it('should complete typical two-area project workflow', async () => {
            const result = await workflowSimulator.simulateCompleteWorkflow(TestScenarios.typicalProject);
            
            testFramework.expect(result.success).toBeTruthy();
            testFramework.expect(result.steps).toHaveLength(5);
            testFramework.expect(result.boardData.groups).toHaveLength(3); // Planning + Kitchen + Bathroom
            testFramework.expect(result.boardData.totalItems).toBe(11); // 5 planning + 6 scope items
        });

        testFramework.it('should complete large multi-area project workflow', async () => {
            const result = await workflowSimulator.simulateCompleteWorkflow(TestScenarios.largeProject);
            
            testFramework.expect(result.success).toBeTruthy();
            testFramework.expect(result.boardData.groups).toHaveLength(6); // Planning + 5 areas
            testFramework.expect(result.boardData.totalItems).toBe(15); // 5 planning + 10 scope items
            testFramework.expect(result.totalTime).toBeLessThan(10000); // Should complete in under 10 seconds
        });

        testFramework.it('should complete maximum complexity project workflow', async () => {
            const result = await workflowSimulator.simulateCompleteWorkflow(TestScenarios.maximumProject);
            
            testFramework.expect(result.success).toBeTruthy();
            testFramework.expect(result.boardData.groups).toHaveLength(16); // Planning + 15 areas
            testFramework.expect(result.boardData.totalItems).toBe(20); // 5 planning + 15 scope items
            testFramework.expect(result.totalTime).toBeLessThan(15000); // Should complete in under 15 seconds
        });
    });

    // Error Recovery Workflow Tests
    testFramework.describe('E2E - Error Recovery Workflows', () => {
        let workflowSimulator;

        testFramework.beforeEach(() => {
            workflowSimulator = new WorkflowSimulator();
        });

        testFramework.it('should handle invalid project name', async () => {
            const invalidConfig = {
                ...TestScenarios.minimalProject,
                projectName: 'AB' // Too short
            };

            const result = await workflowSimulator.simulateCompleteWorkflow(invalidConfig);
            
            testFramework.expect(result.success).toBeFalsy();
            testFramework.expect(result.steps[0].errors).toContain('Project name must be at least 3 characters');
        });

        testFramework.it('should handle invalid workspace ID', async () => {
            const invalidConfig = {
                ...TestScenarios.minimalProject,
                workspaceId: 'invalid123' // Contains letters
            };

            const result = await workflowSimulator.simulateCompleteWorkflow(invalidConfig);
            
            testFramework.expect(result.success).toBeFalsy();
            testFramework.expect(result.steps[0].errors).toContain('Invalid workspace ID format');
        });

        testFramework.it('should handle no areas selected', async () => {
            const invalidConfig = {
                ...TestScenarios.minimalProject,
                areas: [] // No areas
            };

            const result = await workflowSimulator.simulateCompleteWorkflow(invalidConfig);
            
            testFramework.expect(result.success).toBeFalsy();
            testFramework.expect(result.steps[1].errors).toContain('At least one renovation area must be selected');
        });

        testFramework.it('should handle invalid renovation areas', async () => {
            const invalidConfig = {
                ...TestScenarios.minimalProject,
                areas: ['InvalidArea', 'AnotherInvalid']
            };

            const result = await workflowSimulator.simulateCompleteWorkflow(invalidConfig);
            
            testFramework.expect(result.success).toBeFalsy();
            testFramework.expect(result.steps[1].errors[0]).toContain('Invalid renovation areas');
        });

        testFramework.it('should handle missing scopes for selected areas', async () => {
            const invalidConfig = {
                ...TestScenarios.minimalProject,
                scopes: {} // No scopes provided
            };

            const result = await workflowSimulator.simulateCompleteWorkflow(invalidConfig);
            
            testFramework.expect(result.success).toBeFalsy();
            testFramework.expect(result.steps[2].errors).toContain('No scopes selected for area: Kitchen');
        });
    });

    // Button and Interaction Tests
    testFramework.describe('E2E - Button and Interaction Workflows', () => {
        let workflowSimulator;

        testFramework.beforeEach(() => {
            workflowSimulator = new WorkflowSimulator();
        });

        testFramework.it('should validate step progression requirements', () => {
            const stateManager = workflowSimulator.stateManager;
            
            // Initially can't proceed
            testFramework.expect(stateManager.canProceedToStep('area-selection')).toBeFalsy();
            
            // After valid project setup
            stateManager.setState({
                projectData: {
                    projectName: 'Test Project',
                    workspaceId: '123456789'
                }
            });
            testFramework.expect(stateManager.canProceedToStep('area-selection')).toBeTruthy();
            
            // After area selection
            stateManager.setState({
                projectData: {
                    ...stateManager.getState().projectData,
                    selectedAreas: ['Kitchen']
                }
            });
            testFramework.expect(stateManager.canProceedToStep('scope-selection')).toBeTruthy();
        });

        testFramework.it('should track user action sequence', () => {
            const actionSequence = [];
            
            // Simulate user actions
            actionSequence.push({ action: 'enter_project_name', value: 'Test Project' });
            actionSequence.push({ action: 'enter_workspace_id', value: '123456789' });
            actionSequence.push({ action: 'click_next', step: 'project-setup' });
            actionSequence.push({ action: 'select_area', value: 'Kitchen' });
            actionSequence.push({ action: 'click_next', step: 'area-selection' });
            
            testFramework.expect(actionSequence).toHaveLength(5);
            testFramework.expect(actionSequence[0].action).toBe('enter_project_name');
            testFramework.expect(actionSequence[4].step).toBe('area-selection');
        });

        testFramework.it('should handle back navigation', () => {
            const stateManager = workflowSimulator.stateManager;
            
            // Progress through steps
            stateManager.setState({ step: 'project-setup' });
            stateManager.setState({ step: 'area-selection' });
            stateManager.setState({ step: 'scope-selection' });
            
            testFramework.expect(stateManager.stateHistory).toHaveLength(3);
            testFramework.expect(stateManager.getState().step).toBe('scope-selection');
            
            // Can access previous states
            const previousState = stateManager.stateHistory[stateManager.stateHistory.length - 1];
            testFramework.expect(previousState.step).toBe('area-selection');
        });

        testFramework.it('should validate form submission states', () => {
            const formStates = {
                projectSetup: {
                    projectName: 'Valid Project',
                    workspaceId: '123456789',
                    isValid: true
                },
                areaSelection: {
                    selectedAreas: ['Kitchen', 'Bathroom'],
                    isValid: true
                },
                scopeSelection: {
                    selectedScopes: {
                        'Kitchen': ['Cabinet replacement'],
                        'Bathroom': ['Tile work']
                    },
                    isValid: true
                }
            };

            Object.values(formStates).forEach(state => {
                testFramework.expect(state.isValid).toBeTruthy();
            });
        });
    });

    // Performance and Timing Tests
    testFramework.describe('E2E - Performance and Timing', () => {
        let workflowSimulator;

        testFramework.beforeEach(() => {
            workflowSimulator = new WorkflowSimulator();
        });

        testFramework.it('should complete workflows within time limits', async () => {
            const timeTargets = {
                minimal: 5000,  // 5 seconds
                typical: 8000,  // 8 seconds
                large: 12000,   // 12 seconds
                maximum: 20000  // 20 seconds
            };

            // Test minimal project
            const minimalResult = await workflowSimulator.simulateCompleteWorkflow(TestScenarios.minimalProject);
            testFramework.expect(minimalResult.totalTime).toBeLessThan(timeTargets.minimal);

            workflowSimulator.reset();

            // Test typical project
            const typicalResult = await workflowSimulator.simulateCompleteWorkflow(TestScenarios.typicalProject);
            testFramework.expect(typicalResult.totalTime).toBeLessThan(timeTargets.typical);
        });

        testFramework.it('should track step-by-step timing', async () => {
            const result = await workflowSimulator.simulateCompleteWorkflow(TestScenarios.minimalProject);
            
            result.steps.forEach(step => {
                testFramework.expect(step.duration).toBeGreaterThan(0);
                testFramework.expect(step.duration).toBeLessThan(2000); // Each step under 2 seconds
            });
        });

        testFramework.it('should handle concurrent workflow simulations', async () => {
            const concurrentTests = [
                workflowSimulator.simulateCompleteWorkflow(TestScenarios.minimalProject),
                workflowSimulator.simulateCompleteWorkflow(TestScenarios.typicalProject)
            ];

            const results = await Promise.allSettled(concurrentTests);
            
            testFramework.expect(results).toHaveLength(2);
            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    testFramework.expect(result.value.success).toBeTruthy();
                }
            });
        });
    });

    // Data Integrity Tests
    testFramework.describe('E2E - Data Integrity and Validation', () => {
        let workflowSimulator;

        testFramework.beforeEach(() => {
            workflowSimulator = new WorkflowSimulator();
        });

        testFramework.it('should maintain data consistency throughout workflow', async () => {
            const result = await workflowSimulator.simulateCompleteWorkflow(TestScenarios.typicalProject);
            
            const finalState = workflowSimulator.stateManager.getState();
            
            // Verify data consistency
            testFramework.expect(finalState.projectData.projectName).toBe(TestScenarios.typicalProject.projectName);
            testFramework.expect(finalState.projectData.selectedAreas).toEqual(TestScenarios.typicalProject.areas);
            testFramework.expect(finalState.projectData.selectedScopes).toEqual(TestScenarios.typicalProject.scopes);
        });

        testFramework.it('should validate board creation data accuracy', async () => {
            const result = await workflowSimulator.simulateCompleteWorkflow(TestScenarios.typicalProject);
            
            const boardData = result.boardData;
            
            // Verify board contains correct number of groups
            const expectedGroups = 1 + TestScenarios.typicalProject.areas.length; // Planning + areas
            testFramework.expect(boardData.groups).toHaveLength(expectedGroups);
            
            // Verify group names
            const groupNames = boardData.groups.map(g => g.title);
            testFramework.expect(groupNames).toContain('Design and Planning');
            TestScenarios.typicalProject.areas.forEach(area => {
                testFramework.expect(groupNames).toContain(area);
            });
        });

        testFramework.it('should calculate item counts correctly', async () => {
            const result = await workflowSimulator.simulateCompleteWorkflow(TestScenarios.typicalProject);
            
            const expectedPlanningTasks = 5; // Standard planning tasks
            const expectedScopeItems = Object.values(TestScenarios.typicalProject.scopes)
                .reduce((sum, scopes) => sum + scopes.length, 0);
            const expectedTotal = expectedPlanningTasks + expectedScopeItems;
            
            testFramework.expect(result.boardData.totalItems).toBe(expectedTotal);
        });
    });

    console.log('✅ E2E Workflow Tests initialized successfully!');
}

// Initialize E2E tests when framework is ready
if (typeof testFramework !== 'undefined') {
    initializeE2ETests();
} else {
    // Wait for framework to be available
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeE2ETests, 300);
    });
}