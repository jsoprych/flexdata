// src/components/fd-status-bar.ts
export class FDStatusBar extends BaseControl {
  constructor() {
    super();
    this.renderSlot().innerHTML = '<p>Status: Ready</p>';
  }
}
customElements.define('fd-status-bar', FDStatusBar);