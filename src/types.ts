export interface MarkdownProps {
  blacklist: Array<any>; // Should be Array<string> but Lodash types require Array<any>
  children: string;
  errorHandler: Function;
  rules: Object;
  styles: MarkdownStyles;
  whitelist: Array<any>;
  onLinkPress(target: string): void;
}

export interface MarkdownStyles {
  blockQuoteSection?: Object;
  blockQuoteSectionBar?: Object;
  codeBlock?: Object;
  del?: Object;
  em?: Object;
  heading?: Object;
  heading1?: Object;
  heading2?: Object;
  heading3?: Object;
  heading4?: Object;
  heading5?: Object;
  heading6?: Object;
  hr?: Object;
  image?: Object;
  inlineCode?: Object;
  link?: Object;
  listItem?: Object;
  listItemNumber?: Object;
  mailTo?: Object;
  paragraph?: Object;
  listItemText?: Object;
  strong?: Object;
  table?: Object;
  tableHeader?: Object;
  tableHeaderCell?: Object;
  tableRow?: Object;
  tableRowLast?: Object;
  tableRowCell?: Object;
  text?: Object;
  u?: Object;
  video?: Object;
  view?: Object;
}
