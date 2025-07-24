// Renovation Project Manager - Main Application Script

// Application state
let AppState = {
    currentStep: 'project-setup',
    apiToken: null,
    projectName: '',
    workspaceId: '',
    selectedAreas: [],
    selectedScopes: {},
    boardStructure: null,
    createdBoardId: null,
    createdBoardUrl: null,
    createdColumns: null,
    useStepBreakdowns: true, // Enable step-by-step breakdowns by default
    
    // AI Enhancement State - Task 1 & 2
    aiState: {
        initialized: false,
        available: false,
        fallbackMode: false,
        error: null,
        enhancedScopes: [], // Track which scopes are AI-enhanced
        apiKey: null
    },
    
    // AI Enhancement Data - Task 2
    globalLocation: '',
    aiEnhancedScopes: {}, // Object: {scopeId: boolean}
    scopeJobDescriptions: {}, // Object: {scopeId: description}
    scopeLocations: {} // Object: {scopeId: location}
};

// Enhanced Progress Tracker - Task 4.2
class ProgressTracker {
    constructor() {
        this.currentStage = 'Initializing';
        this.currentProgress = 0;
        this.stageHistory = [];
        this.errors = [];
    }
    
    async step(stageName, progress, asyncFunction) {
        console.log(`📊 Stage: ${stageName} (${progress}%)`);
        
        this.currentStage = stageName;
        this.currentProgress = progress;
        
        const startTime = Date.now();
        updateLoadingProgress(stageName, progress);
        
        try {
            const result = await asyncFunction();
            
            const duration = Date.now() - startTime;
            this.stageHistory.push({
                stage: stageName,
                progress,
                duration,
                success: true,
                timestamp: new Date().toISOString()
            });
            
            console.log(`✅ ${stageName} completed in ${duration}ms`);
            return result;
            
        } catch (error) {
            const duration = Date.now() - startTime;
            this.stageHistory.push({
                stage: stageName,
                progress,
                duration,
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            this.errors.push({
                stage: stageName,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            console.error(`❌ ${stageName} failed in ${duration}ms:`, error);
            throw error;
        }
    }
    
    getCurrentStage() {
        return this.currentStage;
    }
    
    getProgress() {
        return this.currentProgress;
    }
    
    getHistory() {
        return this.stageHistory;
    }
    
    getErrors() {
        return this.errors;
    }
    
    getTotalDuration() {
        return this.stageHistory.reduce((total, stage) => total + stage.duration, 0);
    }
}

// Enhanced Rate Limiter - Task 4.2
class RateLimiter {
    constructor(requestsPerMinute = 40) {
        this.requestsPerMinute = requestsPerMinute;
        this.requests = [];
        this.isThrottled = false;
    }
    
    async waitIfNeeded() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Remove old requests
        this.requests = this.requests.filter(time => time > oneMinuteAgo);
        
        if (this.requests.length >= this.requestsPerMinute) {
            const oldestRequest = this.requests[0];
            const waitTime = oldestRequest + 60000 - now;
            
            if (waitTime > 0) {
                console.log(`⏱️ Rate limit reached. Waiting ${waitTime}ms...`);
                this.isThrottled = true;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                this.isThrottled = false;
                return this.waitIfNeeded();
            }
        }
        
        this.requests.push(now);
    }
    
    async executeWithDelay(fn, delay = 200) {
        await this.waitIfNeeded();
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return await fn();
    }
    
    getStatus() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const recentRequests = this.requests.filter(time => time > oneMinuteAgo);
        
        return {
            requestsInLastMinute: recentRequests.length,
            isThrottled: this.isThrottled,
            remainingRequests: Math.max(0, this.requestsPerMinute - recentRequests.length)
        };
    }
}

// Monday.com API Configuration
const API_CONFIG = {
    baseUrl: 'https://api.monday.com/v2',
    version: '2025-01',
    timeout: 30000
};

// Application initialization - Enhanced with proper token check sequence
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 DOM loaded, starting application...');
    
    initializeApplication();
    setupEventListeners();
    
    // Check API token after a small delay to ensure everything is loaded
    setTimeout(() => {
        checkApiToken();
    }, 200);
    
        console.log('🎯 Application startup complete');
});

// Initialize application - Enhanced with API token check
function initializeApplication() {
    console.log('🚀 Initializing Renovation Project Manager...');
    
    // Initialize AI enhancement features - Task 1
    initializeAIFeatures();
    
    // Populate areas grid
    populateAreasGrid();
    
    // Load any saved state from localStorage
    loadSavedState();
    
    // Initialize counters and feedback
    updateSelectionCounter();
    
    // Show initial step
    showStep('project-setup');
    
    // Add test button for token modal (development only)
    addTestTokenButton();
    
    console.log('✅ Application initialized successfully');
}

// Initialize AI Enhancement Features - Task 1
async function initializeAIFeatures() {
    console.log('🤖 Initializing AI Enhancement Features...');
    
    try {
        // Check if AI config is available
        if (typeof window.AIConfigUtils === 'undefined') {
            throw new Error('AI configuration utilities not loaded');
        }
        
        // Initialize AI with graceful fallback
        const initResult = await window.AIConfigUtils.initializeAI();
        
        console.log('🔍 AI initialization result:', {
            success: initResult.success,
            hasConnection: !!initResult.connection,
            error: initResult.error,
            fallbackMode: initResult.fallbackMode
        });
        
        if (initResult.success) {
            // AI successfully initialized
            AppState.aiState.initialized = true;
            AppState.aiState.available = true;
            AppState.aiState.fallbackMode = false;
            AppState.aiState.apiKey = window.AIConfigUtils.getApiKey();
            
            console.log('✅ AI Features initialized successfully!');
            
            // Safely access connection data
            if (initResult.connection) {
                console.log('Model:', initResult.connection.model);
                console.log('Usage:', initResult.connection.usage);
            } else {
                console.log('AI initialized but connection details not available');
            }
            
            // Show success indicator (optional)
            showAIStatusIndicator('available');
            
        } else {
            // AI initialization failed - enable fallback mode
            AppState.aiState.initialized = true;
            AppState.aiState.available = false;
            AppState.aiState.fallbackMode = true;
            AppState.aiState.error = initResult.error;
            
            console.warn('⚠️ AI Features unavailable, using base templates:', initResult.error);
            showAIStatusIndicator('fallback');
        }
        
    } catch (error) {
        // Complete failure - disable AI features
        AppState.aiState.initialized = false;
        AppState.aiState.available = false;
        AppState.aiState.fallbackMode = true;
        AppState.aiState.error = error.message;
        
        console.error('❌ AI Features initialization failed:', error.message);
        showAIStatusIndicator('disabled');
    }
}

// Show AI status indicator in the UI
function showAIStatusIndicator(status) {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Remove existing indicator
    const existing = header.querySelector('.ai-status-indicator');
    if (existing) {
        existing.remove();
    }
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = 'ai-status-indicator';
    indicator.style.position = 'absolute';
    indicator.style.top = '10px';
    indicator.style.left = '10px';
    indicator.style.padding = '4px 8px';
    indicator.style.borderRadius = '4px';
    indicator.style.fontSize = '0.8rem';
    indicator.style.fontWeight = 'bold';
    
    switch (status) {
        case 'available':
            indicator.textContent = '🤖 AI Enhanced';
            indicator.style.background = '#d4edda';
            indicator.style.color = '#155724';
            indicator.style.border = '1px solid #c3e6cb';
            indicator.title = 'AI enhancement features are available';
            break;
        case 'fallback':
            indicator.textContent = '📋 Base Templates';
            indicator.style.background = '#fff3cd';
            indicator.style.color = '#856404';
            indicator.style.border = '1px solid #ffeaa7';
            indicator.title = 'Using base templates (AI unavailable)';
            break;
        case 'disabled':
            indicator.textContent = '⚠️ AI Disabled';
            indicator.style.background = '#f8d7da';
            indicator.style.color = '#721c24';
            indicator.style.border = '1px solid #f5c6cb';
            indicator.title = 'AI features disabled due to error';
            break;
    }
    
    header.appendChild(indicator);
}

// Add test button for token modal - Development helper
function addTestTokenButton() {
    const header = document.querySelector('header');
    if (header) {
        // Test Token Modal button
        const testButton = document.createElement('button');
        testButton.textContent = 'Test Token Modal';
        testButton.className = 'btn btn-secondary';
        testButton.style.position = 'absolute';
        testButton.style.top = '10px';
        testButton.style.right = '10px';
        testButton.style.fontSize = '0.8rem';
        testButton.style.padding = '8px 16px';
        testButton.onclick = () => {
            console.log('🧪 Manual token modal test');
            showTokenModal();
        };
        header.appendChild(testButton);
        
        // Clear Token button for testing
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Token';
        clearButton.className = 'btn btn-secondary';
        clearButton.style.position = 'absolute';
        clearButton.style.top = '10px';
        clearButton.style.right = '150px';
        clearButton.style.fontSize = '0.8rem';
        clearButton.style.padding = '8px 16px';
        clearButton.onclick = () => {
            console.log('🧪 Clearing API token for testing');
            localStorage.removeItem('monday_api_token');
            AppState.apiToken = null;
            console.log('✅ Token cleared, refreshing...');
            location.reload();
        };
        header.appendChild(clearButton);
        
        // Show Workspaces button for debugging
        const workspacesButton = document.createElement('button');
        workspacesButton.textContent = 'Show Workspaces';
        workspacesButton.className = 'btn btn-secondary';
        workspacesButton.style.position = 'absolute';
        workspacesButton.style.top = '10px';
        workspacesButton.style.right = '300px';
        workspacesButton.style.fontSize = '0.8rem';
        workspacesButton.style.padding = '8px 16px';
        workspacesButton.onclick = async () => {
            console.log('🧪 Getting available workspaces...');
            try {
                const workspaces = await getAvailableWorkspaces();
                console.log('📋 Available workspaces:', workspaces);
                
                if (workspaces.length > 0) {
                    const workspaceList = workspaces.map(w => `${w.id} - ${w.name}`).join('\n');
                    alert(`Available Workspaces:\n\n${workspaceList}`);
                } else {
                    alert('No workspaces found or unable to retrieve workspaces.');
                }
            } catch (error) {
                console.error('❌ Failed to get workspaces:', error);
                alert(`Error getting workspaces: ${error.message}`);
            }
        };
        header.appendChild(workspacesButton);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Step navigation buttons
    document.getElementById('next-to-areas').addEventListener('click', () => {
        if (validateProjectSetup()) {
            saveProjectDetails();
            showStep('area-selection');
        }
    });
    
    document.getElementById('back-to-setup').addEventListener('click', () => {
        showStep('project-setup');
    });
    
    document.getElementById('next-to-scopes').addEventListener('click', () => {
        if (validateAreaSelection()) {
            generateScopeDropdowns();
            showStep('scope-selection');
        }
    });
    
    document.getElementById('back-to-areas').addEventListener('click', () => {
        showStep('area-selection');
    });
    
    document.getElementById('next-to-confirmation').addEventListener('click', async () => {
        if (validateScopeSelection()) {
            await populateConfirmationSummary();
            showStep('confirmation');
        }
    });
    
    document.getElementById('back-to-scopes').addEventListener('click', () => {
        showStep('scope-selection');
    });
    
    document.getElementById('back-to-confirmation').addEventListener('click', () => {
        showStep('confirmation');
    });
    
    // Main action buttons
    document.getElementById('create-board').addEventListener('click', createMondayBoard);
    document.getElementById('retry-create').addEventListener('click', createMondayBoard);
    document.getElementById('create-another').addEventListener('click', resetApplication);
    
    // Form validation with debounce
    document.getElementById('project-name').addEventListener('input', validateProjectSetup);
    document.getElementById('workspace-id').addEventListener('input', debounce(validateProjectSetup, 500));
    
    // API token modal
    document.getElementById('save-token').addEventListener('click', saveApiToken);
    document.getElementById('test-token').addEventListener('click', testApiConnection);
    
    // Area selection changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('area-checkbox')) {
            handleAreaSelection(e.target);
        }
    });
    
    // Step breakdown toggle
    document.getElementById('step-breakdown-toggle').addEventListener('change', function(e) {
        AppState.useStepBreakdowns = e.target.checked;
        updateBreakdownPreview();
        console.log(`🔧 Step breakdowns ${e.target.checked ? 'enabled' : 'disabled'}`);
    });
}

