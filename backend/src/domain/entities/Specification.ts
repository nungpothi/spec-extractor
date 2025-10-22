import { v4 as uuidv4 } from 'uuid';

export class Specification {
  public readonly id: string;
  public readonly summary: string;
  public readonly jsonData: object;
  public readonly previewHtml: string;
  public readonly createdAt: Date;
  public readonly createdBy?: string;
  public readonly updatedAt?: Date;
  public readonly updatedBy?: string;

  constructor(
    id: string,
    summary: string,
    jsonData: object,
    previewHtml: string,
    createdAt: Date,
    createdBy?: string,
    updatedAt?: Date,
    updatedBy?: string,
  ) {
    this.id = id;
    this.summary = summary;
    this.jsonData = jsonData;
    this.previewHtml = previewHtml;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static create(
    jsonData: object,
    previewHtml: string,
    createdBy?: string,
  ): Specification {
    const id = uuidv4();
    const summary = this.generateSummary(jsonData);
    const createdAt = new Date();

    return new Specification(
      id,
      summary,
      jsonData,
      previewHtml,
      createdAt,
      createdBy,
    );
  }

  public isValid(): boolean {
    return !!(
      this.id &&
      this.summary &&
      this.jsonData &&
      this.previewHtml &&
      this.createdAt
    );
  }

  public hasJsonContent(): boolean {
    return Object.keys(this.jsonData).length > 0;
  }

  public isCreatedAfter(date: Date): boolean {
    return this.createdAt > date;
  }

  public getAge(): number {
    return Date.now() - this.createdAt.getTime();
  }

  private static generateSummary(jsonData: object): string {
    try {
      const keys = Object.keys(jsonData);
      if (keys.length === 0) return 'Empty JSON object';
      if (keys.length === 1) return `JSON with "${keys[0]}" property`;
      
      return `JSON with ${keys.length} properties: ${keys.slice(0, 3).join(', ')}${
        keys.length > 3 ? '...' : ''
      }`;
    } catch {
      return 'JSON specification';
    }
  }
}