# agentic-starter

**An agentic project factory — tell it what to build, and a team of specialized agents builds it.**

## How It Works

### 1. Start the Orchestrator
Open this repo in opencode and switch to the `orchestrator` agent (Tab key). The orchestrator will:
- Ask you discovery questions about your project
- Generate a project specification (`.opencode/spec.md`)
- Get your approval on the spec
- Dispatch specialized agents in parallel

### 2. The Provisioning Flow
```
Orchestrator (asks questions)
    ↓
Generate spec.md (you approve)
    ↓
Dispatch agents in parallel:
  ├── @architect → architecture.md
  ├── @frontend → UI/components/pages
  ├── @backend → API/server logic
  ├── @database → schema/migrations
  └── (installer checks for missing skills)
    ↓
After scaffold:
  ├── @devops → deployment/CI-CD
  ├── @reviewer → code review
  └── @tester → test infrastructure
    ↓
Completion confirmed
```

### 3. After Generation
```bash
# Install dependencies
npm install

# Run init to generate AGENTS.md for your new project
opencode init

# Start building
opencode
```

## Available Agents

| Agent | Role | Mode |
|-------|------|------|
| **orchestrator** | Main provisioning agent — runs the questionnaire and coordinates everything | Primary |
| **@architect** | Designs system architecture and technical decisions | Subagent |
| **@frontend** | Builds UI, pages, components, styling | Subagent |
| **@backend** | Implements API, server logic, auth | Subagent |
| **@database** | Designs schema, creates migrations, seed data | Subagent |
| **@devops** | Sets up deployment, CI/CD, infrastructure | Subagent |
| **@reviewer** | Reviews code for quality and security | Subagent (read-only) |
| **@tester** | Sets up and writes tests | Subagent |

## Directory Structure

```
agentic-starter/
├── .opencode/
│   ├── agents/           # Agent definitions
│   │   ├── orchestrator.md
│   │   ├── architect.md
│   │   ├── frontend.md
│   │   ├── backend.md
│   │   ├── database.md
│   │   ├── devops.md
│   │   ├── reviewer.md
│   │   ├── tester.md
│   │   └── learner.md
│   ├── spec.md           # Project specification (generated)
│   └── architecture.md   # Architecture design (generated)
├── templates/            # Starter templates
│   ├── nextjs-fullstack/
│   ├── nextjs-starter/
│   ├── nextjs-cms/
│   └── react-native/
├── AGENTS.md            # This file
└── README.md
```

## Managing Skills

This repo works with your globally installed skills (shadcn, tailwind, prismic, etc.). To install additional skills:

```bash
# Search for a skill
npx skills find [keyword]

# Install a skill
npx skills add <package>
```

The `@learner` agent can also help discover and install skills automatically.

## Quick Start

1. Fork/clone this repo to your machine
2. Open it in opencode: `opencode`
3. Switch to `@orchestrator` (Tab)
4. Answer the provisioning questions
5. Watch agents build your project in parallel

## Customizing Agents

Edit agent files in `.opencode/agents/` to customize behavior. Each agent reads:
- `.opencode/spec.md` — project requirements
- `.opencode/architecture.md` — technical decisions

## License

MIT