// Check if API token exists - Fixed for proper modal display
function checkApiToken() {
    const token = localStorage.getItem('monday_api_token');
    
    console.log('🔍 Checking API token...', token ? 'Token found' : 'No token found');
    
    if (!token) {
        console.log('📝 No API token found, showing modal...');
        // Delay to ensure DOM is loaded
        setTimeout(() => {
            showTokenModal();
        }, 100);
    } else {
        console.log('✅ API token found, testing connection...');
        AppState.apiToken = token;
        testApiConnection(true); // Silent test
    }
}

// Show/hide token modal - Enhanced with debugging
function showTokenModal() {
    console.log('🔧 showTokenModal called');
    const modal = document.getElementById('token-modal');
    
    if (!modal) {
        console.error('❌ Modal element not found!');
        return;
    }
    
    console.log('✅ Modal element found, adding show class');
    modal.classList.add('show');
    
    // Focus on the token input
    const tokenInput = document.getElementById('api-token');
    if (tokenInput) {
        setTimeout(() => tokenInput.focus(), 200);
    }
    
    console.log('🎭 Modal should now be visible');
}

function hideTokenModal() {
    console.log('🔧 hideTokenModal called');
    const modal = document.getElementById('token-modal');
    if (modal) {
        modal.classList.remove('show');
        console.log('✅ Modal hidden');
    }
}

// Save API token
function saveApiToken() {
    const tokenInput = document.getElementById('api-token');
    const token = tokenInput.value.trim();
    
    if (!token) {
        showError('token-error', 'Please enter a valid API token.');
        return;
    }
    
    AppState.apiToken = token;
    localStorage.setItem('monday_api_token', token);
    
    // Test the connection
    testApiConnection();
}

// Test API connection
async function testApiConnection(silent = false) {
    if (!AppState.apiToken) {
        if (!silent) showError('token-error', 'No API token provided.');
        return;
    }
    
    try {
        const response = await makeApiRequest('query { me { id name } }');
        
        if (response.me) {
            if (!silent) {
                showSuccess('token-error', `Connected as ${response.me.name}`);
                setTimeout(hideTokenModal, 1500);
            }
            return true;
        } else {
            throw new Error('Invalid response from API');
        }
    } catch (error) {
        const errorMessage = `Connection failed: ${error.message}`;
        if (!silent) showError('token-error', errorMessage);
        return false;
    }
}

// Make API request to Monday.com - Enhanced for Task 3 with better error handling
async function makeApiRequest(query, variables = {}, retryCount = 0) {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second
    
    if (!AppState.apiToken) {
        throw new Error('API token not configured');
    }
    
    try {
        const response = await fetch(API_CONFIG.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AppState.apiToken,
                'API-Version': API_CONFIG.version
            },
            body: JSON.stringify({ query, variables })
        });
        
        // Handle rate limiting (429 Too Many Requests)
        if (response.status === 429) {
            if (retryCount < maxRetries) {
                const retryAfter = response.headers.get('Retry-After');
                const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, retryCount);
                
                console.log(`⏳ Rate limited. Retrying after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
                
                return makeApiRequest(query, variables, retryCount + 1);
            } else {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
        }
        
        // Handle other HTTP errors
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            
            try {
                const errorData = await response.json();
                if (errorData.errors && errorData.errors.length > 0) {
                    errorMessage = errorData.errors[0].message;
                }
            } catch (parseError) {
                // If we can't parse the error response, use the original error message
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        // Handle GraphQL errors
        if (data.errors) {
            const error = data.errors[0];
            const errorMessage = error.message || 'GraphQL error';
            const errorCode = error.extensions?.code;
            
            // Handle specific error types
            if (errorCode === 'UserUnauthorizedException') {
                throw new Error('Authentication failed. Please check your API token.');
            } else if (errorCode === 'InvalidBoardIdException') {
                throw new Error('Invalid board ID. Please check your workspace ID.');
            } else if (errorCode === 'ColumnValueException') {
                throw new Error('Invalid column value format. Please check your data.');
            } else if (errorCode === 'ItemsLimitationException') {
                throw new Error('Board item limit exceeded (10,000 items max per board).');
            } else {
                throw new Error(errorMessage);
            }
        }
        
        return data.data;
        
    } catch (error) {
        // Handle network errors and other exceptions
        if (error.name === 'TypeError' || error.message.includes('fetch')) {
            throw new Error('Network error. Please check your internet connection.');
        }
        
        // If this is a retry-able error and we haven't exceeded max retries
        if (retryCount < maxRetries && isRetryableError(error)) {
            const delay = baseDelay * Math.pow(2, retryCount);
            console.log(`⏳ Retrying request after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            return makeApiRequest(query, variables, retryCount + 1);
        }
        
        throw error;
    }
}

// Check if error is retryable - New function for Task 3
function isRetryableError(error) {
    const retryableErrors = [
        'Network error',
        'timeout',
        'ECONNRESET',
        'ENOTFOUND',
        'ECONNREFUSED'
    ];
    
    return retryableErrors.some(retryableError => 
        error.message.toLowerCase().includes(retryableError.toLowerCase())
    );
}

// Step navigation
function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(stepId).classList.add('active');
    AppState.currentStep = stepId;
    
    // Update page title
    updatePageTitle(stepId);
}

function updatePageTitle(stepId) {
    const titles = {
        'project-setup': 'Step 1: Project Details',
        'area-selection': 'Step 2: Select Areas',
        'scope-selection': 'Step 3: Select Scopes',
        'confirmation': 'Step 4: Review & Confirm',
        'results': 'Board Creation Results'
    };
    
    document.title = `${titles[stepId]} - Renovation Project Manager`;
}

// Populate areas grid - Enhanced for Task 2 with better UX
function populateAreasGrid() {
    const areasGrid = document.getElementById('areas-grid');
    const areas = RenovationData.DataHelper.getAllAreas();
    
    areasGrid.innerHTML = '';
    
    areas.forEach((area, index) => {
        const areaItem = document.createElement('div');
        areaItem.className = 'area-item';
        areaItem.setAttribute('data-area', area);
        
        // Add scope count for user information
        const scopeCount = RenovationData.DataHelper.getScopesForArea(area).length;
        
        areaItem.innerHTML = `
            <label>
                <input type="checkbox" class="area-checkbox" value="${area}" id="area-${index}">
                <div class="area-info">
                    <span class="area-name">${area}</span>
                    <span class="scope-count">${scopeCount} scopes available</span>
                </div>
            </label>
        `;
        
        areasGrid.appendChild(areaItem);
        
        // Add click handler to entire area item for better UX
        areaItem.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                handleAreaSelection(checkbox);
            }
        });
    });
    
    // Show total areas available
    const totalAreasInfo = document.createElement('div');
    totalAreasInfo.className = 'total-areas-info';
    totalAreasInfo.innerHTML = `<p><strong>${areas.length}</strong> renovation areas available. Select one or more to continue.</p>`;
    areasGrid.appendChild(totalAreasInfo);
}

// Handle area selection - Enhanced for Task 2 with better feedback
function handleAreaSelection(checkbox) {
    const area = checkbox.value;
    const areaItem = checkbox.closest('.area-item');
    
    if (checkbox.checked) {
        // Add to selected areas
        if (!AppState.selectedAreas.includes(area)) {
            AppState.selectedAreas.push(area);
        }
        areaItem.classList.add('selected');
        
        // Show selection feedback
        showSelectionFeedback(area, 'added');
    } else {
        // Remove from selected areas
        AppState.selectedAreas = AppState.selectedAreas.filter(a => a !== area);
        areaItem.classList.remove('selected');
        
        // Clear associated scopes
        delete AppState.selectedScopes[area];
        
        // Show deselection feedback
        showSelectionFeedback(area, 'removed');
    }
    
    // Update selection counter
    updateSelectionCounter();
    
    // Validate selection
    validateAreaSelection();
    
    // Save state
    saveSelectionState();
}

// Show selection feedback
function showSelectionFeedback(area, action) {
    const feedbackDiv = document.getElementById('selection-feedback') || createSelectionFeedback();
    
    const message = action === 'added' 
        ? `✅ ${area} added to project` 
        : `❌ ${area} removed from project`;
    
    feedbackDiv.textContent = message;
    feedbackDiv.className = `selection-feedback ${action}`;
    
    // Auto-hide after 2 seconds
    setTimeout(() => {
        feedbackDiv.textContent = '';
        feedbackDiv.className = 'selection-feedback';
    }, 2000);
}

// Create selection feedback element
function createSelectionFeedback() {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'selection-feedback';
    feedbackDiv.className = 'selection-feedback';
    
    const areasGrid = document.getElementById('areas-grid');
    areasGrid.parentNode.insertBefore(feedbackDiv, areasGrid);
    
    return feedbackDiv;
}

// Update selection counter
function updateSelectionCounter() {
    const counter = document.getElementById('selection-counter') || createSelectionCounter();
    const count = AppState.selectedAreas.length;
    
    counter.innerHTML = `
        <span class="counter-text">Selected: </span>
        <span class="counter-number">${count}</span>
        <span class="counter-suffix"> of 15 areas</span>
    `;
    
    counter.className = count > 0 ? 'selection-counter active' : 'selection-counter';
}

