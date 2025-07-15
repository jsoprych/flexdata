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

  // src/core/components/FDGrid.ts
  var FDGrid = class extends BaseControl {
    constructor() {
      super(...arguments);
      __publicField(this, "_rowsPerPage", 10);
      __publicField(this, "onClick", (event) => {
        this.dispatchEvent(new CustomEvent("grid-clicked", {
          detail: { message: "Grid was clicked!" },
          bubbles: true,
          composed: true
        }));
      });
    }
    static get observedAttributes() {
      return ["rows-per-page"];
    }
    get rowsPerPage() {
      return this._rowsPerPage;
    }
    set rowsPerPage(value) {
      if (value !== this._rowsPerPage) {
        this._rowsPerPage = value;
        this.setAttribute("rows-per-page", value.toString());
        this.render();
      }
    }
    attributeToProperty(attr) {
      return attr === "rows-per-page" ? "rowsPerPage" : null;
    }
    render() {
      this.shadow.innerHTML = '\n      <style>\n        :host { display: block; padding: 8px; background: #f9f9f9; }\n        .grid-container { border: 1px solid #ccc; padding: 10px; }\n      </style>\n      <div class="grid-container">\n        <slot>Default Grid Content (Rows per page: '.concat(this.rowsPerPage, ")</slot>\n      </div>\n    ");
    }
    attachEventListeners() {
      this.shadow.addEventListener("click", this.onClick);
    }
    detachEventListeners() {
      this.shadow.removeEventListener("click", this.onClick);
    }
  };
  customElements.define("fd-grid", FDGrid);
})();
//# sourceMappingURL=FDGrid.js.map
