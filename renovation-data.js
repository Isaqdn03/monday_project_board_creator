 // Renovation Project Manager - Data Configuration
// Complete renovation areas and scopes as defined in PRD

// Standard "Design and Planning" tasks (always included)
const STANDARD_PLANNING_TASKS = [
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
];

// Standard "Permitting" tasks (always included after Design and Planning)
const STANDARD_PERMITTING_TASKS = [
    "Submit demolition permit",
    "Submit building permit application",
    "Submit pool permit application",
    "Submit electrical permit application",
    "Submit plumbing permit application",
    "Submit HVAC permit application",
    "All permits approved"
];

// Complete renovation areas with their associated scopes
const RENOVATION_AREAS = {
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
        "Ventilation fan installation",
        "Waterproofing and moisture control"
    ],
    "Living Room": [
        "Flooring replacement or refinishing",
        "Paint and wall treatments",
        "Fireplace installation or renovation",
        "Built-in storage solutions",
        "Electrical updates (outlets, lighting)",
        "Crown molding and trim work",
        "Window treatments and replacements",
        "Ceiling updates and fixtures",
        "Entertainment center installation",
        "Accent wall creation",
        "Furniture and layout planning",
        "Smart home technology integration"
    ],
    "Bedroom": [
        "Flooring replacement or refinishing",
        "Paint and wall treatments",
        "Closet organization and built-ins",
        "Electrical updates (outlets, lighting)",
        "Window treatments and replacements",
        "Crown molding and trim work",
        "Ceiling updates and fixtures",
        "Built-in storage solutions",
        "Accent wall creation",
        "Master suite bathroom connection",
        "Walk-in closet construction",
        "Bedroom furniture planning"
    ],
    "Basement": [
        "Waterproofing and moisture control",
        "Flooring installation",
        "Ceiling and insulation work",
        "Electrical system upgrades",
        "Plumbing rough-in",
        "Heating and ventilation",
        "Wall framing and drywall",
        "Paint and finishing work",
        "Egress window installation",
        "Basement bathroom addition",
        "Recreation room setup",
        "Storage solutions and organization",
        "Staircase renovation"
    ],
    "Attic": [
        "Insulation installation or upgrade",
        "Ventilation system installation",
        "Flooring installation",
        "Electrical system installation",
        "Skylight installation",
        "Staircase or ladder installation",
        "Storage solutions",
        "Conversion to living space",
        "Dormer addition",
        "Roof structural modifications",
        "Heating and cooling integration",
        "Finished ceiling installation"
    ],
    "Exterior/Facade": [
        "Siding replacement or repair",
        "Exterior painting",
        "Roof replacement or repair",
        "Window replacement",
        "Door replacement (entry, patio)",
        "Deck or patio construction",
        "Landscaping and garden work",
        "Driveway and walkway installation",
        "Exterior lighting installation",
        "Fence installation or repair",
        "Gutter and downspout installation",
        "Foundation work and grading",
        "Outdoor kitchen or entertainment area"
    ],
    "Office Spaces": [
        "Electrical upgrades for technology",
        "Built-in desk and storage solutions",
        "Flooring replacement",
        "Paint and wall treatments",
        "Lighting optimization",
        "Soundproofing installation",
        "Climate control systems",
        "Network and cable management",
        "Ergonomic workspace design",
        "Conference room setup",
        "Reception area design",
        "Security system installation",
        "Accessibility compliance upgrades"
    ],
    "Retail Storefront": [
        "Storefront glass and entrance design",
        "Interior layout and fixtures",
        "Display and shelving systems",
        "Lighting design and installation",
        "Flooring for high-traffic areas",
        "Cash wrap and checkout area",
        "Security system installation",
        "HVAC system upgrades",
        "Electrical and technology infrastructure",
        "Signage and branding elements",
        "Customer seating areas",
        "Storage and back-office spaces",
        "ADA compliance modifications"
    ],
    "Healthcare Facilities": [
        "Medical equipment installation",
        "Specialized flooring (anti-microbial)",
        "Medical gas and suction systems",
        "Infection control measures",
        "Waiting room and reception design",
        "Patient room configuration",
        "Specialized lighting systems",
        "HVAC with medical-grade filtration",
        "Electrical systems for medical equipment",
        "Privacy and sound control",
        "Emergency power systems",
        "Compliance with health regulations",
        "Sterilization and cleaning stations"
    ],
    "Educational Spaces": [
        "Classroom layout and furniture",
        "Technology integration (smart boards, projectors)",
        "Lighting optimization for learning",
        "Acoustics and sound control",
        "Flooring for durability and safety",
        "Storage and organization systems",
        "Safety and security upgrades",
        "HVAC system optimization",
        "Accessibility compliance",
        "Laboratory and specialized room setup",
        "Cafeteria and common area design",
        "Playground and outdoor learning spaces",
        "Library and media center renovation"
    ],
    "HVAC Systems": [
        "Central air conditioning installation",
        "Heating system replacement or upgrade",
        "Ductwork installation or modification",
        "Ventilation system upgrades",
        "Thermostat and control system installation",
        "Air quality improvement systems",
        "Insulation upgrades",
        "Zoning system installation",
        "Energy efficiency upgrades",
        "Smart home HVAC integration",
        "Radiant heating installation",
        "Heat pump installation",
        "Maintenance and service planning"
    ],
    "Electrical Systems": [
        "Panel upgrade and electrical service increase",
        "New outlet and switch installation",
        "Lighting fixture installation and upgrades",
        "Ceiling fan installation",
        "Electrical safety inspections and updates",
        "Smart home wiring and automation",
        "Security system wiring",
        "Electrical code compliance updates",
        "Emergency generator installation",
        "Electric vehicle charging station",
        "Landscape lighting installation",
        "Electrical troubleshooting and repairs",
        "Energy monitoring system installation"
    ],
    "Plumbing Systems": [
        "Pipe replacement or repiping",
        "Fixture installation (sinks, toilets, showers)",
        "Water heater replacement or upgrade",
        "Drain cleaning and repair",
        "Sewer line inspection and repair",
        "Water pressure optimization",
        "Leak detection and repair",
        "Water filtration system installation",
        "Bathroom and kitchen plumbing upgrades",
        "Outdoor irrigation system installation",
        "Plumbing code compliance updates",
        "Emergency plumbing repairs",
        "Water conservation upgrades"
    ],
    "Structural Elements": [
        "Foundation repair and reinforcement",
        "Load-bearing wall modifications",
        "Beam and column installation",
        "Structural engineering assessments",
        "Earthquake or seismic retrofitting",
        "Roof structural repairs",
        "Floor joist replacement or reinforcement",
        "Basement or crawl space structural work",
        "Staircase structural modifications",
        "Deck and patio structural work",
        "Retaining wall construction",
        "Structural code compliance updates",
        "Building permit structural requirements"
    ]
};

