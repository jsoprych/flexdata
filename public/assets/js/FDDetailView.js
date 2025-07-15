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

  // src/core/components/FDDetailView.ts
  var FDDetailView = class extends BaseControl {
    constructor() {
      super(...arguments);
      __publicField(this, "onGridClicked", (event) => {
        console.log("Detail View received:", event.detail.message);
      });
    }
    render() {
      this.shadow.innerHTML = '\n      <style>\n        :host { display: block; border: 1px solid #ccc; padding: 10px; }\n        .detail-container { margin: 8px; }\n      </style>\n      <div class="detail-container">\n        <slot name="header">Default Header</slot>\n        <slot name="body">Default Body Content</slot>\n      </div>\n    ';
    }
    attachEventListeners() {
      this.addEventListener("grid-clicked", this.onGridClicked);
    }
    detachEventListeners() {
      this.removeEventListener("grid-clicked", this.onGridClicked);
    }
  };
  customElements.define("fd-detail-view", FDDetailView);
})();
//# sourceMappingURL=FDDetailView.js.map
