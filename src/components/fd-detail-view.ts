import { DataController } from '../data-controller.js';

class FDDetailView extends HTMLElement {
    private shadow: ShadowRoot;
    private dataController: DataController;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.dataController = DataController.getInstance();
        this.render();
    }

    connectedCallback() {
        this.dataController.on('row-selected', (rowData) => this.render(rowData));
    }

    disconnectedCallback() {
        this.dataController.off('row-selected', (rowData) => this.render(rowData));
    }

    private render(data: Record<string, string> | null = null) {
        const personalFields = ['first_name', 'last_name', 'customer_type'];
        const accountFields = ['customer_id', 'customer_code', 'company_name', 'tax_id', 'status', 'notes'];
        const metaFields = ['created_at', 'updated_at'];

        this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 1200px;
                    width: 100%;
                    background: var(--bg-primary, #ffffff);
                    border-radius: var(--border-radius, 8px);
                    box-shadow: var(--shadow, 0 2px 4px rgba(0, 0, 0, 0.05));
                    padding: var(--padding, 16px);
                    margin-top: 16px;
                    font-family: var(--font-family, 'Helvetica', 'Arial', sans-serif);
                    color: var(--text-primary, #2e3440);
                }
                h2 {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    color: var(--text-primary, #2e3440);
                }
                details {
                    margin-bottom: 8px;
                }
                summary {
                    cursor: pointer;
                    font-weight: 600;
                    color: var(--text-secondary, #5e81ac);
                    padding: 8px;
                    background: var(--bg-header, #d9e6f2);
                    border-radius: var(--border-radius, 8px);
                }
                summary:hover {
                    background: var(--bg-header-hover, #c8d7e8);
                }
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                li {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px;
                    border-bottom: 1px solid var(--border-color, #d8dee9);
                }
                .detail-label {
                    font-weight: 600;
                    color: var(--text-secondary, #5e81ac);
                    flex: 1;
                    min-width: 150px;
                }
                .detail-value {
                    flex: 2;
                    text-align: right;
                }
                .no-selection {
                    color: var(--text-secondary, #5e81ac);
                    font-style: italic;
                    text-align: center;
                }
                .save-button {
                    margin-top: 16px;
                    padding: 8px 16px;
                    border: 1px solid var(--border-color, #d8dee9);
                    border-radius: var(--border-radius, 8px);
                    background: var(--bg-primary, #ffffff);
                    color: var(--text-button, #81a1c1);
                    cursor: pointer;
                }
                .save-button:hover {
                    background: var(--bg-header-hover, #c8d7e8);
                }
                @media (max-width: 768px) {
                    :host {
                        padding: var(--padding-mobile, 8px);
                    }
                    h2 {
                        font-size: 18px;
                    }
                    li {
                        flex-direction: column;
                        gap: 4px;
                    }
                    .detail-label, .detail-value {
                        text-align: left;
                        flex: none;
                    }
                }
            </style>
            <h2>Customer Details</h2>
            ${data ? `
                <details open>
                    <summary>Personal Info</summary>
                    <ul role="list">
                        ${personalFields.map(key => data[key] !== undefined ? `
                            <li>
                                <span class="detail-label">${key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</span>
                                <span class="detail-value">${data[key] || 'N/A'}</span>
                            </li>
                        ` : '').join('')}
                    </ul>
                </details>
                <details open>
                    <summary>Account Info</summary>
                    <ul role="list">
                        ${accountFields.map(key => data[key] !== undefined ? `
                            <li>
                                <span class="detail-label">${key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</span>
                                <span class="detail-value">${data[key] || 'N/A'}</span>
                            </li>
                        ` : '').join('')}
                    </ul>
                </details>
                <details>
                    <summary>Metadata</summary>
                    <ul role="list">
                        ${metaFields.map(key => data[key] !== undefined ? `
                            <li>
                                <span class="detail-label">${key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</span>
                                <span class="detail-value">${data[key] || 'N/A'}</span>
                            </li>
                        ` : '').join('')}
                    </ul>
                </details>
                <button class="save-button" disabled>Save Changes</button>
            ` : '<p class="no-selection">Select a row to view details</p>'}
        `;
    }
}

customElements.define('fd-detail-view', FDDetailView);