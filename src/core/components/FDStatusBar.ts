// src/core/components/FDStatusBar.ts
import { BaseControl } from '../BaseControl';

export class FDStatusBar extends BaseControl {
  private _statusText: string = "Ready";

  static get observedAttributes() {
    return ['status-text'];
  }

  get statusText() {
    return this._statusText;
  }

  set statusText(value: string) {
    if (value !== this._statusText) {
      this._statusText = value;
      this.setAttribute('status-text', value);
      this.render();
    }
  }

  protected attributeToProperty(attr: string): string | null {
    return attr === 'status-text' ? 'statusText' : null;
  }

  protected render() {
    this.shadow.innerHTML = `
      <style>
        :host { display: block; background: #eee; padding: 5px; font-size: 0.9em; }
      </style>
      <div class="status-bar">
        ${this.statusText}
      </div>
    `;
  }
}

customElements.define('fd-status-bar', FDStatusBar);
