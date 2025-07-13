class CSVGrid extends HTMLElement {
  private data: any[] = [];
  private filteredData: any[] = [];
  private headers: string[] = [];
  private sortDirection: number = 1;
  private sortColumn: number = -1;
  private currentPage: number = 1;
  private rowsPerPage: number = 10;
  private searchQuery: string = '';

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Helvetica', 'Arial', sans-serif;
          color: #2e3440;
        }
        .grid-container {
          background: #ffffff;
          border: 1px solid #d8dee9;
          border-radius: 8px;
          max-width: 100%;
          overflow-x: auto;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
        }
        th {
          background: #d9e6f2;
          padding: 12px;
          cursor: pointer;
          user-select: none;
          text-align: left;
          font-size: 16px;
          font-weight: 600;
          color: #2e3440;
          border-bottom: 2px solid #d8dee9;
          transition: background 0.2s ease;
        }
        th:hover {
          background: #c8d7e8;
        }
        td {
          padding: 12px;
          font-size: 14px;
          border-bottom: 1px solid #d8dee9;
        }
        td.message-bubble {
          background: #f0f4f8;
          border-radius: 6px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        tr:nth-child(even) {
          background: #e6f0fa;
        }
        th.sort-indicator::after {
          content: ' ↕';
          font-size: 12px;
        }
        th.sort-ascending::after {
          content: ' ↑';
          font-size: 12px;
        }
        th.sort-descending::after {
          content: ' ↓';
          font-size: 12px;
        }
        .loading {
          padding: 12px;
          color: #5e81ac;
          font-size: 14px;
          text-align: center;
        }
        .error {
          padding: 12px;
          color: #d32f2f;
          font-size: 14px;
          text-align: center;
        }
        .pagination {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          padding: 0 12px;
        }
        .pagination button {
          padding: 8px 16px;
          cursor: pointer;
          border: 1px solid #d8dee9;
          background: #ffffff;
          border-radius: 6px;
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 14px;
          color: #81a1c1;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .pagination button:hover:not(:disabled) {
          background: #e6f0fa;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .pagination button:disabled {
          cursor: not-allowed;
          color: #a3be8c;
          background: #f0f4f8;
        }
        .pagination select {
          padding: 8px;
          border: 1px solid #d8dee9;
          border-radius: 6px;
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 14px;
          color: #2e3440;
          background: #ffffff;
        }
        .pagination select:focus {
          outline: none;
          border-color: #81a1c1;
          box-shadow: 0 0 0 2px rgba(129, 161, 193, 0.2);
        }
        .pagination span {
          font-size: 14px;
          color: #2e3440;
        }
        .search-container {
          margin-bottom: 16px;
          padding: 0 12px;
        }
        .search-container input {
          padding: 8px 12px;
          width: 100%;
          max-width: 300px;
          border: 1px solid #d8dee9;
          border-radius: 6px;
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 14px;
          color: #2e3440;
          background: #ffffff;
        }
        .search-container input:focus {
          outline: none;
          border-color: #81a1c1;
          box-shadow: 0 0 0 2px rgba(129, 161, 193, 0.2);
        }
      </style>
      <div class="search-container">
        <input type="text" placeholder="Search..." class="search-input">
      </div>
      <div class="grid-container">
        <table role="grid">
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="pagination">
        <button class="prev" disabled>Previous</button>
        <span class="page-info">Page 1 of 1</span>
        <button class="next">Next</button>
        <select class="rows-per-page">
          <option value="5">5 rows</option>
          <option value="10" selected>10 rows</option>
          <option value="20">20 rows</option>
          <option value="50">50 rows</option>
        </select>
      </div>
    `;
  }

  static get observedAttributes(): string[] {
    return ['data-src', 'rows-per-page'];
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === 'data-src' && newValue) {
      void this.loadData(newValue);
    } else if (name === 'rows-per-page' && newValue) {
      const rows = parseInt(newValue, 10);
      if (!isNaN(rows) && rows > 0) {
        this.rowsPerPage = rows;
        this.currentPage = 1;
        this.renderTable();
        this.updatePaginationControls();
      }
    }
  }

  connectedCallback(): void {
    const src = this.getAttribute('data-src');
    const rowsPerPage = this.getAttribute('rows-per-page');
    if (rowsPerPage) {
      const rows = parseInt(rowsPerPage, 10);
      if (!isNaN(rows) && rows > 0) {
        this.rowsPerPage = rows;
      }
    }
    if (src) {
      void this.loadData(src);
    }
    const shadow = this.shadowRoot;
    if (shadow) {
      shadow.querySelector('.prev')?.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderTable();
          this.updatePaginationControls();
        }
      });
      shadow.querySelector('.next')?.addEventListener('click', () => {
        const totalPages = Math.ceil(this.filteredData.length / this.rowsPerPage);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.renderTable();
          this.updatePaginationControls();
        }
      });
      shadow.querySelector('.rows-per-page')?.addEventListener('change', (e: Event) => {
        const select = e.target as HTMLSelectElement;
        this.rowsPerPage = parseInt(select.value, 10);
        this.currentPage = 1;
        this.renderTable();
        this.updatePaginationControls();
      });
      shadow.querySelector('.search-input')?.addEventListener('input', (e: Event) => {
        this.searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
        this.applyFilter();
        this.currentPage = 1;
        this.renderTable();
        this.updatePaginationControls();
      });
      shadow.addEventListener('click', (e: Event) => {
        const th = (e.target as HTMLElement).closest('th');
        if (th) {
          const index = Array.from(shadow.querySelectorAll('th') || []).indexOf(th);
          this.sortTable(index);
        }
      });
      shadow.addEventListener('keydown', (e: KeyboardEvent) => {
        const th = (e.target as HTMLElement).closest('th');
        if (th && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          const index = Array.from(shadow.querySelectorAll('th') || []).indexOf(th);
          this.sortTable(index);
        }
      });
    }
  }

  private async loadData(url: string): Promise<void> {
    try {
      const tbody = this.shadowRoot?.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = '<tr><td class="loading">Loading...</td></tr>';
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      if (!Array.isArray(json) || json.length === 0) {
        throw new Error('Invalid JSON data');
      }
      this.headers = Object.keys(json[0]);
      this.data = json;
      this.filteredData = [...json];
      this.currentPage = 1;
      this.renderTable();
      this.updatePaginationControls();
    } catch (error) {
      console.error('Fetch error:', error);
      const tbody = this.shadowRoot?.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = `<tr><td class="error">Error: ${(error as Error).message}</td></tr>`;
      }
    }
  }

  private applyFilter(): void {
    if (!this.searchQuery) {
      this.filteredData = [...this.data];
      return;
    }
    this.filteredData = this.data.filter(row =>
      Object.values(row).some(cell =>
        String(cell).toLowerCase().includes(this.searchQuery)
      )
    );
  }

  private renderTable(): void {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    const paginatedData = this.filteredData.slice(startIndex, endIndex);
    const thead = this.shadowRoot?.querySelector('thead');
    const tbody = this.shadowRoot?.querySelector('tbody');
    if (thead && tbody) {
      thead.innerHTML = `
        <tr>
          ${this.headers.map((h, i) => `<th role="columnheader" class="${i === this.sortColumn ? (this.sortDirection > 0 ? 'sort-ascending' : 'sort-descending') : 'sort-indicator'}">${h}</th>`).join('')}
        </tr>
      `;
      tbody.innerHTML = `
        ${paginatedData.map(row => `
          <tr role="row">
            ${this.headers.map(h => `<td role="gridcell" class="message-bubble">${row[h] ?? ''}</td>`).join('')}
          </tr>
        `).join('')}
      `;
    }
  }

  private updatePaginationControls(): void {
    const totalRows = this.filteredData.length;
    const totalPages = Math.ceil(totalRows / this.rowsPerPage);
    const shadow = this.shadowRoot;
    if (shadow) {
      const prevButton = shadow.querySelector('.prev') as HTMLButtonElement;
      const nextButton = shadow.querySelector('.next') as HTMLButtonElement;
      const pageInfo = shadow.querySelector('.page-info');
      const rowsPerPageSelect = shadow.querySelector('.rows-per-page') as HTMLSelectElement;

      prevButton.disabled = this.currentPage === 1;
      nextButton.disabled = this.currentPage === totalPages || totalPages === 0;
      pageInfo.textContent = `Page ${this.currentPage} of ${totalPages || 1}`;
      rowsPerPageSelect.value = this.rowsPerPage.toString();
    }
  }

  private sortTable(columnIndex: number): void {
    if (this.sortColumn === columnIndex) {
      this.sortDirection *= -1;
    } else {
      this.sortDirection = 1;
    }
    this.sortColumn = columnIndex;

    const columnKey = this.headers[columnIndex];
    const isNumeric = this.isColumnNumeric(columnIndex);

    this.filteredData.sort((rowA, rowB) => {
      const cellA = String(rowA[columnKey] ?? '').trim();
      const cellB = String(rowB[columnKey] ?? '').trim();
      if (isNumeric) {
        return (Number(cellA) - Number(cellB)) * this.sortDirection;
      }
      return cellA.localeCompare(cellB) * this.sortDirection;
    });

    this.currentPage = 1;
    this.renderTable();
    this.updatePaginationControls();

    const ths = this.shadowRoot?.querySelectorAll('th') || [];
    ths.forEach((th: HTMLTableCellElement, index: number) => {
      th.classList.remove('sort-indicator', 'sort-ascending', 'sort-descending');
      if (index === columnIndex) {
        th.classList.add(this.sortDirection > 0 ? 'sort-ascending' : 'sort-descending');
        th.setAttribute('aria-sort', this.sortDirection > 0 ? 'ascending' : 'descending');
      } else {
        th.classList.add('sort-indicator');
        th.setAttribute('aria-sort', 'none');
      }
    });
  }

  private isColumnNumeric(columnIndex: number): boolean {
    const columnKey = this.headers[columnIndex];
    return this.filteredData.every(row => {
      const cell = String(row[columnKey] ?? '').trim();
      return cell !== '' && !isNaN(Number(cell));
    });
  }
}

customElements.define('csv-grid', CSVGrid);