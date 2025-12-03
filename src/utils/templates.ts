import { Template } from '../types';

export const TEMPLATES: Template[] = [
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Template for capturing meeting discussions and action items',
    icon: 'Users',
    content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Time:** 
**Attendees:** 

---

## Agenda

1. 
2. 
3. 

## Discussion Points

### Topic 1

- Key points discussed
- Decisions made

### Topic 2

- Key points discussed
- Decisions made

## Action Items

| Task | Owner | Due Date | Status |
|------|-------|----------|--------|
|      |       |          | ⏳     |
|      |       |          | ⏳     |

## Next Steps

- 

## Next Meeting

**Date:** 
**Topics to cover:**
- 
`,
  },
  {
    id: 'daily-log',
    name: 'Daily Log',
    description: 'Track your daily progress and reflections',
    icon: 'Calendar',
    content: `# Daily Log - ${new Date().toLocaleDateString()}

## 🎯 Today's Goals

- [ ] 
- [ ] 
- [ ] 

## ✅ Completed

- 

## 🔄 In Progress

- 

## 🚧 Blockers

- 

## 💡 Ideas & Notes

- 

## 📝 Reflections

### What went well?

### What could be improved?

### Key learnings

---

**Tomorrow's priorities:**
1. 
2. 
3. 
`,
  },
  {
    id: 'documentation',
    name: 'Documentation',
    description: 'Technical documentation template',
    icon: 'Book',
    content: `# Project Name

## Overview

Brief description of what this project/feature does.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Installation

\`\`\`bash
# Installation commands
npm install package-name
\`\`\`

## Usage

\`\`\`javascript
// Basic usage example
import { feature } from 'package-name';

feature.doSomething();
\`\`\`

## API Reference

### \`methodName(param)\`

Description of the method.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| param | string | Description |

**Returns:** \`ReturnType\` - Description

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | boolean | true | Description |

## Examples

### Example 1: Basic Usage

\`\`\`javascript
// Example code
\`\`\`

## Troubleshooting

### Common Issues

**Issue:** Description
**Solution:** Steps to resolve
`,
  },
  {
    id: 'study-notes',
    name: 'Study Notes',
    description: 'Structured notes for learning and studying',
    icon: 'GraduationCap',
    content: `# 📚 Study Notes: [Topic]

**Date:** ${new Date().toLocaleDateString()}
**Subject:** 
**Source:** 

---

## 🎯 Learning Objectives

By the end of this study session, I should be able to:
- [ ] 
- [ ] 
- [ ] 

## 📖 Key Concepts

### Concept 1

**Definition:**

**Key Points:**
- 

**Example:**

### Concept 2

**Definition:**

**Key Points:**
- 

**Example:**

## 🔗 Connections

How this relates to what I already know:
- 

## ❓ Questions

Things I need to clarify:
- 

## 📝 Summary

In my own words:

## 🧠 Review Questions

1. Q: 
   A: 

2. Q: 
   A: 

## 📚 Further Reading

- 

---

**Next review date:** 
`,
  },
];