// Detailed step-by-step breakdowns for renovation scopes
// Each scope can optionally have a detailed breakdown into implementation steps
const SCOPE_STEP_BREAKDOWNS = {
    "Kitchen": {
        "Cabinet replacement/refacing": {
            title: "Cabinet Replacement/Refacing",
            description: "Complete cabinet renovation workflow from planning to final installation",
            steps: [
                {
                    name: "Planning & Measurement",
                    description: "Measure space, plan layout, select cabinet style and finishes",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Demo & Removal",
                    description: "Remove existing cabinets, countertops, and hardware",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Planning & Measurement"]
                },
                {
                    name: "Prep the Space",
                    description: "Repair walls, level surfaces, update electrical/plumbing rough-ins",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Demo & Removal"]
                },
                {
                    name: "Install New Cabinets",
                    description: "Install cabinet boxes, doors, and drawer systems",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Prep the Space"]
                },
                {
                    name: "Add Hardware & Accessories",
                    description: "Install cabinet hardware, drawer slides, shelving, and organizational systems",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Install New Cabinets"]
                },
                {
                    name: "Final Touches",
                    description: "Install crown molding, toe kicks, touch-up paint, and final cleanup",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Add Hardware & Accessories"]
                }
            ]
        },
        "Countertop installation (granite, quartz, marble)": {
            title: "Countertop Installation",
            description: "Professional stone countertop installation process",
            steps: [
                {
                    name: "Material Selection & Templating",
                    description: "Choose stone material, create precise templates of countertop areas",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Fabrication & Cutting",
                    description: "Stone fabrication at shop, cut to exact specifications",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: ["Material Selection & Templating"]
                },
                {
                    name: "Prep for Installation",
                    description: "Ensure cabinet installation complete, disconnect plumbing/electrical",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Fabrication & Cutting"]
                },
                {
                    name: "Stone Installation",
                    description: "Professional installation of countertop sections with seaming",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Prep for Installation"]
                },
                {
                    name: "Plumbing & Electrical Reconnection",
                    description: "Reconnect sink, faucet, electrical connections for appliances",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Stone Installation"]
                },
                {
                    name: "Final Sealing & Cleanup",
                    description: "Apply sealer to natural stone, final cleanup and inspection",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Plumbing & Electrical Reconnection"]
                }
            ]
        },
        "Backsplash installation": {
            title: "Backsplash Installation",
            description: "Tile or stone backsplash installation behind kitchen countertops",
            steps: [
                {
                    name: "Design & Material Selection",
                    description: "Choose backsplash material, pattern, and layout design",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: []
                },
                {
                    name: "Surface Preparation",
                    description: "Clean and prep wall surface, apply primer if needed",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Design & Material Selection"]
                },
                {
                    name: "Layout & Planning",
                    description: "Mark layout lines, plan tile placement and cuts",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Surface Preparation"]
                },
                {
                    name: "Tile Installation",
                    description: "Install tiles with adhesive, maintain proper spacing and alignment",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Layout & Planning"]
                },
                {
                    name: "Grouting & Sealing",
                    description: "Apply grout, clean excess, apply sealer to grout lines",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Tile Installation"]
                },
                {
                    name: "Final Cleanup & Protection",
                    description: "Final cleaning, caulk edges, apply protective measures",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Grouting & Sealing"]
                }
            ]
        }
    },
    "Bathroom": {
        "Bathtub/shower replacement or renovation": {
            title: "Bathtub/Shower Replacement",
            description: "Complete bathtub or shower renovation process",
            steps: [
                {
                    name: "Planning & Design",
                    description: "Plan new tub/shower layout, select fixtures and finishes",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Demolition",
                    description: "Remove existing tub/shower, surrounding tile and fixtures",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Planning & Design"]
                },
                {
                    name: "Plumbing Rough-in",
                    description: "Update plumbing lines, install new valve and drain connections",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Demolition"]
                },
                {
                    name: "Waterproofing & Prep",
                    description: "Install waterproof membrane, prep walls for tile or surround",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Plumbing Rough-in"]
                },
                {
                    name: "Tub/Shower Installation",
                    description: "Install new bathtub or shower base and fixtures",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Waterproofing & Prep"]
                },
                {
                    name: "Tile & Finishing",
                    description: "Install wall tile or surround, grout, and final plumbing connections",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Tub/Shower Installation"]
                }
            ]
        },
        "Tile work (floor and wall)": {
            title: "Bathroom Tile Installation",
            description: "Complete bathroom floor and wall tile installation",
            steps: [
                {
                    name: "Surface Preparation",
                    description: "Prep and level substrate, install backer board if needed",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Waterproofing",
                    description: "Apply waterproof membrane to floor and wet areas",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Surface Preparation"]
                },
                {
                    name: "Layout Planning",
                    description: "Plan tile layout, mark reference lines and starting points",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Waterproofing"]
                },
                {
                    name: "Floor Tile Installation",
                    description: "Install floor tiles, maintain proper spacing and level",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Layout Planning"]
                },
                {
                    name: "Wall Tile Installation", 
                    description: "Install wall tiles around tub/shower and vanity areas",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Floor Tile Installation"]
                },
                {
                    name: "Grouting & Sealing",
                    description: "Apply grout to all joints, clean and seal grout lines",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Wall Tile Installation"]
                }
            ]
        }
    }
};