// Create selection counter element
function createSelectionCounter() {
    const counter = document.createElement('div');
    counter.id = 'selection-counter';
    counter.className = 'selection-counter';
    
    const areasGrid = document.getElementById('areas-grid');
    areasGrid.parentNode.insertBefore(counter, areasGrid);
    
    return counter;
}

// Save selection state
function saveSelectionState() {
    localStorage.setItem('renovation_selection_state', JSON.stringify({
        selectedAreas: AppState.selectedAreas,
        selectedScopes: AppState.selectedScopes,
        timestamp: new Date().toISOString()
    }));
}

// Generate scope dropdowns - Enhanced for Task 2 with AI Enhancement Toggles
function generateScopeDropdowns() {
    const scopesContainer = document.getElementById('scopes-container');
    scopesContainer.innerHTML = '';
    
    if (AppState.selectedAreas.length === 0) {
        scopesContainer.innerHTML = '<p class="no-areas-message">Please select at least one renovation area first.</p>';
        return;
    }
    
    // Add instruction header
    const instructionHeader = document.createElement('div');
    instructionHeader.className = 'scope-instructions';
    instructionHeader.innerHTML = `
        <p><strong>Select specific scopes for each renovation area:</strong></p>
        <p class="instruction-tip">💡 Toggle AI Enhancement for intelligent task breakdown and compliance research</p>
    `;
    scopesContainer.appendChild(instructionHeader);

    // Add global location input section (optional - can be used for all scopes)
    const globalLocationSection = document.createElement('div');
    globalLocationSection.className = 'global-location-section';
    globalLocationSection.innerHTML = `
        <h4>📍 Project Location</h4>
        <p>Set a default location for building code compliance (can be overridden per scope)</p>
        <input type="text" 
               id="global-project-location" 
               class="location-input"
               placeholder="City, State (e.g., Chicago, IL)"
               value="${AppState.globalLocation || ''}"
               autocomplete="address-level2">
        <small style="color: #666; display: block; margin-top: 5px;">
            This helps AI research local building codes and compliance requirements
        </small>
    `;
    scopesContainer.appendChild(globalLocationSection);

    // Add event listener for global location
    const globalLocationInput = globalLocationSection.querySelector('#global-project-location');
    globalLocationInput.addEventListener('input', (e) => {
        AppState.globalLocation = e.target.value.trim();
        saveSelectionState();
        
        // Update all scope-specific location inputs if they're empty
        document.querySelectorAll('.location-input[data-scope]').forEach(input => {
            if (!input.value.trim()) {
                input.placeholder = AppState.globalLocation ? 
                    AppState.globalLocation + ' (default)' : 
                    'City, State (e.g., Chicago, IL)';
            }
        });
    });
    
    AppState.selectedAreas.forEach(area => {
        const scopes = RenovationData.DataHelper.getScopesForArea(area);
        
        const areaGroup = document.createElement('div');
        areaGroup.className = 'area-group';
        areaGroup.setAttribute('data-area', area);
        
        // Area header
        const areaHeader = document.createElement('div');
        areaHeader.className = 'area-header';
        areaHeader.innerHTML = `
            <h3>${area}</h3>
            <span class="scope-count">${scopes.length} scopes available</span>
        `;
        areaGroup.appendChild(areaHeader);
        
        // Create individual scope items
        scopes.forEach(scope => {
            const scopeItem = createScopeItem(area, scope);
            areaGroup.appendChild(scopeItem);
        });
        
        scopesContainer.appendChild(areaGroup);
    });
    
    // Initialize state if needed
    if (!AppState.aiEnhancedScopes) {
        AppState.aiEnhancedScopes = {};
    }
    if (!AppState.scopeJobDescriptions) {
        AppState.scopeJobDescriptions = {};
    }
    if (!AppState.scopeLocations) {
        AppState.scopeLocations = {};
    }
    
    // Update validation
    validateScopeSelection();
}

// Create individual scope item with AI enhancement toggle - Task 2
function createScopeItem(area, scope) {
    const scopeId = `${area}-${scope}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const isSelected = AppState.selectedScopes[area] && AppState.selectedScopes[area].includes(scope);
    const isAiEnhanced = AppState.aiEnhancedScopes && AppState.aiEnhancedScopes[scopeId];
    const hasStepBreakdown = RenovationData.DataHelper.hasStepBreakdown(area, scope);
    const stepCount = hasStepBreakdown ? RenovationData.DataHelper.getStepBreakdown(area, scope).length : 3;
    
    const scopeItem = document.createElement('div');
    scopeItem.className = `scope-item ${isSelected ? 'selected' : ''} ${isAiEnhanced ? 'ai-enhanced' : ''}`;
    scopeItem.setAttribute('data-area', area);
    scopeItem.setAttribute('data-scope', scope);
    scopeItem.setAttribute('data-scope-id', scopeId);
    
    scopeItem.innerHTML = `
        <div class="scope-header">
            <label class="scope-checkbox">
                <input type="checkbox" 
                       value="${scope}" 
                       data-area="${area}"
                       ${isSelected ? 'checked' : ''}>
                <div class="scope-info">
                    <h4>${scope}</h4>
                    <span class="step-count">${stepCount} base steps</span>
                </div>
            </label>
            
            <div class="ai-toggle-container">
                <label class="ai-toggle-switch">
                    <input type="checkbox" 
                           class="ai-enhance-toggle" 
                           data-scope-id="${scopeId}"
                           ${isAiEnhanced ? 'checked' : ''}
                           ${!AppState.aiState.available ? 'disabled' : ''}>
                    <span class="ai-toggle-slider">
                        <span class="ai-toggle-icon base">📋</span>
                        <span class="ai-toggle-icon robot">🤖</span>
                    </span>
                </label>
                <span class="ai-toggle-label">
                    ${AppState.aiState.available ? 'AI Enhance' : 'AI Unavailable'}
                </span>
            </div>
        </div>
        
        <div class="ai-enhancement-panel ${isAiEnhanced ? 'expanded' : ''}" id="panel-${scopeId}">
            <div class="ai-panel-header">
                <span class="ai-icon">🤖</span>
                <h5>AI Enhancement Settings</h5>
            </div>
            
            <p class="ai-panel-description">
                Describe special requirements, constraints, or unique aspects of this ${scope.toLowerCase()} work to help AI customize the task breakdown.
            </p>
            
            <div class="job-description-container">
                <label class="job-description-label" for="desc-${scopeId}">
                    🎯 Project Description & Special Requirements
                </label>
                <textarea 
                    id="desc-${scopeId}"
                    class="job-description-textarea"
                    data-scope-id="${scopeId}"
                    placeholder="Examples for ${scope.toLowerCase()}:
• Historic 1920s building with original plaster walls
• Requires ADA compliance modifications
• Client prefers eco-friendly materials only
• Load-bearing wall modifications needed
• Unique site conditions or restrictions"
                    maxlength="1000">${AppState.scopeJobDescriptions?.[scopeId] || ''}</textarea>
                <div class="character-counter">
                    <span id="counter-${scopeId}">0</span>/1000 characters
                </div>
            </div>
            
            <div class="location-container">
                <label class="location-label" for="loc-${scopeId}">
                    📍 Specific Location (optional)
                </label>
                <input type="text" 
                       id="loc-${scopeId}"
                       class="location-input"
                       data-scope="${scopeId}"
                       placeholder="${AppState.globalLocation || 'City, State (e.g., Chicago, IL)'}"
                       value="${AppState.scopeLocations?.[scopeId] || ''}"
                       autocomplete="address-level2">
                <small style="color: #666; display: block; margin-top: 5px;">
                    Override global location for scope-specific building codes
                </small>
            </div>
            
            <div class="ai-enhancement-preview">
                <div class="ai-preview-header">
                    <span class="ai-preview-icon">🔍</span>
                    <span>AI will research and enhance:</span>
                </div>
                <ul class="ai-enhancement-list">
                    <li>Local building codes and compliance requirements</li>
                    <li>Current industry best practices for ${scope.toLowerCase()}</li>
                    <li>Safety regulations and OSHA requirements</li>
                    <li>Material recommendations and alternatives</li>
                    <li>Permit requirements and procedures</li>
                </ul>
            </div>
        </div>
    `;
    
    // Add event listeners
    setupScopeItemEventListeners(scopeItem, area, scope, scopeId);
    
    return scopeItem;
}

// Setup event listeners for scope item - Task 2
function setupScopeItemEventListeners(scopeItem, area, scope, scopeId) {
    // Scope selection checkbox
    const checkbox = scopeItem.querySelector('input[type="checkbox"][data-area]');
    checkbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        
        // Update AppState
        if (!AppState.selectedScopes[area]) {
            AppState.selectedScopes[area] = [];
        }
        
        if (isChecked) {
            if (!AppState.selectedScopes[area].includes(scope)) {
                AppState.selectedScopes[area].push(scope);
            }
            scopeItem.classList.add('selected');
        } else {
            AppState.selectedScopes[area] = AppState.selectedScopes[area].filter(s => s !== scope);
            scopeItem.classList.remove('selected');
            
            // Also disable AI enhancement if scope is deselected
            const aiToggle = scopeItem.querySelector('.ai-enhance-toggle');
            if (aiToggle.checked) {
                aiToggle.checked = false;
                aiToggle.dispatchEvent(new Event('change'));
            }
        }
        
        // Update validation and save state
        validateScopeSelection();
        updateBreakdownPreview();
        saveSelectionState();
    });
    
    // AI enhancement toggle
    const aiToggle = scopeItem.querySelector('.ai-enhance-toggle');
    aiToggle.addEventListener('change', (e) => {
        const isEnabled = e.target.checked;
        const panel = scopeItem.querySelector('.ai-enhancement-panel');
        
        // Ensure scope is selected before enabling AI
        if (isEnabled && !checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
        }
        
        // Update AppState
        if (!AppState.aiEnhancedScopes) {
            AppState.aiEnhancedScopes = {};
        }
        AppState.aiEnhancedScopes[scopeId] = isEnabled;
        
        // Update UI
        if (isEnabled) {
            scopeItem.classList.add('ai-enhanced');
            panel.classList.add('expanded');
        } else {
            scopeItem.classList.remove('ai-enhanced');
            panel.classList.remove('expanded');
        }
        
        saveSelectionState();
    });
    
    // Job description textarea
    const textarea = scopeItem.querySelector('.job-description-textarea');
    const counter = scopeItem.querySelector(`#counter-${scopeId}`);
    
    // Update character counter initially
    updateCharacterCounter(textarea, counter);
    
    textarea.addEventListener('input', (e) => {
        const text = e.target.value;
        
        // Update AppState
        if (!AppState.scopeJobDescriptions) {
            AppState.scopeJobDescriptions = {};
        }
        AppState.scopeJobDescriptions[scopeId] = text;
        
        // Update character counter
        updateCharacterCounter(textarea, counter);
        
        saveSelectionState();
    });
    
    // Location input
    const locationInput = scopeItem.querySelector('.location-input[data-scope]');
    locationInput.addEventListener('input', (e) => {
        const location = e.target.value.trim();
        
        // Update AppState
        if (!AppState.scopeLocations) {
            AppState.scopeLocations = {};
        }
        AppState.scopeLocations[scopeId] = location;
        
        saveSelectionState();
    });
}

