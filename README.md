FlexData
FlexData is a lightweight, modular TypeScript-based Web Component suite for managing JSON data in a master-detail interface. It includes a sortable, paginated, and filterable data grid (<csv-grid>), a detail view for selected rows (<detail-view>), and a control panel for actions like exporting and column toggling (<control-panel>). Built with esbuild for bundling and served via PHP's built-in server, it uses Shadow DOM for style encapsulation and a centralized StateManager for reactive state updates. The components feature a modern, customizable design with a default Helvetica-based theme, fully configurable via CSS custom properties for flexible styling.
Prerequisites

Node.js (for esbuild and TypeScript)
PHP (for php -S)
npm (for installing dependencies)

Setup

Install dependencies:
npm install


Build the TypeScript code:
npm run build

This compiles src/components/*.ts and src/state-manager.ts to public/assets/js/.

Start the PHP server:
npm run serve

This runs php -S localhost:8000 -t public, serving files from the public/ directory.

Development mode (optional):
npm run watch

This rebuilds the JavaScript on file changes.

Open the project:Visit http://localhost:8000 to see the FlexData components.


Project Structure

src/components/csv-grid.ts: Sortable, paginated, filterable grid component.
src/components/detail-view.ts: Detail view for selected row data.
src/components/control-panel.ts: Controls for export, reset, and column toggling.
src/state-manager.ts: Centralized state manager for reactive updates.
public/assets/js/*.js: Compiled, minified JavaScript (production-ready).
public/index.html: Test HTML page with customizable styling.
public/api/data.php: PHP script to serve JSON data (50 records).
public/data.csv: Sample CSV file (optional fallback).
build.js: esbuild script to compile and bundle TypeScript.
tsconfig.json: TypeScript configuration.
package.json: Node.js configuration with scripts.
.gitignore: Ignores build artifacts, node modules, and temporary files.

Deployment to Production

Run npm run build to generate public/assets/js/*.js.
Copy the public/ directory (or specific files: assets/js/*.js, api/data.php, index.html) to the production server’s web root (e.g., /var/www/html/ for Apache/Nginx or static/ for Django).
Include in your production HTML:<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page</title>
  <style>
    :root {
      /* Customize as needed */
      --font-family: 'Helvetica', 'Arial', sans-serif;
      --bg-body: #f0f4f8;
      --bg-primary: #ffffff;
      --bg-row-even: #e6f0fa;
      --bg-header: #d9e6f2;
      --bg-header-hover: #c8d7e8;
      --bg-cell-bubble: #f0f4f8;
      --bg-selected: #a3be8c;
      --text-primary: #2e3440;
      --text-secondary: #5e81ac;
      --text-button: #81a1c1;
      --text-disabled: #a3be8c;
      --text-error: #d32f2f;
      --border-color: #d8dee9;
      --shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      --border-radius: 8px;
      --padding: 16px;
      --padding-mobile: 8px;
      --font-size-header: 28px;
      --font-size-header-mobile: 24px;
      --font-size-cell: 14px;
      --font-size-cell-mobile: 13px;
    }
    body {
      font-family: var(--font-family);
      background: var(--bg-body);
      color: var(--text-primary);
      margin: 0;
      padding: 32px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    h1 {
      font-size: var(--font-size-header);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 24px;
      text-align: center;
      background: var(--bg-primary);
      padding: 16px 24px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border-color);
      max-width: 1200px;
      width: 100%;
    }
    csv-grid, control-panel, detail-view {
      max-width: 1200px;
      width: 100%;
      background: var(--bg-primary);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      padding: var(--padding);
    }
    @media (max-width: 768px) {
      body { padding: var(--padding-mobile); }
      h1 { font-size: var(--font-size-header-mobile); padding: var(--padding-mobile); }
      csv-grid, control-panel, detail-view { padding: var(--padding-mobile); }
    }
  </style>
</head>
<body>
  <h1>Your Data Suite</h1>
  <control-panel></control-panel>
  <csv-grid data-src="/api/data.php" rows-per-page="10"></csv-grid>
  <detail-view></detail-view>
  <script src="/assets/js/csv-grid.js"></script>
  <script src="/assets/js/detail-view.js"></script>
  <script src="/assets/js/control-panel.js"></script>
  <script src="/assets/js/state-manager.js"></script>
</body>
</html>


Ensure the server supports PHP (for data.php) and serves static files with correct MIME types (e.g., text/javascript for .js).

Usage
The FlexData suite provides a master-detail interface for JSON data:

<csv-grid data-src="/api/data.php" rows-per-page="10">: Displays a sortable, paginated, filterable grid. Click rows to select and view details.
<detail-view>: Shows selected row data in a card format.
<control-panel>: Offers buttons to export data as CSV, reset search, and toggle column visibility.
Features:
Sorting: Click or press Enter/Space on column headers to sort (numeric or alphabetic).
Pagination: Navigate with Previous/Next or select rows per page (5, 10, 20, 50).
Filtering: Search via an input field (case-insensitive, any column).
Column Toggling: Show/hide columns via checkboxes.
Export: Download filtered data as CSV.
Styling: Fully customizable via CSS variables (default: Helvetica, light theme). Override in :root or :host.
Accessibility: ARIA attributes (role="grid", aria-sort).


State Management: Centralized StateManager ensures reactive updates across components.

Customization
Override CSS variables in your HTML or CSS to customize the appearance:
:root {
  --bg-body: #f8f9fa;
  --bg-primary: #ffffff;
  --bg-row-even: #e9ecef;
  --font-family: 'Roboto', sans-serif;
  --text-button: #007bff;
  /* Add more as needed */
}

Expanding the Component Library

Add new components to src/components/ (e.g., src/components/chart-view.ts).
Update build.js to include new entry points:entryPoints: [
  { in: 'src/components/csv-grid.ts', out: 'csv-grid' },
  { in: 'src/components/detail-view.ts', out: 'detail-view' },
  { in: 'src/components/control-panel.ts', out: 'control-panel' },
  { in: 'src/state-manager.ts', out: 'state-manager' },
  { in: 'src/components/chart-view.ts', out: 'chart-view' }
]


For app-specific code, create src/app/app.ts and add to entryPoints.

Notes

The data source (api/data.php) returns JSON. For CSV fallback, consider Papa Parse:<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>


Components use Shadow DOM for style encapsulation; page styling is in index.html.
The public/ directory is self-contained for production.
The project is lightweight, using only TypeScript, esbuild, and native Web Components APIs.