// Configuration for board creation
const BOARD_CONFIG = {
    // Standard board columns that will be created
    columns: [
        {
            id: "status",
            title: "Status",
            type: "color",
            settings: {
                labels: [
                    { id: 0, title: "Not Started", color: "#c4c4c4" },
                    { id: 1, title: "Working on it", color: "#fdab3d" },
                    { id: 2, title: "Stuck", color: "#e2445c" },
                    { id: 3, title: "Done", color: "#00c875" }
                ]
            }
        },
        {
            id: "person",
            title: "Assignee",
            type: "multiple-person"
        },
        {
            id: "date4",
            title: "Due Date",
            type: "date"
        },
        {
            id: "dropdown",
            title: "Priority",
            type: "dropdown",
            settings: {
                labels: ["High", "Medium", "Low"]
            }
        },
        {
            id: "text",
            title: "Notes",
            type: "text"
        }
    ],
    
    // Default board settings
    settings: {
        board_kind: "public",
        folder_id: null,
        template_id: null
    }
};

// Helper functions for step breakdown support
const StepBreakdownHelper = {
    // Check if a scope has step breakdown available
    hasStepBreakdown: function(area, scope) {
        return SCOPE_STEP_BREAKDOWNS[area] && SCOPE_STEP_BREAKDOWNS[area][scope];
    },
    
    // Get step breakdown for a specific scope
    getStepBreakdown: function(area, scope) {
        return SCOPE_STEP_BREAKDOWNS[area] && SCOPE_STEP_BREAKDOWNS[area][scope];
    },
    
    // Get all scopes with step breakdowns for an area
    getScopesWithBreakdowns: function(area) {
        return SCOPE_STEP_BREAKDOWNS[area] ? Object.keys(SCOPE_STEP_BREAKDOWNS[area]) : [];
    },
    
    // Get count of available step breakdowns
    getBreakdownCount: function() {
        let count = 0;
        Object.values(SCOPE_STEP_BREAKDOWNS).forEach(areaBreakdowns => {
            count += Object.keys(areaBreakdowns).length;
        });
        return count;
    }
};

