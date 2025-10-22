export class JsonToHtmlConverterService {
  convert(jsonData: object): string {
    try {
      return this.generateHtmlFromJson(jsonData);
    } catch (error) {
      return `<div class="error">Error converting JSON: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
    }
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