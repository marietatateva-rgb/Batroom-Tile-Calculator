# Invoices-App Monorepo

A monorepo containing the Invoices-App project with multiple sub-components.

## Structure

```
invoices-app-monorepo/
├── invoice-repo/              # Library: Invoice data types and management logic
├── invoice-console-app/       # Console app: Simple CLI for creating/editing invoices
├── invoice-web-app/           # Web app: UI for managing invoices
├── package.json               # Monorepo configuration
└── README.md                  # This file
```

## Sub-Components

### invoice-repo
A library package that holds:
- Invoice data types and models
- Logic to manage invoices (CRUD operations)
- Shared utilities for invoice processing

### invoice-console-app
A console application that demonstrates:
- How to create invoices
- How to edit invoices
- Basic CLI interactions

### invoice-web-app
A web-based application that provides:
- User interface for managing invoices
- Browser-based invoice management

## Getting Started

Each sub-project will be implemented with its own package.json and dependencies.

To install all dependencies:
```bash
npm install
```

To run the console app:
```bash
npm start
```

## Development

Each sub-component is independent but can use the shared `invoice-repo` library package.