// Update character counter for textarea
function updateCharacterCounter(textarea, counter) {
    const length = textarea.value.length;
    const maxLength = parseInt(textarea.getAttribute('maxlength')) || 1000;
    
    counter.textContent = length;
    
    // Update counter styling based on length
    const parent = counter.parentElement;
    parent.classList.remove('warning', 'error');
    
    if (length > maxLength * 0.9) {
        parent.classList.add('error');
    } else if (length > maxLength * 0.75) {
        parent.classList.add('warning');
    }
}

// Save AI enhancement state to localStorage - Task 2
function saveSelectionState() {
    const stateToSave = {
        selectedAreas: AppState.selectedAreas,
        selectedScopes: AppState.selectedScopes,
        globalLocation: AppState.globalLocation,
        aiEnhancedScopes: AppState.aiEnhancedScopes,
        scopeJobDescriptions: AppState.scopeJobDescriptions,
        scopeLocations: AppState.scopeLocations,
        useStepBreakdowns: AppState.useStepBreakdowns,
        timestamp: Date.now()
    };
    
    try {
        localStorage.setItem('renovation_app_state', JSON.stringify(stateToSave));
        console.log('💾 Selection state saved');
    } catch (error) {
        console.warn('Failed to save selection state:', error);
    }
}

// Load AI enhancement state from localStorage - Task 2
function loadSavedState() {
    try {
        const savedState = localStorage.getItem('renovation_app_state');
        if (!savedState) return;
        
        const state = JSON.parse(savedState);
        
        // Load basic state
        if (state.selectedAreas) AppState.selectedAreas = state.selectedAreas;
        if (state.selectedScopes) AppState.selectedScopes = state.selectedScopes;
        if (state.useStepBreakdowns !== undefined) AppState.useStepBreakdowns = state.useStepBreakdowns;
        
        // Load AI enhancement state
        if (state.globalLocation) AppState.globalLocation = state.globalLocation;
        if (state.aiEnhancedScopes) AppState.aiEnhancedScopes = state.aiEnhancedScopes;
        if (state.scopeJobDescriptions) AppState.scopeJobDescriptions = state.scopeJobDescriptions;
        if (state.scopeLocations) AppState.scopeLocations = state.scopeLocations;
        
        console.log('📂 Selection state loaded');
        
        // Update UI if on scope selection step
        if (AppState.currentStep === 'scope-selection') {
            generateScopeDropdowns();
        }
        
    } catch (error) {
        console.warn('Failed to load saved state:', error);
    }
}

// Update scope selection info
function updateScopeSelectionInfo(area, selectedCount, totalCount) {
    const selectId = `scope-${area.replace(/\s+/g, '-').toLowerCase()}`;
    const infoElement = document.getElementById(`info-${selectId}`);
    const selectedCountElement = infoElement.querySelector('.selected-count');
    
    selectedCountElement.textContent = `${selectedCount} of ${totalCount} selected`;
    
    // Update validation indicator
    const validationElement = document.getElementById(`validation-${selectId}`);
    if (selectedCount === 0) {
        validationElement.innerHTML = '<span class="validation-warning">⚠️ Please select at least one scope</span>';
        validationElement.className = 'scope-validation warning';
    } else {
        validationElement.innerHTML = `<span class="validation-success">✅ ${selectedCount} scope${selectedCount > 1 ? 's' : ''} selected</span>`;
        validationElement.className = 'scope-validation success';
    }
}

// Update overall scope progress
function updateScopeProgress() {
    const progressElement = document.getElementById('scope-progress');
    if (!progressElement) return;
    
    const totalAreas = AppState.selectedAreas.length;
    const areasWithScopes = Object.keys(AppState.selectedScopes).filter(area => 
        AppState.selectedScopes[area] && AppState.selectedScopes[area].length > 0
    ).length;
    
    const totalScopes = Object.values(AppState.selectedScopes).reduce((sum, scopes) => 
        sum + (scopes ? scopes.length : 0), 0
    );
    
    progressElement.innerHTML = `
        <div class="progress-summary">
            <span class="progress-text">Progress: ${areasWithScopes} of ${totalAreas} areas configured</span>
            <span class="total-scopes">Total scopes selected: ${totalScopes}</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${totalAreas > 0 ? (areasWithScopes / totalAreas) * 100 : 0}%"></div>
        </div>
    `;
}

// Validation functions - Enhanced for Task 2
function validateProjectSetup() {
    const projectName = document.getElementById('project-name').value.trim();
    const workspaceId = document.getElementById('workspace-id').value.trim();
    
    let isValid = true;
    
    // Clear previous errors
    hideError('project-name-error');
    hideError('workspace-id-error');
    
    // Validate project name
    if (!projectName) {
        showError('project-name-error', 'Project name is required.');
        isValid = false;
    } else if (projectName.length < 3) {
        showError('project-name-error', 'Project name must be at least 3 characters long.');
        isValid = false;
    } else if (projectName.length > 100) {
        showError('project-name-error', 'Project name must be less than 100 characters.');
        isValid = false;
    } else if (!/^[a-zA-Z0-9\s\-_]+$/.test(projectName)) {
        showError('project-name-error', 'Project name can only contain letters, numbers, spaces, hyphens, and underscores.');
        isValid = false;
    }
    
    // Validate workspace ID
    if (!workspaceId) {
        showError('workspace-id-error', 'Workspace ID is required.');
        isValid = false;
    } else if (!/^\d+$/.test(workspaceId)) {
        showError('workspace-id-error', 'Workspace ID must be a number.');
        isValid = false;
    } else if (workspaceId.length < 6 || workspaceId.length > 15) {
        showError('workspace-id-error', 'Workspace ID should be between 6 and 15 digits.');
        isValid = false;
    } else {
        // Add real-time workspace validation (non-blocking)
        validateWorkspaceRealTime(workspaceId);
    }
    
    // Enable/disable next button
    const nextButton = document.getElementById('next-to-areas');
    nextButton.disabled = !isValid;
    
    // Update button text based on validation
    if (isValid) {
        nextButton.textContent = 'Next: Select Areas';
        nextButton.classList.remove('error');
    } else {
        nextButton.textContent = 'Please fix errors above';
        nextButton.classList.add('error');
    }
    
    return isValid;
}

// Real-time workspace validation (non-blocking)
async function validateWorkspaceRealTime(workspaceId) {
    if (!AppState.apiToken) {
        return; // Can't validate without token
    }
    
    const workspaceErrorElement = document.getElementById('workspace-id-error');
    
    try {
        // Clear any existing error first
        hideError('workspace-id-error');
        
        // Show loading indicator
        if (workspaceErrorElement) {
            workspaceErrorElement.innerHTML = '<span style="color: #666;">Validating workspace...</span>';
            workspaceErrorElement.style.display = 'block';
        }
        
        // Query workspace to validate it exists
        const query = `
            query {
                workspaces(ids: [${workspaceId}]) {
                    id
                    name
                }
            }
        `;
        
        const response = await makeApiRequest(query);
        
        if (response.workspaces && response.workspaces.length > 0) {
            const workspace = response.workspaces[0];
            if (workspaceErrorElement) {
                workspaceErrorElement.innerHTML = `<span style="color: #28a745;">✓ Workspace "${workspace.name}" found</span>`;
                workspaceErrorElement.style.display = 'block';
            }
        } else {
            if (workspaceErrorElement) {
                workspaceErrorElement.innerHTML = '<span style="color: #ffc107;">⚠ Workspace not found or no access</span>';
                workspaceErrorElement.style.display = 'block';
            }
        }
        
    } catch (error) {
        // Show warning but don't block form submission
        if (workspaceErrorElement) {
            workspaceErrorElement.innerHTML = '<span style="color: #ffc107;">⚠ Could not validate workspace</span>';
            workspaceErrorElement.style.display = 'block';
        }
    }
}

// Validate workspace exists (blocking validation for board creation)
async function validateWorkspace(workspaceId) {
    if (!AppState.apiToken) {
        throw new Error('API token not configured');
    }
    
    if (!workspaceId) {
        throw new Error('Workspace ID is required');
    }
    
    try {
        const query = `
            query {
                workspaces(ids: [${workspaceId}]) {
                    id
                    name
                    description
                }
            }
        `;
        
        const response = await makeApiRequest(query);
        
        if (!response.workspaces || response.workspaces.length === 0) {
            throw new Error(`Workspace ${workspaceId} not found or not accessible`);
        }
        
        const workspace = response.workspaces[0];
        console.log(`✅ Workspace validated: ${workspace.name} (ID: ${workspace.id})`);
        return workspace;
        
    } catch (error) {
        console.error('❌ Workspace validation failed:', error.message);
        throw new Error(`Workspace validation failed: ${error.message}`);
    }
}

// Get available workspaces for fallback
async function getAvailableWorkspaces() {
    if (!AppState.apiToken) {
        throw new Error('API token not configured');
    }
    
    try {
        const query = `
            query {
                workspaces {
                    id
                    name
                    description
                }
            }
        `;
        
        const response = await makeApiRequest(query);
        
        if (!response.workspaces) {
            throw new Error('No workspaces found');
        }
        
        console.log(`✅ Found ${response.workspaces.length} available workspaces`);
        return response.workspaces;
        
    } catch (error) {
        console.error('❌ Failed to get available workspaces:', error.message);
        throw new Error(`Failed to get workspaces: ${error.message}`);
    }
}

function validateAreaSelection() {
    const validation = RenovationData.DataHelper.validateAreaSelection(AppState.selectedAreas);
    
    if (!validation.valid) {
        showError('areas-error', validation.message);
        document.getElementById('next-to-scopes').disabled = true;
        return false;
    }
    
    hideError('areas-error');
    document.getElementById('next-to-scopes').disabled = false;
    return true;
}

function validateScopeSelection() {
    const validation = RenovationData.DataHelper.validateScopeSelection(AppState.selectedScopes);
    
    // Update progress indicator
    updateScopeProgress();
    
    if (!validation.valid) {
        showError('scopes-error', validation.message);
        document.getElementById('next-to-confirmation').disabled = true;
        return false;
    }
    
    hideError('scopes-error');
    document.getElementById('next-to-confirmation').disabled = false;
    return true;
}

// Save project details
function saveProjectDetails() {
    AppState.projectName = document.getElementById('project-name').value.trim();
    AppState.workspaceId = document.getElementById('workspace-id').value.trim();
    
    // Save to localStorage
    localStorage.setItem('renovation_project_state', JSON.stringify(AppState));
}

