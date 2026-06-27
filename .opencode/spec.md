# Project Specification

## Overview
- **Project:** [Project Name]
- **Type:** [Project Type]
- **Description:** [One-line description]

## Tech Stack
- **Frontend:** [Framework + version]
- **Backend:** [Framework + version]
- **Database:** [Database + ORM]
- **CMS:** [CMS or "none"]
- **Auth:** [Auth provider]
- **Styling:** [Styling approach]
- **State:** [State management]

## Deployment
- **Target:** [Platform]
- **CI/CD:** [yes/no]
- **Monitoring:** [tool or "none"]

## Architecture
[High-level architecture description]

## Pages/Routes
1. [route] - [purpose]
2. [route] - [purpose]

## Features
### Core Features
- [feature]
- [feature]

### Integrations
- [integration]

## Data Model
[Key entities and relationships]

## Installed Skills
- [skill 1]
- [skill 2]

## Agent Dispatch Plan
| Agent | When | Dependency |
|-------|------|------------|
| architect | First | spec.md |
| frontend | Parallel | architecture.md |
| backend | Parallel | architecture.md |
| database | Parallel | architecture.md |
| devops | After scaffold | all above |
| reviewer | After all | all code |
| tester | After scaffold | all code |
