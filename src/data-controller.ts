export class DataController {
    private static instance: DataController;
    private data: Record<string, string>[] = [];
    private filteredData: Record<string, string>[] = [];
    private sortColumn: string | null = null;
    private sortDirection: 'asc' | 'desc' = 'asc';
    private selectedRow: Record<string, string> | null = null;
    private listeners: { [key: string]: ((data: any) => void)[] } = {};

    private constructor() {}

    static getInstance(): DataController {
        if (!DataController.instance) {
            DataController.instance = new DataController();
        }
        return DataController.instance;
    }

    async loadData(url: string) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.data = await response.json();
            this.filteredData = [...this.data];
            this.notify('data-updated', this.filteredData);
        } catch (error) {
            console.error('Fetch error:', error);
            this.notify('error', { message: `Error loading data: ${error.message}` });
        }
    }

    setFilter(filter: string) {
        const headers = this.data.length > 0 ? Object.keys(this.data[0]) : [];
        this.filteredData = this.data.filter(row =>
            headers.some(header => (row[header] || '').toLowerCase().includes(filter.toLowerCase()))
        );
        this.notify('data-updated', this.filteredData);
    }

    setSort(column: string, direction: 'asc' | 'desc') {
        this.sortColumn = column;
        this.sortDirection = direction;
        this.filteredData.sort((a, b) => {
            const aValue = a[column] ?? '';
            const bValue = b[column] ?? '';
            const numericColumns = ['customer_id', 'tax_id'];
            const isNumericColumn = numericColumns.includes(column);
            const aIsNumber = !isNaN(parseFloat(aValue)) && isFinite(parseFloat(aValue));
            const bIsNumber = !isNaN(parseFloat(bValue)) && isFinite(parseFloat(bValue));
            if (isNumericColumn && aIsNumber && bIsNumber) {
                return this.sortDirection === 'asc'
                    ? parseFloat(aValue) - parseFloat(bValue)
                    : parseFloat(bValue) - parseFloat(aValue);
            }
            const aStr = aValue.toString().toLowerCase();
            const bStr = bValue.toString().toLowerCase();
            return this.sortDirection === 'asc'
                ? aStr.localeCompare(bStr)
                : bStr.localeCompare(aStr);
        });
        this.notify('data-updated', this.filteredData);
    }

    setSelectedRow(row: Record<string, string> | null) {
        this.selectedRow = row;
        this.notify('row-selected', this.selectedRow);
    }

    getFilteredData(): Record<string, string>[] {
        return this.filteredData;
    }

    getSelectedRow(): Record<string, string> | null {
        return this.selectedRow;
    }

    getSortColumn(): string | null {
        return this.sortColumn;
    }

    getSortDirection(): 'asc' | 'desc' {
        return this.sortDirection;
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event: string, callback: (data: any) => void) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    private notify(event: string, data: any) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}