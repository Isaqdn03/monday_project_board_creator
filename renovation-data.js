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
    ],
    "Pool/Spa": [
        "Pool renovation"
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
        },
        "Appliance upgrades (refrigerator, stove, dishwasher)": {
            title: "Kitchen Appliance Upgrades",
            description: "Complete kitchen appliance upgrade including installation and connections",
            steps: [
                {
                    name: "Appliance Planning & Selection",
                    description: "Select new appliances, verify dimensions and utility requirements",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Utility Preparation",
                    description: "Prepare electrical, gas, and water connections for new appliances",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Appliance Planning & Selection"]
                },
                {
                    name: "Old Appliance Removal",
                    description: "Disconnect and remove old appliances, prepare installation areas",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Utility Preparation"]
                },
                {
                    name: "New Appliance Installation",
                    description: "Install new appliances, ensure proper fit and connections",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Old Appliance Removal"]
                },
                {
                    name: "System Testing & Calibration",
                    description: "Test all appliance functions, calibrate settings, ensure proper operation",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["New Appliance Installation"]
                },
                {
                    name: "Final Inspection & Training",
                    description: "Conduct final inspection, train homeowner on appliance operation",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["System Testing & Calibration"]
                }
            ]
        },
        "Flooring replacement": {
            title: "Kitchen Flooring Replacement",
            description: "Complete kitchen flooring replacement with proper preparation and installation",
            steps: [
                {
                    name: "Flooring Planning & Material Selection",
                    description: "Select flooring material, measure space, plan layout and transitions",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Appliance & Cabinet Prep",
                    description: "Remove appliances, protect cabinets, prepare work area",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Flooring Planning & Material Selection"]
                },
                {
                    name: "Old Flooring Removal",
                    description: "Remove existing flooring, clean and prepare subfloor",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Appliance & Cabinet Prep"]
                },
                {
                    name: "Subfloor Preparation",
                    description: "Level subfloor, install underlayment, address moisture concerns",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Old Flooring Removal"]
                },
                {
                    name: "New Flooring Installation",
                    description: "Install new flooring, ensure proper transitions and sealing",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Subfloor Preparation"]
                },
                {
                    name: "Trim & Appliance Reinstallation",
                    description: "Install trim pieces, reinstall appliances, complete final details",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["New Flooring Installation"]
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
        },
        "Vanity and sink replacement": {
            title: "Bathroom Vanity & Sink Replacement",
            description: "Complete vanity and sink replacement with plumbing connections",
            steps: [
                {
                    name: "Planning & Measurement",
                    description: "Measure space, select new vanity and sink, plan plumbing modifications",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Old Vanity Removal",
                    description: "Disconnect plumbing, remove old vanity, sink, and countertop",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Planning & Measurement"]
                },
                {
                    name: "Plumbing Adjustments",
                    description: "Modify plumbing connections, install new shut-off valves if needed",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Old Vanity Removal"]
                },
                {
                    name: "Vanity Installation",
                    description: "Install new vanity cabinet, ensure level and secure mounting",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Plumbing Adjustments"]
                },
                {
                    name: "Countertop & Sink Installation",
                    description: "Install countertop, mount sink, connect faucet and drain",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Vanity Installation"]
                },
                {
                    name: "Final Connections & Testing",
                    description: "Complete all plumbing connections, test for leaks, install accessories",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Countertop & Sink Installation"]
                }
            ]
        },
        "Toilet replacement or upgrade": {
            title: "Toilet Replacement",
            description: "Complete toilet replacement with proper installation and sealing",
            steps: [
                {
                    name: "Toilet Selection & Prep",
                    description: "Select new toilet, verify rough-in dimensions, prepare work area",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Old Toilet Removal",
                    description: "Shut off water, disconnect supply line, remove old toilet and wax ring",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Toilet Selection & Prep"]
                },
                {
                    name: "Flange Inspection & Repair",
                    description: "Inspect toilet flange, repair or replace if damaged, ensure proper height",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Old Toilet Removal"]
                },
                {
                    name: "New Toilet Installation",
                    description: "Install new wax ring, position and secure toilet, ensure proper seal",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Flange Inspection & Repair"]
                },
                {
                    name: "Water Connection & Testing",
                    description: "Connect water supply, adjust water level, test for leaks and proper operation",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["New Toilet Installation"]
                },
                {
                    name: "Final Adjustments & Cleanup",
                    description: "Install toilet seat, caulk base, clean up work area",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Water Connection & Testing"]
                }
            ]
        },
        "Lighting and electrical upgrades": {
            title: "Bathroom Electrical & Lighting Upgrade",
            description: "Complete electrical and lighting upgrades for bathroom safety and functionality",
            steps: [
                {
                    name: "Electrical Planning & Code Review",
                    description: "Plan electrical upgrades, review code requirements, obtain permits",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Circuit Installation & GFCI Protection",
                    description: "Install new circuits, GFCI outlets, and proper grounding",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Electrical Planning & Code Review"]
                },
                {
                    name: "Lighting Fixture Rough-In",
                    description: "Install electrical boxes for lights, switches, and exhaust fan",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Circuit Installation & GFCI Protection"]
                },
                {
                    name: "Switch & Outlet Installation",
                    description: "Install switches, GFCI outlets, and dimmer controls",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Lighting Fixture Rough-In"]
                },
                {
                    name: "Light Fixture Installation",
                    description: "Install vanity lights, ceiling lights, and exhaust fan",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Switch & Outlet Installation"]
                },
                {
                    name: "Testing & Final Inspection",
                    description: "Test all electrical components, obtain final inspection, verify safety",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Light Fixture Installation"]
                }
            ]
        },
        "Flooring replacement": {
            title: "Bathroom Flooring Replacement",
            description: "Complete bathroom flooring replacement with moisture protection",
            steps: [
                {
                    name: "Flooring Selection & Planning",
                    description: "Select moisture-resistant flooring, plan layout and transitions",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Fixture & Toilet Removal",
                    description: "Remove toilet and other fixtures to access flooring",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Flooring Selection & Planning"]
                },
                {
                    name: "Old Flooring Removal",
                    description: "Remove existing flooring, clean and prep subfloor",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Fixture & Toilet Removal"]
                },
                {
                    name: "Subfloor Prep & Waterproofing",
                    description: "Level subfloor, install moisture barrier and underlayment",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Old Flooring Removal"]
                },
                {
                    name: "New Flooring Installation",
                    description: "Install new flooring, ensure proper sealing around fixtures",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Subfloor Prep & Waterproofing"]
                },
                {
                    name: "Fixture Reinstallation & Finishing",
                    description: "Reinstall toilet and fixtures, install transition strips and trim",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["New Flooring Installation"]
                }
            ]
        }
    },
    "Living Room": {
        "Flooring replacement or refinishing": {
            title: "Living Room Flooring Installation",
            description: "Complete flooring replacement or refinishing process for living room",
            steps: [
                {
                    name: "Floor Assessment & Planning",
                    description: "Assess existing flooring, measure space, select new flooring material and layout",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Furniture Removal & Prep",
                    description: "Remove all furniture, prepare subfloor, repair any damage or squeaks",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Floor Assessment & Planning"]
                },
                {
                    name: "Subfloor Preparation",
                    description: "Level subfloor, install underlayment if needed, check for moisture issues",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Furniture Removal & Prep"]
                },
                {
                    name: "Flooring Installation",
                    description: "Install new flooring material according to manufacturer specifications",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Subfloor Preparation"]
                },
                {
                    name: "Trim & Transition Installation",
                    description: "Install baseboards, quarter round, and transition strips",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Flooring Installation"]
                },
                {
                    name: "Final Cleanup & Furniture Return",
                    description: "Clean all debris, polish/seal if needed, return furniture to room",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Trim & Transition Installation"]
                }
            ]
        },
        "Fireplace installation or renovation": {
            title: "Fireplace Installation/Renovation",
            description: "Complete fireplace installation or renovation including safety and code compliance",
            steps: [
                {
                    name: "Design & Permitting",
                    description: "Design fireplace layout, obtain necessary permits, plan ventilation and gas lines",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Structural Preparation",
                    description: "Frame opening, install proper support structures, prepare foundation if needed",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Design & Permitting"]
                },
                {
                    name: "Utility Rough-In",
                    description: "Install gas lines, electrical connections, and ventilation systems",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Structural Preparation"]
                },
                {
                    name: "Fireplace Installation",
                    description: "Install fireplace unit, connect to utilities, install chimney or vent system",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Utility Rough-In"]
                },
                {
                    name: "Surround & Finishing",
                    description: "Install mantle, surround materials, hearth, and decorative elements",
                    estimatedDays: 3,
                    priority: "Medium",
                    dependencies: ["Fireplace Installation"]
                },
                {
                    name: "Testing & Final Inspection",
                    description: "Test all systems, obtain final inspection, provide operation instructions",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Surround & Finishing"]
                }
            ]
        },
        "Paint and wall treatments": {
            title: "Living Room Paint & Wall Treatments",
            description: "Complete paint and wall treatment renovation for living room spaces",
            steps: [
                {
                    name: "Surface Assessment & Preparation Planning",
                    description: "Assess wall conditions, select paint colors and finishes, plan wall treatments",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Room Preparation & Protection",
                    description: "Remove furniture, protect floors and fixtures, remove outlet covers and hardware",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Surface Assessment & Preparation Planning"]
                },
                {
                    name: "Wall Repair & Priming",
                    description: "Fill holes, sand surfaces, apply primer to walls and trim",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Room Preparation & Protection"]
                },
                {
                    name: "Paint Application",
                    description: "Apply base coats and finish coats, ensure even coverage and professional finish",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Wall Repair & Priming"]
                },
                {
                    name: "Wall Treatment Installation",
                    description: "Install wallpaper, wainscoting, or decorative treatments as planned",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Paint Application"]
                },
                {
                    name: "Final Touches & Cleanup",
                    description: "Reinstall hardware and fixtures, touch up paint, clean up work area",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Wall Treatment Installation"]
                }
            ]
        }
    },
    "Bedroom": {
        "Closet organization and built-ins": {
            title: "Closet Organization System",
            description: "Complete closet renovation with custom organization and built-in solutions",
            steps: [
                {
                    name: "Space Planning & Design",
                    description: "Measure closet, assess storage needs, design custom organization system",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Demolition & Preparation",
                    description: "Remove existing shelving and rods, repair walls, prepare electrical if needed",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Space Planning & Design"]
                },
                {
                    name: "Electrical & Lighting Installation",
                    description: "Install closet lighting, outlets for accessories, switches",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Demolition & Preparation"]
                },
                {
                    name: "Built-In Construction",
                    description: "Build and install custom shelving, drawers, and storage components",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Electrical & Lighting Installation"]
                },
                {
                    name: "Hardware & Accessories",
                    description: "Install rods, hooks, specialty hardware, and organizational accessories",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Built-In Construction"]
                },
                {
                    name: "Finishing & Organization",
                    description: "Apply finish coats, install doors if needed, organize items in new system",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Hardware & Accessories"]
                }
            ]
        },
        "Walk-in closet construction": {
            title: "Walk-In Closet Construction",
            description: "Complete construction of new walk-in closet including framing and finishing",
            steps: [
                {
                    name: "Planning & Permits",
                    description: "Design layout, obtain permits, plan electrical and ventilation needs",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Framing & Structural Work",
                    description: "Frame new walls, install door opening, ensure proper support",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Planning & Permits"]
                },
                {
                    name: "Electrical & HVAC Rough-In",
                    description: "Install electrical circuits, lighting rough-in, extend HVAC if needed",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Framing & Structural Work"]
                },
                {
                    name: "Drywall & Insulation",
                    description: "Install insulation, hang and finish drywall, prepare for paint",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Electrical & HVAC Rough-In"]
                },
                {
                    name: "Flooring & Interior Finishing",
                    description: "Install flooring, paint walls, install trim and door",
                    estimatedDays: 3,
                    priority: "Medium",
                    dependencies: ["Drywall & Insulation"]
                },
                {
                    name: "Closet System Installation",
                    description: "Install organization system, lighting fixtures, and final accessories",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Flooring & Interior Finishing"]
                }
            ]
        }
    },
    "Basement": {
        "Waterproofing and moisture control": {
            title: "Basement Waterproofing",
            description: "Complete basement waterproofing system to prevent moisture and water damage",
            steps: [
                {
                    name: "Moisture Assessment & Planning",
                    description: "Inspect for water sources, test moisture levels, design waterproofing strategy",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Exterior Drainage & Grading",
                    description: "Improve exterior drainage, adjust grading, repair foundation cracks",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Moisture Assessment & Planning"]
                },
                {
                    name: "Interior Drainage System",
                    description: "Install interior drainage, sump pump system, and vapor barriers",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Exterior Drainage & Grading"]
                },
                {
                    name: "Wall Waterproofing",
                    description: "Apply waterproof coatings, install drainage membrane, seal penetrations",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Interior Drainage System"]
                },
                {
                    name: "Dehumidification & Ventilation",
                    description: "Install dehumidification system, improve ventilation, add exhaust fans",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Wall Waterproofing"]
                },
                {
                    name: "Testing & Monitoring Setup",
                    description: "Test all systems, install moisture monitoring, provide maintenance instructions",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Dehumidification & Ventilation"]
                }
            ]
        },
        "Recreation room setup": {
            title: "Basement Recreation Room",
            description: "Complete basement finishing for recreation and entertainment space",
            steps: [
                {
                    name: "Space Planning & Design",
                    description: "Plan room layout, design entertainment areas, plan electrical and lighting needs",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Framing & Insulation",
                    description: "Frame partition walls, install insulation, prepare for utilities",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Space Planning & Design"]
                },
                {
                    name: "Electrical & HVAC Installation",
                    description: "Install electrical circuits, outlets, extend HVAC system, add lighting",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Framing & Insulation"]
                },
                {
                    name: "Drywall & Ceiling Installation",
                    description: "Install drywall, finish seams, install drop ceiling or drywall ceiling",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Electrical & HVAC Installation"]
                },
                {
                    name: "Flooring & Wall Finishing",
                    description: "Install flooring, paint walls, install trim and baseboards",
                    estimatedDays: 4,
                    priority: "Medium",
                    dependencies: ["Drywall & Ceiling Installation"]
                },
                {
                    name: "Entertainment System & Final Details",
                    description: "Install entertainment systems, bar area, furniture, and final accessories",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Flooring & Wall Finishing"]
                }
            ]
        }
    },
    "Attic": {
        "Conversion to living space": {
            title: "Attic Living Space Conversion",
            description: "Complete attic conversion to habitable living space with proper safety and codes",
            steps: [
                {
                    name: "Structural Assessment & Planning",
                    description: "Assess structural capacity, plan layout, obtain permits, design stairs access",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Structural Reinforcement",
                    description: "Reinforce floor joists, add structural support, frame dormers if needed",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: ["Structural Assessment & Planning"]
                },
                {
                    name: "Staircase Installation",
                    description: "Install permanent staircase, ensure code compliance for egress",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Structural Reinforcement"]
                },
                {
                    name: "Electrical & HVAC Systems",
                    description: "Install electrical service, extend HVAC system, add emergency egress lighting",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Staircase Installation"]
                },
                {
                    name: "Insulation & Drywall",
                    description: "Install proper insulation, hang and finish drywall, prepare for finishing",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: ["Electrical & HVAC Systems"]
                },
                {
                    name: "Flooring & Final Finishing",
                    description: "Install flooring, paint, install trim, fixtures, and final details",
                    estimatedDays: 4,
                    priority: "Medium",
                    dependencies: ["Insulation & Drywall"]
                }
            ]
        },
        "Skylight installation": {
            title: "Skylight Installation",
            description: "Professional skylight installation with proper waterproofing and finishing",
            steps: [
                {
                    name: "Planning & Permits",
                    description: "Select skylight type and location, obtain permits, check structural requirements",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Roof Opening & Framing",
                    description: "Cut roof opening, frame opening properly, install structural support",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Planning & Permits"]
                },
                {
                    name: "Skylight Installation",
                    description: "Install skylight unit, ensure proper fit and structural attachment",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Roof Opening & Framing"]
                },
                {
                    name: "Weatherproofing & Flashing",
                    description: "Install flashing system, apply waterproof barriers, seal all penetrations",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Skylight Installation"]
                },
                {
                    name: "Interior Finishing",
                    description: "Install interior trim, drywall shaft if needed, paint and finish work",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Weatherproofing & Flashing"]
                },
                {
                    name: "Testing & Final Inspection",
                    description: "Test for leaks, obtain final inspection, provide operation instructions",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Interior Finishing"]
                }
            ]
        }
    },
    "Exterior/Facade": {
        "Siding replacement or repair": {
            title: "Exterior Siding Replacement",
            description: "Complete siding replacement or repair including weatherproofing and insulation",
            steps: [
                {
                    name: "Assessment & Material Selection",
                    description: "Assess existing siding, select new materials, obtain permits, plan installation",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Siding Removal & Prep",
                    description: "Remove old siding, inspect and repair sheathing, address any structural issues",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Assessment & Material Selection"]
                },
                {
                    name: "Weather Barrier Installation",
                    description: "Install house wrap, vapor barriers, and insulation upgrades if needed",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Siding Removal & Prep"]
                },
                {
                    name: "Siding Installation",
                    description: "Install new siding material according to manufacturer specifications",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: ["Weather Barrier Installation"]
                },
                {
                    name: "Trim & Detail Work",
                    description: "Install corner trim, window trim, soffits, and architectural details",
                    estimatedDays: 3,
                    priority: "Medium",
                    dependencies: ["Siding Installation"]
                },
                {
                    name: "Caulking & Final Finishing",
                    description: "Caulk all joints, touch up paint, final cleanup and inspection",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Trim & Detail Work"]
                }
            ]
        },
        "Deck or patio construction": {
            title: "Deck/Patio Construction",
            description: "Complete outdoor deck or patio construction with proper foundation and drainage",
            steps: [
                {
                    name: "Design & Permitting",
                    description: "Design deck/patio layout, obtain permits, plan utilities and drainage",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Excavation & Site Prep",
                    description: "Excavate area, grade for drainage, mark utility locations",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Design & Permitting"]
                },
                {
                    name: "Foundation & Structural Work",
                    description: "Install footings, posts, beams, and structural framework",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Excavation & Site Prep"]
                },
                {
                    name: "Decking/Patio Surface Installation",
                    description: "Install deck boards, patio pavers, or concrete surface",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Foundation & Structural Work"]
                },
                {
                    name: "Railings & Safety Features",
                    description: "Install railings, stairs, safety lighting, and code-required features",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Decking/Patio Surface Installation"]
                },
                {
                    name: "Finishing & Landscaping",
                    description: "Apply stain/sealant, install lighting, complete landscaping around area",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Railings & Safety Features"]
                }
            ]
        }
    },
    "Office Spaces": {
        "Built-in desk and storage solutions": {
            title: "Office Built-In Systems",
            description: "Custom built-in desk and storage solutions for efficient office workspace",
            steps: [
                {
                    name: "Workspace Planning & Design",
                    description: "Assess needs, measure space, design custom built-in solutions",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Electrical & Technology Prep",
                    description: "Plan and install electrical circuits, network cables, USB outlets",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Workspace Planning & Design"]
                },
                {
                    name: "Structural Framework",
                    description: "Build framework for built-ins, ensure proper support and leveling",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Electrical & Technology Prep"]
                },
                {
                    name: "Cabinet & Desk Construction",
                    description: "Build and install custom cabinets, desk surfaces, and storage units",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Structural Framework"]
                },
                {
                    name: "Hardware & Accessories Installation",
                    description: "Install drawer slides, handles, cable management, and organizational accessories",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Cabinet & Desk Construction"]
                },
                {
                    name: "Finishing & Technology Integration",
                    description: "Apply finish coats, install lighting, integrate technology systems",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Hardware & Accessories Installation"]
                }
            ]
        },
        "Network and cable management": {
            title: "Office Network & Cable Management",
            description: "Professional network installation and cable management system",
            steps: [
                {
                    name: "Network Planning & Design",
                    description: "Plan network topology, cable routes, equipment locations, and bandwidth needs",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Cable Pathway Installation",
                    description: "Install conduit, cable trays, and pathways for network cables",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Network Planning & Design"]
                },
                {
                    name: "Network Cable Installation",
                    description: "Run network cables, install wall jacks, and label all connections",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Cable Pathway Installation"]
                },
                {
                    name: "Equipment Installation",
                    description: "Install network equipment, servers, switches, and wireless access points",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Network Cable Installation"]
                },
                {
                    name: "Cable Management Systems",
                    description: "Install cable management solutions, organize all cables, ensure clean appearance",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Equipment Installation"]
                },
                {
                    name: "Testing & Documentation",
                    description: "Test all network connections, document system, provide user training",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Cable Management Systems"]
                }
            ]
        }
    },
    "Retail Storefront": {
        "Storefront glass and entrance design": {
            title: "Storefront Glass & Entrance",
            description: "Complete storefront glass installation and entrance design for retail space",
            steps: [
                {
                    name: "Design & Planning",
                    description: "Design storefront layout, select glass and entrance systems, obtain permits",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Structural Preparation",
                    description: "Prepare opening, install structural framework, ensure proper support",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Design & Planning"]
                },
                {
                    name: "Glass System Installation",
                    description: "Install storefront glass system, ensure proper sealing and security",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Structural Preparation"]
                },
                {
                    name: "Entrance Door Installation",
                    description: "Install entrance doors, hardware, security systems, and accessibility features",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Glass System Installation"]
                },
                {
                    name: "Weatherproofing & Sealing",
                    description: "Apply weatherstripping, caulking, and protective coatings",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Entrance Door Installation"]
                },
                {
                    name: "Final Testing & Inspection",
                    description: "Test all systems, obtain final inspection, provide operation instructions",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Weatherproofing & Sealing"]
                }
            ]
        },
        "Display and shelving systems": {
            title: "Retail Display & Shelving",
            description: "Custom retail display and shelving systems for optimal merchandise presentation",
            steps: [
                {
                    name: "Retail Planning & Layout",
                    description: "Plan store layout, design traffic flow, select display systems and materials",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Electrical & Lighting Prep",
                    description: "Install electrical circuits for display lighting, outlets for equipment",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Retail Planning & Layout"]
                },
                {
                    name: "Wall System Installation",
                    description: "Install wall-mounted shelving systems, brackets, and support structures",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Electrical & Lighting Prep"]
                },
                {
                    name: "Freestanding Display Installation",
                    description: "Install freestanding displays, gondolas, and specialty fixtures",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Wall System Installation"]
                },
                {
                    name: "Lighting & Accent Features",
                    description: "Install display lighting, accent features, and promotional elements",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Freestanding Display Installation"]
                },
                {
                    name: "Final Setup & Merchandising",
                    description: "Complete system setup, install signage, prepare for merchandise placement",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Lighting & Accent Features"]
                }
            ]
        }
    },
    "Healthcare Facilities": {
        "Medical equipment installation": {
            title: "Medical Equipment Installation",
            description: "Professional medical equipment installation with code compliance and safety",
            steps: [
                {
                    name: "Equipment Planning & Compliance",
                    description: "Plan equipment layout, ensure code compliance, coordinate with medical staff",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Utility Infrastructure",
                    description: "Install specialized electrical, gas, and data connections for medical equipment",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Equipment Planning & Compliance"]
                },
                {
                    name: "Equipment Mounting & Installation",
                    description: "Install and mount medical equipment according to manufacturer specifications",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Utility Infrastructure"]
                },
                {
                    name: "System Integration & Testing",
                    description: "Integrate equipment with facility systems, conduct comprehensive testing",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Equipment Mounting & Installation"]
                },
                {
                    name: "Calibration & Certification",
                    description: "Calibrate equipment, obtain required certifications, document compliance",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["System Integration & Testing"]
                },
                {
                    name: "Staff Training & Documentation",
                    description: "Train staff on equipment operation, provide documentation and maintenance schedules",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Calibration & Certification"]
                }
            ]
        },
        "HVAC with medical-grade filtration": {
            title: "Medical-Grade HVAC System",
            description: "Specialized HVAC system with medical-grade filtration and air quality control",
            steps: [
                {
                    name: "System Design & Engineering",
                    description: "Design medical-grade HVAC system, plan filtration and air quality requirements",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Equipment & Ductwork Installation",
                    description: "Install HVAC equipment, specialized ductwork, and air handling units",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: ["System Design & Engineering"]
                },
                {
                    name: "Medical-Grade Filtration",
                    description: "Install HEPA filters, UV sterilization, and specialized air purification systems",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Equipment & Ductwork Installation"]
                },
                {
                    name: "Control Systems & Monitoring",
                    description: "Install environmental controls, monitoring systems, and alarm systems",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Medical-Grade Filtration"]
                },
                {
                    name: "Testing & Commissioning",
                    description: "Conduct air quality testing, system commissioning, and performance verification",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Control Systems & Monitoring"]
                },
                {
                    name: "Certification & Training",
                    description: "Obtain medical facility certifications, train staff on system operation",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Testing & Commissioning"]
                }
            ]
        }
    },
    "Educational Spaces": {
        "Classroom layout and furniture": {
            title: "Classroom Design & Furniture",
            description: "Complete classroom layout and furniture installation for optimal learning environment",
            steps: [
                {
                    name: "Educational Planning & Design",
                    description: "Plan classroom layout, select furniture, ensure ADA compliance and safety",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Space Preparation",
                    description: "Prepare classroom space, install any needed flooring or wall treatments",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Educational Planning & Design"]
                },
                {
                    name: "Technology Infrastructure",
                    description: "Install electrical outlets, network connections, and technology mounting systems",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Space Preparation"]
                },
                {
                    name: "Furniture Installation",
                    description: "Install desks, chairs, storage units, and teacher furniture",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Technology Infrastructure"]
                },
                {
                    name: "Learning Aids & Storage",
                    description: "Install whiteboards, bulletin boards, storage solutions, and learning aids",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Furniture Installation"]
                },
                {
                    name: "Final Setup & Safety Check",
                    description: "Complete room setup, conduct safety inspection, prepare for occupancy",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Learning Aids & Storage"]
                }
            ]
        },
        "Technology integration (smart boards, projectors)": {
            title: "Educational Technology Integration",
            description: "Complete integration of smart boards, projectors, and educational technology",
            steps: [
                {
                    name: "Technology Planning & Assessment",
                    description: "Assess technology needs, plan integration, ensure compatibility with existing systems",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Infrastructure Installation",
                    description: "Install electrical circuits, network connections, and mounting systems",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Technology Planning & Assessment"]
                },
                {
                    name: "Equipment Mounting & Installation",
                    description: "Mount smart boards, projectors, speakers, and other technology equipment",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Infrastructure Installation"]
                },
                {
                    name: "System Integration & Configuration",
                    description: "Connect all systems, configure software, ensure proper operation",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Equipment Mounting & Installation"]
                },
                {
                    name: "Testing & Calibration",
                    description: "Test all systems, calibrate displays, ensure optimal performance",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["System Integration & Configuration"]
                },
                {
                    name: "Training & Documentation",
                    description: "Train teachers and staff, provide documentation and support materials",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Testing & Calibration"]
                }
            ]
        }
    },
    "HVAC Systems": {
        "Central air conditioning installation": {
            title: "Central Air Conditioning Installation",
            description: "Complete central AC system installation including ductwork and controls",
            steps: [
                {
                    name: "System Sizing & Design",
                    description: "Calculate cooling load, design system layout, select appropriate equipment",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Equipment Placement & Prep",
                    description: "Position outdoor unit, prepare indoor unit location, ensure proper clearances",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["System Sizing & Design"]
                },
                {
                    name: "Electrical & Refrigerant Lines",
                    description: "Install electrical connections, run refrigerant lines, install disconnect switches",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Equipment Placement & Prep"]
                },
                {
                    name: "Ductwork Installation",
                    description: "Install or modify ductwork, ensure proper airflow and sealing",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Electrical & Refrigerant Lines"]
                },
                {
                    name: "System Startup & Testing",
                    description: "Start system, check refrigerant levels, test all functions and controls",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Ductwork Installation"]
                },
                {
                    name: "Final Inspection & Training",
                    description: "Conduct final inspection, train homeowner on operation and maintenance",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["System Startup & Testing"]
                }
            ]
        },
        "Ductwork installation or modification": {
            title: "HVAC Ductwork Installation",
            description: "Professional ductwork installation or modification for optimal airflow",
            steps: [
                {
                    name: "Ductwork Design & Planning",
                    description: "Design duct layout, calculate sizes, plan routing through structure",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Access & Preparation",
                    description: "Create access points, prepare installation areas, protect surrounding areas",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Ductwork Design & Planning"]
                },
                {
                    name: "Main Trunk Installation",
                    description: "Install main trunk lines, ensure proper support and alignment",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Access & Preparation"]
                },
                {
                    name: "Branch Ductwork Installation",
                    description: "Install branch ducts to individual rooms, install dampers and controls",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Main Trunk Installation"]
                },
                {
                    name: "Insulation & Sealing",
                    description: "Insulate all ductwork, seal joints, ensure energy efficiency",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Branch Ductwork Installation"]
                },
                {
                    name: "Testing & Balancing",
                    description: "Test airflow, balance system, adjust dampers for optimal performance",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Insulation & Sealing"]
                }
            ]
        }
    },
    "Electrical Systems": {
        "Panel upgrade and electrical service increase": {
            title: "Electrical Panel Upgrade",
            description: "Complete electrical panel upgrade and service increase for modern electrical demands",
            steps: [
                {
                    name: "Assessment & Planning",
                    description: "Assess current system, calculate load requirements, obtain permits",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Utility Coordination",
                    description: "Coordinate with utility company, schedule service disconnect and upgrade",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Assessment & Planning"]
                },
                {
                    name: "Panel Installation",
                    description: "Install new electrical panel, ensure proper grounding and bonding",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Utility Coordination"]
                },
                {
                    name: "Circuit Rewiring",
                    description: "Connect existing circuits to new panel, add new circuits as needed",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Panel Installation"]
                },
                {
                    name: "Safety Device Installation",
                    description: "Install GFCI, AFCI breakers, surge protection as required by code",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Circuit Rewiring"]
                },
                {
                    name: "Testing & Final Inspection",
                    description: "Test all circuits, obtain final inspection, provide system documentation",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["Safety Device Installation"]
                }
            ]
        },
        "Smart home wiring and automation": {
            title: "Smart Home Electrical System",
            description: "Complete smart home wiring and automation system installation",
            steps: [
                {
                    name: "Smart Home Planning & Design",
                    description: "Plan automation systems, select devices, design network infrastructure",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Network & Communication Wiring",
                    description: "Install network cables, communication wiring, and wireless infrastructure",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Smart Home Planning & Design"]
                },
                {
                    name: "Smart Switch & Outlet Installation",
                    description: "Install smart switches, outlets, and control devices throughout home",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Network & Communication Wiring"]
                },
                {
                    name: "Automation Hub & Controls",
                    description: "Install central automation hub, configure control systems and interfaces",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Smart Switch & Outlet Installation"]
                },
                {
                    name: "Device Integration & Programming",
                    description: "Connect all devices to network, program automation sequences and scenes",
                    estimatedDays: 3,
                    priority: "Medium",
                    dependencies: ["Automation Hub & Controls"]
                },
                {
                    name: "Testing & User Training",
                    description: "Test all systems, train homeowners on operation, provide documentation",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Device Integration & Programming"]
                }
            ]
        }
    },
    "Plumbing Systems": {
        "Pipe replacement or repiping": {
            title: "Plumbing System Repiping",
            description: "Complete pipe replacement or repiping for improved water quality and pressure",
            steps: [
                {
                    name: "System Assessment & Planning",
                    description: "Assess existing plumbing, plan new routing, select pipe materials and sizes",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Water Shutoff & Preparation",
                    description: "Shut off water supply, drain system, prepare work areas and access points",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["System Assessment & Planning"]
                },
                {
                    name: "Old Pipe Removal",
                    description: "Remove old piping system, clean up debris, prepare for new installation",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Water Shutoff & Preparation"]
                },
                {
                    name: "New Pipe Installation",
                    description: "Install new water supply and drain pipes, ensure proper support and routing",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Old Pipe Removal"]
                },
                {
                    name: "Connection & Testing",
                    description: "Connect fixtures, test system for leaks, adjust water pressure",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["New Pipe Installation"]
                },
                {
                    name: "System Restoration & Cleanup",
                    description: "Restore water service, patch access holes, clean up work areas",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Connection & Testing"]
                }
            ]
        },
        "Water heater replacement or upgrade": {
            title: "Water Heater Replacement",
            description: "Complete water heater replacement or upgrade including connections and venting",
            steps: [
                {
                    name: "Assessment & Selection",
                    description: "Assess hot water needs, select appropriate water heater, obtain permits",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Old Unit Removal",
                    description: "Disconnect and remove old water heater, prepare installation area",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Assessment & Selection"]
                },
                {
                    name: "Utility Connections Prep",
                    description: "Prepare gas, electrical, and water connections for new unit",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Old Unit Removal"]
                },
                {
                    name: "New Water Heater Installation",
                    description: "Install new water heater, connect all utilities, ensure proper venting",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["Utility Connections Prep"]
                },
                {
                    name: "System Testing & Startup",
                    description: "Test all connections, start system, check for proper operation",
                    estimatedDays: 1,
                    priority: "High",
                    dependencies: ["New Water Heater Installation"]
                },
                {
                    name: "Final Inspection & Training",
                    description: "Obtain final inspection, train homeowner on operation and maintenance",
                    estimatedDays: 1,
                    priority: "Medium",
                    dependencies: ["System Testing & Startup"]
                }
            ]
        }
    },
    "Structural Elements": {
        "Foundation repair and reinforcement": {
            title: "Foundation Repair & Reinforcement",
            description: "Complete foundation repair and reinforcement for structural integrity",
            steps: [
                {
                    name: "Structural Assessment & Engineering",
                    description: "Conduct structural assessment, obtain engineering analysis, plan repair strategy",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Excavation & Access",
                    description: "Excavate around foundation, create access for repair work, shore up as needed",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Structural Assessment & Engineering"]
                },
                {
                    name: "Foundation Repair Work",
                    description: "Perform concrete repairs, crack sealing, or foundation underpinning",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: ["Excavation & Access"]
                },
                {
                    name: "Reinforcement Installation",
                    description: "Install steel reinforcement, carbon fiber, or other strengthening materials",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Foundation Repair Work"]
                },
                {
                    name: "Waterproofing & Drainage",
                    description: "Apply waterproofing, install drainage systems, ensure moisture control",
                    estimatedDays: 3,
                    priority: "Medium",
                    dependencies: ["Reinforcement Installation"]
                },
                {
                    name: "Backfill & Final Inspection",
                    description: "Backfill excavation, grade for drainage, obtain structural inspection",
                    estimatedDays: 2,
                    priority: "Medium",
                    dependencies: ["Waterproofing & Drainage"]
                }
            ]
        },
        "Load-bearing wall modifications": {
            title: "Load-Bearing Wall Modification",
            description: "Professional modification of load-bearing walls with proper structural support",
            steps: [
                {
                    name: "Structural Engineering & Permits",
                    description: "Obtain structural engineering analysis, design beam systems, get permits",
                    estimatedDays: 7,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Temporary Support Installation",
                    description: "Install temporary support systems to carry loads during construction",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Structural Engineering & Permits"]
                },
                {
                    name: "Wall Modification Work",
                    description: "Carefully remove portions of wall, create openings as designed",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Temporary Support Installation"]
                },
                {
                    name: "Beam & Support Installation",
                    description: "Install engineered beams, posts, and permanent support structures",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Wall Modification Work"]
                },
                {
                    name: "Structural Connections",
                    description: "Complete all structural connections, ensure proper load transfer",
                    estimatedDays: 2,
                    priority: "High",
                    dependencies: ["Beam & Support Installation"]
                },
                {
                    name: "Finishing & Final Inspection",
                    description: "Complete finish work, remove temporary supports, obtain final inspection",
                    estimatedDays: 3,
                    priority: "Medium",
                    dependencies: ["Structural Connections"]
                }
            ]
        }
    },
    "Pool/Spa": {
        "Pool renovation": {
            title: "Complete Pool Renovation",
            description: "Comprehensive pool renovation workflow from assessment to final startup with industry-standard project management phases",
            steps: [
                {
                    name: "Pool Design & Engineering Assessment",
                    description: "Conduct comprehensive pool assessment, design renovation plan, obtain permits, and finalize material selections",
                    estimatedDays: 7,
                    priority: "High",
                    dependencies: []
                },
                {
                    name: "Pool Excavation & Site Preparation",
                    description: "Drain pool completely, excavate for modifications, prepare work site, and stage materials",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Pool Design & Engineering Assessment"]
                },
                {
                    name: "Pool Steel Reinforcement Installation",
                    description: "Install new rebar grid, structural reinforcement, and prepare for concrete application",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Pool Excavation & Site Preparation"]
                },
                {
                    name: "Pool Plumbing & Electrical Rough-In",
                    description: "Install new plumbing lines, electrical conduits, lighting systems, and equipment connections",
                    estimatedDays: 5,
                    priority: "High",
                    dependencies: ["Pool Steel Reinforcement Installation"]
                },
                {
                    name: "Pool Shotcrete Application & Curing",
                    description: "Apply gunite/shotcrete shell, shape pool structure, and allow proper curing time",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Pool Plumbing & Electrical Rough-In"]
                },
                {
                    name: "Pool Equipment Installation & Setup",
                    description: "Install pumps, filters, heaters, automation systems, and all mechanical equipment",
                    estimatedDays: 3,
                    priority: "High",
                    dependencies: ["Pool Shotcrete Application & Curing"]
                },
                {
                    name: "Pool Tile Installation & Coping",
                    description: "Install waterline tile, decorative features, pool coping, and structural inspection",
                    estimatedDays: 6,
                    priority: "Medium",
                    dependencies: ["Pool Equipment Installation & Setup"]
                },
                {
                    name: "Pool Decking Installation & Finishing",
                    description: "Install or renovate pool deck, drainage systems, safety features, and landscaping prep",
                    estimatedDays: 5,
                    priority: "Medium",
                    dependencies: ["Pool Tile Installation & Coping"]
                },
                {
                    name: "Pool Plaster/Finish Application",
                    description: "Apply final interior finish (plaster, pebble, or tile), complete waterproofing, and cure properly",
                    estimatedDays: 4,
                    priority: "High",
                    dependencies: ["Pool Decking Installation & Finishing"]
                },
                {
                    name: "Pool Filling & Final Startup",
                    description: "Fill pool, balance water chemistry, test all systems, conduct final inspection, and provide client training",
                    estimatedDays: 3,
                    priority: "Medium",
                    dependencies: ["Pool Plaster/Finish Application"]
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

    // Step Breakdown Helper Functions - Added for Task 2 compatibility
    // Check if a scope has step breakdown available
    hasStepBreakdown: function(area, scope) {
        return SCOPE_STEP_BREAKDOWNS[area] && SCOPE_STEP_BREAKDOWNS[area][scope];
    },
    
    // Get step breakdown for a specific scope
    getStepBreakdown: function(area, scope) {
        const breakdown = SCOPE_STEP_BREAKDOWNS[area] && SCOPE_STEP_BREAKDOWNS[area][scope];
        return breakdown ? breakdown.steps : null;
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

    // Transform selections to API-ready format with AI enhancement support
    transformToApiFormat: async function(processedData) {
        console.log('🔄 Transforming selections to API format with AI enhancement...');
        
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
        
        for (const [area, scopes] of Object.entries(processedData.selectedScopes)) {
            console.log(`🔍 Processing area: ${area}, scopes:`, scopes);
            
            apiData.groups.push({
                title: area,
                position: groupPosition++
            });
            
            let itemPosition = 0;
            // Process scopes sequentially to handle async AI enhancement
            for (const scope of scopes) {
                // Check if this scope is AI-enhanced
                const scopeId = `${area}-${scope}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                
                // Add debug logging for AppState
                console.log(`🔍 DEBUG - Current AppState for AI detection:`);
                console.log(`   - AppState exists: ${!!window.AppState}`);
                console.log(`   - aiState.available: ${window.AppState?.aiState?.available}`);
                console.log(`   - aiEnhancedScopes exists: ${!!window.AppState?.aiEnhancedScopes}`);
                console.log(`   - aiEnhancedScopes content: ${JSON.stringify(window.AppState?.aiEnhancedScopes || {})}`);
                console.log(`   - scopeId we're looking for: ${scopeId}`);
                console.log(`   - aiEnhancedScopes[scopeId]: ${window.AppState?.aiEnhancedScopes?.[scopeId]}`);
                
                const isAiEnhanced = window.AppState?.aiState?.available && 
                                   window.AppState?.aiEnhancedScopes && 
                                   window.AppState.aiEnhancedScopes[scopeId];
                
                // Check if this scope has step-by-step breakdown
                const hasStepBreakdown = SCOPE_STEP_BREAKDOWNS[area] && SCOPE_STEP_BREAKDOWNS[area][scope];
                
                console.log(`🔍 Processing scope: ${area} - ${scope}`);
                console.log(`   - Scope ID: ${scopeId}`);
                console.log(`   - AI Enhanced: ${isAiEnhanced}`);
                console.log(`   - Has base breakdown: ${!!hasStepBreakdown}`);
                console.log(`   - Use step breakdowns: ${window.AppState?.useStepBreakdowns}`);
                
                let stepsToUse = null;
                let stepSource = 'single-item';
                
                if (isAiEnhanced && hasStepBreakdown) {
                    // AI Enhancement: Get enhanced steps from mock AI service
                    try {
                        console.log(`🤖 Getting AI enhancement for ${area} - ${scope}...`);
                        
                        const baseSteps = SCOPE_STEP_BREAKDOWNS[area][scope].steps;
                        const jobDescription = window.AppState?.scopeJobDescriptions?.[scopeId] || '';
                        const location = window.AppState?.scopeLocations?.[scopeId] || window.AppState?.globalLocation || '';
                        
                        // Call mock AI enhancement service
                        if (window.AIConfigUtils && typeof window.AIConfigUtils.enhanceTaskBreakdown === 'function') {
                            const aiResult = await window.AIConfigUtils.enhanceTaskBreakdown(
                                baseSteps, jobDescription, area, scope, location
                            );
                            
                            if (aiResult && aiResult.enhancedSteps && Array.isArray(aiResult.enhancedSteps)) {
                                stepsToUse = aiResult.enhancedSteps;
                                stepSource = 'ai-enhanced';
                                
                                console.log(`✅ AI Enhancement successful: ${baseSteps.length} → ${stepsToUse.length} steps`);
                                
                                // Log research insights if available
                                if (aiResult.researchInsights && aiResult.researchInsights.length > 0) {
                                    console.log(`🔍 Research insights generated: ${aiResult.researchInsights.length}`);
                                    aiResult.researchInsights.forEach(insight => {
                                        console.log(`   📌 ${insight.category}: ${insight.finding}`);
                                    });
                                }
                            } else {
                                console.warn('⚠️ AI Enhancement returned invalid format, using base steps');
                                stepsToUse = baseSteps;
                                stepSource = 'base-template';
                            }
                        } else {
                            console.warn('⚠️ AI Enhancement service not available, using base steps');
                            stepsToUse = baseSteps;
                            stepSource = 'base-template';
                        }
                    } catch (error) {
                        console.error('❌ AI Enhancement failed, using base steps:', error);
                        stepsToUse = SCOPE_STEP_BREAKDOWNS[area][scope].steps;
                        stepSource = 'base-template';
                    }
                } else if (hasStepBreakdown && window.AppState?.useStepBreakdowns !== false) {
                    // Use base template steps
                    stepsToUse = SCOPE_STEP_BREAKDOWNS[area][scope].steps;
                    stepSource = 'base-template';
                }
                
                if (stepsToUse && Array.isArray(stepsToUse)) {
                    // Create multiple items for each step
                    console.log(`📋 Creating ${stepSource} steps for ${scope}: ${stepsToUse.length} steps`);
                    
                    stepsToUse.forEach((step, stepIndex) => {
                        apiData.items.push({
                            name: step.name,
                            group: area,
                            position: itemPosition++,
                            column_values: this.generateStepColumnValues(step, scope, area),
                            metadata: {
                                isStepBreakdown: true,
                                isAiEnhanced: stepSource === 'ai-enhanced',
                                stepSource: stepSource,
                                parentScope: scope,
                                stepIndex: stepIndex,
                                stepDescription: step.description,
                                estimatedDays: step.estimatedDays,
                                dependencies: step.dependencies,
                                complianceNotes: step.complianceNotes || [],
                                researchBased: step.researchBased || false
                            }
                        });
                    });
                } else {
                    // Create single item for scope (original behavior)
                    console.log(`📋 Creating single item for ${scope} (no step breakdown)`);
                    apiData.items.push({
                        name: scope,
                        group: area,
                        position: itemPosition++,
                        column_values: this.generateColumnValues('renovation', scope, area),
                        metadata: {
                            isStepBreakdown: false,
                            isAiEnhanced: false,
                            stepSource: 'single-item',
                            parentScope: scope
                        }
                    });
                }
            }
        }
        
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

    // Generate board structure for Monday.com API - Enhanced with AI Support
    generateBoardStructure: async function(projectName, selectedScopes) {
        console.log('🏗️ Generating enhanced board structure with AI support...');
        
        try {
            // Process selections with validation
            const processedData = this.processUserSelections(
                Object.keys(selectedScopes),
                selectedScopes,
                projectName,
                window.AppState?.workspaceId || 'default'
            );
            
            // Transform to API format with AI enhancement
            const apiData = await this.transformToApiFormat(processedData);
            
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
            
            console.log('✅ Board structure generated successfully with AI enhancements');
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