"use strict";
(() => {
  // src/components/fd-status-bar.ts
  var FDStatusBar = class extends BaseControl {
    constructor() {
      super();
      this.renderSlot().innerHTML = "<p>Status: Ready</p>";
    }
  };
  customElements.define("fd-status-bar", FDStatusBar);
})();
//# sourceMappingURL=fd-status-bar.js.map
