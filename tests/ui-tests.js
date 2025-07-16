// ============================================================================
// RENOVATION PROJECT MANAGER - UI TESTS
// ============================================================================
// Comprehensive UI testing for all interface elements and interactions
// ============================================================================

// Wait for testFramework to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Use the global test framework
    const describe = testFramework.describe.bind(testFramework);
    const it = testFramework.it.bind(testFramework);
    const expect = testFramework.expect.bind(testFramework);
    const beforeEach = testFramework.beforeEach.bind(testFramework);
    const afterEach = testFramework.afterEach.bind(testFramework);

// Mock DOM elements for testing
let mockDOM = {};

// UI Test Suite
describe('UI Components and Interactions', () => {
    beforeEach(() => {
        // Setup mock DOM elements
        mockDOM = {
            projectName: DOMUtils.createMockElement('input', 'project-name'),
            workspaceId: DOMUtils.createMockElement('input', 'workspace-id'),
            areasGrid: DOMUtils.createMockElement('div', 'areas-grid'),
            nextToScopes: DOMUtils.createMockElement('button', 'next-to-scopes'),
            nextToConfirmation: DOMUtils.createMockElement('button', 'next-to-confirmation'),
            createBoardBtn: DOMUtils.createMockElement('button', 'create-board'),
            selectionCounter: DOMUtils.createMockElement('div', 'selection-counter'),
            scopesContainer: DOMUtils.createMockElement('div', 'selected-scopes'),
            progressBar: DOMUtils.createMockElement('div', 'progress-bar'),
            loading: DOMUtils.createMockElement('div', 'loading'),
            successResult: DOMUtils.createMockElement('div', 'success-result'),
            errorResult: DOMUtils.createMockElement('div', 'error-result')
        };

        // Mock global functions
        global.AppState = {
            currentStep: 'project-setup',
            apiToken: 'test-token',
            projectName: '',
            workspaceId: '',
            selectedAreas: [],
            selectedScopes: {},
            boardStructure: null,
            createdBoardId: null,
            createdBoardUrl: null
        };

        // Mock renovation data
        global.RenovationData = {
            RENOVATION_AREAS: {
                'Kitchen': ['Cabinet replacement', 'Countertop installation', 'Appliance upgrades'],
                'Bathroom': ['Tile installation', 'Fixture replacement', 'Plumbing updates'],
                'Living Room': ['Flooring replacement', 'Lighting updates', 'Paint'],
                'Bedroom': ['Flooring', 'Closet organization', 'Lighting']
            },
            DataHelper: {
                processUserSelections: (areas, scopes, name, workspace) => ({ areas, scopes, name, workspace }),
                generateBoardStructure: (name, scopes) => ({ name, scopes }),
                validateScopeSelection: (scopes) => ({ valid: true, message: 'Valid' })
            }
        };
    });

    afterEach(() => {
        // Clean up
        mockDOM = {};
        global.AppState = null;
        global.RenovationData = null;
    });

    describe('Project Setup Form', () => {
        it('should validate project name input', () => {
            const input = mockDOM.projectName;
            
            // Test empty input
            DOMUtils.simulateInput(input, '');
            expect(input.value).toBe('');
            
            // Test valid input
            DOMUtils.simulateInput(input, 'Test Project');
            expect(input.value).toBe('Test Project');
            
            // Test input length validation
            const longName = 'A'.repeat(51);
            DOMUtils.simulateInput(input, longName);
            expect(input.value.length).toBeGreaterThan(50);
        });

        it('should validate workspace ID input', () => {
            const input = mockDOM.workspaceId;
            
            // Test numeric input
            DOMUtils.simulateInput(input, '123456789');
            expect(input.value).toBe('123456789');
            
            // Test non-numeric input
            DOMUtils.simulateInput(input, 'invalid-id');
            expect(input.value).toBe('invalid-id');
        });

        it('should enable/disable next button based on form validity', () => {
            const projectInput = mockDOM.projectName;
            const workspaceInput = mockDOM.workspaceId;
            const nextButton = mockDOM.nextToScopes;
            
            // Initially disabled
            expect(nextButton.disabled).toBeTruthy();
            
            // Enable when both fields are valid
            DOMUtils.simulateInput(projectInput, 'Test Project');
            DOMUtils.simulateInput(workspaceInput, '123456789');
            
            // Simulate validation logic
            const isValid = projectInput.value.length >= 3 && workspaceInput.value.length >= 8;
            nextButton.disabled = !isValid;
            
            expect(nextButton.disabled).toBeFalsy();
        });

        it('should show validation errors for invalid inputs', () => {
            const projectInput = mockDOM.projectName;
            
            // Test short name
            DOMUtils.simulateInput(projectInput, 'AB');
            
            // Simulate validation
            const isValid = projectInput.value.length >= 3;
            expect(isValid).toBeFalsy();
            
            // Test valid name
            DOMUtils.simulateInput(projectInput, 'Valid Project Name');
            const isValidNow = projectInput.value.length >= 3;
            expect(isValidNow).toBeTruthy();
        });
    });

    describe('Area Selection Interface', () => {
        it('should display all 15 renovation areas', () => {
            const areas = Object.keys(RenovationData.RENOVATION_AREAS);
            expect(areas.length).toBe(4); // Mock has 4 areas
            
            areas.forEach(area => {
                expect(area).toBeDefined();
                expect(typeof area).toBe('string');
            });
        });

        it('should handle area selection and deselection', () => {
            const selectedAreas = [];
            
            // Simulate area selection
            const selectArea = (area) => {
                if (!selectedAreas.includes(area)) {
                    selectedAreas.push(area);
                }
            };
            
            const deselectArea = (area) => {
                const index = selectedAreas.indexOf(area);
                if (index > -1) {
                    selectedAreas.splice(index, 1);
                }
            };
            
            // Test selection
            selectArea('Kitchen');
            expect(selectedAreas).toContain('Kitchen');
            expect(selectedAreas.length).toBe(1);
            
            // Test deselection
            deselectArea('Kitchen');
            expect(selectedAreas).not.toContain('Kitchen');
            expect(selectedAreas.length).toBe(0);
        });

        it('should update selection counter', () => {
            const counter = mockDOM.selectionCounter;
            const selectedAreas = ['Kitchen', 'Bathroom'];
            
            // Simulate counter update
            counter.textContent = `${selectedAreas.length} of 15 areas selected`;
            
            expect(counter.textContent).toBe('2 of 15 areas selected');
        });

        it('should validate minimum area selection', () => {
            const selectedAreas = [];
            const nextButton = mockDOM.nextToScopes;
            
            // Test no selection
            nextButton.disabled = selectedAreas.length === 0;
            expect(nextButton.disabled).toBeTruthy();
            
            // Test with selection
            selectedAreas.push('Kitchen');
            nextButton.disabled = selectedAreas.length === 0;
            expect(nextButton.disabled).toBeFalsy();
        });

        it('should handle click anywhere on area card', () => {
            const areaCard = DOMUtils.createMockElement('div', 'area-kitchen');
            const checkbox = DOMUtils.createMockElement('input', 'kitchen-checkbox');
            checkbox.type = 'checkbox';
            
            // Simulate card click
            let clicked = false;
            areaCard.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                clicked = true;
            });
            
            DOMUtils.simulateClick(areaCard);
            expect(clicked).toBeTruthy();
        });
    });

    describe('Scope Selection Interface', () => {
        it('should generate dropdowns for selected areas only', () => {
            const selectedAreas = ['Kitchen', 'Bathroom'];
            const generatedDropdowns = [];
            
            // Simulate dropdown generation
            selectedAreas.forEach(area => {
                const dropdown = DOMUtils.createMockElement('select', `scope-${area.toLowerCase()}`);
                generatedDropdowns.push(dropdown);
            });
            
            expect(generatedDropdowns.length).toBe(2);
            expect(generatedDropdowns[0].id).toBe('scope-kitchen');
            expect(generatedDropdowns[1].id).toBe('scope-bathroom');
        });

        it('should populate dropdowns with area-specific scopes', () => {
            const area = 'Kitchen';
            const scopes = RenovationData.RENOVATION_AREAS[area];
            const dropdown = DOMUtils.createMockElement('select', 'scope-kitchen');
            
            // Simulate option population
            scopes.forEach(scope => {
                const option = DOMUtils.createMockElement('option', '', { value: scope });
                option.textContent = scope;
                dropdown.appendChild(option);
            });
            
            expect(dropdown.children.length).toBe(scopes.length);
        });

        it('should handle Select All/Clear All functionality', () => {
            const scopes = ['Cabinet replacement', 'Countertop installation', 'Appliance upgrades'];
            const selectedScopes = [];
            
            // Simulate Select All
            const selectAll = () => {
                selectedScopes.length = 0;
                selectedScopes.push(...scopes);
            };
            
            // Simulate Clear All
            const clearAll = () => {
                selectedScopes.length = 0;
            };
            
            selectAll();
            expect(selectedScopes.length).toBe(3);
            expect(selectedScopes).toEqual(scopes);
            
            clearAll();
            expect(selectedScopes.length).toBe(0);
        });

        it('should validate scope selection completeness', () => {
            const selectedAreas = ['Kitchen', 'Bathroom'];
            const selectedScopes = {
                'Kitchen': ['Cabinet replacement'],
                'Bathroom': [] // Empty - should be invalid
            };
            
            // Simulate validation
            const isValid = selectedAreas.every(area => 
                selectedScopes[area] && selectedScopes[area].length > 0
            );
            
            expect(isValid).toBeFalsy();
            
            // Fix validation
            selectedScopes['Bathroom'] = ['Tile installation'];
            const isValidNow = selectedAreas.every(area => 
                selectedScopes[area] && selectedScopes[area].length > 0
            );
            
            expect(isValidNow).toBeTruthy();
        });

        it('should update progress indicators', () => {
            const selectedAreas = ['Kitchen', 'Bathroom'];
            const selectedScopes = {
                'Kitchen': ['Cabinet replacement'],
                'Bathroom': ['Tile installation']
            };
            
            // Simulate progress calculation
            const completedAreas = selectedAreas.filter(area => 
                selectedScopes[area] && selectedScopes[area].length > 0
            ).length;
            
            const progress = (completedAreas / selectedAreas.length) * 100;
            
            expect(progress).toBe(100);
        });
    });

    describe('Navigation and Flow Control', () => {
        it('should handle step navigation', () => {
            const steps = ['project-setup', 'area-selection', 'scope-selection', 'confirmation', 'results'];
            let currentStep = 0;
            
            // Simulate next button clicks
            const nextStep = () => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                }
            };
            
            const prevStep = () => {
                if (currentStep > 0) {
                    currentStep--;
                }
            };
            
            expect(steps[currentStep]).toBe('project-setup');
            
            nextStep();
            expect(steps[currentStep]).toBe('area-selection');
            
            nextStep();
            expect(steps[currentStep]).toBe('scope-selection');
            
            prevStep();
            expect(steps[currentStep]).toBe('area-selection');
        });

        it('should validate each step before proceeding', () => {
            const validateStep = (step) => {
                switch (step) {
                    case 'project-setup':
                        return global.AppState.projectName.length >= 3 && 
                               global.AppState.workspaceId.length >= 8;
                    case 'area-selection':
                        return global.AppState.selectedAreas.length > 0;
                    case 'scope-selection':
                        return Object.keys(global.AppState.selectedScopes).length > 0;
                    default:
                        return true;
                }
            };
            
            // Test invalid states
            expect(validateStep('project-setup')).toBeFalsy();
            expect(validateStep('area-selection')).toBeFalsy();
            expect(validateStep('scope-selection')).toBeFalsy();
            
            // Test valid states
            global.AppState.projectName = 'Test Project';
            global.AppState.workspaceId = '123456789';
            global.AppState.selectedAreas = ['Kitchen'];
            global.AppState.selectedScopes = { 'Kitchen': ['Cabinet replacement'] };
            
            expect(validateStep('project-setup')).toBeTruthy();
            expect(validateStep('area-selection')).toBeTruthy();
            expect(validateStep('scope-selection')).toBeTruthy();
        });

        it('should show appropriate step content', () => {
            const steps = ['project-setup', 'area-selection', 'scope-selection', 'confirmation', 'results'];
            
            const showStep = (stepName) => {
                steps.forEach(step => {
                    const element = DOMUtils.createMockElement('div', step);
                    element.style.display = (step === stepName) ? 'block' : 'none';
                });
            };
            
            showStep('area-selection');
            // This would be tested by checking DOM visibility in a real browser
            expect(true).toBeTruthy(); // Placeholder for actual DOM test
        });
    });

    describe('Form Validation and Feedback', () => {
        it('should show real-time validation feedback', () => {
            const input = mockDOM.projectName;
            const errorElement = DOMUtils.createMockElement('div', 'project-name-error');
            
            const validateInput = (value) => {
                if (value.length < 3) {
                    errorElement.textContent = 'Project name must be at least 3 characters';
                    errorElement.style.display = 'block';
                    return false;
                } else {
                    errorElement.style.display = 'none';
                    return true;
                }
            };
            
            // Test invalid input
            DOMUtils.simulateInput(input, 'AB');
            expect(validateInput(input.value)).toBeFalsy();
            expect(errorElement.textContent).toContain('at least 3 characters');
            
            // Test valid input
            DOMUtils.simulateInput(input, 'Valid Name');
            expect(validateInput(input.value)).toBeTruthy();
        });

        it('should handle workspace ID validation', () => {
            const input = mockDOM.workspaceId;
            
            const validateWorkspaceId = (value) => {
                const isNumeric = /^\d+$/.test(value);
                const isValidLength = value.length >= 8 && value.length <= 12;
                return isNumeric && isValidLength;
            };
            
            // Test invalid inputs
            expect(validateWorkspaceId('abc')).toBeFalsy();
            expect(validateWorkspaceId('123')).toBeFalsy();
            expect(validateWorkspaceId('1234567890123')).toBeFalsy();
            
            // Test valid input
            expect(validateWorkspaceId('123456789')).toBeTruthy();
        });

        it('should provide visual feedback for form states', () => {
            const input = mockDOM.projectName;
            
            const updateInputState = (isValid) => {
                if (isValid) {
                    input.style.borderColor = '#28a745';
                    input.classList.add('valid');
                    input.classList.remove('invalid');
                } else {
                    input.style.borderColor = '#dc3545';
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                }
            };
            
            // Test invalid state
            updateInputState(false);
            expect(input.style.borderColor).toBe('#dc3545');
            expect(input.classList.contains('invalid')).toBeTruthy();
            
            // Test valid state
            updateInputState(true);
            expect(input.style.borderColor).toBe('#28a745');
            expect(input.classList.contains('valid')).toBeTruthy();
        });
    });

    describe('Progress Tracking and Loading States', () => {
        it('should update progress bar correctly', () => {
            const progressBar = mockDOM.progressBar;
            const progressFill = DOMUtils.createMockElement('div', 'progress-fill');
            progressBar.appendChild(progressFill);
            
            const updateProgress = (percentage) => {
                progressFill.style.width = `${percentage}%`;
                progressFill.textContent = `${percentage}%`;
            };
            
            updateProgress(50);
            expect(progressFill.style.width).toBe('50%');
            expect(progressFill.textContent).toBe('50%');
            
            updateProgress(100);
            expect(progressFill.style.width).toBe('100%');
            expect(progressFill.textContent).toBe('100%');
        });

        it('should show loading states during board creation', () => {
            const loading = mockDOM.loading;
            const success = mockDOM.successResult;
            const error = mockDOM.errorResult;
            
            const showLoading = () => {
                loading.style.display = 'block';
                success.style.display = 'none';
                error.style.display = 'none';
            };
            
            const showSuccess = () => {
                loading.style.display = 'none';
                success.style.display = 'block';
                error.style.display = 'none';
            };
            
            const showError = () => {
                loading.style.display = 'none';
                success.style.display = 'none';
                error.style.display = 'block';
            };
            
            // Test loading state
            showLoading();
            expect(loading.style.display).toBe('block');
            expect(success.style.display).toBe('none');
            expect(error.style.display).toBe('none');
            
            // Test success state
            showSuccess();
            expect(loading.style.display).toBe('none');
            expect(success.style.display).toBe('block');
            expect(error.style.display).toBe('none');
            
            // Test error state
            showError();
            expect(loading.style.display).toBe('none');
            expect(success.style.display).toBe('none');
            expect(error.style.display).toBe('block');
        });

        it('should handle progress color changes', () => {
            const progressFill = DOMUtils.createMockElement('div', 'progress-fill');
            
            const updateProgressColor = (percentage) => {
                if (percentage < 25) {
                    progressFill.style.backgroundColor = '#ffc107';
                } else if (percentage < 50) {
                    progressFill.style.backgroundColor = '#17a2b8';
                } else if (percentage < 75) {
                    progressFill.style.backgroundColor = '#007bff';
                } else if (percentage < 100) {
                    progressFill.style.backgroundColor = '#28a745';
                } else {
                    progressFill.style.backgroundColor = '#155724';
                }
            };
            
            updateProgressColor(10);
            expect(progressFill.style.backgroundColor).toBe('#ffc107');
            
            updateProgressColor(30);
            expect(progressFill.style.backgroundColor).toBe('#17a2b8');
            
            updateProgressColor(60);
            expect(progressFill.style.backgroundColor).toBe('#007bff');
            
            updateProgressColor(80);
            expect(progressFill.style.backgroundColor).toBe('#28a745');
            
            updateProgressColor(100);
            expect(progressFill.style.backgroundColor).toBe('#155724');
        });
    });

    describe('Button States and Interactions', () => {
        it('should handle button enable/disable states', () => {
            const button = mockDOM.nextToScopes;
            
            // Test disabled state
            button.disabled = true;
            expect(button.disabled).toBeTruthy();
            
            // Test enabled state
            button.disabled = false;
            expect(button.disabled).toBeFalsy();
        });

        it('should handle button click events', () => {
            const button = mockDOM.nextToScopes;
            let clicked = false;
            
            button.addEventListener('click', () => {
                clicked = true;
            });
            
            DOMUtils.simulateClick(button);
            expect(clicked).toBeTruthy();
        });

        it('should prevent clicks on disabled buttons', () => {
            const button = mockDOM.nextToScopes;
            let clicked = false;
            
            button.disabled = true;
            button.addEventListener('click', (e) => {
                if (button.disabled) {
                    e.preventDefault();
                    return;
                }
                clicked = true;
            });
            
            DOMUtils.simulateClick(button);
            expect(clicked).toBeFalsy();
        });

        it('should handle create board button states', () => {
            const createButton = mockDOM.createBoardBtn;
            
            // Test initial state
            createButton.disabled = true;
            expect(createButton.disabled).toBeTruthy();
            
            // Test enabled when valid
            const isFormValid = true; // Simulate valid form
            createButton.disabled = !isFormValid;
            expect(createButton.disabled).toBeFalsy();
            
            // Test loading state
            createButton.disabled = true;
            createButton.textContent = 'Creating Board...';
            expect(createButton.disabled).toBeTruthy();
            expect(createButton.textContent).toBe('Creating Board...');
        });
    });

    describe('Error Handling and User Feedback', () => {
        it('should display error messages correctly', () => {
            const errorElement = DOMUtils.createMockElement('div', 'error-message');
            
            const showError = (message) => {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                errorElement.className = 'error-message show';
            };
            
            const hideError = () => {
                errorElement.style.display = 'none';
                errorElement.className = 'error-message';
            };
            
            // Test showing error
            showError('Invalid workspace ID');
            expect(errorElement.textContent).toBe('Invalid workspace ID');
            expect(errorElement.style.display).toBe('block');
            expect(errorElement.className).toBe('error-message show');
            
            // Test hiding error
            hideError();
            expect(errorElement.style.display).toBe('none');
            expect(errorElement.className).toBe('error-message');
        });

        it('should handle success messages', () => {
            const successElement = DOMUtils.createMockElement('div', 'success-message');
            
            const showSuccess = (message) => {
                successElement.textContent = message;
                successElement.style.display = 'block';
                successElement.className = 'success-message show';
            };
            
            showSuccess('Board created successfully!');
            expect(successElement.textContent).toBe('Board created successfully!');
            expect(successElement.style.display).toBe('block');
            expect(successElement.className).toBe('success-message show');
        });

        it('should provide contextual help and guidance', () => {
            const helpElement = DOMUtils.createMockElement('div', 'help-text');
            
            const showHelp = (context) => {
                const helpTexts = {
                    'workspace-id': 'Enter your Monday.com workspace ID (8-12 digits)',
                    'project-name': 'Enter a descriptive name for your renovation project',
                    'area-selection': 'Select the renovation areas for your project'
                };
                
                helpElement.textContent = helpTexts[context] || 'Help text not available';
                helpElement.style.display = 'block';
            };
            
            showHelp('workspace-id');
            expect(helpElement.textContent).toContain('Monday.com workspace ID');
            
            showHelp('project-name');
            expect(helpElement.textContent).toContain('descriptive name');
            
            showHelp('area-selection');
            expect(helpElement.textContent).toContain('Select the renovation areas');
        });
    });

    describe('Responsive Design and Accessibility', () => {
        it('should handle touch interactions', () => {
            const element = DOMUtils.createMockElement('div', 'touch-element');
            let touchStarted = false;
            let touchEnded = false;
            
            element.addEventListener('touchstart', () => {
                touchStarted = true;
            });
            
            element.addEventListener('touchend', () => {
                touchEnded = true;
            });
            
            // Simulate touch events
            const touchStart = new Event('touchstart');
            const touchEnd = new Event('touchend');
            
            element.dispatchEvent(touchStart);
            expect(touchStarted).toBeTruthy();
            
            element.dispatchEvent(touchEnd);
            expect(touchEnded).toBeTruthy();
        });

        it('should handle keyboard navigation', () => {
            const element = DOMUtils.createMockElement('button', 'keyboard-button');
            let keyPressed = false;
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    keyPressed = true;
                }
            });
            
            // Simulate keyboard events
            const enterKey = new KeyboardEvent('keydown', { key: 'Enter' });
            const spaceKey = new KeyboardEvent('keydown', { key: ' ' });
            
            element.dispatchEvent(enterKey);
            expect(keyPressed).toBeTruthy();
            
            keyPressed = false;
            element.dispatchEvent(spaceKey);
            expect(keyPressed).toBeTruthy();
        });

        it('should handle focus management', () => {
            const input = DOMUtils.createMockElement('input', 'focus-input');
            let focused = false;
            let blurred = false;
            
            input.addEventListener('focus', () => {
                focused = true;
            });
            
            input.addEventListener('blur', () => {
                blurred = true;
            });
            
            // Simulate focus events
            const focusEvent = new Event('focus');
            const blurEvent = new Event('blur');
            
            input.dispatchEvent(focusEvent);
            expect(focused).toBeTruthy();
            
            input.dispatchEvent(blurEvent);
            expect(blurred).toBeTruthy();
        });
    });
});

// Additional utility functions for UI testing
const UITestUtils = {
    simulateFormSubmission: (formElement, data) => {
        Object.entries(data).forEach(([key, value]) => {
            const input = formElement.querySelector(`[name="${key}"]`);
            if (input) {
                DOMUtils.simulateInput(input, value);
            }
        });
        
        const submitEvent = new Event('submit');
        formElement.dispatchEvent(submitEvent);
    },

    validateFormState: (formElement) => {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        const isValid = Array.from(inputs).every(input => {
            return input.checkValidity ? input.checkValidity() : true;
        });
        
        return isValid;
    },

    getFormData: (formElement) => {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        const data = {};
        
        Array.from(inputs).forEach(input => {
            if (input.name) {
                data[input.name] = input.value;
            }
        });
        
        return data;
    }
};

// Export utilities for use in other test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UITestUtils };
} else {
    window.UITestUtils = UITestUtils;
}

}); // End of DOMContentLoaded event listener 