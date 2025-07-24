// ============================================================================
// RENOVATION PROJECT MANAGER - DATA PROCESSING TESTS
// ============================================================================
// Complete data structure and processing validation tests
// ============================================================================

// Mock Renovation Data for Testing
const MockRenovationData = {
    STANDARD_PLANNING_TASKS: [
        "Construction Contract Executed",
        "Architectural Plan Development", 
        "Interior Design and Selections",
        "Permit Applications and Approvals",
        "Budget Finalization and Approval",
        "Timeline and Milestone Planning",
        "Contractor Selection and Vetting",
        "Material and Fixture Selection",
        "Engineering and Structural Analysis",
        "Final Design Review and Sign-off"
    ],

    RENOVATION_AREAS: {
        "Kitchen": [
            "Cabinet replacement/refacing",
            "Countertop installation (granite, quartz, marble)",
            "Appliance upgrades (refrigerator, stove, dishwasher)",
            "Backsplash installation",
            "Flooring replacement",
            "Plumbing modifications",
            "Electrical updates (outlets, lighting)",
            "Island or peninsula addition",
            "Pantry installation",
            "Kitchen exhaust and ventilation",
            "Paint and wall treatments",
            "Window and door replacement",
            "Ceiling updates and lighting fixtures"
        ],
        "Bathroom": [
            "Bathtub/shower replacement or renovation",
            "Vanity and sink installation",
            "Toilet replacement or upgrade",
            "Tile work (floor and wall)",
            "Plumbing fixture updates",
            "Electrical work (lighting, outlets, ventilation)",
            "Flooring replacement",
            "Paint and wall treatments",
            "Mirror and storage solutions",
            "Heated flooring installation",
            "Accessibility modifications",
            "Ventilation fan installation"
        ],
        "Living Room": [
            "Flooring replacement (hardwood, carpet, tile)",
            "Wall treatments and paint",
            "Lighting fixture updates",
            "Window treatments and replacement",
            "Built-in storage solutions",
            "Fireplace renovation or installation",
            "Ceiling treatments and crown molding",
            "Electrical outlet additions",
            "Entertainment center installation",
            "HVAC modifications for comfort"
        ],
        "Bedroom": [
            "Flooring replacement",
            "Paint and wall treatments",
            "Closet organization and renovation",
            "Lighting fixture updates",
            "Window treatments and replacement",
            "Built-in storage solutions",
            "Ceiling fan installation",
            "Electrical outlet additions",
            "Crown molding and trim work",
            "Master suite bathroom addition"
        ],
        "Basement": [
            "Waterproofing and moisture control",
            "Flooring installation",
            "Ceiling finishing and insulation",
            "Electrical system updates",
            "Plumbing rough-in and fixtures",
            "HVAC modifications",
            "Staircase renovation or replacement",
            "Window installation or enlargement",
            "Partition walls and room division",
            "Storage solutions and built-ins",
            "Lighting installation",
            "Paint and wall finishing"
        ]
    }
};

