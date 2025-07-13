"use strict";(()=>{var n=class extends HTMLElement{data=[];filteredData=[];headers=[];sortDirection=1;sortColumn=-1;currentPage=1;rowsPerPage=10;searchQuery="";constructor(){super();let r=this.attachShadow({mode:"open"});r.innerHTML=`
      <style>
        :host {
          display: block;
          font-family: 'Helvetica', 'Arial', sans-serif;
          color: #2e3440;
        }
        .grid-container {
          background: #ffffff;
          border: 1px solid #d8dee9;
          border-radius: 8px;
          max-width: 100%;
          overflow-x: auto;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
        }
        th {
          background: #d9e6f2;
          padding: 12px;
          cursor: pointer;
          user-select: none;
          text-align: left;
          font-size: 16px;
          font-weight: 600;
          color: #2e3440;
          border-bottom: 2px solid #d8dee9;
          transition: background 0.2s ease;
        }
        th:hover {
          background: #c8d7e8;
        }
        td {
          padding: 12px;
          font-size: 14px;
          border-bottom: 1px solid #d8dee9;
        }
        td.message-bubble {
          background: #f0f4f8;
          border-radius: 6px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        tr:nth-child(even) {
          background: #e6f0fa;
        }
        th.sort-indicator::after {
          content: ' \u2195';
          font-size: 12px;
        }
        th.sort-ascending::after {
          content: ' \u2191';
          font-size: 12px;
        }
        th.sort-descending::after {
          content: ' \u2193';
          font-size: 12px;
        }
        .loading {
          padding: 12px;
          color: #5e81ac;
          font-size: 14px;
          text-align: center;
        }
        .error {
          padding: 12px;
          color: #d32f2f;
          font-size: 14px;
          text-align: center;
        }
        .pagination {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          padding: 0 12px;
        }
        .pagination button {
          padding: 8px 16px;
          cursor: pointer;
          border: 1px solid #d8dee9;
          background: #ffffff;
          border-radius: 6px;
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 14px;
          color: #81a1c1;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .pagination button:hover:not(:disabled) {
          background: #e6f0fa;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .pagination button:disabled {
          cursor: not-allowed;
          color: #a3be8c;
          background: #f0f4f8;
        }
        .pagination select {
          padding: 8px;
          border: 1px solid #d8dee9;
          border-radius: 6px;
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 14px;
          color: #2e3440;
          background: #ffffff;
        }
        .pagination select:focus {
          outline: none;
          border-color: #81a1c1;
          box-shadow: 0 0 0 2px rgba(129, 161, 193, 0.2);
        }
        .pagination span {
          font-size: 14px;
          color: #2e3440;
        }
        .search-container {
          margin-bottom: 16px;
          padding: 0 12px;
        }
        .search-container input {
          padding: 8px 12px;
          width: 100%;
          max-width: 300px;
          border: 1px solid #d8dee9;
          border-radius: 6px;
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 14px;
          color: #2e3440;
          background: #ffffff;
        }
        .search-container input:focus {
          outline: none;
          border-color: #81a1c1;
          box-shadow: 0 0 0 2px rgba(129, 161, 193, 0.2);
        }
      </style>
      <div class="search-container">
        <input type="text" placeholder="Search..." class="search-input">
      </div>
      <div class="grid-container">
        <table role="grid">
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="pagination">
        <button class="prev" disabled>Previous</button>
        <span class="page-info">Page 1 of 1</span>
        <button class="next">Next</button>
        <select class="rows-per-page">
          <option value="5">5 rows</option>
          <option value="10" selected>10 rows</option>
          <option value="20">20 rows</option>
          <option value="50">50 rows</option>
        </select>
      </div>
    `}static get observedAttributes(){return["data-src","rows-per-page"]}attributeChangedCallback(r,o,e){if(r==="data-src"&&e)this.loadData(e);else if(r==="rows-per-page"&&e){let t=parseInt(e,10);!isNaN(t)&&t>0&&(this.rowsPerPage=t,this.currentPage=1,this.renderTable(),this.updatePaginationControls())}}connectedCallback(){let r=this.getAttribute("data-src"),o=this.getAttribute("rows-per-page");if(o){let t=parseInt(o,10);!isNaN(t)&&t>0&&(this.rowsPerPage=t)}r&&this.loadData(r);let e=this.shadowRoot;e&&(e.querySelector(".prev")?.addEventListener("click",()=>{this.currentPage>1&&(this.currentPage--,this.renderTable(),this.updatePaginationControls())}),e.querySelector(".next")?.addEventListener("click",()=>{let t=Math.ceil(this.filteredData.length/this.rowsPerPage);this.currentPage<t&&(this.currentPage++,this.renderTable(),this.updatePaginationControls())}),e.querySelector(".rows-per-page")?.addEventListener("change",t=>{let s=t.target;this.rowsPerPage=parseInt(s.value,10),this.currentPage=1,this.renderTable(),this.updatePaginationControls()}),e.querySelector(".search-input")?.addEventListener("input",t=>{this.searchQuery=t.target.value.toLowerCase(),this.applyFilter(),this.currentPage=1,this.renderTable(),this.updatePaginationControls()}),e.addEventListener("click",t=>{let s=t.target.closest("th");if(s){let a=Array.from(e.querySelectorAll("th")||[]).indexOf(s);this.sortTable(a)}}),e.addEventListener("keydown",t=>{let s=t.target.closest("th");if(s&&(t.key==="Enter"||t.key===" ")){t.preventDefault();let a=Array.from(e.querySelectorAll("th")||[]).indexOf(s);this.sortTable(a)}}))}async loadData(r){try{let o=this.shadowRoot?.querySelector("tbody");o&&(o.innerHTML='<tr><td class="loading">Loading...</td></tr>');let e=await fetch(r);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);let t=await e.json();if(!Array.isArray(t)||t.length===0)throw new Error("Invalid JSON data");this.headers=Object.keys(t[0]),this.data=t,this.filteredData=[...t],this.currentPage=1,this.renderTable(),this.updatePaginationControls()}catch(o){console.error("Fetch error:",o);let e=this.shadowRoot?.querySelector("tbody");e&&(e.innerHTML=`<tr><td class="error">Error: ${o.message}</td></tr>`)}}applyFilter(){if(!this.searchQuery){this.filteredData=[...this.data];return}this.filteredData=this.data.filter(r=>Object.values(r).some(o=>String(o).toLowerCase().includes(this.searchQuery)))}renderTable(){let r=(this.currentPage-1)*this.rowsPerPage,o=r+this.rowsPerPage,e=this.filteredData.slice(r,o),t=this.shadowRoot?.querySelector("thead"),s=this.shadowRoot?.querySelector("tbody");t&&s&&(t.innerHTML=`
        <tr>
          ${this.headers.map((a,i)=>`<th role="columnheader" class="${i===this.sortColumn?this.sortDirection>0?"sort-ascending":"sort-descending":"sort-indicator"}">${a}</th>`).join("")}
        </tr>
      `,s.innerHTML=`
        ${e.map(a=>`
          <tr role="row">
            ${this.headers.map(i=>`<td role="gridcell" class="message-bubble">${a[i]??""}</td>`).join("")}
          </tr>
        `).join("")}
      `)}updatePaginationControls(){let r=this.filteredData.length,o=Math.ceil(r/this.rowsPerPage),e=this.shadowRoot;if(e){let t=e.querySelector(".prev"),s=e.querySelector(".next"),a=e.querySelector(".page-info"),i=e.querySelector(".rows-per-page");t.disabled=this.currentPage===1,s.disabled=this.currentPage===o||o===0,a.textContent=`Page ${this.currentPage} of ${o||1}`,i.value=this.rowsPerPage.toString()}}sortTable(r){this.sortColumn===r?this.sortDirection*=-1:this.sortDirection=1,this.sortColumn=r;let o=this.headers[r],e=this.isColumnNumeric(r);this.filteredData.sort((s,a)=>{let i=String(s[o]??"").trim(),d=String(a[o]??"").trim();return e?(Number(i)-Number(d))*this.sortDirection:i.localeCompare(d)*this.sortDirection}),this.currentPage=1,this.renderTable(),this.updatePaginationControls(),(this.shadowRoot?.querySelectorAll("th")||[]).forEach((s,a)=>{s.classList.remove("sort-indicator","sort-ascending","sort-descending"),a===r?(s.classList.add(this.sortDirection>0?"sort-ascending":"sort-descending"),s.setAttribute("aria-sort",this.sortDirection>0?"ascending":"descending")):(s.classList.add("sort-indicator"),s.setAttribute("aria-sort","none"))})}isColumnNumeric(r){let o=this.headers[r];return this.filteredData.every(e=>{let t=String(e[o]??"").trim();return t!==""&&!isNaN(Number(t))})}};customElements.define("csv-grid",n);})();
