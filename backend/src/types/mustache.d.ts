declare module 'mustache' {
  export interface MustacheStatic {
    render(template: string, view: any, partials?: any): string;
    escape(text: string): string;
  }

  const Mustache: MustacheStatic;
  export default Mustache;
}