// Data Processing Helper Functions
const DataProcessingHelpers = {
    // Validate renovation data structure
    validateRenovationDataStructure(data) {
        if (!data || typeof data !== 'object') return false;
        
        // Check for required properties
        if (!data.STANDARD_PLANNING_TASKS || !data.RENOVATION_AREAS) return false;
        
        // Validate planning tasks
        if (!Array.isArray(data.STANDARD_PLANNING_TASKS) || data.STANDARD_PLANNING_TASKS.length === 0) {
            return false;
        }
        
        // Validate renovation areas
        if (typeof data.RENOVATION_AREAS !== 'object' || Object.keys(data.RENOVATION_AREAS).length === 0) {
            return false;
        }
        
        // Validate each area has scopes
        for (const [area, scopes] of Object.entries(data.RENOVATION_AREAS)) {
            if (!Array.isArray(scopes) || scopes.length === 0) {
                return false;
            }
        }
        
        return true;
    },

    // Extract area names
    getAreaNames(data) {
        if (!this.validateRenovationDataStructure(data)) return [];
        return Object.keys(data.RENOVATION_AREAS);
    },

    // Get scopes for specific area
    getScopesForArea(data, areaName) {
        if (!this.validateRenovationDataStructure(data)) return [];
        return data.RENOVATION_AREAS[areaName] || [];
    },

    // Transform user selections to API format
    transformSelectionsToAPIFormat(projectData) {
        const result = {
            boardData: {
                name: projectData.projectName,
                workspace_id: parseInt(projectData.workspaceId)
            },
            groups: [],
            items: []
        };

        // Add Design and Planning group
        result.groups.push({
            name: "Design and Planning",
            color: "#037f4c",
            position: 0
        });

        // Add planning tasks
        MockRenovationData.STANDARD_PLANNING_TASKS.forEach((task, index) => {
            result.items.push({
                name: task,
                group: "Design and Planning",
                position: index,
                column_values: {
                    status: "Not Started",
                    priority: "Medium"
                }
            });
        });

        // Add selected renovation area groups
        projectData.selectedAreas.forEach((area, areaIndex) => {
            result.groups.push({
                name: area,
                color: "#0073ea",
                position: areaIndex + 1
            });

            // Add scope items for this area
            const scopes = projectData.selectedScopes[area] || [];
            scopes.forEach((scope, scopeIndex) => {
                result.items.push({
                    name: scope,
                    group: area,
                    position: scopeIndex,
                    column_values: {
                        status: "Not Started",
                        priority: "Medium"
                    }
                });
            });
        });

        return result;
    },

    // Validate transformed data
    validateTransformedData(transformedData) {
        if (!transformedData || typeof transformedData !== 'object') return false;
        
        // Check board data
        if (!transformedData.boardData || !transformedData.boardData.name || !transformedData.boardData.workspace_id) {
            return false;
        }
        
        // Check groups
        if (!Array.isArray(transformedData.groups) || transformedData.groups.length === 0) {
            return false;
        }
        
        // Check items
        if (!Array.isArray(transformedData.items) || transformedData.items.length === 0) {
            return false;
        }
        
        // Validate required group (Design and Planning)
        const planningGroup = transformedData.groups.find(g => g.name === "Design and Planning");
        if (!planningGroup) return false;
        
        return true;
    },

    // Calculate statistics
    calculateDataStatistics(data) {
        if (!this.validateRenovationDataStructure(data)) {
            return null;
        }

        const stats = {
            totalAreas: Object.keys(data.RENOVATION_AREAS).length,
            totalScopes: 0,
            planningTasks: data.STANDARD_PLANNING_TASKS.length,
            areaStats: {}
        };

        for (const [area, scopes] of Object.entries(data.RENOVATION_AREAS)) {
            stats.areaStats[area] = {
                scopeCount: scopes.length,
                averageScopeLength: scopes.reduce((sum, scope) => sum + scope.length, 0) / scopes.length
            };
            stats.totalScopes += scopes.length;
        }

        stats.averageScopesPerArea = stats.totalScopes / stats.totalAreas;

        return stats;
    },

    // Sanitize user input
    sanitizeUserInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML
            .replace(/[^\w\s\-\.]/g, '') // Allow only alphanumeric, spaces, hyphens, dots
            .slice(0, 255); // Limit length
    },

    // Validate project configuration
    validateProjectConfiguration(config) {
        const errors = [];

        // Validate project name
        if (!config.projectName || config.projectName.length < 3) {
            errors.push('Project name must be at least 3 characters');
        }
        if (config.projectName && config.projectName.length > 50) {
            errors.push('Project name must be 50 characters or less');
        }

        // Validate workspace ID
        if (!config.workspaceId || !/^\d{8,12}$/.test(config.workspaceId)) {
            errors.push('Workspace ID must be 8-12 digits');
        }

        // Validate selected areas
        if (!config.selectedAreas || !Array.isArray(config.selectedAreas) || config.selectedAreas.length === 0) {
            errors.push('At least one renovation area must be selected');
        }

        // Validate selected scopes
        if (!config.selectedScopes || typeof config.selectedScopes !== 'object') {
            errors.push('Scope selections must be provided');
        } else {
            // Check each selected area has scopes
            for (const area of config.selectedAreas || []) {
                if (!config.selectedScopes[area] || !Array.isArray(config.selectedScopes[area]) || 
                    config.selectedScopes[area].length === 0) {
                    errors.push(`No scopes selected for area: ${area}`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};

// Data Integrity Checker
class DataIntegrityChecker {
    constructor() {
        this.checkResults = [];
    }

    runAllChecks(data) {
        this.checkResults = [];
        
        this.checkDataStructure(data);
        this.checkDataCompleteness(data);
        this.checkDataConsistency(data);
        this.checkDataQuality(data);
        
        return {
            passed: this.checkResults.filter(r => r.passed).length,
            failed: this.checkResults.filter(r => !r.passed).length,
            results: this.checkResults
        };
    }

    checkDataStructure(data) {
        const result = {
            check: 'Data Structure',
            passed: true,
            issues: []
        };

        try {
            // Check top-level structure
            if (!data.STANDARD_PLANNING_TASKS) {
                result.issues.push('Missing STANDARD_PLANNING_TASKS');
                result.passed = false;
            }

            if (!data.RENOVATION_AREAS) {
                result.issues.push('Missing RENOVATION_AREAS');
                result.passed = false;
            }

            // Check planning tasks structure
            if (data.STANDARD_PLANNING_TASKS && !Array.isArray(data.STANDARD_PLANNING_TASKS)) {
                result.issues.push('STANDARD_PLANNING_TASKS should be an array');
                result.passed = false;
            }

            // Check renovation areas structure
            if (data.RENOVATION_AREAS && typeof data.RENOVATION_AREAS !== 'object') {
                result.issues.push('RENOVATION_AREAS should be an object');
                result.passed = false;
            }

        } catch (error) {
            result.issues.push(`Structure check error: ${error.message}`);
            result.passed = false;
        }

        this.checkResults.push(result);
    }

    checkDataCompleteness(data) {
        const result = {
            check: 'Data Completeness',
            passed: true,
            issues: []
        };

        try {
            // Check minimum planning tasks
            if (!data.STANDARD_PLANNING_TASKS || data.STANDARD_PLANNING_TASKS.length < 5) {
                result.issues.push('Should have at least 5 standard planning tasks');
                result.passed = false;
            }

            // Check minimum renovation areas
            if (!data.RENOVATION_AREAS || Object.keys(data.RENOVATION_AREAS).length < 5) {
                result.issues.push('Should have at least 5 renovation areas');
                result.passed = false;
            }

            // Check each area has scopes
            if (data.RENOVATION_AREAS) {
                for (const [area, scopes] of Object.entries(data.RENOVATION_AREAS)) {
                    if (!Array.isArray(scopes) || scopes.length === 0) {
                        result.issues.push(`Area '${area}' has no scopes`);
                        result.passed = false;
                    }
                }
            }

        } catch (error) {
            result.issues.push(`Completeness check error: ${error.message}`);
            result.passed = false;
        }

        this.checkResults.push(result);
    }

    checkDataConsistency(data) {
        const result = {
            check: 'Data Consistency',
            passed: true,
            issues: []
        };

        try {
            // Check for duplicate planning tasks
            if (data.STANDARD_PLANNING_TASKS) {
                const uniqueTasks = new Set(data.STANDARD_PLANNING_TASKS);
                if (uniqueTasks.size !== data.STANDARD_PLANNING_TASKS.length) {
                    result.issues.push('Duplicate planning tasks found');
                    result.passed = false;
                }
            }

            // Check for duplicate scopes within areas
            if (data.RENOVATION_AREAS) {
                for (const [area, scopes] of Object.entries(data.RENOVATION_AREAS)) {
                    if (Array.isArray(scopes)) {
                        const uniqueScopes = new Set(scopes);
                        if (uniqueScopes.size !== scopes.length) {
                            result.issues.push(`Duplicate scopes found in area '${area}'`);
                            result.passed = false;
                        }
                    }
                }
            }

        } catch (error) {
            result.issues.push(`Consistency check error: ${error.message}`);
            result.passed = false;
        }

        this.checkResults.push(result);
    }

    checkDataQuality(data) {
        const result = {
            check: 'Data Quality',
            passed: true,
            issues: []
        };

        try {
            // Check planning task quality
            if (data.STANDARD_PLANNING_TASKS) {
                data.STANDARD_PLANNING_TASKS.forEach((task, index) => {
                    if (!task || typeof task !== 'string' || task.trim().length === 0) {
                        result.issues.push(`Planning task ${index} is empty or invalid`);
                        result.passed = false;
                    }
                    if (task && task.length > 100) {
                        result.issues.push(`Planning task ${index} is too long (>100 chars)`);
                        result.passed = false;
                    }
                });
            }

            // Check scope quality
            if (data.RENOVATION_AREAS) {
                for (const [area, scopes] of Object.entries(data.RENOVATION_AREAS)) {
                    if (Array.isArray(scopes)) {
                        scopes.forEach((scope, index) => {
                            if (!scope || typeof scope !== 'string' || scope.trim().length === 0) {
                                result.issues.push(`Scope ${index} in area '${area}' is empty or invalid`);
                                result.passed = false;
                            }
                            if (scope && scope.length > 150) {
                                result.issues.push(`Scope ${index} in area '${area}' is too long (>150 chars)`);
                                result.passed = false;
                            }
                        });
                    }
                }
            }

        } catch (error) {
            result.issues.push(`Quality check error: ${error.message}`);
            result.passed = false;
        }

        this.checkResults.push(result);
    }
}

// Initialize comprehensive data processing tests
function initializeDataProcessingTests() {
    if (typeof testFramework === 'undefined') {
        console.error('TestFramework not available for data processing tests');
        return;
    }

    // Renovation Data Structure Tests
    testFramework.describe('Data Processing - Renovation Data Structure', () => {

        testFramework.it('should validate complete renovation data structure', () => {
            const isValid = DataProcessingHelpers.validateRenovationDataStructure(MockRenovationData);
            testFramework.expect(isValid).toBeTruthy();
        });

        testFramework.it('should extract all renovation area names', () => {
            const areaNames = DataProcessingHelpers.getAreaNames(MockRenovationData);
            
            testFramework.expect(areaNames).toContain('Kitchen');
            testFramework.expect(areaNames).toContain('Bathroom');
            testFramework.expect(areaNames).toContain('Living Room');
            testFramework.expect(areaNames).toContain('Bedroom');
            testFramework.expect(areaNames).toContain('Basement');
        });

        testFramework.it('should retrieve scopes for specific areas', () => {
            const kitchenScopes = DataProcessingHelpers.getScopesForArea(MockRenovationData, 'Kitchen');
            const bathroomScopes = DataProcessingHelpers.getScopesForArea(MockRenovationData, 'Bathroom');
            
            testFramework.expect(kitchenScopes).toContain('Cabinet replacement/refacing');
            testFramework.expect(kitchenScopes).toContain('Countertop installation (granite, quartz, marble)');
            testFramework.expect(bathroomScopes).toContain('Bathtub/shower replacement or renovation');
            testFramework.expect(bathroomScopes).toContain('Vanity and sink installation');
        });

        testFramework.it('should validate each area has adequate scope count', () => {
            const areaNames = DataProcessingHelpers.getAreaNames(MockRenovationData);
            
            areaNames.forEach(area => {
                const scopes = DataProcessingHelpers.getScopesForArea(MockRenovationData, area);
                testFramework.expect(scopes.length).toBeGreaterThan(5); // At least 6 scopes per area
            });
        });

        testFramework.it('should validate standard planning tasks', () => {
            const planningTasks = MockRenovationData.STANDARD_PLANNING_TASKS;
            
            testFramework.expect(planningTasks).toHaveLength(10);
            testFramework.expect(planningTasks).toContain('Construction Contract Executed');
            testFramework.expect(planningTasks).toContain('Architectural Plan Development');
            testFramework.expect(planningTasks).toContain('Final Design Review and Sign-off');
        });
    });

    // Data Transformation Tests
    testFramework.describe('Data Processing - Data Transformation', () => {

        testFramework.it('should transform user selections to API format', () => {
            const mockProjectData = {
                projectName: 'Kitchen Renovation 2025',
                workspaceId: '123456789',
                selectedAreas: ['Kitchen', 'Bathroom'],
                selectedScopes: {
                    'Kitchen': ['Cabinet replacement/refacing', 'Countertop installation'],
                    'Bathroom': ['Bathtub/shower replacement', 'Tile work']
                }
            };

            const transformed = DataProcessingHelpers.transformSelectionsToAPIFormat(mockProjectData);
            
            testFramework.expect(DataProcessingHelpers.validateTransformedData(transformed)).toBeTruthy();
            testFramework.expect(transformed.boardData.name).toBe('Kitchen Renovation 2025');
            testFramework.expect(transformed.boardData.workspace_id).toBe(123456789);
            testFramework.expect(transformed.groups).toHaveLength(3); // Planning + Kitchen + Bathroom
        });

        testFramework.it('should include planning group as first group', () => {
            const mockProjectData = {
                projectName: 'Test Project',
                workspaceId: '123456789',
                selectedAreas: ['Kitchen'],
                selectedScopes: { 'Kitchen': ['Cabinet replacement'] }
            };

            const transformed = DataProcessingHelpers.transformSelectionsToAPIFormat(mockProjectData);
            
            testFramework.expect(transformed.groups[0].name).toBe('Design and Planning');
            testFramework.expect(transformed.groups[0].color).toBe('#037f4c');
            testFramework.expect(transformed.groups[0].position).toBe(0);
        });

        testFramework.it('should create correct number of items', () => {
            const mockProjectData = {
                projectName: 'Test Project',
                workspaceId: '123456789',
                selectedAreas: ['Kitchen', 'Bathroom'],
                selectedScopes: {
                    'Kitchen': ['Scope 1', 'Scope 2'],
                    'Bathroom': ['Scope 3']
                }
            };

            const transformed = DataProcessingHelpers.transformSelectionsToAPIFormat(mockProjectData);
            
            // 10 planning tasks + 3 scope items = 13 total
            testFramework.expect(transformed.items).toHaveLength(13);
            
            // Check planning items
            const planningItems = transformed.items.filter(item => item.group === 'Design and Planning');
            testFramework.expect(planningItems).toHaveLength(10);
            
            // Check scope items
            const kitchenItems = transformed.items.filter(item => item.group === 'Kitchen');
            const bathroomItems = transformed.items.filter(item => item.group === 'Bathroom');
            testFramework.expect(kitchenItems).toHaveLength(2);
            testFramework.expect(bathroomItems).toHaveLength(1);
        });

        testFramework.it('should set default column values for all items', () => {
            const mockProjectData = {
                projectName: 'Test Project',
                workspaceId: '123456789',
                selectedAreas: ['Kitchen'],
                selectedScopes: { 'Kitchen': ['Cabinet replacement'] }
            };

            const transformed = DataProcessingHelpers.transformSelectionsToAPIFormat(mockProjectData);
            
            transformed.items.forEach(item => {
                testFramework.expect(item.column_values.status).toBe('Not Started');
                testFramework.expect(item.column_values.priority).toBe('Medium');
            });
        });
    });

    // Data Validation Tests
    testFramework.describe('Data Processing - Data Validation', () => {

        testFramework.it('should validate complete project configuration', () => {
            const validConfig = {
                projectName: 'Valid Project Name',
                workspaceId: '123456789',
                selectedAreas: ['Kitchen', 'Bathroom'],
                selectedScopes: {
                    'Kitchen': ['Cabinet replacement'],
                    'Bathroom': ['Tile work']
                }
            };

            const validation = DataProcessingHelpers.validateProjectConfiguration(validConfig);
            testFramework.expect(validation.isValid).toBeTruthy();
            testFramework.expect(validation.errors).toHaveLength(0);
        });

        testFramework.it('should detect invalid project name', () => {
            const invalidConfig = {
                projectName: 'AB', // Too short
                workspaceId: '123456789',
                selectedAreas: ['Kitchen'],
                selectedScopes: { 'Kitchen': ['Cabinet replacement'] }
            };

            const validation = DataProcessingHelpers.validateProjectConfiguration(invalidConfig);
            testFramework.expect(validation.isValid).toBeFalsy();
            testFramework.expect(validation.errors).toContain('Project name must be at least 3 characters');
        });

        testFramework.it('should detect invalid workspace ID', () => {
            const invalidConfig = {
                projectName: 'Valid Project',
                workspaceId: 'invalid123', // Contains letters
                selectedAreas: ['Kitchen'],
                selectedScopes: { 'Kitchen': ['Cabinet replacement'] }
            };

            const validation = DataProcessingHelpers.validateProjectConfiguration(invalidConfig);
            testFramework.expect(validation.isValid).toBeFalsy();
            testFramework.expect(validation.errors).toContain('Workspace ID must be 8-12 digits');
        });

        testFramework.it('should detect missing area selections', () => {
            const invalidConfig = {
                projectName: 'Valid Project',
                workspaceId: '123456789',
                selectedAreas: [], // No areas selected
                selectedScopes: {}
            };

            const validation = DataProcessingHelpers.validateProjectConfiguration(invalidConfig);
            testFramework.expect(validation.isValid).toBeFalsy();
            testFramework.expect(validation.errors).toContain('At least one renovation area must be selected');
        });

        testFramework.it('should detect missing scope selections', () => {
            const invalidConfig = {
                projectName: 'Valid Project',
                workspaceId: '123456789',
                selectedAreas: ['Kitchen'],
                selectedScopes: {} // No scopes for Kitchen
            };

            const validation = DataProcessingHelpers.validateProjectConfiguration(invalidConfig);
            testFramework.expect(validation.isValid).toBeFalsy();
            testFramework.expect(validation.errors).toContain('No scopes selected for area: Kitchen');
        });
    });

    // Data Sanitization Tests
    testFramework.describe('Data Processing - Data Sanitization', () => {

        testFramework.it('should sanitize user input correctly', () => {
            testFramework.expect(DataProcessingHelpers.sanitizeUserInput('  Normal Text  ')).toBe('Normal Text');
            testFramework.expect(DataProcessingHelpers.sanitizeUserInput('Text<script>alert("xss")</script>')).toBe('Textscriptalert"xss"script');
            testFramework.expect(DataProcessingHelpers.sanitizeUserInput('Valid-Project.Name 123')).toBe('Valid-Project.Name 123');
            testFramework.expect(DataProcessingHelpers.sanitizeUserInput('Text@#$%^&*()')).toBe('Text');
        });

        testFramework.it('should handle edge cases in sanitization', () => {
            testFramework.expect(DataProcessingHelpers.sanitizeUserInput(null)).toBe('');
            testFramework.expect(DataProcessingHelpers.sanitizeUserInput(undefined)).toBe('');
            testFramework.expect(DataProcessingHelpers.sanitizeUserInput(123)).toBe('');
            testFramework.expect(DataProcessingHelpers.sanitizeUserInput('')).toBe('');
        });

        testFramework.it('should limit input length', () => {
            const longInput = 'A'.repeat(300);
            const sanitized = DataProcessingHelpers.sanitizeUserInput(longInput);
            testFramework.expect(sanitized.length).toBe(255);
        });
    });

    // Data Statistics and Analysis Tests
    testFramework.describe('Data Processing - Statistics and Analysis', () => {

        testFramework.it('should calculate data statistics correctly', () => {
            const stats = DataProcessingHelpers.calculateDataStatistics(MockRenovationData);
            
            testFramework.expect(stats).toBeDefined();
            testFramework.expect(stats.totalAreas).toBe(5); // Kitchen, Bathroom, Living Room, Bedroom, Basement
            testFramework.expect(stats.planningTasks).toBe(10);
            testFramework.expect(stats.totalScopes).toBeGreaterThan(0);
            testFramework.expect(stats.averageScopesPerArea).toBeGreaterThan(0);
        });

        testFramework.it('should provide area-specific statistics', () => {
            const stats = DataProcessingHelpers.calculateDataStatistics(MockRenovationData);
            
            testFramework.expect(stats.areaStats['Kitchen']).toBeDefined();
            testFramework.expect(stats.areaStats['Kitchen'].scopeCount).toBeGreaterThan(0);
            testFramework.expect(stats.areaStats['Kitchen'].averageScopeLength).toBeGreaterThan(0);
            
            testFramework.expect(stats.areaStats['Bathroom']).toBeDefined();
            testFramework.expect(stats.areaStats['Bathroom'].scopeCount).toBeGreaterThan(0);
        });

        testFramework.it('should handle invalid data in statistics calculation', () => {
            const invalidData = { invalid: 'structure' };
            const stats = DataProcessingHelpers.calculateDataStatistics(invalidData);
            
            testFramework.expect(stats).toBeNull();
        });
    });

    // Data Integrity Tests
    testFramework.describe('Data Processing - Data Integrity', () => {

        testFramework.it('should pass all integrity checks for valid data', () => {
            const checker = new DataIntegrityChecker();
            const results = checker.runAllChecks(MockRenovationData);
            
            testFramework.expect(results.failed).toBe(0);
            testFramework.expect(results.passed).toBeGreaterThan(0);
            testFramework.expect(results.results).toHaveLength(4); // 4 types of checks
        });

        testFramework.it('should detect structure issues', () => {
            const invalidData = { STANDARD_PLANNING_TASKS: 'not_an_array' };
            const checker = new DataIntegrityChecker();
            const results = checker.runAllChecks(invalidData);
            
            const structureCheck = results.results.find(r => r.check === 'Data Structure');
            testFramework.expect(structureCheck.passed).toBeFalsy();
            testFramework.expect(structureCheck.issues.length).toBeGreaterThan(0);
        });

        testFramework.it('should detect completeness issues', () => {
            const incompleteData = {
                STANDARD_PLANNING_TASKS: ['Task 1'], // Too few tasks
                RENOVATION_AREAS: {
                    'Kitchen': [] // No scopes
                }
            };
            const checker = new DataIntegrityChecker();
            const results = checker.runAllChecks(incompleteData);
            
            const completenessCheck = results.results.find(r => r.check === 'Data Completeness');
            testFramework.expect(completenessCheck.passed).toBeFalsy();
            testFramework.expect(completenessCheck.issues.length).toBeGreaterThan(0);
        });

        testFramework.it('should detect consistency issues', () => {
            const inconsistentData = {
                STANDARD_PLANNING_TASKS: ['Task 1', 'Task 1'], // Duplicate task
                RENOVATION_AREAS: {
                    'Kitchen': ['Scope 1', 'Scope 1'] // Duplicate scope
                }
            };
            const checker = new DataIntegrityChecker();
            const results = checker.runAllChecks(inconsistentData);
            
            const consistencyCheck = results.results.find(r => r.check === 'Data Consistency');
            testFramework.expect(consistencyCheck.passed).toBeFalsy();
            testFramework.expect(consistencyCheck.issues.length).toBeGreaterThan(0);
        });
    });

    console.log('✅ Data Processing Tests initialized successfully!');
}

// Initialize data processing tests when framework is ready
if (typeof testFramework !== 'undefined') {
    initializeDataProcessingTests();
} else {
    // Wait for framework to be available
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeDataProcessingTests, 400);
    });
}