# Renovation Project Manager

Internal web application that automatically creates standardized Monday.com project boards for renovation projects based on user-selected areas and scopes of work.

## Features

- **Quick Setup**: Create renovation project boards in under 5 minutes
- **Standardized Structure**: Automatic "Design and Planning" phase inclusion
- **15 Renovation Areas**: Kitchen, Bathroom, Living Room, Bedroom, Basement, Attic, Exterior, Office, Retail, Healthcare, Educational, HVAC, Electrical, Plumbing, Structural
- **Dynamic Scope Selection**: Area-specific renovation scopes
- **Monday.com Integration**: Direct board creation via GraphQL API
- **Responsive Design**: Works on desktop and tablet

## Prerequisites

- Monday.com account with API access
- API token with appropriate permissions (`boards:read`, `boards:write`, `items:write`)
- Python 3.6+ OR Node.js 14+
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Setup Instructions

### 1. Clone/Download Project

```bash
# If using git
git clone <repository-url>
cd renovation-project-manager

# Or download and extract the files
```

### 2. Choose Development Server

#### Option A: Python Server (Recommended)
```bash
# Run the Python server
python server.py

# Or specify a custom port
python server.py 3000
```

#### Option B: Node.js Server
```bash
# Install dependencies
npm install

# Start development server
npm start

# Or use dev mode with auto-reload
npm run dev
```

### 3. Access Application

Open your browser and navigate to:
- **Default**: http://localhost:8000
- **Custom Port**: http://localhost:[YOUR_PORT]

### 4. Configure API Token

1. Get your Monday.com API token:
   - Go to your Monday.com account
   - Click your profile picture → Developers
   - Click "My Access Tokens" → Show
   - Copy your personal token

2. Enter token in application:
   - The app will prompt for your API token on first use
   - Enter your token in the modal that appears
   - Click "Test Connection" to verify
   - Token is securely stored in browser localStorage

## Usage Guide

### Step 1: Project Details
- Enter your project name
- Provide your Monday.com workspace ID
- Click "Next: Select Areas"

### Step 2: Select Renovation Areas
- Choose one or more renovation areas from the grid
- All 15 areas are available:
  - Kitchen, Bathroom, Living Room, Bedroom
  - Basement, Attic, Exterior/Facade
  - Office Spaces, Retail Storefront
  - Healthcare Facilities, Educational Spaces
  - HVAC Systems, Electrical Systems
  - Plumbing Systems, Structural Elements
- Click "Next: Select Scopes"

### Step 3: Select Scopes
- For each selected area, choose specific renovation scopes
- Multiple selections are allowed per area
- Each area has 10-15 specific scopes available
- Click "Next: Review & Confirm"

### Step 4: Review & Confirm
- Review all your selections
- Verify project details
- Click "Create Monday.com Board"

### Step 5: Board Creation
- Application automatically creates:
  - New board in your workspace
  - "Design and Planning" group (always first)
  - Groups for each selected renovation area
  - Items for standard planning tasks
  - Items for selected renovation scopes

## Board Structure

### Standard Planning Tasks (Always Included)
- Construction Contract Executed
- Architectural Plan Development
- Interior Design and Selections
- Permit Applications and Approvals
- Budget Finalization and Approval
- Timeline and Milestone Planning
- Contractor Selection and Vetting
- Material and Fixture Selection
- Engineering and Structural Analysis
- Final Design Review and Sign-off

### Board Columns
- **Status**: Not Started, Working on it, Stuck, Done
- **Assignee**: Person assignment
- **Due Date**: Date picker
- **Priority**: High, Medium, Low
- **Notes**: Text field for additional information

## File Structure

```
renovation-project-manager/
├── index.html              # Main application HTML
├── style.css               # Application styles
├── script.js               # Main application logic
├── renovation-data.js      # Data structure and configuration
├── server.py              # Python development server
├── package.json           # Node.js configuration
├── README.md              # This file
└── docs/                  # Documentation
    ├── renovation_app_prd.md
    ├── implementation_plan.md
    ├── monday_api_docs.md
    └── monday_api_code_examples.md
```

## API Integration

The application uses Monday.com's GraphQL API v2 with the following operations:

### Authentication
- Personal API token authentication
- Secure token storage in localStorage
- Connection validation on startup

### Board Creation Flow
1. **Create Board**: Creates new board in specified workspace
2. **Create Groups**: Adds groups for each renovation area
3. **Create Items**: Populates items for planning tasks and scopes
4. **Rate Limiting**: Includes delays to respect API limits

### Error Handling
- Comprehensive error messages
- Retry functionality for failed operations
- Graceful degradation for network issues

## Configuration

### API Token Storage
- Stored securely in browser localStorage
- Automatically loaded on app restart
- Can be updated via settings modal

### Workspace Configuration
- Workspace ID required for board creation
- Can be found in Monday.com URL or developer tools
- Saved per project for convenience

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify API token is correct
   - Check Monday.com account permissions
   - Ensure token has required scopes

2. **Board Creation Failed**
   - Verify workspace ID is correct
   - Check API rate limits
   - Ensure sufficient permissions

3. **Server Won't Start**
   - Check if port is already in use
   - Try different port: `python server.py 3000`
   - Verify Python/Node.js installation

4. **Application Won't Load**
   - Check browser console for errors
   - Verify all files are in correct location
   - Clear browser cache

### Getting Help

1. Check browser console for detailed error messages
2. Verify API token permissions in Monday.com
3. Test API connection using the built-in test feature
4. Review Monday.com API documentation for latest changes

## Security Considerations

- API tokens are stored in browser localStorage (client-side only)
- No server-side storage of sensitive data
- CORS headers configured for development
- Token validation on every API request

## Development Notes

- Built with vanilla JavaScript (no frameworks)
- Responsive CSS Grid and Flexbox layout
- Progressive enhancement approach
- LocalStorage for state persistence
- Comprehensive error handling

## Version History

- **v1.0.0**: Initial release with full renovation area support
- All 15 renovation areas implemented
- Complete Monday.com API integration
- Responsive design and error handling

## License

Internal use only - Not for public distribution.

---

**Support**: Contact the development team for issues or feature requests. 