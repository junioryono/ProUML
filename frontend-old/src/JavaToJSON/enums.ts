export const enum FileType {
  Abstract = "abstract",
  Class = "class",
  Interface = "interface",
  Enum = "enum",
}

export const enum AccessModifier {
  Private = "private",
  Protected = "protected",
  Public = "public",
}

export const enum PunctuationMark {
  Apostrophe = "'",
  Quotation = '"',
}

export const enum Comment {
  DoubleSlash = "//",
  SlashAsterisk = "/*",
  AsteriskSlash = "*/",
}

export const enum Bracket {
  CurlyOpen = "{",
  CurlyClose = "}",
}

export const enum Scope {
  Class = 0,
  VariablesAndMethods = 1,
}

export const enum InnerValueType {
  Variable = "variable",
  Method = "method",
}
