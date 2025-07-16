# Monday.com create_column Mutation Code for All Column Types

## Basic Syntax

The basic structure for all `create_column` mutations:

```graphql
mutation {
  create_column(
    board_id: YOUR_BOARD_ID,
    title: "Column Title",
    description: "Column Description", 
    column_type: COLUMN_TYPE
  ) {
    id
    title
    description
  }
}
```

## Supported Column Types

### 1. Auto Number
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Auto Number",
    description: "Automatically generated numbers",
    column_type: auto_number
  ) {
    id
    title
    description
  }
}
```

### 2. Button
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Action Button",
    description: "Button for triggering actions",
    column_type: button
  ) {
    id
    title
    description
  }
}
```

### 3. Checkbox
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Completed",
    description: "Task completion status",
    column_type: checkbox
  ) {
    id
    title
    description
  }
}
```

### 4. Color Picker
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Color Theme",
    description: "Select a color",
    column_type: color_picker
  ) {
    id
    title
    description
  }
}
```

### 5. Connect Boards (Board Relation)
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Related Items",
    description: "Connect to other board items",
    column_type: board_relation
  ) {
    id
    title
    description
  }
}
```

### 6. Country
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Country",
    description: "Select a country",
    column_type: country
  ) {
    id
    title
    description
  }
}
```

### 7. Creation Log
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Created",
    description: "Item creation information",
    column_type: creation_log
  ) {
    id
    title
    description
  }
}
```

### 8. Date
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Due Date",
    description: "Task due date",
    column_type: date
  ) {
    id
    title
    description
  }
}
```

### 9. Dependency
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Dependencies",
    description: "Task dependencies",
    column_type: dependency
  ) {
    id
    title
    description
  }
}
```

### 10. Dropdown
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Category",
    description: "Select from dropdown options",
    column_type: dropdown
  ) {
    id
    title
    description
  }
}
```

**Dropdown with Custom Labels:**
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Priority Level",
    description: "Task priority",
    column_type: dropdown,
    defaults: "{\"settings\":{\"labels\":[{\"id\":1,\"name\":\"High\"}, {\"id\":2,\"name\":\"Medium\"}, {\"id\":3,\"name\":\"Low\"}]}}"
  ) {
    id
    title
    description
  }
}
```

### 11. Email
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Email Address",
    description: "Contact email",
    column_type: email
  ) {
    id
    title
    description
  }
}
```

### 12. Files
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Attachments",
    description: "File uploads",
    column_type: file
  ) {
    id
    title
    description
  }
}
```

### 13. Formula
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Calculated Value",
    description: "Formula-based calculation",
    column_type: formula
  ) {
    id
    title
    description
  }
}
```

### 14. Hour
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Time",
    description: "Hour selection",
    column_type: hour
  ) {
    id
    title
    description
  }
}
```

### 15. Item ID
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Item ID",
    description: "Unique item identifier",
    column_type: item_id
  ) {
    id
    title
    description
  }
}
```

### 16. Last Updated
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Last Modified",
    description: "Last update information",
    column_type: last_updated
  ) {
    id
    title
    description
  }
}
```

### 17. Link
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Website Link",
    description: "URL links",
    column_type: link
  ) {
    id
    title
    description
  }
}
```

### 18. Location
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Address",
    description: "Geographic location",
    column_type: location
  ) {
    id
    title
    description
  }
}
```

### 19. Long Text
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Description",
    description: "Long text content",
    column_type: long_text
  ) {
    id
    title
    description
  }
}
```

### 20. Mirror
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Mirrored Data",
    description: "Mirror values from connected boards",
    column_type: mirror
  ) {
    id
    title
    description
  }
}
```

### 21. Monday Doc
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Document",
    description: "Monday.com document",
    column_type: doc
  ) {
    id
    title
    description
  }
}
```

### 22. Name
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Item Name",
    description: "Item name column",
    column_type: name
  ) {
    id
    title
    description
  }
}
```

### 23. Numbers
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Budget",
    description: "Numerical values",
    column_type: numbers
  ) {
    id
    title
    description
  }
}
```

### 24. People
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Assigned To",
    description: "Team member assignments",
    column_type: people
  ) {
    id
    title
    description
  }
}
```

### 25. Phone
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Phone Number",
    description: "Contact phone number",
    column_type: phone
  ) {
    id
    title
    description
  }
}
```

### 26. Rating
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Quality Rating",
    description: "Star rating system",
    column_type: rating
  ) {
    id
    title
    description
  }
}
```

### 27. Status
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Status",
    description: "Task status",
    column_type: status
  ) {
    id
    title
    description
  }
}
```

**Status with Custom Labels:**
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Work Status",
    description: "Current work status",
    column_type: status,
    defaults: "{\"settings\":{\"labels\":[{\"id\":1,\"name\":\"Not Started\",\"color\":\"#c4c4c4\"}, {\"id\":2,\"name\":\"In Progress\",\"color\":\"#fdab3d\"}, {\"id\":3,\"name\":\"Done\",\"color\":\"#00c875\"}]}}"
  ) {
    id
    title
    description
  }
}
```

### 28. Tags
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Tags",
    description: "Item tags",
    column_type: tags
  ) {
    id
    title
    description
  }
}
```

### 29. Text
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Notes",
    description: "Short text content",
    column_type: text
  ) {
    id
    title
    description
  }
}
```

### 30. Timeline
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Project Timeline",
    description: "Start and end dates",
    column_type: timeline
  ) {
    id
    title
    description
  }
}
```

### 31. Time Tracking
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Time Spent",
    description: "Track time spent on tasks",
    column_type: time_tracking
  ) {
    id
    title
    description
  }
}
```

### 32. Vote
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Team Vote",
    description: "Voting system",
    column_type: vote
  ) {
    id
    title
    description
  }
}
```

### 33. Week
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Week Selection",
    description: "Select a week",
    column_type: week
  ) {
    id
    title
    description
  }
}
```

### 34. World Clock
```graphql
mutation {
  create_column(
    board_id: 1234567890,
    title: "Time Zone",
    description: "World clock display",
    column_type: world_clock
  ) {
    id
    title
    description
  }
}
```

## Unsupported Column Types

The following column types are **not supported** by the create_column mutation:

- **Progress Tracking** (`progress`) - These columns are calculated automatically
- Some auto-generated columns that don't contain user-input data

## Using Variables

You can also use GraphQL variables for dynamic column creation:

```graphql
mutation CreateColumn($board: ID!, $title: String!, $desc: String!, $type: ColumnType!) {
  create_column(
    board_id: $board,
    title: $title,
    description: $desc,
    column_type: $type
  ) {
    id
    title
    description
  }
}
```

**Variables:**
```json
{
  "board": 1234567890,
  "title": "My Column",
  "desc": "Column description",
  "type": "text"
}
```

## Important Notes

1. **Board ID**: Replace `1234567890` with your actual board ID
2. **Custom Labels**: For `status` and `dropdown` columns, you can use the `defaults` parameter to set custom labels
3. **Permissions**: You need appropriate permissions to create columns on the board
4. **API Key**: Remember to include your API key in the request headers
5. **Rate Limits**: Be mindful of Monday.com's API rate limits when creating multiple columns

This list is based on Monday.com's official API documentation and includes all supported column types that can be created using the create_column mutation.