// Helper functions for data manipulation
const DataHelper = {
    // Get all renovation area names
    getAllAreas: function() {
        return Object.keys(RENOVATION_AREAS);
    },
    
    // Get scopes for a specific area
    getScopesForArea: function(area) {
        return RENOVATION_AREAS[area] || [];
    },
    
    // Get standard planning tasks
    getStandardPlanningTasks: function() {
        return [...STANDARD_PLANNING_TASKS];
    },
    
    // Validate area selection
    validateAreaSelection: function(selectedAreas) {
        if (!Array.isArray(selectedAreas) || selectedAreas.length === 0) {
            return { valid: false, message: "Please select at least one renovation area." };
        }
        
        const invalidAreas = selectedAreas.filter(area => !RENOVATION_AREAS[area]);
        if (invalidAreas.length > 0) {
            return { 
                valid: false, 
                message: `Invalid areas selected: ${invalidAreas.join(', ')}` 
            };
        }
        
        return { valid: true, message: "Area selection is valid." };
    },
    
    // Validate scope selection
    validateScopeSelection: function(selectedScopes) {
        if (!selectedScopes || typeof selectedScopes !== 'object') {
            return { valid: false, message: "Invalid scope selection format." };
        }
        
        for (const [area, scopes] of Object.entries(selectedScopes)) {
            if (!RENOVATION_AREAS[area]) {
                return { 
                    valid: false, 
                    message: `Invalid area: ${area}` 
                };
            }
            
            if (!Array.isArray(scopes) || scopes.length === 0) {
                return { 
                    valid: false, 
                    message: `Please select at least one scope for ${area}.` 
                };
            }
            
            const areaScopes = RENOVATION_AREAS[area];
            const invalidScopes = scopes.filter(scope => !areaScopes.includes(scope));
            if (invalidScopes.length > 0) {
                return { 
                    valid: false, 
                    message: `Invalid scopes for ${area}: ${invalidScopes.join(', ')}` 
                };
            }
        }
        
        return { valid: true, message: "Scope selection is valid." };
    },
    
    // Calculate total tasks for a project (with step breakdown support)
    calculateTotalTasks: function(selectedScopes) {
        let totalTasks = STANDARD_PLANNING_TASKS.length + STANDARD_PERMITTING_TASKS.length;
        
        Object.entries(selectedScopes).forEach(([area, scopes]) => {
            if (Array.isArray(scopes)) {
                scopes.forEach(scope => {
                    // Check if this scope has step-by-step breakdown
                    const hasStepBreakdown = SCOPE_STEP_BREAKDOWNS[area] && SCOPE_STEP_BREAKDOWNS[area][scope];
                    
                    if (hasStepBreakdown && window.AppState?.useStepBreakdowns !== false) {
                        // Add number of steps instead of just 1
                        totalTasks += SCOPE_STEP_BREAKDOWNS[area][scope].steps.length;
                    } else {
                        // Add 1 task for the scope (original behavior)
                        totalTasks += 1;
                    }
                });
            }
        });
        
        return totalTasks;
    },
    
    // Enhanced Selection Processing Engine - Task 4.1
    processUserSelections: function(selectedAreas, selectedScopes, projectName, workspaceId) {
        console.log('🔄 Processing user selections with enhanced validation...');
        
        // Validate and sanitize inputs
        const processedData = {
            projectName: this.sanitizeProjectName(projectName),
            workspaceId: this.validateWorkspaceId(workspaceId),
            selectedAreas: this.validateSelectedAreas(selectedAreas),
            selectedScopes: this.validateSelectedScopes(selectedScopes),
            metadata: {
                totalAreas: selectedAreas.length,
                totalScopes: Object.values(selectedScopes).reduce((sum, scopes) => sum + scopes.length, 0),
                processedAt: new Date().toISOString()
            }
        };
        
        // Validate completeness
        this.validateSelectionCompleteness(processedData);
        
        console.log('✅ User selections processed successfully:', processedData);
        return processedData;
    },

    // Sanitize project name for API compatibility
    sanitizeProjectName: function(projectName) {
        if (!projectName || typeof projectName !== 'string') {
            throw new Error('Project name is required and must be a string');
        }
        
        const sanitized = projectName
            .trim()
            .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
            .substring(0, 50); // Limit length
            
        if (sanitized.length < 3) {
            throw new Error('Project name must be at least 3 characters long');
        }
        
        return sanitized;
    },

    // Validate workspace ID format - Made more flexible
    validateWorkspaceId: function(workspaceId) {
        if (!workspaceId || typeof workspaceId !== 'string') {
            throw new Error('Workspace ID is required');
        }
        
        const trimmedId = workspaceId.trim();
        
        // Allow various formats: numeric IDs, alphanumeric, and reasonable length
        if (trimmedId.length < 3 || trimmedId.length > 50) {
            throw new Error('Workspace ID must be between 3 and 50 characters');
        }
        
        // Allow alphanumeric characters, hyphens, and underscores
        if (!/^[a-zA-Z0-9_-]+$/.test(trimmedId)) {
            throw new Error('Workspace ID can only contain letters, numbers, hyphens, and underscores');
        }
        
        return trimmedId;
    },

    // Validate selected areas
    validateSelectedAreas: function(selectedAreas) {
        if (!Array.isArray(selectedAreas) || selectedAreas.length === 0) {
            throw new Error('At least one renovation area must be selected');
        }
        
        const validAreas = Object.keys(RENOVATION_AREAS);
        const invalidAreas = selectedAreas.filter(area => !validAreas.includes(area));
        
        if (invalidAreas.length > 0) {
            throw new Error(`Invalid renovation areas: ${invalidAreas.join(', ')}`);
        }
        
        return selectedAreas;
    },

    // Validate selected scopes
    validateSelectedScopes: function(selectedScopes) {
        if (!selectedScopes || typeof selectedScopes !== 'object') {
            throw new Error('Selected scopes must be an object');
        }
        
        const validatedScopes = {};
        
        Object.entries(selectedScopes).forEach(([area, scopes]) => {
            if (!Array.isArray(scopes) || scopes.length === 0) {
                throw new Error(`Area "${area}" must have at least one scope selected`);
            }
            
            const validScopes = RENOVATION_AREAS[area];
            if (!validScopes) {
                throw new Error(`Invalid renovation area: ${area}`);
            }
            
            const invalidScopes = scopes.filter(scope => !validScopes.includes(scope));
            if (invalidScopes.length > 0) {
                throw new Error(`Invalid scopes for ${area}: ${invalidScopes.join(', ')}`);
            }
            
            validatedScopes[area] = scopes;
        });
        
        return validatedScopes;
    },

    // Validate selection completeness
    validateSelectionCompleteness: function(processedData) {
        const { selectedAreas, selectedScopes } = processedData;
        
        // Check that all selected areas have scopes
        const missingScopes = selectedAreas.filter(area => 
            !selectedScopes[area] || selectedScopes[area].length === 0
        );
        
        if (missingScopes.length > 0) {
            throw new Error(`Missing scopes for areas: ${missingScopes.join(', ')}`);
        }
        
        // Check that all scope areas are in selected areas
        const extraScopes = Object.keys(selectedScopes).filter(area => 
            !selectedAreas.includes(area)
        );
        
        if (extraScopes.length > 0) {
            throw new Error(`Unexpected scopes for unselected areas: ${extraScopes.join(', ')}`);
        }
        
        return true;
    },

    // Transform selections to API-ready format
    transformToApiFormat: function(processedData) {
        console.log('🔄 Transforming selections to API format...');
        
        const apiData = {
            boardName: `${processedData.projectName} - Renovation Project`,
            workspaceId: processedData.workspaceId,
            boardKind: 'public',
            groups: [],
            items: [],
            metadata: processedData.metadata
        };
        
        // Add Design and Planning group (always first)
        apiData.groups.push({
            title: "Design and Planning",
            position: 0
        });
        
        // Add planning tasks
        STANDARD_PLANNING_TASKS.forEach((task, index) => {
            apiData.items.push({
                name: task,
                group: "Design and Planning",
                position: index,
                column_values: this.generateColumnValues('planning', task)
            });
        });

        // Add Permitting group (always second)
        apiData.groups.push({
            title: "Permitting",
            position: 1
        });
        
        // Add permitting tasks
        STANDARD_PERMITTING_TASKS.forEach((task, index) => {
            apiData.items.push({
                name: task,
                group: "Permitting",
                position: index,
                column_values: this.generateColumnValues('permitting', task)
            });
        });
        
        // Add renovation area groups and items
        let groupPosition = 2;
        console.log(`🔍 Processing selectedScopes:`, processedData.selectedScopes);
        
        Object.entries(processedData.selectedScopes).forEach(([area, scopes]) => {
            console.log(`🔍 Processing area: ${area}, scopes:`, scopes);
            
            apiData.groups.push({
                title: area,
                position: groupPosition++
            });
            
            let itemPosition = 0;
            scopes.forEach((scope) => {
                // Check if this scope has step-by-step breakdown
                const hasStepBreakdown = SCOPE_STEP_BREAKDOWNS[area] && SCOPE_STEP_BREAKDOWNS[area][scope];
                
                console.log(`🔍 Checking step breakdown for ${area} - ${scope}:`);
                console.log(`   - Available breakdown areas:`, Object.keys(SCOPE_STEP_BREAKDOWNS));
                console.log(`   - Available breakdowns for ${area}:`, SCOPE_STEP_BREAKDOWNS[area] ? Object.keys(SCOPE_STEP_BREAKDOWNS[area]) : 'NONE');
                console.log(`   - Has breakdown data: ${!!hasStepBreakdown}`);
                console.log(`   - AppState.useStepBreakdowns: ${window.AppState?.useStepBreakdowns}`);
                console.log(`   - Will use steps: ${hasStepBreakdown && window.AppState?.useStepBreakdowns !== false}`);
                
                if (hasStepBreakdown && window.AppState?.useStepBreakdowns !== false) {
                    // Create multiple items for each step
                    const breakdown = SCOPE_STEP_BREAKDOWNS[area][scope];
                    console.log(`📋 Creating step breakdown for ${scope}: ${breakdown.steps.length} steps`);
                    
                    breakdown.steps.forEach((step, stepIndex) => {
                        apiData.items.push({
                            name: step.name,
                            group: area,
                            position: itemPosition++,
                            column_values: this.generateStepColumnValues(step, scope, area),
                            metadata: {
                                isStepBreakdown: true,
                                parentScope: scope,
                                stepIndex: stepIndex,
                                stepDescription: step.description,
                                estimatedDays: step.estimatedDays,
                                dependencies: step.dependencies
                            }
                        });
                    });
                } else {
                    // Create single item for scope (original behavior)
                    apiData.items.push({
                        name: scope,
                        group: area,
                        position: itemPosition++,
                        column_values: this.generateColumnValues('renovation', scope, area),
                        metadata: {
                            isStepBreakdown: false,
                            parentScope: scope
                        }
                    });
                }
            });
        });
        
        console.log('✅ API format transformation complete');
        return apiData;
    },

    // Generate column values with smart defaults
    generateColumnValues: function(type, taskName, area = null) {
        let taskType, priority, daysOffset;
        
        if (type === 'planning') {
            taskType = 'Planning task';
            priority = 'High';
            daysOffset = 14;
        } else if (type === 'permitting') {
            taskType = 'Permitting task';
            priority = 'High';
            daysOffset = 21; // Permits typically need time during planning phase
        } else {
            taskType = 'Renovation task';
            priority = 'Medium';
            daysOffset = 30;
        }
        
        const columnValues = {
            status: { label: "Not Started" },
            priority: { label: priority },
            notes: `${taskType}: ${taskName}`
        };
        
        // Add area-specific defaults
        if (area) {
            columnValues.notes += ` (${area})`;
        }
        
        // Add due date defaults
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + daysOffset);
        columnValues.date = { date: dueDate.toISOString().split('T')[0] };
        
        return columnValues;
    },

    // Generate enhanced column values for step breakdowns
    generateStepColumnValues: function(step, parentScope, area) {
        const columnValues = {
            status: { label: "Not Started" },
            priority: { label: step.priority },
            notes: `${step.description} | Part of: ${parentScope} (${area})`
        };
        
        // Calculate realistic due dates based on estimated days
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (step.estimatedDays || 1));
        columnValues.date = { date: dueDate.toISOString().split('T')[0] };
        
        // Add dependency information to notes if present
        if (step.dependencies && step.dependencies.length > 0) {
            columnValues.notes += ` | Depends on: ${step.dependencies.join(', ')}`;
        }
        
        // Add estimated duration to notes
        if (step.estimatedDays) {
            columnValues.notes += ` | Est. Duration: ${step.estimatedDays} day${step.estimatedDays > 1 ? 's' : ''}`;
        }
        
        return columnValues;
    },

    // Generate board structure for Monday.com API - Enhanced
    generateBoardStructure: function(projectName, selectedScopes) {
        console.log('🏗️ Generating enhanced board structure...');
        
        try {
            // Process selections with validation
            const processedData = this.processUserSelections(
                Object.keys(selectedScopes),
                selectedScopes,
                projectName,
                window.AppState?.workspaceId || 'default'
            );
            
            // Transform to API format
            const apiData = this.transformToApiFormat(processedData);
            
            // Legacy format for backward compatibility
            const legacyStructure = {
                board_name: apiData.boardName,
                groups: apiData.groups.map(group => ({
                    title: group.title
                })),
                items: apiData.items.map(item => ({
                    name: item.name,
                    group: item.group,
                    column_values: item.column_values,
                    metadata: item.metadata // Preserve metadata for step breakdown tracking
                }))
            };
            
            console.log('✅ Board structure generated successfully');
            return legacyStructure;
            
        } catch (error) {
            console.error('❌ Board structure generation failed:', error);
            throw new Error(`Board structure generation failed: ${error.message}`);
        }
    },

    // Calculate total tasks for reporting
    calculateTotalTasks: function(selectedScopes) {
        const planningTasks = STANDARD_PLANNING_TASKS.length;
        const permittingTasks = STANDARD_PERMITTING_TASKS.length;
        const renovationTasks = Object.values(selectedScopes).reduce((sum, scopes) => sum + scopes.length, 0);
        return planningTasks + permittingTasks + renovationTasks;
    },

    // Validate data structure integrity
    validateBoardStructure: function(boardStructure) {
        console.log('🔍 Validating board structure integrity...');
        
        if (!boardStructure || typeof boardStructure !== 'object') {
            throw new Error('Board structure is required and must be an object');
        }
        
        if (!boardStructure.groups || !Array.isArray(boardStructure.groups)) {
            throw new Error('Board structure must have groups array');
        }
        
        if (!boardStructure.items || !Array.isArray(boardStructure.items)) {
            throw new Error('Board structure must have items array');
        }
        
        // Validate Design and Planning group exists
        const hasDesignPlanning = boardStructure.groups.some(g => g.title === 'Design and Planning');
        if (!hasDesignPlanning) {
            throw new Error('Design and Planning group is required');
        }
        
        // Validate Permitting group exists
        const hasPermitting = boardStructure.groups.some(g => g.title === 'Permitting');
        if (!hasPermitting) {
            throw new Error('Permitting group is required');
        }
        
        // Validate all items have valid groups
        const groupTitles = boardStructure.groups.map(g => g.title);
        const invalidItems = boardStructure.items.filter(item => !groupTitles.includes(item.group));
        
        if (invalidItems.length > 0) {
            throw new Error(`Items reference invalid groups: ${invalidItems.map(i => i.name).join(', ')}`);
        }
        
        console.log('✅ Board structure validation passed');
        return true;
    }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        RENOVATION_AREAS,
        STANDARD_PLANNING_TASKS,
        STANDARD_PERMITTING_TASKS,
        SCOPE_STEP_BREAKDOWNS,
        BOARD_CONFIG,
        DataHelper,
        StepBreakdownHelper
    };
} else {
    // Browser environment
    window.RenovationData = {
        RENOVATION_AREAS,
        STANDARD_PLANNING_TASKS,
        STANDARD_PERMITTING_TASKS,
        SCOPE_STEP_BREAKDOWNS,
        BOARD_CONFIG,
        DataHelper,
        StepBreakdownHelper
    };
} 