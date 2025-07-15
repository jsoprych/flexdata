// src/core/BaseControl.ts
export abstract class BaseControl extends HTMLElement {
  protected shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.detachEventListeners();
  }

  protected abstract render(): void;

  protected attachEventListeners(): void {}
  protected detachEventListeners(): void {}
}
