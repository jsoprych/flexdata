"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/core/BaseControl.ts
  var BaseControl = class extends HTMLElement {
    constructor() {
      super();
      __publicField(this, "shadow");
      this.shadow = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      this.render();
      this.attachEventListeners();
    }
    disconnectedCallback() {
      this.detachEventListeners();
    }
    static get observedAttributes() {
      return [];
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        const prop = this.attributeToProperty(name);
        if (prop && this[prop] !== newValue) {
          this[prop] = newValue;
        }
      }
    }
    attributeToProperty(attr) {
      return null;
    }
    attachEventListeners() {
    }
    detachEventListeners() {
    }
  };

  // src/core/components/FDStatusBar.ts
  var FDStatusBar = class extends BaseControl {
    constructor() {
      super(...arguments);
      __publicField(this, "_statusText", "Ready");
    }
    static get observedAttributes() {
      return ["status-text"];
    }
    get statusText() {
      return this._statusText;
    }
    set statusText(value) {
      if (value !== this._statusText) {
        this._statusText = value;
        this.setAttribute("status-text", value);
        this.render();
      }
    }
    attributeToProperty(attr) {
      return attr === "status-text" ? "statusText" : null;
    }
    render() {
      this.shadow.innerHTML = '\n      <style>\n        :host { display: block; background: #eee; padding: 5px; font-size: 0.9em; }\n      </style>\n      <div class="status-bar">\n        '.concat(this.statusText, "\n      </div>\n    ");
    }
  };
  customElements.define("fd-status-bar", FDStatusBar);
})();
//# sourceMappingURL=FDStatusBar.js.map
