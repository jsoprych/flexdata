FlexData
FlexData is a lightweight, modular TypeScript-based Web Component library for displaying JSON data in a sortable, paginated, and filterable grid (<fd-grid>) with a detail view (<fd-detail-view>). Built with esbuild for bundling and served via PHP's built-in server, it uses Shadow DOM for style encapsulation and a modern, customizable design with a default Helvetica-based theme, fully configurable via CSS custom properties.
Prerequisites

Node.js (for esbuild and TypeScript)
PHP (with pdo_sqlite extension for database support)
npm (for installing dependencies)
SQLite3 (for customer.db)

Setup

Install dependencies:
npm install


Build the TypeScript code:
npm run build

This compiles src/components/fd-grid.ts and src/components/fd-detail-view.ts to public/assets/js/fd-grid.js and public/assets/js/fd-detail-view.js.

Start the PHP server:
npm run serve

This runs php -S localhost:8000 -t public, serving files from the public/ directory.

Development mode (optional):
npm run watch

This rebuilds the JavaScript on file changes.

Open the project:Visit http://localhost:8000 to see the FlexData grid and detail view.


Project Structure

src/components/fd-grid.ts: Sortable, paginated, filterable grid component for JSON data.
src/components/fd-detail-view.ts: Detail view component for selected row data.
public/assets/js/fd-grid.js: Compiled, minified JavaScript for grid.
public/assets/js/fd-detail-view.js: Compiled, minified JavaScript for detail view.
public/index.html: Test HTML page with customizable styling.
public/api/data.php: PHP script to serve JSON data from public/data/customer.db (SQLite) or public/data/data.csv (CSV).
public/data/customer.db: SQLite database with customer data.
public/data/data.csv: Fallback CSV file with sample records (any columns, e.g., ID, Product, Price, Category).
build.js: esbuild script to compile and bundle TypeScript.
tsconfig.json: TypeScript configuration.
package.json: Node.js configuration with scripts.
.gitignore: Ignores build artifacts, node modules, and temporary files.

Deployment to Production

Run npm run build to generate public/assets/js/fd-grid.js and public/assets/js/fd-detail-view.js.
Copy the public/ directory (or specific files: assets/js/fd-grid.js, assets/js/fd-detail-view.js, api/data.php, data/customer.db, data/data.csv, index.html) to the production server’s web root (e.g., /var/www/html/ for Apache/Nginx).
Include in your production HTML:<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page</title>
  <style>
    :root {
      --font-family: 'Helvetica', 'Arial', sans-serif;
      --bg-body: #f0f4f8;
      --bg-primary: #ffffff;
      --bg-row-even: #e6f0fa;
      --bg-header: #d9e6f2;
      --bg-header-hover: #c8d7e8;
      --bg-cell-bubble: #f0f4f8;
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
    @media (max-width: 768px) {
      body { padding: var(--padding-mobile); }
      h1 { font-size: var(--font-size-header-mobile); padding: var(--padding-mobile); }
    }
  </style>
</head>
<body>
  <h1>Your Data Grid</h1>
  <fd-grid data-src="/api/data.php" rows-per-page="10"></fd-grid>
  <fd-detail-view></fd-detail-view>
  <script src="/assets/js/fd-grid.js"></script>
  <script src="/assets/js/fd-detail-view.js"></script>
</body>
</html>


Ensure the server supports PHP with pdo_sqlite extension and serves static files with correct MIME types (e.g., text/javascript for .js).

Usage
The FlexData components display JSON data in a sortable, paginated, and filterable interface, with a detail view for selected rows:

<fd-grid data-src="/api/data.php" rows-per-page="10">: Displays a grid with JSON records from public/data/customer.db (SQLite, default) or public/data/data.csv (CSV, with ?source=csv).
<fd-detail-view>: Displays details of a selected row from <fd-grid> in a list format, with collapsible sections for grouped fields (Personal Info, Account Info, Metadata).
Data Source Switching:
SQLite (default): /api/data.php or /api/data.php?source=sqlite.
CSV: /api/data.php?source=csv.


Features:
Sorting: Click or press Enter/Space on column headers to sort (numeric or alphabetic).
Pagination: Navigate with Previous/Next or select rows per page (5, 10, 20, 50).
Filtering: Search via an input field (case-insensitive, any column).
Row Selection: Click a row to display its details in <fd-detail-view>.
Interactivity: <fd-detail-view> includes collapsible sections (e.g., Personal Info, Account Info) and a placeholder Save button for future editing.
Styling: Customizable via CSS variables (default: Helvetica, light theme). Override in :root or :host.
Accessibility: ARIA attributes (role="grid", aria-sort for <fd-grid>, role="list" for <fd-detail-view>).



Customization
Override CSS variables in your HTML or CSS:
:root {
  --bg-body: #f8f9fa;
  --bg-primary: #ffffff;
  --bg-row-even: #e9ecef;
  --font-family: 'Roboto', sans-serif;
  --text-button: #007bff;
}

Troubleshooting

500 Internal Server Error on /api/data.php:
SQLite:
Ensure public/data/customer.db exists in /home/john/CODE/HTML-COMPONENTS/PROJECTS/flexdata/public/data/.
Check file permissions: chmod 644 public/data/customer.db.
Verify PHP has pdo_sqlite extension (php -m | grep pdo_sqlite).
Install pdo_sqlite if missing: sudo apt-get install php-sqlite3 (Ubuntu/Debian) or sudo yum install php-sqlite3 (CentOS/RHEL).
Check PHP error logs (e.g., /var/log/php_errors.log).
Verify database integrity: sqlite3 public/data/customer.db "SELECT * FROM customers;".
Ensure correct path in data.php: $dbFile = __DIR__ . '/../data/customer.db' (since data.php is in public/api/).


CSV:
Ensure public/data/data.csv exists.
Check file permissions: chmod 644 public/data/data.csv.
Ensure CSV has valid headers (non-empty, unique) and proper format.
Ensure correct path in data.php: $csvFile = __DIR__ . '/../data/data.csv'.


Verify PHP is installed (php -v).


Detail View Not Updating:
Ensure <fd-detail-view> is included in index.html and src/components/fd-detail-view.ts is compiled.
Check console for errors in fd-grid.js or fd-detail-view.js.
Verify row-selected event is firing (e.g., add console.log in <fd-detail-view>’s handleRowSelected).



Notes

The data source (api/data.php) queries public/data/customer.db (SQLite, default) or public/data/data.csv (CSV, with ?source=csv) and serves JSON data.
Components use Shadow DOM for style encapsulation; page styling is in index.html.
The public/ directory and public/data/ are self-contained for production.
The project is lightweight, using only TypeScript, esbuild, PHP, and native Web Components APIs.