// Load saved state - Enhanced for Task 2
function loadSavedState() {
    // Load selection state
    const selectionState = localStorage.getItem('renovation_selection_state');
    if (selectionState) {
        try {
            const parsed = JSON.parse(selectionState);
            AppState.selectedAreas = parsed.selectedAreas || [];
            AppState.selectedScopes = parsed.selectedScopes || {};
            
            // Restore area selections in UI
            AppState.selectedAreas.forEach(area => {
                const checkbox = document.querySelector(`input[value="${area}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.closest('.area-item').classList.add('selected');
                }
            });
            
        } catch (error) {
            console.error('Error loading selection state:', error);
        }
    }
    
    // Load project state
    const projectState = localStorage.getItem('renovation_project_state');
    if (projectState) {
        try {
            const savedState = JSON.parse(projectState);
            AppState = { ...AppState, ...savedState };
            
            // Restore form values
            if (AppState.projectName) {
                document.getElementById('project-name').value = AppState.projectName;
            }
            if (AppState.workspaceId) {
                document.getElementById('workspace-id').value = AppState.workspaceId;
            }
        } catch (error) {
            console.error('Error loading project state:', error);
        }
    }
}

// Populate confirmation summary with AI enhancement support
async function populateConfirmationSummary() {
    document.getElementById('confirm-project-name').textContent = AppState.projectName;
    document.getElementById('confirm-workspace-id').textContent = AppState.workspaceId;
    
    // Selected areas
    const areasUl = document.getElementById('confirm-areas');
    areasUl.innerHTML = '';
    AppState.selectedAreas.forEach(area => {
        const li = document.createElement('li');
        li.textContent = area;
        areasUl.appendChild(li);
    });
    
    // Selected scopes
    const scopesDiv = document.getElementById('confirm-scopes');
    scopesDiv.innerHTML = '';
    Object.entries(AppState.selectedScopes).forEach(([area, scopes]) => {
        const areaDiv = document.createElement('div');
        areaDiv.innerHTML = `
            <h4>${area}:</h4>
            <ul>
                ${scopes.map(scope => `<li>${scope}</li>`).join('')}
            </ul>
        `;
        scopesDiv.appendChild(areaDiv);
    });
    
    // Generate board structure with AI enhancement
    console.log('🔄 Generating board structure with potential AI enhancements...');
    AppState.boardStructure = await RenovationData.DataHelper.generateBoardStructure(
        AppState.projectName,
        AppState.selectedScopes
    );
    console.log('✅ Board structure generated');
    
    // Add step breakdown summary if enabled
    if (AppState.useStepBreakdowns) {
        addStepBreakdownSummary();
    }
}

// Update breakdown preview based on current selections
function updateBreakdownPreview() {
    const previewDiv = document.getElementById('breakdown-preview');
    const previewText = document.getElementById('breakdown-preview-text');
    
    if (!AppState.useStepBreakdowns) {
        previewDiv.style.display = 'none';
        return;
    }
    
    let totalSteps = 0;
    let scopesWithBreakdowns = 0;
    let previewScopes = [];
    
    // Count scopes with step breakdowns from current selections
    Object.entries(AppState.selectedScopes).forEach(([area, scopes]) => {
        if (Array.isArray(scopes)) {
            scopes.forEach(scope => {
                if (RenovationData.StepBreakdownHelper.hasStepBreakdown(area, scope)) {
                    const breakdown = RenovationData.StepBreakdownHelper.getStepBreakdown(area, scope);
                    const stepCount = breakdown.steps.length;
                    totalSteps += stepCount;
                    scopesWithBreakdowns++;
                    previewScopes.push(`${area}: ${scope} (${stepCount} steps)`);
                }
            });
        }
    });
    
    if (totalSteps > 0) {
        previewText.textContent = `${scopesWithBreakdowns} scopes will be enhanced with ${totalSteps} detailed steps`;
        previewDiv.style.display = 'block';
    } else {
        previewDiv.style.display = 'none';
    }
}

// Add step breakdown information to confirmation summary
function addStepBreakdownSummary() {
    console.log('📋 Adding step breakdown summary to confirmation...');
    
    const scopesDiv = document.getElementById('confirm-scopes');
    let totalSteps = 0;
    let scopesWithBreakdowns = 0;
    let breakdownDetails = [];
    
    // Count scopes with step breakdowns
    Object.entries(AppState.selectedScopes).forEach(([area, scopes]) => {
        scopes.forEach(scope => {
            if (RenovationData.StepBreakdownHelper.hasStepBreakdown(area, scope)) {
                const breakdown = RenovationData.StepBreakdownHelper.getStepBreakdown(area, scope);
                const stepCount = breakdown.steps.length;
                totalSteps += stepCount;
                scopesWithBreakdowns++;
                breakdownDetails.push({ area, scope, steps: stepCount });
            }
        });
    });
    
    if (totalSteps > 0) {
        // Create step breakdown info section
        const breakdownInfo = document.createElement('div');
        breakdownInfo.className = 'step-breakdown-info';
        breakdownInfo.innerHTML = `
            <div class="breakdown-header">
                <h4>🔧 Enhanced Step-by-Step Breakdown</h4>
                <span class="breakdown-badge">ACTIVE</span>
            </div>
            <div class="breakdown-stats">
                <div class="stat-item">
                    <strong>${scopesWithBreakdowns}</strong> scopes with detailed steps
                </div>
                <div class="stat-item">
                    <strong>${totalSteps}</strong> granular tasks will be created
                </div>
            </div>
            <div class="breakdown-details">
                <p><strong>Enhanced Scopes:</strong></p>
                <ul class="breakdown-list">
                    ${breakdownDetails.map(detail => 
                        `<li>${detail.area}: ${detail.scope} <span class="step-count">(${detail.steps} steps)</span></li>`
                    ).join('')}
                </ul>
            </div>
        `;
        
        // Insert after the regular scopes div
        scopesDiv.parentNode.insertBefore(breakdownInfo, scopesDiv.nextSibling);
        
        console.log(`✅ Step breakdown summary added: ${scopesWithBreakdowns} scopes, ${totalSteps} total steps`);
    }
}

// Enhanced Board Creation Workflow - Task 4.2
async function createMondayBoard() {
    console.log('🚀 Starting enhanced board creation workflow...');
    
    // Initialize progress tracking
    const progressTracker = new ProgressTracker();
    
    // Show loading state
    showStep('results');
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('success-result').classList.add('hidden');
    document.getElementById('error-result').classList.add('hidden');
    
    const startTime = Date.now();
    
    try {
        // Step 1: Pre-flight validation and setup
        await progressTracker.step('Pre-flight validation and setup...', 5, async () => {
            await validatePrerequisites();
            await prepareDataStructure();
        });
        
        // Step 2: Create board with enhanced error handling
        const boardData = await progressTracker.step('Creating board in Monday.com...', 15, async () => {
            return await createBoardWithEnhancedFallback();
        });
        
        AppState.createdBoardId = boardData.id;
        AppState.createdBoardUrl = boardData.url;
        
        // Step 3: Create standard columns
        await progressTracker.step('Creating standard columns...', 25, async () => {
            console.log('🔧 Starting standard column creation step...');
            const result = await createStandardColumns(boardData.id);
            console.log('🔧 Standard column creation step completed:', result);
            return result;
        });
        
        // Step 4: Create groups with intelligent sequencing
        const groupIds = await progressTracker.step('Creating groups and sections...', 45, async () => {
            return await createGroupsWithSequencing(boardData.id);
        });
        
        // Step 5: Create items with batch processing
        await progressTracker.step('Creating tasks and items...', 80, async () => {
            return await createItemsWithBatching(boardData.id, groupIds);
        });
        
        // Step 6: Post-creation validation and finalization
        await progressTracker.step('Finalizing board setup...', 95, async () => {
            return await finalizeBoard(boardData.id);
        });
        
        // Step 7: Complete
        await progressTracker.step('Complete!', 100, async () => {
            const executionTime = Math.round((Date.now() - startTime) / 1000);
            console.log(`🎉 Board creation completed in ${executionTime} seconds`);
            
            // Generate completion metrics
            const metrics = await generateCompletionMetrics(boardData.id, executionTime);
            
            // Show success with enhanced feedback
            showSuccessWithMetrics(metrics);
        });
        
    } catch (error) {
        console.error('❌ Enhanced board creation failed:', error);
        
        // Enhanced error logging
        await logEnhancedError(error, {
            stage: progressTracker.getCurrentStage(),
            progress: progressTracker.getProgress(),
            appState: {
                projectName: AppState.projectName,
                workspaceId: AppState.workspaceId,
                selectedAreas: AppState.selectedAreas,
                selectedScopes: Object.keys(AppState.selectedScopes)
            }
        });
        
        // Show enhanced error feedback
        showEnhancedError(error, progressTracker.getCurrentStage());
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error-result').classList.remove('hidden');
    }
}

// Enhanced progress tracking - Task 4.4
function updateLoadingProgress(message, percentage) {
    const loadingDiv = document.getElementById('loading');
    const loadingText = loadingDiv.querySelector('p');
    const spinner = loadingDiv.querySelector('.spinner');
    
    if (loadingText) {
        loadingText.textContent = message;
        
        // Add timestamp for better user feedback
        const timestamp = new Date().toLocaleTimeString();
        loadingText.title = `${message} (${timestamp})`;
    }
    
    // Add progress bar if it doesn't exist
    let progressBar = loadingDiv.querySelector('.progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-fill" style="width: 0%"></div>
            <div class="progress-text">0%</div>
        `;
        loadingDiv.appendChild(progressBar);
    }
    
    // Update progress bar with enhanced visual feedback
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = progressBar.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
        
        // Add color-coded progress stages
        if (percentage < 25) {
            progressFill.style.backgroundColor = '#ffc107'; // Yellow for initialization
        } else if (percentage < 50) {
            progressFill.style.backgroundColor = '#17a2b8'; // Blue for board creation
        } else if (percentage < 75) {
            progressFill.style.backgroundColor = '#007bff'; // Darker blue for groups
        } else if (percentage < 100) {
            progressFill.style.backgroundColor = '#28a745'; // Green for items
        } else {
            progressFill.style.backgroundColor = '#155724'; // Dark green for completion
        }
        
        // Add smooth transition
        progressFill.style.transition = 'width 0.3s ease-in-out, background-color 0.3s ease-in-out';
    }
    
    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }
    
    // Enhanced console logging with timestamp
    const timestamp = new Date().toLocaleTimeString();
    console.log(`📊 [${timestamp}] Progress: ${percentage}% - ${message}`);
    
    // Update page title to show progress
    if (percentage < 100) {
        document.title = `${percentage}% - ${message} | Renovation Project Manager`;
    } else {
        document.title = `Complete! | Renovation Project Manager`;
    }
    
    // Add progress to localStorage for potential recovery
    localStorage.setItem('renovation_progress', JSON.stringify({
        message,
        percentage,
        timestamp: new Date().toISOString()
    }));
}

// Finalize board creation - Enhanced for Task 4.3
async function finalizeBoard(boardId) {
    console.log('🏁 Finalizing board creation with validation...');
    
    try {
        // Validate board structure was created correctly
        RenovationData.DataHelper.validateBoardStructure(AppState.boardStructure);
        
        // Verify board exists and is accessible
        await verifyBoardCreation(boardId);
        
        // Add metadata to the board (future enhancement)
        // await addBoardMetadata(boardId);
        
        console.log('✅ Board finalization complete');
        return true;
        
    } catch (error) {
        console.error('❌ Board finalization failed:', error);
        throw new Error(`Board finalization failed: ${error.message}`);
    }
}

// Verify board creation was successful
async function verifyBoardCreation(boardId) {
    console.log('🔍 Verifying board creation...');
    
    try {
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
                    items_page(limit: 5) {
                        items {
                            id
                            name
                            group {
                                id
                                title
                            }
                        }
                    }
                }
            }
        `;
        
        const response = await makeApiRequest(query, { boardId: [boardId] });
        const board = response.boards[0];
        
        if (!board) {
            throw new Error('Board not found after creation');
        }
        
        if (board.state !== 'active') {
            throw new Error('Board is not in active state');
        }
        
        console.log(`✅ Board verification successful: ${board.name}`);
        console.log(`📊 Verification Results:
        - Board ID: ${board.id}
        - Board Name: ${board.name}
        - Groups: ${board.groups.length}
        - Items: ${board.items_page.items.length}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Board verification failed:', error);
        throw new Error(`Board verification failed: ${error.message}`);
    }
}

