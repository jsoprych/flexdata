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
})();
//# sourceMappingURL=BaseControl.js.map
