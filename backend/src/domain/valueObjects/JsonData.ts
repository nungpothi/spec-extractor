export class JsonData {
  constructor(private readonly data: object) {
    this.validate();
  }

  get value(): object {
    return this.data;
  }

  private validate(): void {
    if (!this.data || typeof this.data !== 'object') {
      throw new Error('Invalid JSON data: must be a valid object');
    }
  }

  public toString(): string {
    return JSON.stringify(this.data);
  }

  public toPrettyString(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public getKeys(): string[] {
    return Object.keys(this.data);
  }

  public hasProperty(key: string): boolean {
    return key in this.data;
  }

  public isEmpty(): boolean {
    return Object.keys(this.data).length === 0;
  }
}