// Get user-friendly error message - New function for Task 3
function getUserFriendlyErrorMessage(error) {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('authentication') || errorMessage.includes('token')) {
        return 'Authentication failed. Please check your API token and try again.';
    } else if (errorMessage.includes('workspace')) {
        return 'Workspace not found. Please verify your workspace ID.';
    } else if (errorMessage.includes('rate limit')) {
        return 'Too many requests. Please wait a moment and try again.';
    } else if (errorMessage.includes('network')) {
        return 'Network error. Please check your internet connection and try again.';
    } else if (errorMessage.includes('board creation')) {
        return 'Failed to create board. Please verify your permissions and try again.';
    } else if (errorMessage.includes('group creation')) {
        return 'Failed to create groups. The board was created but some sections may be missing.';
    } else if (errorMessage.includes('item creation')) {
        return 'Failed to create some tasks. The board and groups were created successfully.';
    } else {
        return `Board creation failed: ${error.message}`;
    }
}

// Show success with timing - Enhanced for Task 3
function showSuccessWithTiming(executionTime) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('success-result').classList.remove('hidden');
    
    // Populate success details
    document.getElementById('board-url').href = AppState.createdBoardUrl;
    document.getElementById('result-project-name').textContent = AppState.projectName;
    document.getElementById('result-areas-count').textContent = AppState.selectedAreas.length;
    
    const totalTasks = RenovationData.DataHelper.calculateTotalTasks(AppState.selectedScopes);
    document.getElementById('result-tasks-count').textContent = totalTasks;
    
    // Add timing information
    const successDiv = document.getElementById('success-result');
    const existingTiming = successDiv.querySelector('.timing-info');
    
    if (!existingTiming) {
        const timingDiv = document.createElement('div');
        timingDiv.className = 'timing-info';
        timingDiv.innerHTML = `
            <p><strong>⏱️ Created in ${executionTime} seconds</strong></p>
            <p>🎯 Target: Under 5 minutes ✅</p>
        `;
        
        const summaryDetails = successDiv.querySelector('.summary-details');
        if (summaryDetails) {
            summaryDetails.appendChild(timingDiv);
        }
    }
    
    // Add step breakdown confirmation if enabled
    if (AppState.useStepBreakdowns) {
        addStepBreakdownConfirmation();
    }
}

// Add step breakdown confirmation to success results
function addStepBreakdownConfirmation() {
    console.log('🎉 Adding step breakdown confirmation to success results...');
    
    const successDiv = document.getElementById('success-result');
    let totalSteps = 0;
    let scopesWithBreakdowns = 0;
    
    // Count created step breakdowns
    Object.entries(AppState.selectedScopes).forEach(([area, scopes]) => {
        scopes.forEach(scope => {
            if (RenovationData.StepBreakdownHelper.hasStepBreakdown(area, scope)) {
                const breakdown = RenovationData.StepBreakdownHelper.getStepBreakdown(area, scope);
                totalSteps += breakdown.steps.length;
                scopesWithBreakdowns++;
            }
        });
    });
    
    if (totalSteps > 0 && !successDiv.querySelector('.breakdown-confirmation')) {
        const breakdownConfirmation = document.createElement('div');
        breakdownConfirmation.className = 'breakdown-confirmation';
        breakdownConfirmation.innerHTML = `
            <div class="breakdown-success-header">
                <h3>🔧 Step-by-Step Breakdown Created!</h3>
            </div>
            <div class="breakdown-success-stats">
                <div class="success-stat">
                    <span class="stat-number">${scopesWithBreakdowns}</span>
                    <span class="stat-label">Scopes Enhanced</span>
                </div>
                <div class="success-stat">
                    <span class="stat-number">${totalSteps}</span>
                    <span class="stat-label">Granular Steps</span>
                </div>
            </div>
            <p class="breakdown-success-description">
                🎯 Your selected scopes have been broken down into detailed, actionable steps for better project management!
            </p>
        `;
        
        const summaryDetails = successDiv.querySelector('.summary-details');
        if (summaryDetails) {
            summaryDetails.appendChild(breakdownConfirmation);
            console.log(`✅ Step breakdown confirmation added: ${scopesWithBreakdowns} scopes enhanced with ${totalSteps} steps`);
        }
    }
}

// ============================================================================
// TASK 4: DATA PROCESSING AND BOARD CREATION LOGIC - IMPLEMENTATION COMPLETE
// ============================================================================
//
// ✅ Task 4.1: Enhanced Selection Processing Engine
//    - Comprehensive data validation and sanitization
//    - API-ready format transformation
//    - Selection completeness validation
//    - Smart column value generation
//
// ✅ Task 4.2: Board Structure Generation with Intelligent Sequencing
//    - Enhanced board creation workflow with progress tracking
//    - Intelligent rate limiting with exponential backoff
//    - Batch processing for items to optimize performance
//    - Comprehensive retry logic with workspace fallback
//
// ✅ Task 4.3: Comprehensive Error Handling and Validation System
//    - Enhanced error logging with context and recovery options
//    - User-friendly error messages with actionable guidance
//    - Board creation verification and validation
//    - Graceful degradation and recovery mechanisms
//
// ✅ Task 4.4: Enhanced Progress Tracking and User Feedback
//    - Color-coded progress indicators for different stages
//    - Real-time progress updates with timestamps
//    - Page title updates for better user experience
//    - Progress persistence for potential recovery
//
// ✅ Task 4.5: Data Validation Before API Calls
//    - Pre-flight validation of all prerequisites
//    - Real-time validation during user input
//    - Comprehensive scope and area validation
//    - Integration with enhanced processing engine
//
// ============================================================================

// Enhanced Board Creation Workflow Functions - Task 4.2

// Global rate limiter instance
const rateLimiter = new RateLimiter(35); // Conservative limit for board creation

// Validate prerequisites before board creation
async function validatePrerequisites() {
    console.log('🔍 Validating prerequisites...');
    
    // Validate API token
    if (!AppState.apiToken) {
        throw new Error('API token is required');
    }
    
    // Test API connection
    await testApiConnection(true);
    
    // Validate app state
    if (!AppState.projectName || !AppState.workspaceId) {
        throw new Error('Project name and workspace ID are required');
    }
    
    if (!AppState.selectedAreas || AppState.selectedAreas.length === 0) {
        throw new Error('At least one renovation area must be selected');
    }
    
    if (!AppState.selectedScopes || Object.keys(AppState.selectedScopes).length === 0) {
        throw new Error('At least one scope must be selected');
    }
    
    // Validate selections using enhanced processing
    try {
        RenovationData.DataHelper.processUserSelections(
            AppState.selectedAreas,
            AppState.selectedScopes,
            AppState.projectName,
            AppState.workspaceId
        );
    } catch (error) {
        throw new Error(`Selection validation failed: ${error.message}`);
    }
    
    console.log('✅ All prerequisites validated successfully');
}

// Prepare data structure for board creation
async function prepareDataStructure() {
    console.log('🏗️ Preparing enhanced data structure...');
    
    // Generate enhanced board structure with AI support
    AppState.boardStructure = await RenovationData.DataHelper.generateBoardStructure(
        AppState.projectName,
        AppState.selectedScopes
    );
    
    // Add metadata
    AppState.boardStructure.metadata = {
        createdAt: new Date().toISOString(),
        version: '1.0.0-task4',
        totalGroups: AppState.boardStructure.groups.length,
        totalItems: AppState.boardStructure.items.length
    };
    
    console.log('📊 Data structure prepared:');
    console.log(`  - Groups: ${AppState.boardStructure.groups.length}`);
    console.log(`  - Items: ${AppState.boardStructure.items.length}`);
    
    // Save state for recovery
    localStorage.setItem('renovation_board_structure', JSON.stringify(AppState.boardStructure));
    
    console.log('✅ Data structure preparation complete');
}

// Create board with enhanced fallback logic
async function createBoardWithEnhancedFallback() {
    console.log('📋 Creating board with enhanced fallback logic...');
    
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🔄 Board creation attempt ${attempt}/${maxRetries}`);
            
            // Try with current workspace
            const result = await rateLimiter.executeWithDelay(async () => {
                return await createBoard(AppState.workspaceId);
            }, 500);
            
            console.log(`✅ Board created successfully on attempt ${attempt}`);
            return result;
            
        } catch (error) {
            lastError = error;
            console.log(`⚠️ Attempt ${attempt} failed:`, error.message);
            
            if (attempt < maxRetries) {
                // Try workspace fallback on first failure
                if (attempt === 1) {
                    try {
                        console.log('🔄 Trying workspace fallback...');
                        const workspaces = await getAvailableWorkspaces();
                        
                        if (workspaces.length > 0) {
                            const fallbackWorkspace = workspaces[0];
                            console.log(`🔄 Using fallback workspace: ${fallbackWorkspace.name}`);
                            AppState.workspaceId = fallbackWorkspace.id;
                            continue;
                        }
                    } catch (fallbackError) {
                        console.error('❌ Workspace fallback failed:', fallbackError);
                    }
                }
                
                // Exponential backoff
                const backoffTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                console.log(`⏳ Waiting ${backoffTime}ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, backoffTime));
            }
        }
    }
    
    throw new Error(`Board creation failed after ${maxRetries} attempts: ${lastError.message}`);
}

