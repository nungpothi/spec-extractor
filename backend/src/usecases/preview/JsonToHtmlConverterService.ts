export class JsonToHtmlConverterService {
  convert(jsonData: object): string {
    try {
      // Check if this is a specification JSON with expected sections
      if (this.isSpecificationFormat(jsonData)) {
        return this.generateSpecificationPreview(jsonData as SpecificationFormat);
      }
      
      // Fallback to generic JSON rendering
      return this.generateHtmlFromJson(jsonData);
    } catch (error) {
      return `<div class="error">Error converting JSON: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
    }
  }

  private isSpecificationFormat(data: any): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      ('summary' in data || 'uiMock' in data || 'apiSpec' in data || 'dbSchema' in data)
    );
  }

  private generateSpecificationPreview(data: SpecificationFormat): string {
    const sections: string[] = [];

    // Summary section
    if (data.summary) {
      sections.push(`
        <section class="relative bg-white/80 backdrop-blur p-4 rounded-2xl shadow-md border border-slate-100 mb-4">
          <button class="spec-copy-btn absolute top-3 right-3 z-10 rounded-md p-2 bg-white/70 hover:bg-white shadow border border-slate-200 text-slate-600 hover:text-slate-800 transition-all" data-copy="summary" data-content="${this.escapeHtml(data.summary)}" aria-label="Copy Summary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
          <h2 class="font-semibold mb-2 text-slate-700">Summary</h2>
          <div class="border border-slate-200 p-3 rounded-lg bg-pink-50/60">
            <span class="text-slate-800">${this.escapeHtml(data.summary)}</span>
          </div>
        </section>
      `);
    }

    // UI Mock section
    if (data.uiMock) {
      sections.push(`
        <section class="relative bg-white/80 backdrop-blur p-4 rounded-2xl shadow-md border border-slate-100 mb-4">
          <button class="spec-copy-btn absolute top-3 right-3 z-10 rounded-md p-2 bg-white/70 hover:bg-white shadow border border-slate-200 text-slate-600 hover:text-slate-800 transition-all" data-copy="uiMock" data-content="${this.escapeHtml(data.uiMock)}" aria-label="Copy UI Mock">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
          <h2 class="font-semibold mb-2 text-slate-700">UI Mock</h2>
          <div class="border border-slate-200 p-3 rounded-lg bg-blue-50/60">
            ${data.uiMock}
          </div>
        </section>
      `);
    }

    // API Spec section
    if (data.apiSpec) {
      const apiHtml = this.convertMarkdownTableToHtml(data.apiSpec);
      sections.push(`
        <section class="relative bg-white/80 backdrop-blur p-4 rounded-2xl shadow-md border border-slate-100 mb-4">
          <button class="spec-copy-btn absolute top-3 right-3 z-10 rounded-md p-2 bg-white/70 hover:bg-white shadow border border-slate-200 text-slate-600 hover:text-slate-800 transition-all" data-copy="apiSpec" data-content="${this.escapeHtml(data.apiSpec)}" aria-label="Copy API Spec">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
          <h2 class="font-semibold mb-2 text-slate-700">API Spec</h2>
          <div class="markdown-body border border-slate-200 p-3 rounded-lg bg-green-50/60 overflow-auto h-64">
            ${apiHtml}
          </div>
        </section>
      `);
    }

    // Database Schema section
    if (data.dbSchema) {
      sections.push(`
        <section class="relative bg-white/80 backdrop-blur p-4 rounded-2xl shadow-md border border-slate-100 mb-4">
          <button class="spec-copy-btn absolute top-3 right-3 z-10 rounded-md p-2 bg-white/70 hover:bg-white shadow border border-slate-200 text-slate-600 hover:text-slate-800 transition-all" data-copy="dbSchema" data-content="${this.escapeHtml(data.dbSchema)}" aria-label="Copy DB Schema">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
          <h2 class="font-semibold mb-2 text-slate-700">Database Schema</h2>
          <pre class="border border-slate-200 p-3 rounded-lg bg-yellow-50/60 whitespace-pre-wrap text-sm">${this.escapeHtml(data.dbSchema)}</pre>
        </section>
      `);
    }

    return `<div class="space-y-4">${sections.join('')}</div>`;
  }

  private convertMarkdownTableToHtml(markdown: string): string {
    const lines = markdown.split('\n').filter(line => line.trim());
    if (lines.length < 2) return this.escapeHtml(markdown);

    const headerLine = lines[0];
    if (!headerLine) return this.escapeHtml(markdown);

    const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
    const rows = lines.slice(2).map(line => 
      line.split('|').map(cell => cell.trim()).filter(cell => cell)
    );

    let tableHtml = '<table class="min-w-full table-auto border-collapse">';
    
    // Header
    tableHtml += '<thead class="bg-gray-100"><tr>';
    headers.forEach(header => {
      tableHtml += `<th class="border px-2 py-1 text-left text-sm font-medium">${this.escapeHtml(header)}</th>`;
    });
    tableHtml += '</tr></thead>';

    // Rows
    tableHtml += '<tbody>';
    rows.forEach(row => {
      tableHtml += '<tr>';
      row.forEach((cell, index) => {
        if (index < headers.length) {
          tableHtml += `<td class="border px-2 py-1 text-sm">${this.escapeHtml(cell)}</td>`;
        }
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';

    return tableHtml;
  }

  private generateHtmlFromJson(data: any, depth = 0): string {
    const indent = '  '.repeat(depth);
    
    if (data === null) {
      return '<span class="null">null</span>';
    }
    
    if (typeof data === 'boolean') {
      return `<span class="boolean">${data}</span>`;
    }
    
    if (typeof data === 'number') {
      return `<span class="number">${data}</span>`;
    }
    
    if (typeof data === 'string') {
      return `<span class="string">"${this.escapeHtml(data)}"</span>`;
    }
    
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return '<span class="array">[]</span>';
      }
      
      const items = data.map(item => 
        `${indent}  ${this.generateHtmlFromJson(item, depth + 1)}`
      ).join(',\n');
      
      return `<span class="array">[\n${items}\n${indent}]</span>`;
    }
    
    if (typeof data === 'object') {
      const keys = Object.keys(data);
      
      if (keys.length === 0) {
        return '<span class="object">{}</span>';
      }
      
      const properties = keys.map(key => {
        const value = this.generateHtmlFromJson(data[key], depth + 1);
        return `${indent}  <span class="key">"${this.escapeHtml(key)}"</span>: ${value}`;
      }).join(',\n');
      
      return `<span class="object">{\n${properties}\n${indent}}</span>`;
    }
    
    return `<span class="unknown">${String(data)}</span>`;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

interface SpecificationFormat {
  summary?: string;
  uiMock?: string;
  apiSpec?: string;
  dbSchema?: string;
}