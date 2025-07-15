// src/core/components/FDGrid.ts
import { BaseControl } from '../BaseControl';

export class FDGrid extends BaseControl {
  private _rowsPerPage: number = 10;

  static get observedAttributes() {
    return ['rows-per-page'];
  }

  get rowsPerPage() {
    return this._rowsPerPage;
  }

  set rowsPerPage(value: number) {
    if (value !== this._rowsPerPage) {
      this._rowsPerPage = value;
      this.setAttribute('rows-per-page', value.toString());
      this.render();
    }
  }

  protected attributeToProperty(attr: string): string | null {
    return attr === 'rows-per-page' ? 'rowsPerPage' : null;
  }

  protected render() {
    this.shadow.innerHTML = `
      <style>
        :host { display: block; padding: 8px; background: #f9f9f9; }
        .grid-container { border: 1px solid #ccc; padding: 10px; }
      </style>
      <div class="grid-container">
        <slot>Default Grid Content (Rows per page: ${this.rowsPerPage})</slot>
      </div>
    `;
  }

  protected attachEventListeners() {
    this.shadow.addEventListener('click', this.onClick);
  }

  protected detachEventListeners() {
    this.shadow.removeEventListener('click', this.onClick);
  }

  private onClick = (event: Event) => {
    this.dispatchEvent(new CustomEvent('grid-clicked', {
      detail: { message: 'Grid was clicked!' },
      bubbles: true,
      composed: true
    }));
  };
}

customElements.define('fd-grid', FDGrid);