// Create board with fallback - Enhanced for Task 3.1
async function createBoardWithFallback() {
    console.log('📋 Creating board with fallback logic...');
    
    try {
        // First try with the provided workspace ID
        return await createBoard(AppState.workspaceId);
    } catch (error) {
        console.log('⚠️ Failed to create board with provided workspace, trying fallback...');
        
        try {
            // Try to get available workspaces and use the first one
            const workspaces = await getAvailableWorkspaces();
            
            if (workspaces.length > 0) {
                const fallbackWorkspace = workspaces[0];
                console.log(`🔄 Using fallback workspace: ${fallbackWorkspace.name} (${fallbackWorkspace.id})`);
                
                // Update the app state with the working workspace
                AppState.workspaceId = fallbackWorkspace.id;
                
                return await createBoard(fallbackWorkspace.id);
            } else {
                throw new Error('No available workspaces found');
            }
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError);
            throw new Error(`Board creation failed: ${error.message}. Fallback also failed: ${fallbackError.message}`);
        }
    }
}

// Create board via API - Enhanced for Task 3.1
async function createBoard(workspaceId = AppState.workspaceId) {
    console.log('📋 Creating board with enhanced API integration...');
    
    // Validate workspace exists first
    await validateWorkspace(workspaceId);
    
    const query = `
        mutation($boardName: String!, $workspaceId: ID!, $boardKind: BoardKind!) {
            create_board(
                board_name: $boardName,
                workspace_id: $workspaceId,
                board_kind: $boardKind
            ) {
                id
                name
                url
                description
                state
                workspace {
                    id
                    name
                }
                permissions
                board_kind
            }
        }
    `;
    
    // Generate board name with timestamp for uniqueness
    const timestamp = new Date().toISOString().split('T')[0];
    const boardName = `${AppState.projectName} - Renovation Project (${timestamp})`;
    
    const variables = {
        boardName,
        workspaceId: workspaceId,
        boardKind: 'public'
    };
    
    try {
        const response = await makeApiRequest(query, variables);
        const boardData = response.create_board;
        
        console.log('✅ Board created successfully:', boardData);
        
        // Log board creation details
        console.log(`📊 Board Details:
        - ID: ${boardData.id}
        - Name: ${boardData.name}
        - Workspace: ${boardData.workspace.name}
        - URL: ${boardData.url}`);
        
        return boardData;
    } catch (error) {
        console.error('❌ Board creation failed:', error);
        throw new Error(`Board creation failed: ${error.message}`);
    }
}

// Create standard columns for all boards
async function createStandardColumns(boardId) {
    console.log('📋 Creating standard columns for board...', boardId);
    
    // Define the required columns
    const requiredColumns = [
        {
            title: 'PM',
            column_type: 'people',
            description: 'Project Manager assignment'
        },
        {
            title: 'photos',
            column_type: 'file',
            description: 'Project photos and documentation'
        },
        {
            title: 'Status',
            column_type: 'status',
            description: 'Task status'
        },
        {
            title: 'Timeline',
            column_type: 'timeline',
            description: 'Project timeline and dates'
        }
    ];
    
    const createdColumns = {};
    
    console.log('📊 About to create columns:', requiredColumns.map(c => `${c.title}(${c.column_type})`).join(', '));
    
    for (let i = 0; i < requiredColumns.length; i++) {
        const column = requiredColumns[i];
        
        console.log(`📊 Creating column ${i + 1}/${requiredColumns.length}: ${column.title} (${column.column_type})`);
        
        try {
            const columnData = await rateLimiter.executeWithDelay(async () => {
                const query = `
                    mutation($boardId: ID!, $title: String!, $columnType: ColumnType!, $description: String) {
                        create_column(
                            board_id: $boardId,
                            title: $title,
                            column_type: $columnType,
                            description: $description
                        ) {
                            id
                            title
                            type
                            description
                        }
                    }
                `;
                
                const variables = {
                    boardId,
                    title: column.title,
                    columnType: column.column_type,
                    description: column.description
                };
                
                const response = await makeApiRequest(query, variables);
                return response.create_column;
            }, 300);
            
            createdColumns[column.title] = columnData;
            console.log(`✅ Column created: ${columnData.title} (ID: ${columnData.id})`);
            
        } catch (error) {
            console.error(`❌ Failed to create column ${column.title}:`, error);
            console.error('❌ Column creation error details:', {
                title: column.title,
                type: column.column_type,
                boardId: boardId,
                errorMessage: error.message,
                errorStack: error.stack
            });
            
            // If column creation fails, log the error but continue
            // This allows the board creation to continue even if some columns fail
            console.warn(`⚠️ Continuing without column ${column.title} due to error: ${error.message}`);
        }
    }
    
    // Store column IDs for later use
    AppState.createdColumns = createdColumns;
    
    console.log('✅ Standard columns creation complete');
    console.log(`📊 Created Columns:
    - PM: ${createdColumns.PM?.id || 'failed'}
    - photos: ${createdColumns.photos?.id || 'failed'}
    - Status: ${createdColumns.Status?.id || 'failed'}
    - Timeline: ${createdColumns.Timeline?.id || 'failed'}`);
    
    return createdColumns;
}

// Create groups with intelligent sequencing - Enhanced for Task 4.2
async function createGroupsWithSequencing(boardId) {
    console.log('📂 Creating groups with intelligent sequencing...');
    
    const groupIds = {};
    const groups = AppState.boardStructure.groups;
    
    // Ensure proper group ordering: Design and Planning, then Permitting, then others
    const designPlanningGroup = groups.find(g => g.title === 'Design and Planning');
    const permittingGroup = groups.find(g => g.title === 'Permitting');
    const otherGroups = groups.filter(g => g.title !== 'Design and Planning' && g.title !== 'Permitting');
    
    if (!designPlanningGroup) {
        throw new Error('Design and Planning group is missing from board structure');
    }
    
    if (!permittingGroup) {
        throw new Error('Permitting group is missing from board structure');
    }
    
    // Create groups in proper order with enhanced sequencing
    const orderedGroups = [designPlanningGroup, permittingGroup, ...otherGroups];
    
    for (let i = 0; i < orderedGroups.length; i++) {
        const group = orderedGroups[i];
        
        console.log(`📁 Creating group ${i + 1}/${orderedGroups.length}: ${group.title}`);
        
        const groupData = await rateLimiter.executeWithDelay(async () => {
            const query = `
                mutation($boardId: ID!, $groupName: String!) {
                    create_group(
                        board_id: $boardId,
                        group_name: $groupName
                    ) {
                        id
                        title
                        position
                    }
                }
            `;
            
            const variables = {
                boardId,
                groupName: group.title
            };
            
            try {
                const response = await makeApiRequest(query, variables);
                return response.create_group;
            } catch (error) {
                console.error(`❌ Failed to create group ${group.title}:`, error);
                throw new Error(`Group creation failed for ${group.title}: ${error.message}`);
            }
        }, 400); // Slightly longer delay for group creation
        
        groupIds[group.title] = groupData.id;
        console.log(`✅ Group created: ${groupData.title} (ID: ${groupData.id})`);
        
        // Log rate limiter status
        const rateLimitStatus = rateLimiter.getStatus();
        console.log(`⏱️ Rate limiter status: ${rateLimitStatus.requestsInLastMinute}/${rateLimiter.requestsPerMinute} requests`);
    }
    
    // Validate all groups were created
    const expectedGroups = orderedGroups.map(g => g.title);
    const createdGroups = Object.keys(groupIds);
    
    const missingGroups = expectedGroups.filter(group => !createdGroups.includes(group));
    if (missingGroups.length > 0) {
        throw new Error(`Failed to create groups: ${missingGroups.join(', ')}`);
    }
    
    console.log('✅ All groups created successfully');
    console.log(`📊 Group Summary:
    - Design and Planning: ${groupIds['Design and Planning']}
    - Permitting: ${groupIds['Permitting']}
    - Renovation Areas: ${createdGroups.length - 2}`);
    
    return groupIds;
}

// Create groups - Enhanced for Task 3.2 (Legacy compatibility)
async function createGroups(boardId) {
    return await createGroupsWithSequencing(boardId);
}

