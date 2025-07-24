# Complete Claude API Documentation Guide & Reference 2025

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [Models Overview](#models-overview)
5. [Core API Endpoints](#core-api-endpoints)
6. [Advanced Features](#advanced-features)
7. [Tools & Function Calling](#tools--function-calling)
8. [Code Execution](#code-execution)
9. [Files API](#files-api)
10. [MCP (Model Context Protocol)](#mcp-model-context-protocol)
11. [Prompt Caching](#prompt-caching)
12. [Batch Processing](#batch-processing)
13. [Streaming](#streaming)
14. [Vision Capabilities](#vision-capabilities)
15. [Pricing](#pricing)
16. [SDKs & Integration](#sdks--integration)
17. [Best Practices](#best-practices)
18. [Error Handling](#error-handling)
19. [Rate Limits](#rate-limits)
20. [Examples & Code Samples](#examples--code-samples)

---

## Introduction

Claude is Anthropic's family of advanced AI models designed for safe, helpful, and honest AI assistance. The Claude API provides programmatic access to these models, enabling developers to build sophisticated AI applications with capabilities including text generation, analysis, coding, math, reasoning, and vision processing.

### Key Features
- **Advanced reasoning and analysis**
- **Function calling and tool use**
- **Vision capabilities (image understanding)**
- **Code execution in sandboxed environment**
- **File processing and management**
- **Model Context Protocol (MCP) integration**
- **Prompt caching for cost optimization**
- **Batch processing for large-scale operations**
- **Streaming responses**

---

## Getting Started

### Quick Start

1. **Sign up** at [console.anthropic.com](https://console.anthropic.com)
2. **Generate API key** in Account Settings
3. **Make your first API call**

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1000,
    "messages": [
      {
        "role": "user",
        "content": "Hello, Claude!"
      }
    ]
  }'
```

---

## Authentication

All requests to the Anthropic API require authentication via API key.

### Headers Required
```http
x-api-key: YOUR_API_KEY
anthropic-version: 2023-06-01
content-type: application/json
```

### Environment Variable Setup
```bash
export ANTHROPIC_API_KEY="your_api_key_here"
```

---

## Models Overview

### Claude 4 Family (Latest)

| Model | Description | Best For | Input Cost | Output Cost |
|-------|-------------|----------|------------|-------------|
| **Claude Opus 4** | Most capable model | Complex reasoning, advanced coding, multi-step tasks | $15/MTok | $75/MTok |
| **Claude Sonnet 4** | Balanced performance & speed | General purpose, coding, analysis | $3/MTok | $15/MTok |

### Claude 3.7 & 3.5 Family

| Model | Description | Input Cost | Output Cost |
|-------|-------------|------------|-------------|
| **Claude Sonnet 3.7** | Extended thinking capabilities | $3/MTok | $15/MTok |
| **Claude Sonnet 3.5** | High performance | $3/MTok | $15/MTok |
| **Claude Haiku 3.5** | Fast, efficient | $0.80/MTok | $4/MTok |

### Model Selection Guide
- **Opus 4**: Complex analysis, advanced coding, research tasks
- **Sonnet 4**: General development, content creation, analysis
- **Sonnet 3.7**: Extended reasoning with thinking mode
- **Haiku 3.5**: Simple tasks, high-volume processing

---

## Core API Endpoints

### Base URL
```
https://api.anthropic.com/v1/
```

### Messages API
The primary endpoint for conversational interactions.

```http
POST /v1/messages
```

#### Request Structure
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "temperature": 1.0,
  "system": "You are a helpful AI assistant.",
  "messages": [
    {
      "role": "user",
      "content": "Explain quantum computing"
    }
  ]
}
```

#### Response Structure
```json
{
  "id": "msg_01ABC123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Quantum computing is..."
    }
  ],
  "model": "claude-sonnet-4-20250514",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 15,
    "output_tokens": 120
  }
}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | Model identifier |
| `messages` | array | Yes | Conversation history |
| `max_tokens` | integer | Yes | Maximum tokens to generate |
| `system` | string/array | No | System prompt |
| `temperature` | float | No | Randomness (0-1, default: 1) |
| `top_p` | float | No | Nucleus sampling (0-1) |
| `top_k` | integer | No | Top-k sampling |
| `stop_sequences` | array | No | Custom stop sequences |
| `stream` | boolean | No | Enable streaming |
| `tools` | array | No | Available tools/functions |
| `tool_choice` | object | No | Tool selection behavior |

---

## Advanced Features

### Extended Thinking Mode

Claude 4 models support extended thinking, allowing the model to show its reasoning process.

```json
{
  "model": "claude-opus-4-20250514",
  "max_tokens": 1000,
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  },
  "messages": [...]
}
```

### Interleaved Thinking (Beta)

Enable thinking between tool calls:

```http
anthropic-beta: interleaved-thinking-2025-05-14
```

---

## Tools & Function Calling

### Overview
Claude can interact with external tools and functions to extend its capabilities.

### Tool Types
1. **Client Tools**: Execute on your systems
2. **Server Tools**: Execute on Anthropic's servers

### Tool Definition
```json
{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get current weather for a location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City name"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "Temperature unit"
          }
        },
        "required": ["location"]
      }
    }
  ]
}
```

### Tool Use Workflow

1. **Define tools** in your request
2. **Claude decides** to use a tool
3. **Extract parameters** from Claude's response
4. **Execute tool** on your system
5. **Return results** to Claude
6. **Claude formulates** final response

### Example Implementation

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "calculator",
        "description": "Perform mathematical calculations",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "Mathematical expression to evaluate"
                }
            },
            "required": ["expression"]
        }
    }
]

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    tools=tools,
    messages=[
        {"role": "user", "content": "Calculate 15 * 24 + 37"}
    ]
)

# Check if Claude wants to use a tool
if message.stop_reason == "tool_use":
    tool_call = message.content[1]  # Assuming tool_use block is second
    
    if tool_call.name == "calculator":
        # Execute calculator function
        result = eval(tool_call.input["expression"])  # Simplified example
        
        # Send result back to Claude
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[
                {"role": "user", "content": "Calculate 15 * 24 + 37"},
                {"role": "assistant", "content": message.content},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "tool_result",
                            "tool_use_id": tool_call.id,
                            "content": str(result)
                        }
                    ]
                }
            ]
        )
```

### Parallel Tool Use
Claude can call multiple tools simultaneously:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll get both the weather and time for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_1",
      "name": "get_weather",
      "input": {"location": "New York"}
    },
    {
      "type": "tool_use",
      "id": "toolu_2", 
      "name": "get_time",
      "input": {"timezone": "America/New_York"}
    }
  ]
}
```

---

## Code Execution

### Overview
Claude can execute Python code in a secure, sandboxed environment for data analysis, calculations, and file processing.

### Enable Code Execution
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "tools": [
    {
      "type": "code_execution",
      "name": "code_execution"
    }
  ],
  "messages": [
    {
      "role": "user", 
      "content": "Analyze this dataset and create a visualization"
    }
  ]
}
```

### Features
- **Secure sandbox environment**
- **File upload/download support**
- **Chart and graph generation**
- **Data analysis libraries** (pandas, numpy, matplotlib, etc.)
- **50 free hours daily per organization**

### Pricing
- **50 free hours per day** per organization
- **$0.05 per hour** for additional usage

---

## Files API

### Overview
Upload files once and reference them across multiple conversations.

### Upload File
```http
POST /v1/files
```

```bash
curl https://api.anthropic.com/v1/files \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --form file=@document.pdf \
  --form purpose=user_upload
```

### List Files
```http
GET /v1/files
```

### Reference Files in Messages
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "document",
          "source": {
            "type": "file",
            "file_id": "file-abc123"
          }
        },
        {
          "type": "text",
          "text": "Summarize this document"
        }
      ]
    }
  ]
}
```

### File Limitations
- **Maximum file size**: 4.5 MB per document
- **Supported formats**: PDF, DOCX, TXT, and more
- **Maximum files per request**: 5 documents

---

## MCP (Model Context Protocol)

### Overview
MCP is an open standard for connecting Claude to external tools, databases, and services.

### Key Concepts
- **MCP Servers**: Expose tools and resources
- **MCP Clients**: AI applications (like Claude)
- **Standardized communication**: Universal protocol

### MCP Connector (Beta)
Connect Claude to remote MCP servers directly from the API:

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "mcp_servers": [
    {
      "url": "https://api.example.com/mcp",
      "auth": {
        "type": "bearer",
        "token": "your_token"
      }
    }
  ],
  "messages": [...]
}
```

### Popular MCP Servers
- **GitHub**: Repository management
- **PostgreSQL**: Database queries  
- **File System**: Local file operations
- **Web Automation**: Browser control
- **Notion**: Productivity integration
- **Zapier**: Cross-app workflows

---

## Prompt Caching

### Overview
Cache frequently used prompts to reduce latency by up to 85% and costs by up to 90%.

### Cache Types
1. **5-minute cache** (default)
2. **1-hour cache** (with beta header)

### Basic Caching
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "system": [
    {
      "type": "text",
      "text": "You are an expert data analyst..."
    },
    {
      "type": "text", 
      "text": "[Large dataset content]",
      "cache_control": {"type": "ephemeral"}
    }
  ],
  "messages": [...]
}
```

### Extended Caching (1 hour)
```http
anthropic-beta: extended-cache-ttl-2025-04-11
```

```json
{
  "cache_control": {
    "type": "ephemeral",
    "ttl": 3600
  }
}
```

### Cache Pricing
- **Writing to cache**: 1.25x standard rate (5-min) or 2x (1-hour)
- **Reading from cache**: 0.1x standard rate
- **Minimum cacheable tokens**: 1024 (Sonnet/Opus), 2048 (Haiku)

### Best Practices
- **Structure prompts** with static content first
- **Mark cache breakpoints** at logical boundaries
- **Maintain consistency** in cached content
- **Monitor cache hits** via usage metrics

---

## Batch Processing

### Overview
Process multiple requests asynchronously at 50% cost reduction.

### Create Batch
```http
POST /v1/messages/batches
```

```json
{
  "requests": [
    {
      "custom_id": "request-1",
      "params": {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 1000,
        "messages": [
          {"role": "user", "content": "Analyze this text..."}
        ]
      }
    },
    {
      "custom_id": "request-2", 
      "params": {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 1000,
        "messages": [
          {"role": "user", "content": "Summarize this document..."}
        ]
      }
    }
  ]
}
```

### Monitor Batch
```http
GET /v1/messages/batches/{batch_id}
```

### Retrieve Results
```http
GET /v1/messages/batches/{batch_id}/results
```

### Features
- **50% cost savings**
- **Supports all API features** (except streaming)
- **24-hour processing window**
- **Async processing**

---

## Streaming

### Overview
Receive responses as they're generated for real-time user experiences.

### Enable Streaming
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "stream": true,
  "messages": [...]
}
```

### Response Format
Server-Sent Events (SSE) with multiple event types:

```
event: message_start
data: {"type":"message_start","message":{"id":"msg_123",...}}

event: content_block_start  
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_stop
data: {"type":"message_stop"}
```

### Implementation Example
```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Write a story"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

---

## Vision Capabilities

### Overview
Claude can analyze and understand images, including photos, charts, graphs, and documents.

### Supported Formats
- **JPEG, PNG, GIF, WebP**
- **Maximum size**: 3.75 MB
- **Maximum dimensions**: 8,000 x 8,000 pixels
- **Up to 20 images** per request

### Image Analysis
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRgABAQAAAQ..."
          }
        },
        {
          "type": "text",
          "text": "What's in this image?"
        }
      ]
    }
  ]
}
```

### Use Cases
- **Document processing**
- **Chart and graph analysis**
- **Visual content description**
- **Text extraction from images**
- **Medical image analysis**
- **Educational content**

---

## Pricing

### API Pricing (Per Million Tokens)

| Model | Input Tokens | Output Tokens |
|-------|--------------|---------------|
| **Claude Opus 4** | $15 | $75 |
| **Claude Sonnet 4** | $3 | $15 |
| **Claude Sonnet 3.7** | $3 | $15 |
| **Claude Sonnet 3.5** | $3 | $15 |
| **Claude Haiku 3.5** | $0.80 | $4 |

### Additional Costs
- **Batch processing**: 50% discount on all tokens
- **Prompt caching**: Write 1.25x-2x, Read 0.1x
- **Code execution**: $0.05/hour after 50 free hours
- **Web search**: Per search performed

### Cost Optimization Tips
1. **Use appropriate model** for task complexity
2. **Implement prompt caching** for repeated content
3. **Use batch processing** for non-urgent tasks
4. **Optimize prompts** to reduce token usage

---

## SDKs & Integration

### Official SDKs

#### Python (3.7+)
```bash
pip install anthropic
```

```python
import anthropic

client = anthropic.Anthropic(api_key="your_key")
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Hello!"}]
)
```

#### TypeScript/JavaScript (4.5+)
```bash
npm install @anthropic-ai/sdk
```

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: 'your_key',
});

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

