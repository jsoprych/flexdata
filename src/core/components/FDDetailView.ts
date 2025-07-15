// src/core/components/FDDetailView.ts
import { BaseControl } from '../BaseControl';

export class FDDetailView extends BaseControl {
  protected render() {
    this.shadow.innerHTML = `
      <style>
        :host { display: block; border: 1px solid #ccc; padding: 10px; }
        .detail-container { margin: 8px; }
      </style>
      <div class="detail-container">
        <slot name="header">Default Header</slot>
        <slot name="body">Default Body Content</slot>
      </div>
    `;
  }

  protected attachEventListeners() {
    this.addEventListener('grid-clicked', this.onGridClicked as EventListener);
  }

  protected detachEventListeners() {
    this.removeEventListener('grid-clicked', this.onGridClicked as EventListener);
  }

  private onGridClicked = (event: CustomEvent) => {
    console.log('Detail View received:', event.detail.message);
  };
}

customElements.define('fd-detail-view', FDDetailView);
