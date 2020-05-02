interface option {
  fg?: string;
  bg?: string;
  newline?: boolean;
  escapeXML?: boolean;
  stream?: boolean;
  colors?: string[] | {
    [code: number]: string;
  };
}
declare module 'ansi-to-html' {
  class Filter {
    constructor(option: option) {
    }
    toHtml: (input: any) => string;
  }
  export = Filter;
}