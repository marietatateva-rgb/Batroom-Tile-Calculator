# Invoice Web App

A modern web application for managing invoices, built with Vite and TypeScript.

## Features

- **View Invoices**: Display all invoices in a card-based layout with key information
- **Manage Recipients**: View and manage invoice recipients (companies and individuals)
- **Settings**: Configure invoice issuer and default VAT rates
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Data**: Integrates with invoice-repo for data management

## Project Structure

```
invoice-web-app/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.ts               # Main application logic
│   ├── components/          # Reusable UI components (future)
│   ├── utils/               # Utility functions (future)
│   └── styles/
│       └── main.css         # Global styles
├── index.html               # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm 7+

### Installation

```bash
# Install dependencies (already done)
npm install

# From the root invoices-app directory, you can run:
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

This will start Vite at `http://localhost:5173/` with hot module replacement enabled.

### Build

Create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

### Type Checking

Run TypeScript type checking:

```bash
npm run type-check
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Technologies

- **Vite 7.2.7**: Modern frontend build tool
- **TypeScript 5.3.3**: Static type checking
- **CSS3**: Responsive styling with CSS custom properties
- **HTML5**: Semantic markup
- **invoice-repo**: Data management library

## Architecture

### App State

The application maintains an InvoiceRepo instance loaded with sample data:

```typescript
const repo = generateSampleData()
```

### Views

The application has three main views accessed via navigation:

1. **Invoices View**: Displays all invoices in a grid layout
2. **Recipients View**: Displays all invoice recipients
3. **Settings View**: Shows issuer company and VAT configuration

### Navigation

Navigation between views is handled by the nav buttons in the header. Clicking a button switches the active view without page reload.

## Styling Approach

The application uses:

- **CSS Custom Properties** for consistent theming and easy customization
- **BEM (Block Element Modifier)** naming convention for CSS classes
- **Responsive Design** with mobile-first approach
- **Flexbox and Grid** for layout

## Color Scheme

- **Primary**: Blue (#2563eb) - Main actions and interactive elements
- **Secondary**: Indigo (#6366f1) - Secondary actions and badges
- **Danger**: Red (#ef4444) - Destructive actions
- **Success**: Green (#22c55e) - Positive feedback
- **Warning**: Amber (#f59e0b) - Warnings

## Browser Support

- Modern browsers with ES2020 support:
  - Chrome 80+
  - Firefox 78+
  - Safari 13.1+
  - Edge 80+

## Future Development

Phase 2-4 implementation will include:

- Detailed invoice view component with line items
- Create/edit invoice modal form
- Create/edit recipient form
- Advanced filtering and search
- Automated tests with Vitest
- Production deployment configuration

## Dependencies

### Production

- `invoice-repo`: Invoice data management library

### Development

- `vite`: Build tool and dev server
- `typescript`: Static type checking

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run type-check`: Run TypeScript type checking

## License

ISC