#### Java (8+)
```xml
<dependency>
  <groupId>com.anthropic</groupId>
  <artifactId>anthropic-java</artifactId>
  <version>1.0.0</version>
</dependency>
```

#### Go (Beta)
```bash
go get github.com/anthropic-ai/anthropic-go
```

### Third-Party Integrations
- **Amazon Bedrock**
- **Google Cloud Vertex AI**
- **Azure OpenAI Service** (via compatibility layer)

### OpenAI Compatibility
Claude offers OpenAI-compatible endpoints:

```bash
# Change base URL and API key only
curl https://api.anthropic.com/v1/openai/chat/completions \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{...}'
```

---

## Best Practices

### Prompt Engineering
1. **Be specific and clear** in instructions
2. **Use XML tags** for structure (`<context>`, `<task>`, `<example>`)
3. **Provide examples** of desired output
4. **Set clear expectations** for format and style
5. **Use system prompts** for consistent behavior

### Performance Optimization
1. **Choose the right model** for your use case
2. **Implement streaming** for better UX
3. **Use prompt caching** for repeated content
4. **Batch requests** when possible
5. **Monitor token usage** and costs

### Error Handling
1. **Implement retry logic** with exponential backoff
2. **Handle rate limits** gracefully (429 errors)
3. **Validate inputs** before sending requests
4. **Log request IDs** for debugging
5. **Set appropriate timeouts**

