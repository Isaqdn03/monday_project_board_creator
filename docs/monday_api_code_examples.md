# Monday.com API Code Examples & Best Use Cases

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication Examples](#authentication-examples)
3. [Core Operations](#core-operations)
4. [Column Value Management](#column-value-management)
5. [Webhooks & Real-time Integration](#webhooks--real-time-integration)
6. [Bulk Operations & Automation](#bulk-operations--automation)
7. [Error Handling & Rate Limiting](#error-handling--rate-limiting)
8. [Real-World Use Cases](#real-world-use-cases)
9. [Best Practices & Patterns](#best-practices--patterns)
10. [Advanced Integration Examples](#advanced-integration-examples)

---

## Getting Started

### Basic Setup & First API Call

#### JavaScript/Node.js
```javascript
const fetch = require('node-fetch');

const API_URL = 'https://api.monday.com/v2';
const API_TOKEN = process.env.MONDAY_API_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': API_TOKEN,
  'API-Version': '2025-01'
};

// First API call - Get boards
async function getBoards() {
  const query = `
    query {
      boards(limit: 5) {
        id
        name
        description
        state
      }
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return null;
    }
    
    return data.data.boards;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

#### Python
```python
import requests
import os
import json

API_URL = "https://api.monday.com/v2"
API_TOKEN = os.getenv("MONDAY_API_TOKEN")

headers = {
    "Content-Type": "application/json",
    "Authorization": API_TOKEN,
    "API-Version": "2025-01"
}

def get_boards():
    query = """
    query {
        boards(limit: 5) {
            id
            name
            description
            state
        }
    }
    """
    
    try:
        response = requests.post(
            API_URL,
            headers=headers,
            json={"query": query}
        )
        response.raise_for_status()
        
        data = response.json()
        
        if 'errors' in data:
            print(f"GraphQL errors: {data['errors']}")
            return None
            
        return data['data']['boards']
        
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return None
```

#### PHP
```php
<?php
$apiUrl = 'https://api.monday.com/v2';
$token = getenv('MONDAY_API_TOKEN');

$headers = [
    'Content-Type: application/json',
    'Authorization: ' . $token,
    'API-Version: 2025-01'
];

function getBoards() {
    global $apiUrl, $headers;
    
    $query = 'query { boards(limit: 5) { id name description state } }';
    
    $data = @file_get_contents($apiUrl, false, stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers),
            'content' => json_encode(['query' => $query])
        ]
    ]));
    
    if ($data === false) {
        return null;
    }
    
    $response = json_decode($data, true);
    
    if (isset($response['errors'])) {
        error_log('GraphQL errors: ' . print_r($response['errors'], true));
        return null;
    }
    
    return $response['data']['boards'] ?? null;
}
?>
```

---

## Authentication Examples

### Personal API Token (Recommended for Server-side)
```javascript
// Store in environment variables
const config = {
  apiToken: process.env.MONDAY_API_TOKEN,
  baseUrl: 'https://api.monday.com/v2'
};

class MondayClient {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseUrl = 'https://api.monday.com/v2';
  }

  async makeRequest(query, variables = {}) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.apiToken,
        'API-Version': '2025-01'
      },
      body: JSON.stringify({ query, variables })
    });

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL Error: ${data.errors[0].message}`);
    }
    
    return data.data;
  }
}

const client = new MondayClient(process.env.MONDAY_API_TOKEN);
```

### OAuth Implementation
```javascript
// OAuth flow for apps
const express = require('express');
const app = express();

// Step 1: Redirect to OAuth
app.get('/auth', (req, res) => {
  const clientId = process.env.MONDAY_CLIENT_ID;
  const redirectUri = process.env.MONDAY_REDIRECT_URI;
  
  const oauthUrl = `https://auth.monday.com/oauth2/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;
    
  res.redirect(oauthUrl);
});

// Step 2: Handle callback
app.get('/oauth/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const tokenResponse = await fetch('https://auth.monday.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.MONDAY_CLIENT_ID,
        client_secret: process.env.MONDAY_CLIENT_SECRET,
        redirect_uri: process.env.MONDAY_REDIRECT_URI,
        grant_type: 'authorization_code',
        code
      })
    });
    
    const tokens = await tokenResponse.json();
    
    // Store tokens securely
    // tokens.access_token can now be used for API calls
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## Core Operations

### Board Management

#### Create Board
```javascript
async function createBoard(name, workspaceId, kind = 'public') {
  const query = `
    mutation($name: String!, $workspaceId: ID!, $kind: BoardKind!) {
      create_board(
        board_name: $name,
        workspace_id: $workspaceId,
        board_kind: $kind
      ) {
        id
        name
        url
      }
    }
  `;

  const variables = { name, workspaceId, kind };
  
  try {
    const data = await client.makeRequest(query, variables);
    return data.create_board;
  } catch (error) {
    console.error('Failed to create board:', error);
    throw error;
  }
}

// Usage
const newBoard = await createBoard('Project Alpha', '12345', 'public');
```

#### Get Board with Items
```javascript
async function getBoardWithItems(boardId, limit = 25) {
  const query = `
    query($boardId: [ID!]!, $limit: Int!) {
      boards(ids: $boardId) {
        id
        name
        description
        state
        permissions
        items_page(limit: $limit) {
          cursor
          items {
            id
            name
            state
            created_at
            updated_at
            group {
              id
              title
            }
            column_values {
              id
              type
              text
              value
            }
          }
        }
      }
    }
  `;

  const variables = { boardId: [boardId], limit };
  
  const data = await client.makeRequest(query, variables);
  return data.boards[0];
}
```

### Item Management

#### Create Item with Column Values
```javascript
async function createItemWithValues(boardId, groupId, itemName, columnValues) {
  const query = `
    mutation($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
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
      }
    }
  `;

  const variables = {
    boardId,
    groupId,
    itemName,
    columnValues: JSON.stringify(columnValues)
  };

  const data = await client.makeRequest(query, variables);
  return data.create_item;
}

// Usage - Create task with status and assignee
const columnValues = {
  "status": { "label": "Working on it" },
  "person": { 
    "personsAndTeams": [{ "id": 123456, "kind": "person" }] 
  },
  "date4": { "date": "2025-12-31" },
  "text": "This is important"
};

const newItem = await createItemWithValues(
  "987654321",
  "topics", 
  "New Task",
  columnValues
);
```

#### Bulk Create Items
```javascript
async function bulkCreateItems(boardId, groupId, items) {
  const promises = items.map(item => 
    createItemWithValues(boardId, groupId, item.name, item.columnValues)
  );
  
  // Batch requests with rate limiting
  const results = [];
  const batchSize = 10;
  
  for (let i = 0; i < promises.length; i += batchSize) {
    const batch = promises.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    
    // Rate limiting - wait between batches
    if (i + batchSize < promises.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

// Usage
const items = [
  {
    name: "Task 1",
    columnValues: {
      "status": { "label": "Not started" },
      "text": "Description for task 1"
    }
  },
  {
    name: "Task 2", 
    columnValues: {
      "status": { "label": "Working on it" },
      "person": { "personsAndTeams": [{ "id": 123456, "kind": "person" }] }
    }
  }
];

const createdItems = await bulkCreateItems("987654321", "topics", items);
```

### Advanced Item Queries

#### Filter Items by Column Values
```javascript
async function getItemsByStatus(boardId, statusLabel) {
  const query = `
    query($boardId: [ID!]!, $statusLabel: [String!]!) {
      boards(ids: $boardId) {
        items_page(
          query_params: {
            rules: [{
              column_id: "status",
              compare_value: $statusLabel,
              operator: any_of
            }]
          }
        ) {
          items {
            id
            name
            column_values {
              ... on StatusValue {
                label
                index
              }
            }
          }
        }
      }
    }
  `;

  const variables = { boardId: [boardId], statusLabel: [statusLabel] };
  
  const data = await client.makeRequest(query, variables);
  return data.boards[0].items_page.items;
}

// Usage
const workingItems = await getItemsByStatus("987654321", "Working on it");
```

#### Paginate Through All Items
```javascript
async function getAllBoardItems(boardId) {
  let allItems = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const query = `
      query($boardId: [ID!]!, $cursor: String) {
        boards(ids: $boardId) {
          items_page(limit: 100, cursor: $cursor) {
            cursor
            items {
              id
              name
              state
              column_values {
                id
                text
                type
              }
            }
          }
        }
      }
    `;

    const variables = { boardId: [boardId] };
    if (cursor) variables.cursor = cursor;

    const data = await client.makeRequest(query, variables);
    const itemsPage = data.boards[0].items_page;
    
    allItems.push(...itemsPage.items);
    cursor = itemsPage.cursor;
    hasNextPage = itemsPage.items.length === 100;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return allItems;
}
```

---

## Column Value Management

### Status Column Examples
```javascript
// Set status by label
async function setItemStatus(itemId, boardId, columnId, statusLabel) {
  const query = `
    mutation($itemId: ID!, $boardId: ID!, $columnId: String!, $value: String!) {
      change_simple_column_value(
        item_id: $itemId,
        board_id: $boardId,
        column_id: $columnId,
        value: $value
      ) {
        id
      }
    }
  `;

  const variables = { itemId, boardId, columnId, value: statusLabel };
  
  return await client.makeRequest(query, variables);
}

// Set status by index
async function setItemStatusByIndex(itemId, boardId, columnId, index) {
  const query = `
    mutation($itemId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {
      change_column_value(
        item_id: $itemId,
        board_id: $boardId,
        column_id: $columnId,
        value: $value
      ) {
        id
      }
    }
  `;

  const variables = { 
    itemId, 
    boardId, 
    columnId, 
    value: JSON.stringify({ "index": index })
  };
  
  return await client.makeRequest(query, variables);
}
```

### People Column Examples
```javascript
async function assignPeopleToItem(itemId, boardId, columnId, personIds) {
  const personsAndTeams = personIds.map(id => ({
    id: parseInt(id),
    kind: "person"
  }));

  const query = `
    mutation($itemId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {
      change_column_value(
        item_id: $itemId,
        board_id: $boardId,
        column_id: $columnId,
        value: $value
      ) {
        id
      }
    }
  `;

  const variables = {
    itemId,
    boardId,
    columnId,
    value: JSON.stringify({ "personsAndTeams": personsAndTeams })
  };

  return await client.makeRequest(query, variables);
}

// Usage
await assignPeopleToItem("123456", "987654", "person", ["111111", "222222"]);
```

### Date Column Examples
```javascript
async function setItemDate(itemId, boardId, columnId, date, time = null) {
  const dateValue = { date };
  if (time) dateValue.time = time;

  const query = `
    mutation($itemId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {
      change_column_value(
        item_id: $itemId,
        board_id: $boardId,
        column_id: $columnId,
        value: $value
      ) {
        id
      }
    }
  `;

  const variables = {
    itemId,
    boardId,
    columnId,
    value: JSON.stringify(dateValue)
  };

  return await client.makeRequest(query, variables);
}

// Usage
await setItemDate("123456", "987654", "date4", "2025-12-31", "14:30:00");
```

### Multiple Column Updates
```javascript
async function updateMultipleColumns(itemId, boardId, columnValues) {
  const query = `
    mutation($itemId: ID!, $boardId: ID!, $columnValues: JSON!) {
      change_multiple_column_values(
        item_id: $itemId,
        board_id: $boardId,
        column_values: $columnValues
      ) {
        id
        name
      }
    }
  `;

  const variables = {
    itemId,
    boardId,
    columnValues: JSON.stringify(columnValues)
  };

  return await client.makeRequest(query, variables);
}

// Usage - Update multiple columns at once
const columnValues = {
  "status": { "label": "Done" },
  "person": { "personsAndTeams": [{ "id": 123456, "kind": "person" }] },
  "date4": { "date": "2025-01-15" },
  "text": "Updated description",
  "numbers": { "number": 100 }
};

await updateMultipleColumns("123456", "987654", columnValues);
```

---

## Webhooks & Real-time Integration

### Webhook Setup
```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
  // Verify webhook signature (recommended)
  if (!verifyWebhookSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event } = req.body;
  
  // Handle different webhook events
  switch (event.type) {
    case 'create_pulse':
      handleItemCreated(event);
      break;
    case 'update_column_value':
      handleColumnValueChanged(event);
      break;
    case 'create_update':
      handleUpdateCreated(event);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.status(200).json({ success: true });
});

// Verify webhook signature for security
function verifyWebhookSignature(req) {
  const signature = req.headers['x-monday-signature'];
  if (!signature) return false;

  const signingSecret = process.env.MONDAY_SIGNING_SECRET;
  const body = JSON.stringify(req.body);
  
  const hash = crypto
    .createHmac('sha256', signingSecret)
    .update(body)
    .digest('hex');

  return hash === signature;
}

// Handle webhook challenge
app.post('/webhook', (req, res) => {
  const { challenge } = req.body;
  if (challenge) {
    return res.json({ challenge });
  }
  
  // Process webhook...
});
```

### Webhook Event Handlers
```javascript
async function handleItemCreated(event) {
  console.log(`New item created: ${event.pulseName} on board ${event.boardId}`);
  
  // Example: Send notification to Slack
  await sendSlackNotification({
    text: `📝 New task created: ${event.pulseName}`,
    boardId: event.boardId,
    itemId: event.pulseId
  });
  
  // Example: Create corresponding task in external system
  await createExternalTask({
    title: event.pulseName,
    boardId: event.boardId,
    mondayItemId: event.pulseId
  });
}

async function handleColumnValueChanged(event) {
  console.log(`Column ${event.columnTitle} changed for item ${event.pulseName}`);
  
  // Example: Handle status changes
  if (event.columnId === 'status' && event.value.label === 'Done') {
    await handleTaskCompleted(event);
  }
  
  // Example: Handle assignee changes
  if (event.columnType === 'multiple_person') {
    await notifyAssignees(event);
  }
}

async function handleTaskCompleted(event) {
  // Send completion notification
  await sendEmail({
    to: 'project-manager@company.com',
    subject: `Task Completed: ${event.pulseName}`,
    body: `The task "${event.pulseName}" has been marked as complete.`
  });
  
  // Update external systems
  await updateExternalTaskStatus(event.pulseId, 'completed');
}
```

### Create Webhook via API
```javascript
async function createWebhook(boardId, url, event, config = {}) {
  const query = `
    mutation($boardId: ID!, $url: String!, $event: WebhookEventType!, $config: JSON) {
      create_webhook(
        board_id: $boardId,
        url: $url,
        event: $event,
        config: $config
      ) {
        id
        board_id
        event
        url
      }
    }
  `;

  const variables = {
    boardId,
    url,
    event,
    config: JSON.stringify(config)
  };

  return await client.makeRequest(query, variables);
}

// Usage
const webhook = await createWebhook(
  "987654321",
  "https://your-app.com/webhook",
  "change_column_value",
  { columnId: "status" }
);
```

---

## Bulk Operations & Automation

### Bulk Import from CSV
```javascript
const csv = require('csv-parser');
const fs = require('fs');

async function importFromCSV(filePath, boardId, groupId, columnMapping) {
  const items = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const columnValues = {};
        
        Object.keys(columnMapping).forEach(csvColumn => {
          const mondayColumn = columnMapping[csvColumn];
          if (row[csvColumn]) {
            columnValues[mondayColumn] = formatColumnValue(
              mondayColumn, 
              row[csvColumn]
            );
          }
        });
        
        items.push({
          name: row.name || row.title || 'Imported Item',
          columnValues
        });
      })
      .on('end', async () => {
        try {
          const results = await bulkCreateItems(boardId, groupId, items);
          resolve(results);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}

function formatColumnValue(columnType, value) {
  switch (columnType) {
    case 'status':
      return { label: value };
    case 'date':
      return { date: value };
    case 'person':
      return { personsAndTeams: [{ id: parseInt(value), kind: 'person' }] };
    case 'text':
    case 'long_text':
      return value;
    case 'numbers':
      return { number: parseFloat(value) };
    default:
      return value;
  }
}

// Usage
const columnMapping = {
  'Task Name': 'name',
  'Status': 'status',
  'Assignee ID': 'person',
  'Due Date': 'date4',
  'Description': 'text'
};

await importFromCSV('tasks.csv', '987654321', 'topics', columnMapping);
```

### Automated Daily Reports
```javascript
async function generateDailyReport(boardIds) {
  const report = {
    date: new Date().toISOString().split('T')[0],
    boards: []
  };

  for (const boardId of boardIds) {
    const board = await getBoardWithItems(boardId, 100);
    
    const stats = {
      boardName: board.name,
      totalItems: board.items_page.items.length,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      overdue: 0
    };

    board.items_page.items.forEach(item => {
      const statusColumn = item.column_values.find(col => col.type === 'color');
      const dateColumn = item.column_values.find(col => col.type === 'date');
      
      if (statusColumn) {
        const status = JSON.parse(statusColumn.value || '{}');
        switch (status.label?.toLowerCase()) {
          case 'done':
          case 'complete':
            stats.completed++;
            break;
          case 'working on it':
          case 'in progress':
            stats.inProgress++;
            break;
          default:
            stats.notStarted++;
        }
      }
      
      // Check for overdue items
      if (dateColumn) {
        const dateValue = JSON.parse(dateColumn.value || '{}');
        if (dateValue.date && new Date(dateValue.date) < new Date()) {
          stats.overdue++;
        }
      }
    });

    report.boards.push(stats);
  }

  return report;
}

// Schedule daily reports
const cron = require('node-cron');

cron.schedule('0 9 * * *', async () => {
  const boardIds = process.env.REPORT_BOARD_IDS.split(',');
  const report = await generateDailyReport(boardIds);
  
  // Send report via email, Slack, etc.
  await sendDailyReport(report);
});
```

### Sync with External CRM
```javascript
class CRMSyncService {
  constructor(mondayClient, crmClient) {
    this.monday = mondayClient;
    this.crm = crmClient;
  }

  async syncLeads(boardId) {
    // Get new leads from CRM
    const crmLeads = await this.crm.getNewLeads();
    
    for (const lead of crmLeads) {
      try {
        // Create item in Monday.com
        const columnValues = {
          "text": lead.company,
          "email": { "email": lead.email, "text": lead.email },
          "phone": lead.phone,
          "person": { 
            "personsAndTeams": [{ "id": lead.assignedUserId, "kind": "person" }] 
          },
          "status": { "label": "New Lead" },
          "numbers": { "number": lead.value }
        };

        const mondayItem = await this.createItemWithValues(
          boardId,
          "new_leads",
          lead.name,
          columnValues
        );

        // Update CRM with Monday.com item ID
        await this.crm.updateLead(lead.id, {
          mondayItemId: mondayItem.id
        });

        console.log(`Synced lead: ${lead.name}`);
      } catch (error) {
        console.error(`Failed to sync lead ${lead.name}:`, error);
      }
    }
  }

  async syncUpdatesFromMonday(boardId) {
    // Get recently updated items
    const recentItems = await this.getRecentlyUpdatedItems(boardId);
    
    for (const item of recentItems) {
      const crmId = this.extractCRMId(item);
      if (!crmId) continue;

      try {
        const updateData = this.mapMondayToCRM(item);
        await this.crm.updateLead(crmId, updateData);
        
        console.log(`Updated CRM lead: ${crmId}`);
      } catch (error) {
        console.error(`Failed to update CRM lead ${crmId}:`, error);
      }
    }
  }

  mapMondayToCRM(item) {
    const statusColumn = item.column_values.find(col => col.type === 'color');
    const valueColumn = item.column_values.find(col => col.type === 'numeric');
    
    return {
      status: statusColumn ? JSON.parse(statusColumn.value).label : null,
      value: valueColumn ? JSON.parse(valueColumn.value).number : null,
      lastUpdated: item.updated_at
    };
  }
}

// Usage
const syncService = new CRMSyncService(mondayClient, crmClient);

// Run sync every hour
setInterval(async () => {
  await syncService.syncLeads('987654321');
  await syncService.syncUpdatesFromMonday('987654321');
}, 3600000);
```

---

## Error Handling & Rate Limiting

### Robust Error Handling
```javascript
class MondayAPIError extends Error {
  constructor(message, code, statusCode) {
    super(message);
    this.name = 'MondayAPIError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

class RateLimitError extends MondayAPIError {
  constructor(retryAfter) {
    super('Rate limit exceeded', 'RATE_LIMIT', 429);
    this.retryAfter = retryAfter;
  }
}

async function makeRequestWithRetry(query, variables = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables })
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '60');
        
        if (attempt < maxRetries) {
          console.log(`Rate limited. Waiting ${retryAfter}s before retry ${attempt + 1}...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        } else {
          throw new RateLimitError(retryAfter);
        }
      }

      if (!response.ok) {
        throw new MondayAPIError(
          `HTTP ${response.status}: ${response.statusText}`,
          'HTTP_ERROR',
          response.status
        );
      }

      const data = await response.json();

      if (data.errors) {
        const error = data.errors[0];
        throw new MondayAPIError(
          error.message,
          error.extensions?.code || 'GRAPHQL_ERROR',
          error.extensions?.status_code
        );
      }

      return data.data;

    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (error instanceof MondayAPIError && 
          ['INVALID_TOKEN', 'PERMISSION_DENIED'].includes(error.code)) {
        break;
      }

      // Exponential backoff for other errors
      if (attempt < maxRetries) {
        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(`Request failed. Retrying in ${backoffTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }

  throw lastError;
}

// Usage with error handling
async function safeCreateItem(boardId, groupId, itemName) {
  try {
    const result = await makeRequestWithRetry(`
      mutation($boardId: ID!, $groupId: String!, $itemName: String!) {
        create_item(board_id: $boardId, group_id: $groupId, item_name: $itemName) {
          id
          name
        }
      }
    `, { boardId, groupId, itemName });

    return result.create_item;
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.error('Rate limit exceeded. Please try again later.');
    } else if (error instanceof MondayAPIError) {
      console.error(`Monday.com API error: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
```

### Rate Limiting Strategies
```javascript
class RateLimiter {
  constructor(requestsPerMinute = 60) {
    this.requestsPerMinute = requestsPerMinute;
    this.requests = [];
  }

  async waitIfNeeded() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Remove requests older than 1 minute
    this.requests = this.requests.filter(time => time > oneMinuteAgo);

    if (this.requests.length >= this.requestsPerMinute) {
      const oldestRequest = this.requests[0];
      const waitTime = oldestRequest + 60000 - now;
      
      if (waitTime > 0) {
        console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitIfNeeded(); // Check again after waiting
      }
    }

    this.requests.push(now);
  }

  async execute(fn) {
    await this.waitIfNeeded();
    return fn();
  }
}

const rateLimiter = new RateLimiter(50); // 50 requests per minute

// Usage
async function rateLimitedCreateItem(boardId, groupId, itemName) {
  return rateLimiter.execute(async () => {
    return createItemWithValues(boardId, groupId, itemName, {});
  });
}
```

---

## Real-World Use Cases

### 1. Project Management Dashboard
```javascript
class ProjectDashboard {
  constructor(mondayClient, boardIds) {
    this.client = mondayClient;
    this.boardIds = boardIds;
  }

  async getDashboardData() {
    const boardsData = await Promise.all(
      this.boardIds.map(boardId => this.getBoardStats(boardId))
    );

    return {
      overview: this.calculateOverview(boardsData),
      boards: boardsData,
      timestamp: new Date().toISOString()
    };
  }

  async getBoardStats(boardId) {
    const board = await this.client.makeRequest(`
      query($boardId: [ID!]!) {
        boards(ids: $boardId) {
          id
          name
          items_page(limit: 500) {
            items {
              id
              name
              state
              created_at
              updated_at
              column_values {
                id
                type
                text
                value
              }
            }
          }
        }
      }
    `, { boardId: [boardId] });

    const boardInfo = board.boards[0];
    const items = boardInfo.items_page.items;

    return {
      id: boardInfo.id,
      name: boardInfo.name,
      totalItems: items.length,
      activeItems: items.filter(item => item.state === 'active').length,
      completedToday: this.getCompletedToday(items),
      overdueTasks: this.getOverdueTasks(items),
      teamWorkload: this.calculateTeamWorkload(items),
      progressByStatus: this.getProgressByStatus(items)
    };
  }

  getCompletedToday(items) {
    const today = new Date().toISOString().split('T')[0];
    return items.filter(item => {
      const statusColumn = item.column_values.find(col => col.type === 'color');
      if (!statusColumn?.value) return false;
      
      const status = JSON.parse(statusColumn.value);
      return status.label?.toLowerCase() === 'done' && 
             item.updated_at.startsWith(today);
    }).length;
  }

  getOverdueTasks(items) {
    const today = new Date();
    return items.filter(item => {
      const dateColumn = item.column_values.find(col => col.type === 'date');
      if (!dateColumn?.value) return false;
      
      const dateValue = JSON.parse(dateColumn.value);
      return dateValue.date && new Date(dateValue.date) < today;
    });
  }

  calculateTeamWorkload(items) {
    const workload = {};
    
    items.forEach(item => {
      const personColumn = item.column_values.find(col => 
        col.type === 'multiple-person'
      );
      
      if (personColumn?.value) {
        const persons = JSON.parse(personColumn.value);
        persons.personsAndTeams?.forEach(person => {
          if (person.kind === 'person') {
            workload[person.id] = (workload[person.id] || 0) + 1;
          }
        });
      }
    });
    
    return workload;
  }

  getProgressByStatus(items) {
    const statusCounts = {};
    
    items.forEach(item => {
      const statusColumn = item.column_values.find(col => col.type === 'color');
      if (statusColumn?.value) {
        const status = JSON.parse(statusColumn.value);
        const label = status.label || 'No Status';
        statusCounts[label] = (statusCounts[label] || 0) + 1;
      }
    });
    
    return statusCounts;
  }

  calculateOverview(boardsData) {
    return {
      totalBoards: boardsData.length,
      totalItems: boardsData.reduce((sum, board) => sum + board.totalItems, 0),
      totalActive: boardsData.reduce((sum, board) => sum + board.activeItems, 0),
      completedToday: boardsData.reduce((sum, board) => sum + board.completedToday, 0),
      totalOverdue: boardsData.reduce((sum, board) => sum + board.overdueTasks.length, 0)
    };
  }
}

// Usage
const dashboard = new ProjectDashboard(client, ['123456', '789012']);
const data = await dashboard.getDashboardData();

// Serve via API endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    const data = await dashboard.getDashboardData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Automated Time Tracking Integration
```javascript
class TimeTrackingIntegration {
  constructor(mondayClient, timeTrackingService) {
    this.monday = mondayClient;
    this.timeTracker = timeTrackingService;
  }

  async startTimeTracking(itemId, userId) {
    // Start tracking in external service
    const trackingId = await this.timeTracker.startTracking({
      itemId,
      userId,
      startTime: new Date()
    });

    // Add update to Monday item
    await this.monday.makeRequest(`
      mutation($itemId: ID!, $body: String!) {
        create_update(item_id: $itemId, body: $body) {
          id
        }
      }
    `, {
      itemId,
      body: `⏱️ Time tracking started (ID: ${trackingId})`
    });

    return trackingId;
  }

  async stopTimeTracking(trackingId, itemId, boardId) {
    // Stop tracking and get duration
    const timeLog = await this.timeTracker.stopTracking(trackingId);
    
    // Update time column in Monday
    await this.monday.makeRequest(`
      mutation($itemId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {
        change_column_value(
          item_id: $itemId,
          board_id: $boardId,
          column_id: $columnId,
          value: $value
        ) {
          id
        }
      }
    `, {
      itemId,
      boardId,
      columnId: 'hour',
      value: JSON.stringify({ 
        hour: timeLog.durationHours,
        minute: timeLog.durationMinutes
      })
    });

    // Add completion update
    await this.monday.makeRequest(`
      mutation($itemId: ID!, $body: String!) {
        create_update(item_id: $itemId, body: $body) {
          id
        }
      }
    `, {
      itemId,
      body: `⏹️ Time tracking stopped. Duration: ${timeLog.durationHours}h ${timeLog.durationMinutes}m`
    });

    return timeLog;
  }

  // Webhook handler for status changes
  async handleStatusChange(event) {
    if (event.columnId === 'status') {
      const newStatus = event.value.label;
      
      if (newStatus === 'Working on it') {
        await this.startTimeTracking(event.pulseId, event.userId);
      } else if (newStatus === 'Done') {
        // Find active tracking session
        const activeTracking = await this.timeTracker.findActiveSession(event.pulseId);
        if (activeTracking) {
          await this.stopTimeTracking(
            activeTracking.id,
            event.pulseId,
            event.boardId
          );
        }
      }
    }
  }
}
```

### 3. Customer Support Ticket System
```javascript
class SupportTicketSystem {
  constructor(mondayClient, supportBoardId) {
    this.client = mondayClient;
    this.supportBoardId = supportBoardId;
  }

  async createTicketFromEmail(email) {
    const priority = this.determinePriority(email.subject, email.body);
    const category = this.categorizeTicket(email.body);
    
    const columnValues = {
      "text": email.customerName || email.from,
      "text4": email.subject,
      "long_text": email.body,
      "email": { "email": email.from, "text": email.from },
      "status": { "label": "New" },
      "dropdown": { "labels": [category] },
      "status5": { "label": priority },
      "date4": { "date": new Date().toISOString().split('T')[0] }
    };

    const ticket = await this.client.makeRequest(`
      mutation($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
        create_item(
          board_id: $boardId,
          group_id: "new_tickets",
          item_name: $itemName,
          column_values: $columnValues
        ) {
          id
          name
        }
      }
    `, {
      boardId: this.supportBoardId,
      itemName: `Ticket: ${email.subject}`,
      columnValues: JSON.stringify(columnValues)
    });

    // Auto-assign based on category
    await this.autoAssignTicket(ticket.id, category);
    
    // Send confirmation email
    await this.sendConfirmationEmail(email.from, ticket.id);
    
    return ticket;
  }

  determinePriority(subject, body) {
    const urgentKeywords = ['urgent', 'critical', 'down', 'broken', 'emergency'];
    const text = (subject + ' ' + body).toLowerCase();
    
    if (urgentKeywords.some(keyword => text.includes(keyword))) {
      return 'High';
    }
    return 'Medium';
  }

  categorizeTicket(body) {
    const categories = {
      'Technical Issue': ['error', 'bug', 'broken', 'not working'],
      'Billing': ['invoice', 'payment', 'billing', 'charge'],
      'Feature Request': ['feature', 'enhancement', 'suggestion'],
      'General Inquiry': ['question', 'how to', 'help']
    };

    const text = body.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }
    
    return 'General Inquiry';
  }

  async autoAssignTicket(ticketId, category) {
    const assignments = {
      'Technical Issue': '111111', // Tech support user ID
      'Billing': '222222',         // Billing team user ID
      'Feature Request': '333333',  // Product team user ID
      'General Inquiry': '444444'   // General support user ID
    };

    const assigneeId = assignments[category];
    if (!assigneeId) return;

    await this.client.makeRequest(`
      mutation($itemId: ID!, $boardId: ID!, $value: JSON!) {
        change_column_value(
          item_id: $itemId,
          board_id: $boardId,
          column_id: "person",
          value: $value
        ) {
          id
        }
      }
    `, {
      itemId: ticketId,
      boardId: this.supportBoardId,
      value: JSON.stringify({
        "personsAndTeams": [{ "id": parseInt(assigneeId), "kind": "person" }]
      })
    });
  }

  async generateSLAReport() {
    const tickets = await this.client.makeRequest(`
      query($boardId: [ID!]!) {
        boards(ids: $boardId) {
          items_page(limit: 100) {
            items {
              id
              name
              created_at
              updated_at
              column_values {
                id
                type
                text
                value
              }
            }
          }
        }
      }
    `, { boardId: [this.supportBoardId] });

    const slaReport = {
      totalTickets: 0,
      resolvedInSLA: 0,
      averageResolutionTime: 0,
      byPriority: {}
    };

    tickets.boards[0].items_page.items.forEach(ticket => {
      const statusColumn = ticket.column_values.find(col => col.id === 'status');
      const priorityColumn = ticket.column_values.find(col => col.id === 'status5');
      
      if (statusColumn?.value) {
        const status = JSON.parse(statusColumn.value);
        const priority = priorityColumn ? JSON.parse(priorityColumn.value).label : 'Medium';
        
        slaReport.totalTickets++;
        
        if (status.label === 'Resolved' || status.label === 'Closed') {
          const resolutionTime = new Date(ticket.updated_at) - new Date(ticket.created_at);
          const slaThreshold = this.getSLAThreshold(priority);
          
          if (resolutionTime <= slaThreshold) {
            slaReport.resolvedInSLA++;
          }
          
          if (!slaReport.byPriority[priority]) {
            slaReport.byPriority[priority] = { total: 0, inSLA: 0 };
          }
          slaReport.byPriority[priority].total++;
          if (resolutionTime <= slaThreshold) {
            slaReport.byPriority[priority].inSLA++;
          }
        }
      }
    });

    slaReport.slaPercentage = (slaReport.resolvedInSLA / slaReport.totalTickets) * 100;
    
    return slaReport;
  }

  getSLAThreshold(priority) {
    const thresholds = {
      'High': 4 * 60 * 60 * 1000,    // 4 hours
      'Medium': 24 * 60 * 60 * 1000, // 24 hours
      'Low': 72 * 60 * 60 * 1000     // 72 hours
    };
    return thresholds[priority] || thresholds['Medium'];
  }
}
```

### 4. Inventory Management System
```javascript
class InventoryManager {
  constructor(mondayClient, inventoryBoardId) {
    this.client = mondayClient;
    this.inventoryBoardId = inventoryBoardId;
  }

  async updateStock(itemId, quantity, operation = 'set') {
    // Get current stock level
    const item = await this.client.makeRequest(`
      query($itemId: [ID!]!) {
        items(ids: $itemId) {
          id
          name
          column_values {
            id
            type
            text
            value
          }
        }
      }
    `, { itemId: [itemId] });

    const stockColumn = item.items[0].column_values.find(col => col.id === 'numbers');
    const currentStock = stockColumn ? parseInt(JSON.parse(stockColumn.value).number) : 0;
    
    let newStock;
    switch (operation) {
      case 'add':
        newStock = currentStock + quantity;
        break;
      case 'subtract':
        newStock = Math.max(0, currentStock - quantity);
        break;
      case 'set':
      default:
        newStock = quantity;
    }

    // Update stock level
    await this.client.makeRequest(`
      mutation($itemId: ID!, $boardId: ID!, $value: JSON!) {
        change_column_value(
          item_id: $itemId,
          board_id: $boardId,
          column_id: "numbers",
          value: $value
        ) {
          id
        }
      }
    `, {
      itemId,
      boardId: this.inventoryBoardId,
      value: JSON.stringify({ number: newStock })
    });

    // Check for low stock alerts
    await this.checkLowStockAlert(itemId, newStock);
    
    // Log stock change
    await this.logStockChange(itemId, currentStock, newStock, operation);
    
    return newStock;
  }

  async checkLowStockAlert(itemId, currentStock) {
    // Get item details including minimum stock threshold
    const item = await this.client.makeRequest(`
      query($itemId: [ID!]!) {
        items(ids: $itemId) {
          id
          name
          column_values {
            id
            type
            text
            value
          }
        }
      }
    `, { itemId: [itemId] });

    const minStockColumn = item.items[0].column_values.find(col => col.id === 'numbers7');
    const minStock = minStockColumn ? parseInt(JSON.parse(minStockColumn.value).number) : 10;

    if (currentStock <= minStock) {
      // Update status to "Low Stock"
      await this.client.makeRequest(`
        mutation($itemId: ID!, $boardId: ID!, $value: JSON!) {
          change_column_value(
            item_id: $itemId,
            board_id: $boardId,
            column_id: "status",
            value: $value
          ) {
            id
          }
        }
      `, {
        itemId,
        boardId: this.inventoryBoardId,
        value: JSON.stringify({ label: "Low Stock" })
      });

      // Send alert notification
      await this.sendLowStockAlert(item.items[0].name, currentStock, minStock);
    }
  }

  async logStockChange(itemId, oldStock, newStock, operation) {
    const changeDescription = `Stock ${operation}: ${oldStock} → ${newStock}`;
    
    await this.client.makeRequest(`
      mutation($itemId: ID!, $body: String!) {
        create_update(item_id: $itemId, body: $body) {
          id
        }
      }
    `, {
      itemId,
      body: `📦 ${changeDescription} at ${new Date().toLocaleString()}`
    });
  }

  async processOrder(orderId, items) {
    const results = [];
    
    for (const orderItem of items) {
      try {
        const newStock = await this.updateStock(
          orderItem.productId,
          orderItem.quantity,
          'subtract'
        );
        
        results.push({
          productId: orderItem.productId,
          success: true,
          newStock
        });
      } catch (error) {
        results.push({
          productId: orderItem.productId,
          success: false,
          error: error.message
        });
      }
    }

    // Create order record
    await this.createOrderRecord(orderId, items, results);
    
    return results;
  }

  async createOrderRecord(orderId, items, results) {
    const orderSummary = items.map((item, index) => 
      `${item.productName}: ${item.quantity} (${results[index].success ? 'OK' : 'FAILED'})`
    ).join('\n');

    await this.client.makeRequest(`
      mutation($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
        create_item(
          board_id: $boardId,
          group_id: "orders",
          item_name: $itemName,
          column_values: $columnValues
        ) {
          id
        }
      }
    `, {
      boardId: this.inventoryBoardId,
      itemName: `Order #${orderId}`,
      columnValues: JSON.stringify({
        "text": orderId,
        "long_text": orderSummary,
        "date4": { date: new Date().toISOString().split('T')[0] },
        "status": { label: results.every(r => r.success) ? "Completed" : "Partial" }
      })
    });
  }

  async generateInventoryReport() {
    const items = await this.client.makeRequest(`
      query($boardId: [ID!]!) {
        boards(ids: $boardId) {
          items_page(limit: 500) {
            items {
              id
              name
              column_values {
                id
                type
                text
                value
              }
            }
          }
        }
      }
    `, { boardId: [this.inventoryBoardId] });

    const report = {
      totalProducts: 0,
      lowStockItems: [],
      outOfStockItems: [],
      totalValue: 0,
      categorySummary: {}
    };

    items.boards[0].items_page.items.forEach(item => {
      const stockColumn = item.column_values.find(col => col.id === 'numbers');
      const priceColumn = item.column_values.find(col => col.id === 'numbers8');
      const categoryColumn = item.column_values.find(col => col.id === 'dropdown');
      
      const stock = stockColumn ? parseInt(JSON.parse(stockColumn.value).number) : 0;
      const price = priceColumn ? parseFloat(JSON.parse(priceColumn.value).number) : 0;
      const category = categoryColumn ? JSON.parse(categoryColumn.value).labels?.[0] : 'Uncategorized';

      report.totalProducts++;
      report.totalValue += stock * price;

      if (stock === 0) {
        report.outOfStockItems.push(item.name);
      } else if (stock <= 10) { // Assuming 10 is low stock threshold
        report.lowStockItems.push({ name: item.name, stock });
      }

      if (!report.categorySummary[category]) {
        report.categorySummary[category] = { count: 0, value: 0 };
      }
      report.categorySummary[category].count++;
      report.categorySummary[category].value += stock * price;
    });

    return report;
  }
}
```

---

## Best Practices & Patterns

### 1. Configuration Management
```javascript
// config/monday.js
const config = {
  apiUrl: process.env.MONDAY_API_URL || 'https://api.monday.com/v2',
  apiToken: process.env.MONDAY_API_TOKEN,
  apiVersion: process.env.MONDAY_API_VERSION || '2025-01',
  
  // Rate limiting
  rateLimits: {
    requestsPerMinute: 50,
    complexityLimit: 5000000,
    burstLimit: 200
  },
  
  // Retry configuration
  retry: {
    maxAttempts: 3,
    backoffFactor: 2,
    initialDelay: 1000
  },
  
  // Board IDs for different environments
  boards: {
    development: {
      projects: process.env.DEV_PROJECTS_BOARD_ID,
      tasks: process.env.DEV_TASKS_BOARD_ID
    },
    production: {
      projects: process.env.PROD_PROJECTS_BOARD_ID,
      tasks: process.env.PROD_TASKS_BOARD_ID
    }
  }
};

module.exports = config;
```

### 2. Query Builder Pattern
```javascript
class MondayQueryBuilder {
  constructor() {
    this.queryType = null;
    this.operation = null;
    this.fields = [];
    this.args = {};
    this.variables = {};
  }

  query(operation) {
    this.queryType = 'query';
    this.operation = operation;
    return this;
  }

  mutation(operation) {
    this.queryType = 'mutation';
    this.operation = operation;
    return this;
  }

  withArgs(args) {
    this.args = { ...this.args, ...args };
    return this;
  }

  withVariables(variables) {
    this.variables = { ...this.variables, ...variables };
    return this;
  }

  select(fields) {
    if (Array.isArray(fields)) {
      this.fields.push(...fields);
    } else {
      this.fields.push(fields);
    }
    return this;
  }

  build() {
    const variableDefinitions = Object.keys(this.variables)
      .map(key => `$${key}: ${this.variables[key]}`)
      .join(', ');

    const args = Object.keys(this.args)
      .map(key => `${key}: $${key}`)
      .join(', ');

    const fields = this.fields.join('\n        ');

    return {
      query: `
        ${this.queryType}${variableDefinitions ? `(${variableDefinitions})` : ''} {
          ${this.operation}${args ? `(${args})` : ''} {
            ${fields}
          }
        }
      `,
      variables: Object.keys(this.args).reduce((vars, key) => {
        vars[key] = this.args[key];
        return vars;
      }, {})
    };
  }
}

// Usage
const { query, variables } = new MondayQueryBuilder()
  .query('boards')
  .withArgs({ ids: 'boardIds' })
  .withVariables({ boardIds: '[ID!]!' })
  .select(['id', 'name', 'description'])
  .build();
```

### 3. Data Transformation Utilities
```javascript
class MondayDataTransformer {
  static transformColumnValue(columnType, value) {
    switch (columnType) {
      case 'status':
        return { label: value };
      case 'date':
        return { date: value };
      case 'datetime':
        return { date: value.split('T')[0], time: value.split('T')[1] };
      case 'people':
        return {
          personsAndTeams: Array.isArray(value) 
            ? value.map(id => ({ id: parseInt(id), kind: 'person' }))
            : [{ id: parseInt(value), kind: 'person' }]
        };
      case 'dropdown':
        return {
          labels: Array.isArray(value) ? value : [value]
        };
      case 'numbers':
        return { number: parseFloat(value) };
      case 'rating':
        return { rating: parseInt(value) };
      case 'checkbox':
        return { checked: Boolean(value) };
      case 'email':
        return { email: value, text: value };
      case 'phone':
        return { phone: value, countryShortName: 'US' };
      case 'link':
        return { url: value, text: value };
      default:
        return value;
    }
  }

  static parseColumnValue(columnType, value) {
    if (!value) return null;
    
    try {
      const parsed = JSON.parse(value);
      
      switch (columnType) {
        case 'status':
          return parsed.label;
        case 'date':
        case 'datetime':
          return parsed.date;
        case 'people':
          return parsed.personsAndTeams?.map(p => p.id) || [];
        case 'dropdown':
          return parsed.labels || [];
        case 'numbers':
          return parsed.number;
        case 'rating':
          return parsed.rating;
        case 'checkbox':
          return parsed.checked;
        case 'email':
          return parsed.email;
        case 'phone':
          return parsed.phone;
        case 'link':
          return parsed.url;
        default:
          return value;
      }
    } catch {
      return value;
    }
  }

  static formatItemForDisplay(item) {
    const formatted = {
      id: item.id,
      name: item.name,
      state: item.state,
      created_at: item.created_at,
      updated_at: item.updated_at,
      group: item.group?.title,
      columns: {}
    };

    item.column_values?.forEach(column => {
      const value = this.parseColumnValue(column.type, column.value);
      formatted.columns[column.id] = {
        type: column.type,
        value: value,
        text: column.text
      };
    });

    return formatted;
  }
}
```

### 4. Caching Strategy
```javascript
class MondayCache {
  constructor(ttl = 300000) { // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  generateKey(operation, variables) {
    return `${operation}:${JSON.stringify(variables)}`;
  }

  set(operation, variables, data) {
    const key = this.generateKey(operation, variables);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(operation, variables) {
    const key = this.generateKey(operation, variables);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clear() {
    this.cache.clear();
  }

  // Smart caching for different query types
  shouldCache(operation) {
    const cachableOperations = [
      'boards',
      'users',
      'workspaces',
      'teams'
    ];
    
    const nonCachableOperations = [
      'create_item',
      'update_item',
      'delete_item',
      'change_column_value'
    ];
    
    if (nonCachableOperations.includes(operation)) {
      return false;
    }
    
    return cachableOperations.includes(operation);
  }
}

// Enhanced client with caching
class CachedMondayClient extends MondayClient {
  constructor(apiToken) {
    super(apiToken);
    this.cache = new MondayCache();
  }

  async makeRequest(query, variables = {}) {
    const operation = this.extractOperation(query);
    
    // Check cache for read operations
    if (this.cache.shouldCache(operation)) {
      const cached = this.cache.get(operation, variables);
      if (cached) {
        console.log(`Cache hit for ${operation}`);
        return cached;
      }
    }

    const result = await super.makeRequest(query, variables);
    
    // Cache successful read operations
    if (this.cache.shouldCache(operation)) {
      this.cache.set(operation, variables, result);
    }

    return result;
  }

  extractOperation(query) {
    const match = query.match(/(?:query|mutation)\s*(?:\([^)]*\))?\s*{\s*([a-zA-Z_][a-zA-Z0-9_]*)/);
    return match ? match[1] : 'unknown';
  }
}
```

### 5. Testing Patterns
```javascript
// test/monday-client.test.js
const { MondayClient } = require('../src/monday-client');

describe('MondayClient', () => {
  let client;
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    client = new MondayClient('test-token');
  });

  test('should handle successful API response', async () => {
    const mockResponse = {
      data: {
        boards: [{ id: '123', name: 'Test Board' }]
      }
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const query = 'query { boards { id name } }';
    const result = await client.makeRequest(query);

    expect(result.boards).toHaveLength(1);
    expect(result.boards[0].name).toBe('Test Board');
  });

  test('should handle GraphQL errors', async () => {
    const mockResponse = {
      errors: [{ message: 'Invalid token' }]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const query = 'query { boards { id name } }';
    
    await expect(client.makeRequest(query))
      .rejects
      .toThrow('Invalid token');
  });

  test('should handle rate limiting', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Map([['retry-after', '60']])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { boards: [] } })
      });

    jest.useFakeTimers();
    
    const query = 'query { boards { id name } }';
    const promise = client.makeRequest(query);
    
    // Fast-forward time
    jest.advanceTimersByTime(60000);
    
    const result = await promise;
    expect(result.boards).toBeDefined();
    
    jest.useRealTimers();
  });
});

// Mock data factory
class MondayMockFactory {
  static createBoard(overrides = {}) {
    return {
      id: '123456789',
      name: 'Test Board',
      description: 'A test board',
      state: 'active',
      ...overrides
    };
  }

  static createItem(overrides = {}) {
    return {
      id: '987654321',
      name: 'Test Item',
      state: 'active',
      created_at: '2025-01-15T10:00:00Z',
      updated_at: '2025-01-15T10:00:00Z',
      column_values: [],
      ...overrides
    };
  }

  static createColumnValue(type, value, overrides = {}) {
    return {
      id: 'test_column',
      type,
      text: String(value),
      value: JSON.stringify(value),
      ...overrides
    };
  }
}
```

---

## Advanced Integration Examples

### Microservice Architecture
```javascript
// services/monday-service.js
class MondayService {
  constructor(client, eventBus) {
    this.client = client;
    this.eventBus = eventBus;
  }

  async createProject(projectData) {
    try {
      const board = await this.client.createBoard(
        projectData.name,
        projectData.workspaceId
      );

      // Emit event for other services
      this.eventBus.emit('project.created', {
        projectId: board.id,
        name: board.name,
        timestamp: new Date()
      });

      return board;
    } catch (error) {
      this.eventBus.emit('project.creation.failed', {
        projectData,
        error: error.message,
        timestamp: new Date()
      });
      throw error;
    }
  }

  async handleExternalEvent(eventType, payload) {
    switch (eventType) {
      case 'user.registered':
        await this.addUserToProjects(payload.userId, payload.defaultProjects);
        break;
      case 'billing.updated':
        await this.updateProjectBilling(payload.projectId, payload.billingInfo);
        break;
      default:
        console.log('Unhandled event:', eventType);
    }
  }
}

// Event-driven webhook processor
class WebhookProcessor {
  constructor(mondayService, eventBus) {
    this.mondayService = mondayService;
    this.eventBus = eventBus;
  }

  async processWebhook(payload) {
    const { event } = payload;
    
    // Transform Monday.com event to internal event
    const internalEvent = this.transformEvent(event);
    
    // Emit to event bus for other services
    this.eventBus.emit(internalEvent.type, internalEvent.data);
    
    // Handle specific business logic
    await this.handleBusinessLogic(internalEvent);
  }

  transformEvent(mondayEvent) {
    const eventMap = {
      'create_pulse': 'task.created',
      'update_column_value': 'task.updated',
      'create_update': 'task.commented'
    };

    return {
      type: eventMap[mondayEvent.type] || 'unknown',
      data: {
        taskId: mondayEvent.pulseId,
        boardId: mondayEvent.boardId,
        userId: mondayEvent.userId,
        timestamp: mondayEvent.triggerTime,
        originalEvent: mondayEvent
      }
    };
  }
}
```

This comprehensive guide provides practical, production-ready code examples and patterns for integrating with the Monday.com API. Each example includes error handling, best practices, and real-world use cases that you can adapt to your specific needs.

Remember to always:
- Store API tokens securely
- Implement proper error handling and retry logic
- Respect rate limits
- Use appropriate caching strategies
- Test your integrations thoroughly
- Monitor your API usage and performance