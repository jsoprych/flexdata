import { DataController } from '../data-controller.js';

class FDGrid extends HTMLElement {
    private shadow: ShadowRoot;
    private dataController: DataController;
    private currentPage: number = 1;
    private rowsPerPage: number = 10;
    private showJson: boolean = false;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.dataController = DataController.getInstance();
        this.render();
    }

    static get observedAttributes() {
        return ['data-src', 'rows-per-page'];
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name === 'data-src' && newValue && oldValue !== newValue) {
            this.dataController.loadData(newValue);
        }
        if (name === 'rows-per-page') {
            this.rowsPerPage = parseInt(newValue || '10', 10) || 10;
            this.currentPage = 1;
            this.render();
        }
    }

    connectedCallback() {
        this.dataController.on('data-updated', () => this.render());
        this.dataController.on('error', (error) => this.handleError(error));
        const dataSrc = this.getAttribute('data-src');
        if (dataSrc) {
            this.dataController.loadData(dataSrc);
        }
    }

    disconnectedCallback() {
        this.dataController.off('data-updated', () => this.render());
        this.dataController.off('error', (error) => this.handleError(error));
    }

    private handleError(error: { message: string }) {
        this.shadow.innerHTML = `
            <style>
                .error { color: var(--text-error, #d32f2f); font-family: var(--font-family, 'Helvetica', 'Arial', sans-serif); }
            </style>
            <div class="error">${error.message}</div>
        `;
    }

    private render() {
        const headers = this.dataController.getFilteredData().length > 0 ? Object.keys(this.dataController.getFilteredData()[0]) : [];
        const start = (this.currentPage - 1) * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        const paginatedData = this.dataController.getFilteredData().slice(start, end);
        const totalPages = Math.ceil(this.dataController.getFilteredData().length / this.rowsPerPage);

        this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: var(--font-family, 'Helvetica', 'Arial', sans-serif);
                }
                .grid-container {
                    background: var(--bg-primary, #ffffff);
                    border-radius: var(--border-radius, 8px);
                    box-shadow: var(--shadow, 0 2px 4px rgba(0, 0, 0, 0.05));
                    padding: var(--padding, 16px);
                }
                .controls {
                    margin-bottom: 16px;
                    display: flex;
                    gap: 16px;
                    align-items: center;
                }
                input[type="text"] {
                    padding: 8px;
                    border: 1px solid var(--border-color, #d8dee9);
                    border-radius: var(--border-radius, 8px);
                    font-size: var(--font-size-cell, 14px);
                }
                select {
                    padding: 8px;
                    border: 1px solid var(--border-color, #d8dee9);
                    border-radius: var(--border-radius, 8px);
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: var(--bg-primary, #ffffff);
                }
                th {
                    background: var(--bg-header, #d9e6f2);
                    padding: 12px;
                    font-weight: 600;
                    text-align: left;
                    cursor: pointer;
                    user-select: none;
                    border-bottom: 1px solid var(--border-color, #d8dee9);
                }
                th:hover {
                    background: var(--bg-header-hover, #c8d7e8);
                }
                td {
                    padding: 12px;
                    border-bottom: 1px solid var(--border-color, #d8dee9);
                    font-size: var(--font-size-cell, 14px);
                }
                tr:nth-child(even) {
                    background: var(--bg-row-even, #e6f0fa);
                }
                tr:hover {
                    background: var(--bg-cell-bubble, #f0f4f8);
                    cursor: pointer;
                }
                .pagination {
                    margin-top: 16px;
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                    align-items: center;
                }
                button {
                    padding: 8px 16px;
                    border: 1px solid var(--border-color, #d8dee9);
                    border-radius: var(--border-radius, 8px);
                    background: var(--bg-primary, #ffffff);
                    color: var(--text-button, #81a1c1);
                    cursor: pointer;
                }
                button:hover {
                    background: var(--bg-header-hover, #c8d7e8);
                }
                button:disabled {
                    color: var(--text-disabled, #a3be8c);
                    cursor: not-allowed;
                }
                .json-view {
                    margin-top: 16px;
                    padding: 8px;
                    background: var(--bg-row-even, #e6f0fa);
                    border: 1px solid var(--border-color, #d8dee9);
                    border-radius: var(--border-radius, 8px);
                    max-height: 300px;
                    overflow: auto;
                    font-family: monospace;
                    font-size: var(--font-size-cell, 14px);
                }
                @media (max-width: 768px) {
                    .grid-container {
                        padding: var(--padding-mobile, 8px);
                    }
                    th, td {
                        padding: 8px;
                        font-size: var(--font-size-cell-mobile, 13px);
                    }
                    .controls {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .json-view {
                        font-size: var(--font-size-cell-mobile, 13px);
                    }
                }
            </style>
            <div class="grid-container" role="grid">
                <div class="controls">
                    <input type="text" placeholder="Filter..." aria-label="Filter grid data">
                    <select aria-label="Rows per page">
                        <option value="5" ${this.rowsPerPage === 5 ? 'selected' : ''}>5</option>
                        <option value="10" ${this.rowsPerPage === 10 ? 'selected' : ''}>10</option>
                        <option value="20" ${this.rowsPerPage === 20 ? 'selected' : ''}>20</option>
                        <option value="50" ${this.rowsPerPage === 50 ? 'selected' : ''}>50</option>
                    </select>
                    <button class="toggle-json">Toggle JSON</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            ${headers.map(header => `
                                <th aria-sort="${this.dataController.getSortColumn() === header ? this.dataController.getSortDirection() : 'none'}">
                                    ${header.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    ${this.dataController.getSortColumn() === header ? (this.dataController.getSortDirection() === 'asc' ? '↑' : '↓') : ''}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedData.map(row => `
                            <tr class="selectable">
                                ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="pagination">
                    <button ${this.currentPage === 1 ? 'disabled' : ''}>Previous</button>
                    <span>Page ${this.currentPage} of ${totalPages}</span>
                    <button ${this.currentPage === totalPages ? 'disabled' : ''}>Next</button>
                </div>
                ${this.showJson && this.dataController.getFilteredData().length > 0 ? `
                    <pre class="json-view">${JSON.stringify(this.dataController.getFilteredData(), null, 2)}</pre>
                ` : ''}
            </div>
        `;

        this.shadow.querySelector('input')?.addEventListener('input', (e) => {
            const filter = (e.target as HTMLInputElement).value;
            this.dataController.setFilter(filter);
            this.currentPage = 1;
        });

        this.shadow.querySelector('select')?.addEventListener('change', (e) => {
            this.rowsPerPage = parseInt((e.target as HTMLSelectElement).value, 10);
            this.currentPage = 1;
            this.render();
        });

        this.shadow.querySelectorAll('th').forEach((th, index) => {
            th.addEventListener('click', () => {
                const header = headers[index];
                const currentSortColumn = this.dataController.getSortColumn();
                const currentSortDirection = this.dataController.getSortDirection();
                const newDirection = currentSortColumn === header && currentSortDirection === 'asc' ? 'desc' : 'asc';
                this.dataController.setSort(header, newDirection);
            });
        });

        this.shadow.querySelectorAll('.pagination button').forEach(button => {
            button.addEventListener('click', () => {
                if (button.textContent === 'Previous' && this.currentPage > 1) {
                    this.currentPage--;
                } else if (button.textContent === 'Next' && this.currentPage < totalPages) {
                    this.currentPage++;
                }
                this.render();
            });
        });

        this.shadow.querySelectorAll('tr.selectable').forEach(row => {
            row.addEventListener('click', () => {
                const rowIndex = Array.from(this.shadow.querySelectorAll('tr.selectable')).indexOf(row);
                const rowData = paginatedData[rowIndex];
                this.dataController.setSelectedRow(rowData);
            });
        });

        this.shadow.querySelector('.toggle-json')?.addEventListener('click', () => {
            this.showJson = !this.showJson;
            this.render();
        });
    }
}

customElements.define('fd-grid', FDGrid);