### Security
1. **Secure API keys** (environment variables)
2. **Implement proper authentication**
3. **Validate user inputs**
4. **Use HTTPS** for all requests
5. **Monitor for unusual usage patterns**

---

## Error Handling

### Common Error Codes

| Code | Error | Description |
|------|-------|-------------|
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Invalid API key |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Request validation failed |
| 429 | Rate Limited | Too many requests |
| 500 | Internal Server Error | Anthropic server error |
| 529 | Overloaded | Service temporarily unavailable |

### Error Response Format
```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Invalid model specified"
  }
}
```

### Retry Strategy
```python
import time
import random

def retry_with_backoff(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except anthropic.RateLimitError:
            if attempt == max_retries - 1:
                raise
            delay = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(delay)
```

---

## Rate Limits

### API Rate Limits
Rate limits vary by model and usage tier:

| Tier | RPM | TPM |
|------|-----|-----|
| Tier 1 | 50 | 40K |
| Tier 2 | 1000 | 400K |
| Tier 3 | 2000 | 800K |
| Tier 4 | 4000 | 1.6M |

### Handling Rate Limits
1. **Monitor usage** via response headers
2. **Implement exponential backoff**
3. **Use batch processing** for large volumes
4. **Cache responses** when appropriate
5. **Spread requests** across time