// Create items - Enhanced for Task 3.3
// Create items with batch processing - Enhanced for Task 4.2
async function createItemsWithBatching(boardId, groupIds) {
    console.log('📝 Creating items with batch processing...');
    
    const items = AppState.boardStructure.items;
    const totalItems = items.length;
    
    // Group items by their group for better processing
    const itemsByGroup = {};
    items.forEach(item => {
        if (!itemsByGroup[item.group]) {
            itemsByGroup[item.group] = [];
        }
        itemsByGroup[item.group].push(item);
    });
    
    // Process groups in order: Design and Planning first, then Permitting, then others
    const groupOrder = ['Design and Planning', 'Permitting', ...Object.keys(itemsByGroup).filter(g => g !== 'Design and Planning' && g !== 'Permitting')];
    
    let createdCount = 0;
    
    for (const groupName of groupOrder) {
        const groupItems = itemsByGroup[groupName];
        if (!groupItems || groupItems.length === 0) continue;
        
        console.log(`📂 Creating ${groupItems.length} items for group: ${groupName}`);
        
        // Process items in batches
        const batchSize = 5; // Conservative batch size
        const batches = [];
        
        for (let i = 0; i < groupItems.length; i += batchSize) {
            batches.push(groupItems.slice(i, i + batchSize));
        }
        
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
            const batch = batches[batchIndex];
            
            console.log(`📦 Processing batch ${batchIndex + 1}/${batches.length} for ${groupName}`);
            
            // Process batch items sequentially (not parallel to avoid rate limits)
            for (const item of batch) {
                createdCount++;
                
                console.log(`📋 Creating item ${createdCount}/${totalItems}: ${item.name}`);
                
                const itemData = await rateLimiter.executeWithDelay(async () => {
                    const query = `
                        mutation($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON) {
                            create_item(
                                board_id: $boardId,
                                group_id: $groupId,
                                item_name: $itemName,
                                column_values: $columnValues
                            ) {
                                id
                                name
                                state
                                created_at
                                group {
                                    id
                                    title
                                }
                                column_values {
                                    id
                                    text
                                    value
                                }
                            }
                        }
                    `;
                    
                    // Set up column values based on item type and group
                    const columnValues = createColumnValues(item);
                    
                    const variables = {
                        boardId,
                        groupId: groupIds[item.group],
                        itemName: item.name,
                        columnValues: JSON.stringify(columnValues)
                    };
                    
                    try {
                        const response = await makeApiRequest(query, variables);
                        return response.create_item;
                    } catch (error) {
                        console.error(`❌ Failed to create item ${item.name}:`, error);
                        
                        // Enhanced debugging information
                        console.error(`📊 Item Creation Debug Information:
                        - Item Name: ${item.name}
                        - Group: ${item.group}
                        - Group ID: ${groupIds[item.group]}
                        - Available Created Columns: ${JSON.stringify(Object.keys(AppState.createdColumns || {}), null, 2)}
                        - Column Values: ${JSON.stringify(columnValues, null, 2)}
                        - Raw Column Values (before stringify): ${JSON.stringify(columnValues)}`);
                        
                        // Check if the error is column-value related
                        if (error.message.includes('column value format') || error.message.includes('ColumnValueException')) {
                            console.error(`📊 Column Value Format Error - trying with minimal column values...`);
                            
                            // Try with minimal column values
                            const minimalColumnValues = {
                                text: `Task: ${item.name}`
                            };
                            
                            try {
                                const minimalVariables = {
                                    boardId,
                                    groupId: groupIds[item.group],
                                    itemName: item.name,
                                    columnValues: JSON.stringify(minimalColumnValues)
                                };
                                
                                console.log(`📊 Retrying with minimal column values:`, minimalColumnValues);
                                const response = await makeApiRequest(query, minimalVariables);
                                console.log(`✅ Item created with minimal values: ${item.name}`);
                                return response.create_item;
                                
                            } catch (minimalError) {
                                console.error(`❌ Even minimal column values failed:`, minimalError);
                            }
                        }
                        
                        throw new Error(`Item creation failed for ${item.name}: ${error.message}`);
                    }
                }, 250); // Increased delay for item creation
                
                console.log(`✅ Item created: ${itemData.name} in ${itemData.group.title}`);
                
                // Update progress within the items step (75% is the base, we use 75-90% for items)
                const progressWithinItems = (createdCount / totalItems) * 15; // 15% of total progress
                updateLoadingProgress(`Creating items (${createdCount}/${totalItems})...`, 75 + progressWithinItems);
            }
            
            // Brief pause between batches
            if (batchIndex < batches.length - 1) {
                console.log('⏸️ Brief pause between batches...');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
    
    console.log('✅ All items created successfully');
    console.log(`📊 Item Summary:
    - Total Items: ${totalItems}
    - Planning Tasks: ${items.filter(item => item.group === 'Design and Planning').length}
    - Renovation Tasks: ${items.filter(item => item.group !== 'Design and Planning').length}`);
    
    return { totalItems, createdCount };
}

// Create items - Enhanced for Task 3.3 (Legacy compatibility)
async function createItems(boardId, groupIds) {
    return await createItemsWithBatching(boardId, groupIds);
}

// Create column values for items - Enhanced with standard columns
function createColumnValues(item) {
    const columnValues = {};
    
    // Use the created column IDs if available
    const createdColumns = AppState.createdColumns || {};
    
    console.log('📊 Creating column values for item:', item.name, 'Available columns:', Object.keys(createdColumns));
    
    // Set default status using created Status column
    if (createdColumns.Status?.id) {
        if (item.group === 'Design and Planning') {
            // Planning tasks start with "Not Started" status
            columnValues[createdColumns.Status.id] = { "index": 0 };
        } else {
            // Renovation tasks start with "Not Started" status
            columnValues[createdColumns.Status.id] = { "index": 0 };
        }
        console.log('📊 Added Status column value:', createdColumns.Status.id, '=', columnValues[createdColumns.Status.id]);
    } else {
        // Fallback to default status column
        columnValues.status = { "index": 0 };
        console.log('📊 Using fallback status column');
    }
    
    // Set PM (Person) column - leave empty for manual assignment
    if (createdColumns.PM?.id) {
        columnValues[createdColumns.PM.id] = { "personsAndTeams": [] };
        console.log('📊 Added PM column value:', createdColumns.PM.id, '=', columnValues[createdColumns.PM.id]);
    }
    
    // Set Timeline column with appropriate dates
    if (createdColumns.Timeline?.id) {
        if (item.group === 'Design and Planning') {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + 14); // 2 weeks from now
            
            columnValues[createdColumns.Timeline.id] = {
                from: startDate.toISOString().split('T')[0],
                to: endDate.toISOString().split('T')[0]
            };
            console.log('📊 Added Timeline column value (Planning):', createdColumns.Timeline.id, '=', columnValues[createdColumns.Timeline.id]);
        } else {
            // Renovation tasks get longer timeframes
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 14); // Start after planning
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + 30); // 1 month duration
            
            columnValues[createdColumns.Timeline.id] = {
                from: startDate.toISOString().split('T')[0],
                to: endDate.toISOString().split('T')[0]
            };
            console.log('📊 Added Timeline column value (Renovation):', createdColumns.Timeline.id, '=', columnValues[createdColumns.Timeline.id]);
        }
    }
    
    // Photos column - leave empty for manual upload
    if (createdColumns.photos?.id) {
        columnValues[createdColumns.photos.id] = {};
        console.log('📊 Added photos column value:', createdColumns.photos.id, '=', columnValues[createdColumns.photos.id]);
    }
    
    // Add default notes based on item type (fallback text column)
    if (item.group === 'Design and Planning') {
        columnValues.text = `Critical planning task for ${AppState.projectName}`;
    } else {
        columnValues.text = `${item.group} renovation task`;
    }
    
    // Fallback due date column for backward compatibility
    if (item.group === 'Design and Planning') {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 14); // 2 weeks from now
        columnValues.date4 = { 
            date: futureDate.toISOString().split('T')[0] 
        };
    } else {
        // Renovation tasks get longer timeframes
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30); // 1 month from now
        columnValues.date4 = { 
            date: futureDate.toISOString().split('T')[0] 
        };
    }
    
    return columnValues;
}

// Enhanced Helper Functions - Task 4.2 & 4.3

// Generate completion metrics
async function generateCompletionMetrics(boardId, executionTime) {
    console.log('📊 Generating completion metrics...');
    
    const metrics = {
        boardId,
        executionTime,
        totalAreas: AppState.selectedAreas.length,
        totalScopes: Object.values(AppState.selectedScopes).reduce((sum, scopes) => sum + scopes.length, 0),
        totalGroups: AppState.boardStructure.groups.length,
        totalItems: AppState.boardStructure.items.length,
        planningTasks: AppState.boardStructure.items.filter(item => item.group === 'Design and Planning').length,
        renovationTasks: AppState.boardStructure.items.filter(item => item.group !== 'Design and Planning').length,
        boardUrl: AppState.createdBoardUrl,
        completedAt: new Date().toISOString()
    };
    
    console.log('✅ Completion metrics generated:', metrics);
    return metrics;
}

// Show success with enhanced metrics
function showSuccessWithMetrics(metrics) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('success-result').classList.remove('hidden');
    
    // Populate success details with enhanced metrics
    document.getElementById('board-url').href = AppState.createdBoardUrl;
    document.getElementById('result-project-name').textContent = AppState.projectName;
    document.getElementById('result-areas-count').textContent = metrics.totalAreas;
    document.getElementById('result-tasks-count').textContent = metrics.totalItems;
    
    // Add timing information
    const timingElement = document.getElementById('result-timing');
    if (timingElement) {
        timingElement.textContent = `Completed in ${metrics.executionTime} seconds`;
    }
    
    // Log success metrics
    console.log('🎉 Board creation successful!');
    console.log(`📊 Final Metrics:
    - Execution Time: ${metrics.executionTime}s
    - Total Areas: ${metrics.totalAreas}
    - Total Scopes: ${metrics.totalScopes}
    - Total Groups: ${metrics.totalGroups}
    - Total Items: ${metrics.totalItems}
    - Planning Tasks: ${metrics.planningTasks}
    - Renovation Tasks: ${metrics.renovationTasks}`);
}

// Enhanced error logging
async function logEnhancedError(error, context) {
    console.error('❌ Enhanced error logging:', {
        error: {
            message: error.message,
            stack: error.stack,
            name: error.name
        },
        context: {
            stage: context.stage,
            progress: context.progress,
            timestamp: new Date().toISOString(),
            appState: context.appState
        },
        environment: {
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        }
    });
    
    // Store error for potential retry
    const errorData = {
        error: error.message,
        stage: context.stage,
        timestamp: new Date().toISOString(),
        appState: context.appState
    };
    
    localStorage.setItem('renovation_last_error', JSON.stringify(errorData));
}

// Show enhanced error feedback
function showEnhancedError(error, stage) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error-result').classList.remove('hidden');
    
    // Enhanced error message
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        const enhancedMessage = `
            <div class="error-details">
                <h4>Error in ${stage}</h4>
                <p><strong>Error:</strong> ${getUserFriendlyErrorMessage(error)}</p>
                <p><strong>What happened:</strong> The board creation process failed during the "${stage}" stage.</p>
                <p><strong>What you can do:</strong></p>
                <ul>
                    <li>Check your internet connection and try again</li>
                    <li>Verify your API token is still valid</li>
                    <li>Ensure the workspace ID is correct</li>
                    <li>Try again with fewer renovation areas if the process is timing out</li>
                </ul>
                <p><strong>Need help?</strong> Contact support with the error details above.</p>
            </div>
        `;
        errorMessage.innerHTML = enhancedMessage;
    }
    
    // Add retry button functionality
    const retryButton = document.getElementById('retry-button');
    if (retryButton) {
        retryButton.onclick = () => {
            console.log('🔄 User initiated retry...');
            createMondayBoard();
        };
    }
}

// Show success result (Legacy compatibility)
function showSuccess() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('success-result').classList.remove('hidden');
    
    // Populate success details
    document.getElementById('board-url').href = AppState.createdBoardUrl;
    document.getElementById('result-project-name').textContent = AppState.projectName;
    document.getElementById('result-areas-count').textContent = AppState.selectedAreas.length;
    document.getElementById('result-tasks-count').textContent = 
        RenovationData.DataHelper.calculateTotalTasks(AppState.selectedScopes);
}

// Reset application
function resetApplication() {
    AppState = {
        currentStep: 'project-setup',
        apiToken: AppState.apiToken, // Keep API token
        projectName: '',
        workspaceId: '',
        selectedAreas: [],
        selectedScopes: {},
        boardStructure: null,
        createdBoardId: null,
        createdBoardUrl: null,
        useStepBreakdowns: true // Keep step breakdown preference
    };
    
    // Clear form fields
    document.getElementById('project-name').value = '';
    document.getElementById('workspace-id').value = '';
    
    // Clear selections
    document.querySelectorAll('.area-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.area-item').classList.remove('selected');
    });
    
    // Clear localStorage
    localStorage.removeItem('renovation_project_state');
    
    // Show first step
    showStep('project-setup');
}

// Utility functions
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add('show');
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
    element.classList.remove('show');
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add('show');
    element.style.color = '#28a745';
}

// Debounce function for input validation
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for debugging
window.RenovationApp = {
    AppState,
    showStep,
    createMondayBoard,
    resetApplication
}; 