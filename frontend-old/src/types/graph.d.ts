type VariablesAndMethodsDeclarations = {
  value: string;
  type: "variable" | "method";
  contains?: string[];
};

type QuotationIndex = {
  type: "'" | '"';
  start: number;
  finish: number;
};

type JavaFile = {
  name: string;
  parent?: string;
  text: string;
};

type VariableAndMethodParameters = {
  type: string;
  name: string;
};

// {
//   modifier: AccessModifier.Private,
//   static: true,
//   final: true,
//   type: "long",
//   name: "serialVersionUID",
//   value: 20,
// }

type VariableType = VariableAndMethodParameters & {
  accessModifier: "private" | "protected" | "public";
  static: boolean;
  final: boolean;
  value: string | undefined;
};

type MethodType = VariableAndMethodParameters & {
  accessModifier: "private" | "protected" | "public";
  parameters?: VariableAndMethodParameters[];
} & (
    | {
        abstract: true;
      }
    | {
        static: boolean;
        final: boolean;
      }
  );

type VariableMapType = VariableType & {
  variable: true;
};

type MethodMapType = MethodType & {
  method: true;
};

type AbstractClassInterfaceShared = {
  extends?: string[];
  variables?: VariableType[];
  methods?: MethodType[];
};

type FileTypeWithProperties =
  | (AbstractClassInterfaceShared & {
      type: "abstract" | "class";
      implements?: string[];
    })
  | (AbstractClassInterfaceShared & {
      type: "interface";
    })
  | {
      type: "enum";
    };

type JavaToJSONFile = FileTypeWithProperties & {
  id: string;
  name: string;
};

type FileProperties =
  | {
      type: "abstract" | "class";
      implements?: string[];
      extends?: string[];
    }
  | {
      type: "interface";
      extends?: string[];
    }
  | {
      type: "enum";
    };

type JSONToUML =
  | {
      id: string;
      shape: "class";
      data: {
        name: string[];
        variables: { static: boolean; string: string; toString(): string }[] | undefined;
        methods: { static: boolean; string: string; toString(): string }[] | undefined;
      };
    }
  | {
      shape: "composition";
      source: string;
      target: string;
      label: string;
    }
  | {
      shape: "extends" | "implements" | "aggregation" | "association";
      source: string;
      target: string;
    };