---

## Examples & Code Samples

### Basic Chat
```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": "Explain machine learning"}
    ]
)

print(response.content[0].text)
```

### Multi-turn Conversation
```python
messages = [
    {"role": "user", "content": "What's the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."},
    {"role": "user", "content": "What's its population?"}
]

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    messages=messages
)
```

### Image Analysis
```python
import base64

# Read and encode image
with open("image.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode()

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": image_data
                    }
                },
                {"type": "text", "text": "Describe this image"}
            ]
        }
    ]
)
```

### Tool Use Example
```python
def get_weather(location):
    # Simplified weather function
    return f"The weather in {location} is sunny, 22°C"

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string"}
            },
            "required": ["location"]
        }
    }
]

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in London?"}]
)

if message.stop_reason == "tool_use":
    tool_call = message.content[1]
    if tool_call.name == "get_weather":
        weather = get_weather(tool_call.input["location"])
        
        # Continue conversation with tool result
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[
                {"role": "user", "content": "What's the weather in London?"},
                {"role": "assistant", "content": message.content},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "tool_result",
                            "tool_use_id": tool_call.id,
                            "content": weather
                        }
                    ]
                }
            ]
        )
```

### Streaming with Async
```python
import asyncio
import anthropic

async def stream_response():
    client = anthropic.AsyncAnthropic()
    
    async with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": "Write a story"}]
    ) as stream:
        async for text in stream.text_stream:
            print(text, end="", flush=True)

asyncio.run(stream_response())
```

### Prompt Caching
```python
# First request - creates cache
response1 = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    system=[
        {
            "type": "text",
            "text": "You are an expert analyst."
        },
        {
            "type": "text",
            "text": "[Large document content]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": "Summarize the key points"}]
)

# Subsequent requests - uses cache
response2 = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    system=[
        {
            "type": "text",
            "text": "You are an expert analyst."
        },
        {
            "type": "text",
            "text": "[Same large document content]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": "What are the main conclusions?"}]
)
```

---

## Conclusion

The Claude API provides powerful capabilities for building AI applications with advanced reasoning, tool use, vision processing, and more. By following the patterns and best practices outlined in this guide, you can create efficient, cost-effective, and robust applications that leverage Claude's full potential.

For the most up-to-date information, always refer to the [official Anthropic documentation](https://docs.anthropic.com).

### Additional Resources
- [Anthropic Console](https://console.anthropic.com)
- [API Documentation](https://docs.anthropic.com)
- [Claude Cookbook](https://github.com/anthropics/anthropic-cookbook)
- [Community Examples](https://github.com/anthropics/anthropic-cookbook)
- [Support](https://support.anthropic.com)

*Last updated: July 2025*