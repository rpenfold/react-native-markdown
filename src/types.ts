export interface MarkdownProps {
  blacklist: Array<any>; // Should be Array<string> but Lodash types require Array<any>
  children: string;
  errorHandler: Function;
  rules: object;
  styles: MarkdownStyles;
  whitelist: Array<any>;
  onLinkPress(target: string): void;
}

export interface MarkdownStyles {
  blockQuoteSection?: object;
  blockQuoteSectionBar?: object;
  codeBlock?: object;
  del?: object;
  em?: object;
  heading?: object;
  heading1?: object;
  heading2?: object;
  heading3?: object;
  heading4?: object;
  heading5?: object;
  heading6?: object;
  hr?: object;
  image?: object;
  inlineCode?: object;
  link?: object;
  listItem?: object;
  listItemNumber?: object;
  mailTo?: object;
  paragraph?: object;
  listItemText?: object;
  strong?: object;
  table?: object;
  tableHeader?: object;
  tableHeaderCell?: object;
  tableRow?: object;
  tableRowLast?: object;
  tableRowCell?: object;
  text?: object;
  u?: object;
  video?: object;
  view?: object;
}
