# Monday.com API Complete Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Getting Started](#getting-started)
4. [GraphQL Overview](#graphql-overview)
5. [API Versioning](#api-versioning)
6. [Rate Limits](#rate-limits)
7. [Error Handling](#error-handling)
8. [Core Resources](#core-resources)
9. [Column Types Reference](#column-types-reference)
10. [Webhooks](#webhooks)
11. [Apps Framework](#apps-framework)
12. [Advanced Features](#advanced-features)

---

## Introduction

The monday GraphQL API is part of the monday apps framework. It is an application layer that allows apps to read and update data inside a monday.com account. It supports operations boards, items, column values, users, workspaces, and more.

### What is Monday.com?

Welcome to monday.com, a work OS where teams create and shape their own workflows in minutes, code-free. Our mission is to help teams outdo their best, fulfilling their potential, and collaborating more effectively.

### Why Use the API?

There are countless use cases for the API, including:
- Accessing board data to render a custom report inside a monday.com dashboard
- Creating a new item on a board when a record is created on another system
- Importing data from another source programmatically

### Who Can Use the API?

Admin, member, and guest users are all able to utilize the monday.com API.

Admins and members have access to their own API tokens. Guests cannot access an API key but can utilize API features through other authentication methods, like OAuth or a shortLivedToken.

Viewers, users who have been deactivated or disabled, users with unconfirmed emails, or users on student accounts cannot access the API.

### Supported Products

The platform API currently supports the monday work management, dev, sales CRM, and service products. It currently does not support Workforms.

---

## Authentication

The Monday.com API supports multiple authentication methods depending on your use case.

### Personal API Tokens

The monday.com platform API utilizes personal V2 API tokens to authenticate requests and identify the user making the call. These tokens are unique to each user and have no explicit length.

Personal tokens allow you to interact with the API using your own user account. Their permissions mirror what you can do in the monday.com UI, ensuring that API access is consistent with your platform-level permissions.

#### Accessing Your API Token

**All Users:**
In your monday.com account, click on your profile picture in the top right corner. Select Developers. This will open the Developer Center in another tab. Click My Access Tokens > Show. Copy your personal token.

**Account Admins (Alternative Method):**
In your monday.com account, click on your profile picture in the top right corner. Select Administration > Connections > Personal API token. Copy your personal token.

#### Using Your Token

Once you have your token, you can make requests with the API by passing the token in the Authorization header.

```bash
curl -X POST https://api.monday.com/v2 \
  -H "Authorization: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { me { id name } }"}'
```

### OAuth Authentication

OAuth 2.0 is a protocol that lets your app request authorization to read or modify data in a user's monday account. At the end of the OAuth process, your app gets an access token that belongs to the user and grants access to specified permission scopes.

#### OAuth Flow Steps

1. **Authorization Request**
   The first step in the OAuth flow is making an authorization request and redirecting a user to the monday OAuth page. The OAuth request URL is: https://auth.monday.com/oauth2/authorize.

2. **Token Exchange**
   Once you have obtained an authorization code from the authorization endpoint, you can exchange it for an access token to make calls to monday's API.

3. **API Access**
   The access token gives your app access to the monday API on behalf of the user and will be valid until the user uninstalls your app.

### Seamless Authentication

We offer two mechanisms for seamless authentication, which eliminate most of the overhead of user and token management in your app. We recommend using Seamless Authentication if your app only needs to make API calls when a user is interacting with it.

**Advantages:**
Your app does not need to store and manage API keys · You can host client-side apps fully on monday servers · Your users do not need to take additional steps to authorize your app or supply an API key

---

## Getting Started

### Setting Up Your Environment

#### 1. Create a Monday.com Account

The first step is to sign up and create a trial account. You can also create a developer account strictly for developing apps. If you already have a monday.com account, skip to the next step!

#### 2. Enable Developer Mode

Developer mode is a valuable tool that makes developing with monday easier by exposing template IDs, column IDs, doc IDs, and more. It allows you to easily retrieve these IDs, which many methods in our API require.

**Steps to Enable:**
Click on your profile picture in the top right corner of your monday account. Select monday.labs. Type Developer mode in the search bar. Click Activate and close the modal. Wait for the page to refresh.

### API Endpoint

GraphQL APIs use a single endpoint for all operations (unlike REST APIs). Our API endpoint is: https://api.monday.com/v2

### Making Your First Request

```javascript
fetch("https://api.monday.com/v2", {
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'YOUR_API_KEY_HERE',
    'API-Version': '2023-04'
  },
  body: JSON.stringify({
    'query': 'query{boards (limit:1) {id name} }'
  })
});
```

---

## GraphQL Overview

The monday.com API is built with GraphQL, a flexible query language that allows you to return as much or as little data as you need. GraphQL is an application layer that parses the query you send it and returns (or changes) data accordingly.

### Key GraphQL Concepts

#### Operations

There are two possible operations in GraphQL: queries and mutations. Queries perform the READ operation and do not change or alter any data. The result of each query will be formatted in the same way as the query itself.

#### Object Types and Fields

Object types are a collection of fields used to describe the set of possible data you can query using the API. They can also have arguments on the fields to pass parameters when querying data.

Fields specify properties or attributes of objects to help define what information to retrieve from a query. Every object in the schema contains fields that can be queried by name to retrieve specific properties of the object.

#### Arguments

You can pass arguments in a query to specify what data to return (i.e., filter the search results) and narrow down the results to only the specific ones you're after.

#### Variables

You can use variables to pass dynamic values to your arguments. They are written outside of the query string itself in the variables section and passed to the arguments.

```graphql
mutation change_column_value($value: JSON!) {
  change_column_value (board_id: 157244624, item_id: 9539475, column_id: "status", value: $value) {
    id
  }
}
```

### Schema Access

We expose our schema here. By default, it is in introspection JSON format for the Current API version. You can request a different version using the optional version=<API-Version> parameter with the version name.

---

## API Versioning

### Version Lifecycle

Our guides and API reference will always reflect the schema of the current version. All upcoming updates or schema changes will be announced in the API changelog and release notes and denoted in the API reference when relevant.

Each version moves through the following lifecycle:

1. **Release Candidate (RC)**: Testing phase
2. **Current**: Default version for new requests
3. **Maintenance**: Receives bug fixes only
4. **Deprecated**: Will be removed

New RCs are released every three months at the start of each quarter at 12:00 AM UTC. Version names are not semantic but instead refer to the year and month in which they become the default/current version.

### Using API Versions

#### In HTTP Headers

```bash
curl --location --request POST 'https://api.monday.com/v2' \
  --header 'API-Version: 2024-01' \
  --header 'Authorization: YOUR_API_KEY_HERE' \
  --header 'Content-Type: application/json' \
  --data-raw '{"query":"query { version { kind value } }"}'
```

#### In JavaScript SDK

We support two ways to set the API version when using the Javascript SDK: setting the default version or passing the version for a specific call.

### Version Behavior

Any request to a version of the API that has been deprecated will get the Maintenance version. If you request a version that does not exist (e.g. 2024-02 instead of 2024-01), you will get the Current version.

---

## Rate Limits

We strive to provide a top-tier API experience that is reliable and consistent for all users. To maintain a high-quality service and ensure optimal performance, users are subject to the following limits to help manage the API's consumption and throughput.

### Complexity Limits

Complexity defines the load that each call puts on the API. This limit restricts the heaviness of each query to help prevent excessive load and maintain optimal performance. The limit will not affect most users—the quota is set sufficiently high to impact only users making requests that would compromise the stability of the API.

### Minute Limits

You will receive a Minute limit rate exceeded error if you hit the limit. The limit varies based on your monday.com plan and the type of request.

### Concurrency Limits

The concurrency limit restricts the number of requests being handled at any moment. You will receive a Concurrency limit exceeded error if you hit the limit. The limit varies based on your monday.com plan and the type of request.

### IP Limits

The IP limit helps control the API traffic coming from a given IP address within a short period. You will receive an IP_RATE_LIMIT_EXCEEDED error if you hit the limit.

### Special Rate Limits

#### Board Creation and Duplication

This mutation has an additional rate limit of 40 mutations per minute. If you exceed this limit, you will receive 429 HTTP response code with a Call limit exceeded for CreateBoard error message.

This mutation has an additional rate limit of 40 mutations per minute. If you exceed this limit, you will receive 429 HTTP response code with a "Call limit exceeded for DuplicateBoard" error message.

### Rate Limit Improvements

Standardized error codes: Rate limit errors will now return a 429 HTTP error code to help standardize responses and simplify error handling. Retry-After header: Errors will now include the Retry-After header to indicate how long you need to wait before making another request.

---

## Error Handling

### Error Format (Version 2025-01+)

Starting in version 2025-01, errors returned by the API will have the following characteristics: HTTP status: Response will be 200 – OK for application-level errors. Other statuses will be returned for transport-layer errors, such as 500 - Internal server error, 429 - Too many requests or 400 - Bad request

```json
{
  "data": [],
  "errors": [
    {
      "message": "User unauthorized to perform action",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "me"
      ],
      "extensions": {
        "code": "UserUnauthorizedException",
        "error_data": {},
        "status_code": 403
      }
    }
  ],
  "account_id": 123456
}
```

### Common Error Types

#### 2xx Errors
Errors with a 2xx status code indicate that monday.com is not accepting the requested action due to a platform platform restriction, limitation, or rule. These errors occur for various reasons, including passing invalid values, missing permissions, or reaching character limits.

#### 4xx Errors
Errors with a 4xx status code indicate that something went wrong on the client's (your) side. These errors occur for various reasons, including not having access to the requested information, using the API at too high a volume, or providing incorrect input.

#### 5xx Errors
Errors with a 5xx status code indicate that something went wrong on the server (monday's) side.

### Specific Error Codes

#### Authentication Errors

A 401 (Not authenticated) error indicates that you don't have authentication credentials or the token you provided is invalid.

#### Board Errors

A 200 error with a InvalidBoardIdException indicates that the board ID being passed in the query is not a valid board ID. Ensure the board ID exists and you have access to the board.

#### Column Value Errors

A 200 error with a ColumnValueException indicates that the column value you are attempting to send in your query is of the incorrect formatting. If you are updating a column value, ensure the value conforms with each column's data structure.

#### Item Errors

A 200 error with a ItemsLimitationException indicates that you have exceeded the limit of items allowed for a board. To prevent abuse, each board has a limit of 10,000 items created via the API.

---

## Core Resources

### Boards

monday.com boards are where users input all of their data, making them one of the core platform components. The board's structure consists of items(rows), groups (groups of rows), and columns, and the board's data is stored in items and their respective updates sections.

#### Querying Boards

```graphql
query {
  boards (ids: 1234567890) {
    name
    state
    permissions
    items_page {
      items {
        id
        name
      }
    }
  }
}
```

#### Creating Boards

The create_board mutation allows you to create a new board via the API. You can also specify what fields to query back from the new board when you run the mutation.

```graphql
mutation ($name: String!, $workspace: ID!) {
  create_board (board_name: $name, workspace_id: $workspace, board_kind: public) {
    id
  }
}
```

#### Duplicating Boards

The duplicate_board mutation allows you to duplicate a board with all of its items and groups to a specific workspace or folder of your choice via the API.

#### Deleting Boards

The delete_board mutation allows you to delete a board via the API. You can also specify what fields to query back from the deleted board when you run the mutation.

### Items

The create_item mutation allows you to create a new item via the API. You can also specify what fields to query back from the new item when you run the mutation.

#### Creating Items

```graphql
mutation {
  create_item (board_id: 1234567890, item_name: "New Item") {
    id
  }
}
```

#### Reading Items

```graphql
query {
  items (ids: [1234567890, 9876543210]) {
    name
    column_values {
      value
      text
    }
  }
}
```

#### Updating Items

The duplicate_item mutation allows you to duplicate a single item via the API. You can also specify what fields to query back from the duplicated item when you run the mutation.

#### Moving Items

The move_item_to_group mutation allows you to move an item between groups on the same board via the API. You can also specify what fields to query back from the item when you run the mutation.

### Users

Every monday.com user is part of an account or organization as an admin, team member, member, viewer, guest, subscriber, board owner, or in a custom role. Each user has a unique set of user details.

#### Querying Users

```graphql
query {
  users {
    id
    name
    email
    photo_original
  }
}
```

#### User Management

This mutation deactivates users from a monday.com account. It returns the DeactivateUsersResult type which supports a set of fields that you can query back when you run it.

### Workspaces

monday.com Workspaces are used by teams to organize and manage their accounts by departments/teams/projects. Workspaces can contain boards, dashboards, and folders.

#### Querying Workspaces

```graphql
query {
  workspaces {
    id
    name
    description
  }
}
```

#### Main Workspace Behavior

Every account has a main workspace, but you typically can't query its details via the API. However, users will eventually be able to query main workspace details as we complete a multi-product migration over the next few months.

### Teams

The add_users_to_team mutation allows you to add users to a team via the API. This mutation returns the ChangeTeamMembershipResult type which allows you to specify what fields to query back when you run the mutation.

#### Team Operations

```graphql
mutation {
  add_users_to_team (user_ids: [123456, 654321], team_id: 789012) {
    team {
      id
      name
    }
  }
}
```

### Updates

The create_update mutation allows you to add an update to an item via the API. You can also specify what fields to query back from the new update when you run the mutation.

#### Creating Updates

```graphql
mutation {
  create_update (item_id: 1234567890, body: "This is a new update") {
    id
  }
}
```

#### Querying Updates

When querying updates at the root, you can now filter the results by a specific date range using the new from_date and to_date arguments.

```graphql
query {
  updates (limit: 50, to_date: "2025-06-04", from_date: "2025-01-01") {
    body
    id
    created_at
    creator {
      name
      id
    }
  }
}
```

### Docs

Workdocs serve as a central place for teams to plan and execute work in a collaborative format. They are like virtual whiteboards that allow you to jot down notes, create charts, and populate items on a board from the text you type.

#### Creating Docs

The create_doc mutation allows you to create a new doc in a document column or workspace. You can also specify what fields to query back from the new doc when you run the mutation.

```graphql
mutation {
  create_doc (location: {workspace: { workspace_id: 12345678, name:"New doc", kind: private}}) {
    id
  }
}
```

---

## Column Types Reference

The monday.com platform supports a variety of column types to store different data. Our API supports most types, allowing you to read, filter, delete, and update those columns.

### Status Column

The status column represents a label designation for your item(s). It can be used to denote the status of a particular item or hold any other custom labeling for the item. Each status column is a collection of indexes and their corresponding labels.

#### Reading Status Values

```graphql
query {
  items (ids:[1234567890, 9876543210]) {
    column_values {
      ... on StatusValue {
        index
        value
        label
      }
    }
  }
}
```

#### Updating Status Values

You can update a status column with either a simple string or a JSON string, and each status column can have a maximum of 40 labels.

```graphql
mutation {
  change_simple_column_value (
    item_id: 9876543210, 
    board_id: 1234567890, 
    column_id: "status", 
    value: "Done"
  ) {
    id
  }
}
```

### Dropdown Column

The dropdown column lets a user select one or more options from a selection. You can filter, read, update, and clear the dropdown column via the API.

#### Reading Dropdown Values

```graphql
query {
  items (ids:[1234567890, 9876543210]) {
    column_values {
      ... on DropdownValue {
        values {
          label
          id
        }
      }
    }
  }
}
```

#### Updating Dropdown Values

You can update a dropdown column with a simple string value or a JSON string value. It is not possible to mix dropdown labels (the text values) with dropdown IDs in the string values.

### Text Column

```graphql
mutation {
  change_simple_column_value (
    item_id: 1234567890, 
    board_id: 9876543210, 
    column_id: "text", 
    value: "New text content"
  ) {
    id
  }
}
```

### Number Column

```graphql
mutation {
  change_simple_column_value (
    item_id: 1234567890, 
    board_id: 9876543210, 
    column_id: "numbers", 
    value: "42"
  ) {
    id
  }
}
```

### Date Column

```graphql
mutation {
  change_column_value (
    item_id: 1234567890, 
    board_id: 9876543210, 
    column_id: "date", 
    value: "{\"date\":\"2023-12-31\"}"
  ) {
    id
  }
}
```

### People Column

```graphql
mutation {
  change_column_value (
    item_id: 1234567890, 
    board_id: 9876543210, 
    column_id: "person", 
    value: "{\"personsAndTeams\":[{\"id\":123456,\"kind\":\"person\"}]}"
  ) {
    id
  }
}
```

### Connect Boards Column

The connect boards column links an item on the board with an item(s) on a different board(s). You can filter, read, update, and clear the connect boards column via the API.

Boards can't be connected using the API - only items on boards that are already connected. Let's say your want to connect an item from Board B to Board A, but the boards are not yet connected. You must first manually connect Boards B and A, and then you can use the API to connect the items.

### Column Value Clearing

To clear a column's value, you can pass an empty string or an empty JSON object, depending on the column type.

**Text Column Clear:**
```graphql
mutation {
  change_simple_column_value(item_id: 123456789, board_id: 11223344, column_id: "text", value: "") {
    id
  }
}
```

**JSON Column Clear:**
```graphql
mutation {
  change_column_value(item_id: 123456789, board_id: 11223344, column_id: "email", value: "{}") {
    id
  }
}
```

---

## Webhooks

Webhooks (also called a web callback or HTTP push API) are ways to provide real-time information and updates. They deliver data to other applications as it happens, making webhooks much more efficient for both providers and consumers.

### Setting Up Webhooks

Follow these steps to add a webhook to one of your boards: Open the Automations Center in the top right-hand corner of the board.

### Webhook Events

Every webhook sent to your endpoint will have an event field containing the payload with the event's data. Subitem webhooks will include a similar payload for each event but will also include the parent_item_id and subitem board ID in their payload.

Common webhook events include:
- `create_item`
- `create_subitem`
- `change_column_value`
- `create_update`
- `status_column_change`

### Webhook Listener Example

Here's a simple example of a webhook listener that will print the output of the webhook and respond correctly to the challenge:

**JavaScript:**
```javascript
app.post("/", function(req, res) {
  console.log(JSON.stringify(req.body, 0, 2));
  res.status(200).send(req.body);
})
```

**Python:**
```python
from flask import Flask, request, abort, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    if request.method == 'POST':
        data = request.get_json()
        challenge = data['challenge']
        return jsonify({'challenge': challenge})
    else:
        abort(400)
```

### Webhook Authentication

Some webhook requests contain a JWT in the Authorization header, which can be used to check the request is legitimate. To authenticate the request, verify the JWT's signature against the app's Signing Secret, as described in our integrations documentation.

### Retry Policy

Requests sent through our webhook integration will retry once a minute for 30 minutes.

### Querying Webhooks

Querying webhooks will return one or a collection of webhooks. This method accepts various arguments and returns an array. You can only query webhooks directly at the root, so it can't be nested within another query.

---

## Apps Framework

### Developer Center

The Developer Center is a one-stop shop to manage your monday apps and API usage. For app builders, you can create new apps, manage apps hosted with monday code, publish new app versions, implement webhooks, submit an app to the marketplace, analyze marketplace sales and ratings data, and so much more.

#### Access Levels

Access to these capabilities varies based on your monday.com user type: Admins and members can create apps and view those they are collaborators on · Guests can view apps they're collaborators on but can't create them

### App Features

#### Board Views
Display custom interfaces within monday.com boards

#### Dashboard Widgets
Create widgets for monday.com dashboards

#### Integration Recipes
Build custom automations and integrations

#### App Monetization

The monday apps framework has three interfaces to manage your app's monetization: monday SDK: Handles subscriptions in a frontend app GraphQL API: Allows your backend to access subscription information and create mock subscriptions for testing Webhooks: Sends subscription information to your backend

### OAuth and Permissions

OAuth scopes define what your app can and cannot do. Each endpoint in the monday API requires a certain permission scope that can be found in our API reference.

### Credentials Management

The credentials app feature enables secure authentication between monday apps and third-party services—such as Google, Dropbox, or Slack— within monday workflows. It manages the full OAuth 2.0 flow, including redirect handling, token exchange, and refresh support (when applicable).

---

## Advanced Features

### Activity Logs

Activity logs are records of all activities performed on a board. You can use them to see which actions were performed on your boards, when, and by whom.

```graphql
query {
  boards (ids: 1234567890) {
    activity_logs {
      id
      event
      created_at
      user {
        name
      }
    }
  }
}
```

### Subitems

Subitems are special items that are "nested" under the items on your board. They can be accessed via the subitem column, which can be added from the column's center or by right-clicking an item to expose its dropdown menu.

#### Creating Subitems

The create_subitem mutation allows you to create a new subitem via the API. You can also specify what fields to query back from the new subitem when you run the mutation.

```graphql
mutation {
  create_subitem (parent_item_id: 1234567890, item_name: "New Subitem") {
    id
  }
}
```

### Managed Columns

Managed columns are useful tools to standardize workflows across your monday.com account. Select users can create, own, and manage status and dropdown columns with predefined labels that can't be edited by other members.

### Pagination

Many queries support pagination to handle large datasets:

```graphql
query {
  boards {
    items_page (limit: 25) {
      cursor
      items {
        id
        name
      }
    }
  }
}
```

### Complex Filtering

```graphql
query {
  boards (ids: 1234567890) {
    items_page (query_params: {
      rules: [
        {column_id: "status", compare_value: ["Done"], operator: any_of},
        {column_id: "person", compare_value: [123456], operator: any_of}
      ]
    }) {
      items {
        id
        name
      }
    }
  }
}
```

### Formula Columns

In API versions 2025-01 and later, you can read the formula column using the display_value field. This field returns the content of the formula column as a string.

```graphql
query {
  boards(ids: [1234567890]){
    items_page(limit:2){
      items{
        id
        column_values {
          ...on FormulaValue{
            display_value
            id
            type
          }
        }
      }
    }
  }
}
```

---

## Best Practices

### Rate Limit Management

1. **Monitor Response Headers**: Always check the `Retry-After` header in error responses
2. **Implement Exponential Backoff**: When receiving rate limit errors, wait before retrying
3. **Batch Operations**: Use mutations that can update multiple items at once
4. **Optimize Query Complexity**: Request only the fields you need

### Error Handling

1. **Always Handle Partial Success**: GraphQL can return partial data with errors
2. **Check Error Codes**: Use error codes to determine appropriate retry logic
3. **Log Request IDs**: All API responses now contain a unique request ID to help measure performance, track the full request lifecycle across services, and simplify troubleshooting.

### Security

1. **Use Environment Variables**: Never hardcode API tokens
2. **Implement Token Rotation**: Regularly regenerate API tokens
3. **Validate Webhook Signatures**: Always verify webhook authenticity
4. **Use HTTPS**: All API communications should use HTTPS

### Performance

1. **Use Fragments**: Reduce query complexity with GraphQL fragments
2. **Cache Static Data**: Cache board schemas and user information
3. **Implement Pagination**: Don't fetch large datasets in single requests
4. **Monitor Complexity**: Keep track of query complexity to avoid limits

---

## Resources

- **API Playground**: Test queries in the GraphQL playground
- **Developer Community**: We've created a community specifically for our devs where you can search through previous topics to find solutions, ask new questions, hear about new features and updates, and learn tips and tricks from other devs.
- **Changelog**: Stay updated with API changes and new features
- **Developer Center**: Manage your apps and API usage

This documentation provides comprehensive coverage of the Monday.com API, from basic authentication to advanced features. Always refer to the official API reference for the most current information and detailed specifications.