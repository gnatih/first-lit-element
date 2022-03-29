/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        background: #eceae5;
        min-height: 648px;
      }
    `;
  }

  static get properties() {
    return {
      name: {type: String},
      count: {type: Number},
      primary_menu: {type: Array},
      hero: {type: String},
    };
  }

  _fetchData = async () => {
    let data = await fetch(
      'https://ibp.wp.localhost/wp-json/wp-api-menus/v2/menu-locations/primary',
      {
        headers: {
          Authorization: `Basic UmFqOklCdXAgSlhSTyBuUlV2IDAyTDggSDN6dyBja0R1`,
        },
      }
    );

    const json = await data.json();
    console.log(json);
    this.primary_menu = json;
  };

  constructor() {
    super();
    this.name = 'World';
    this.count = 0;
    this.primary_menu = [];
    this.current_menu = {};

    this._fetchData();
  }

  _renderUL(arr) {
    let str = '<ul>';

    arr.forEach((el) => {
      str += `<li>`;
      if (el.children) {
        str += `${el.title}<ul>`;
        el.children.forEach((child) => {
          if (window.location.href == child.url) {
            this.current_menu = child;
          }
          str += `<li><a href=${child.url}>${child.title}</a></li>`;
        });
        str += '</ul>';
      } else {
        str += `<a href=${el.url}>${el.title}</a>`;
      }
      str += '</li>';
    });
    str += '</ul>';

    return unsafeHTML(str);
  }

  render() {
    return html`
      <div style="background:url(${this.current_menu.hero})">
        ${this._renderUL(this.primary_menu)}
        <button @click=${this._onClick} part="button">
          Click Count: ${this.count}
        </button>
        <slot></slot>
      </div>
    `;
  }

  _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
  }

  /**
   * Formats a greeting
   * @param name {string} The name to say "Hello" to
   * @returns {string} A greeting directed at `name`
   */
  sayHello(name) {
    return `Hello, ${name}`;
  }
}

window.customElements.define('my-element', MyElement);
