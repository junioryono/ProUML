import { AccessModifier, Bracket, Comment, FileType, InnerValueType, PunctuationMark } from "./enums";
import { v4 as uuidv4 } from "uuid";

export class Parser {
  private files: FileParser[] = [];
  private parsedFiles: JavaToJSONFile[] | undefined = undefined;
  private parsedForUML: JSONToUML[] | undefined = undefined;

  constructor(files: JavaFile[]) {
    if (
      !Array.isArray(files) ||
      !files.length ||
      !files.every((file) => file && file.name && typeof file.name === "string" && file.text && typeof file.text === "string")
    ) {
      throw new Error("Cannot parse project");
    }
    this.files = files.map((file) => new FileParser(file));
  }

  public parseFiles() {
    this.parsedFiles = this.files.map((file) => file.parse());
    const parsedChildren: JavaToJSONFile[] = this.files
      .map((file) => file.getChildren().map((child) => new FileParser(child)))
      .flat()
      .map((file) => file.parse());
    this.parsedFiles = [...this.parsedFiles, ...parsedChildren];
    this.parseForUML();
    return this;
  }

  private parseForUML() {
    if (this.parsedFiles === undefined) throw new Error("Files were not parsed");

    console.log("parsedFiles", this.parsedFiles);
    const classes = this.parsedFiles.map((file) => {
      const variables =
        file.type === "abstract" || file.type === "class" || file.type === "interface"
          ? file.variables?.map((variable) => {
              let string = "";

              if (variable.accessModifier === "private") {
                string += "-";
              } else if (variable.accessModifier === "protected") {
                string += "#";
              } else {
                string += "+";
              }

              string += " " + variable.name + ": " + variable.type;

              if (variable.value) {
                string += " = " + variable.value;
              }

              if (variable.final) {
                string += " {readOnly}";
              }

              return { static: variable.static || false, string };
            })
          : undefined;
      const methods =
        file.type === "abstract" || file.type === "class" || file.type === "interface"
          ? file.methods?.map((method) => {
              let string = "";

              if (method.accessModifier === "private") {
                string += "-";
              } else if (method.accessModifier === "protected") {
                string += "#";
              } else {
                string += "+";
              }

              string += " " + method.name + "(";

              const paramString = method.parameters?.map((parameter) => parameter.name + ": " + parameter.type).join(", ");
              if (paramString !== undefined) {
                string += paramString;
              }

              string += "): " + method.type;

              return { static: ((method as any).static as boolean) || false, string };
            })
          : undefined;

      return {
        id: file.id,
        shape: "class",
        name: [file.type === "abstract" ? "<<abstract>>" : file.type === "interface" ? "<<interface>>" : file.type === "enum" ? "<<enum>>" : undefined, file.name].filter(
          (name) => name !== undefined,
        ),
        variables: variables,
        methods: methods,
      } as JSONToUML;
    });

    const edges: JSONToUML[] = [];

    const edgeAlreadyConnected = (source: string, target: string, indexParam: number) => {
      return edges.some((edge, index) => {
        if (edge.shape === "class") {
          return false;
        }

        if ((index === undefined || indexParam === index) && edge.source === source && edge.target === target) {
          return true;
        }

        return false;
      });
    };

    const edgeAlreadyConnectedInOppositeDirection = (source: string, target: string, indexParam: number) => {
      return edges.some((edge, index) => {
        if (edge.shape === "class") {
          return false;
        }

        if ((index === undefined || indexParam === index) && edge.source === target && edge.target === source) {
          return true;
        }

        return false;
      });
    };

    edges.push(
      ...(this.parsedFiles
        .map((file) => {
          const fileEdges: JSONToUML[] = [];

          if ((file.type === "interface" && file.extends) || ((file.type === "abstract" || file.type === "class") && file.extends)) {
            for (const extend of file.extends || []) {
              const matchingFile = this.parsedFiles?.find((innerFile) => innerFile.name !== file.name && innerFile.name === extend);
              if (matchingFile === undefined || (matchingFile.type !== "abstract" && matchingFile.type !== "class")) {
                continue;
              }

              fileEdges.push({
                shape: "extends",
                source: file.id,
                target: matchingFile.id,
              });
            }
          }

          if (file.type === "abstract" || file.type === "class") {
            if (file.implements) {
              for (const implement of file.implements || []) {
                const matchingFile = this.parsedFiles?.find((innerFile) => innerFile.name !== file.name && innerFile.name === implement);
                if (matchingFile === undefined || matchingFile.type !== "interface") {
                  continue;
                }

                fileEdges.push({
                  shape: "implements",
                  source: file.id,
                  target: matchingFile.id,
                });
              }
            }

            for (const property of file.variables || []) {
              const matchingFile = this.parsedFiles?.find((innerFile) => innerFile.name !== file.name && innerFile.name === property.type);
              if (matchingFile === undefined) {
                continue;
              }

              fileEdges.push({
                shape: "aggregation",
                source: file.id,
                target: matchingFile.id,
              });
            }

            for (const property of file.methods || []) {
              const matchingFile = this.parsedFiles?.find((innerFile) => innerFile.name !== file.name && innerFile.name === property.type);
              if (matchingFile === undefined) {
                continue;
              }

              fileEdges.push({
                shape: "aggregation",
                source: file.id,
                target: matchingFile.id,
              });
            }
          }

          console.log("fileEdges", fileEdges);
          return fileEdges;
        })
        .filter((innerEdges) => innerEdges.some((edge, index) => edge.shape !== "class" && !edgeAlreadyConnected(edge.source, edge.target, index)))
        .map((innerEdges) => {
          // TODO: need to fix double connections
          return innerEdges;
        })
        .filter((innerEdges) => innerEdges.length !== 0)
        .flat() as JSONToUML[]),
    );

    this.parsedForUML = [...classes, ...edges];
  }

  public getParsedFiles() {
    if (this.parsedFiles === undefined) throw new Error("Files were not parsed");
    return this.parsedFiles;
  }

  public getParsedForUML() {
    if (this.parsedForUML === undefined) throw new Error("Files were not parsed");
    return this.parsedForUML;
  }
}

class FileParser {
  private name: string;
  private parent: string | undefined;
  private text: string;
  private fileProperties: FileProperties | undefined = undefined;
  private quotationIndices: QuotationIndex[] = [];
  private classDeclarations: string = "";
  private variablesAndMethodsDeclarations: string = "";
  private children: JavaFile[] = [];

  constructor(file: JavaFile) {
    this.name = file.name;
    this.parent = file.parent;
    this.text = file.text;
  }

  public getChildren(): JavaFile[] {
    const tempChildren = this.children;
    this.children = [];
    return tempChildren;
  }

  public parse(): JavaToJSONFile {
    // Remove all comments
    for (let first = null, startIndex = 0; first !== undefined; ) {
      first = this.getFirstIndex({ text: this.text, startIndex });
      if (first === undefined) break;

      let regexSearch = undefined;
      if (first.property === Comment.DoubleSlash) {
        regexSearch = /\/.*/;
      } else if (first.property === Comment.SlashAsterisk) {
        regexSearch = /\/\*[\s\S]*?\*\/.*/;
      }

      if (regexSearch === undefined) throw new Error("Parsing error");
      this.text = this.text.slice(0, first.index) + this.text.slice(first.index).replace(regexSearch, "");
    }

    this.text = this.text
      .replace(/[\s\S]*?package[\s\S]*?;[\s]*/g, "") // Remove package declaration
      .replace(/[\s\S]*?import[\s\S]*?;[\s]*/g, "") // Remove all imports
      .replace(/\r?\n|\r/g, " ") // Replace line breaks with a space
      .replace(/\s+/g, " ") // Replace double spaces with one space
      .replace(/\s*,\s*/g, ",") // Remove all spaces before and after ,
      .replace(/\s*;\s*/g, ";") // Remove all spaces before and after ;
      .replace(/\s*{\s*/g, "{") // Remove all spaces before and after {
      .replace(/\s*}\s*/g, "}") // Remove all spaces before and after }
      .replace(/[\s]*=[\s]*/g, " = ") // Replace all "=", " =", and "= " with " = "
      .trim(); // Remove leading and trailing white spaces

    this.quotationIndices = this.getAllQuotationIndices({ text: this.text });

    const classDeclarations = this.getMainClassDeclarations();
    this.classDeclarations = classDeclarations.text;
    this.setFileProperties();

    const scopeDeclarations = this.getScopeDeclarations({ startBracketIndex: classDeclarations.index });
    this.variablesAndMethodsDeclarations = scopeDeclarations.text;

    const declarationsBeforeMain = this.text.substring(0, classDeclarations.index - classDeclarations.text.length);
    const declarationsAfterMain = classDeclarations.index === scopeDeclarations.endBracketIndex ? "" : this.text.substring(scopeDeclarations.endBracketIndex);
    const childrenText = declarationsBeforeMain + declarationsAfterMain;
    this.separateAndAddChildren({ childrenText });

    const variablesAndMethodsDeclarationsSplit = this.splitVariablesAndMethods({
      text: this.variablesAndMethodsDeclarations,
    });

    const variablesAndMethodsDeclarationsFormatted = this.formatVariablesAndMethods({
      variablesAndMethods: variablesAndMethodsDeclarationsSplit,
    }) as ((VariableType & { variable?: true }) | (MethodType & { variable?: false }))[];

    const variables = variablesAndMethodsDeclarationsFormatted
      .filter((property) => property.variable === true)
      .map((property) => {
        delete property.variable;
        return property;
      }) as VariableType[];

    const methods = variablesAndMethodsDeclarationsFormatted
      .filter((property) => property.variable === false)
      .map((property) => {
        delete property.variable;
        return property;
      }) as VariableType[];

    return {
      ...this.fileProperties,
      ...(this.fileProperties?.type !== FileType.Enum ? { variables, methods } : {}),
      ...(this.parent !== undefined ? { parent: this.parent } : {}),
      name: this.name,
      id: uuidv4(),
    } as JavaToJSONFile;
  }

  private getFirstIndex({ text, startIndex = 0 }: { text: string; startIndex?: number }) {
    const indices: any = {
      [Comment.DoubleSlash]: text.indexOf(Comment.DoubleSlash, startIndex),
      [Comment.SlashAsterisk]: text.indexOf(Comment.SlashAsterisk, startIndex),
    };

    if (Object.keys(indices).every((property) => indices[property] === -1)) return undefined;

    const closestIndexProperty = Object.keys(indices).reduce((a, b) => {
      if (indices[a] === -1) return b;
      if (indices[b] === -1) return a;

      if (indices[a] < indices[b]) return a;
      return b;
    });

    return {
      property: closestIndexProperty,
      index: indices[closestIndexProperty],
    };
  }

  private getAllQuotationIndices = ({ text }: { text: string }) => {
    const ignoreIndices: QuotationIndex[] = [];
    let currentQuote: PunctuationMark | undefined = undefined;

    for (let i = 0; i < text.length; i++) {
      const currentLetter = text[i];
      if (currentLetter === PunctuationMark.Apostrophe) {
        if (!currentQuote) {
          currentQuote = PunctuationMark.Apostrophe;
          ignoreIndices.push({
            type: currentQuote,
            start: i,
            finish: text.length - 1,
          });
        } else if (currentQuote === PunctuationMark.Apostrophe) {
          currentQuote = undefined;
          ignoreIndices[ignoreIndices.length - 1] = {
            ...ignoreIndices[ignoreIndices.length - 1],
            finish: i,
          };
        }
      } else if (currentLetter === PunctuationMark.Quotation) {
        if (!currentQuote) {
          currentQuote = PunctuationMark.Quotation;
          ignoreIndices.push({
            type: currentQuote,
            start: i,
            finish: text.length - 1,
          });
        } else if (currentQuote === PunctuationMark.Quotation) {
          currentQuote = undefined;
          ignoreIndices[ignoreIndices.length - 1] = {
            ...ignoreIndices[ignoreIndices.length - 1],
            finish: i,
          };
        }
      }
    }

    return ignoreIndices;
  };

  private getMainClassDeclarations = () => {
    const match = this.text.match(new RegExp(`[^;}]*${this.name}[^{]*`));
    if (!match || match.index === undefined || !match.length) throw new Error("File name not found in file.");
    return { text: match[0].trim(), index: match.index + match[0].length };
  };

  private getScopeDeclarations = ({ startBracketIndex }: { startBracketIndex: number }) => {
    let scopeDeclarations = "";
    let currentScope = 1;
    let lastChangedScopeIndex = startBracketIndex;
    let endBracketIndex = startBracketIndex;

    for (let i = startBracketIndex + 1; i < this.text.length; i++) {
      // Prevents getting other classes in the file
      if (currentScope === 0) {
        endBracketIndex = i;
        break;
      }

      // Make sure this index is not inside a quote because we want to know if the current scope is changing
      if (this.quotationIndices.find((quotation) => i > quotation.start && i < quotation.finish)) {
        continue;
      }

      if (this.text[i] === Bracket.CurlyOpen || this.text[i] === Bracket.CurlyClose) {
        if (currentScope > 0) {
          scopeDeclarations += this.text.substring(lastChangedScopeIndex, i);
        }
        lastChangedScopeIndex = i;
      } else if (this.text[i] === ";") {
        const closingCurlyArray = [...this.text.matchAll(/}/g)];
        const closingCurlyAvailable = closingCurlyArray.filter((value) =>
          this.quotationIndices.find((quotation) => value && value.index !== undefined && value.index > quotation.start && value.index < quotation.finish),
        );
        if (!closingCurlyAvailable) {
          scopeDeclarations += this.text.substring(lastChangedScopeIndex, i);
          lastChangedScopeIndex = i;
        }
      }

      if (this.text[i] === Bracket.CurlyOpen) {
        currentScope++;
      } else if (this.text[i] === Bracket.CurlyClose) {
        currentScope--;
      }
    }

    if (scopeDeclarations.length > 0) {
      if (scopeDeclarations[0] === Bracket.CurlyOpen) scopeDeclarations = scopeDeclarations.substring(1, scopeDeclarations.length);
      if (scopeDeclarations[scopeDeclarations.length] === Bracket.CurlyClose) scopeDeclarations = scopeDeclarations.substring(0, scopeDeclarations.length - 1);
    }

    return { text: scopeDeclarations, endBracketIndex };
  };

  private separateAndAddChildren = ({ childrenText }: { childrenText: string }) => {
    const quotationIndices = this.getAllQuotationIndices({ text: childrenText });
    let currentScope = 0;
    let lastClosedIndex = -1;

    for (let i = 0; i < childrenText.length; i++) {
      if (quotationIndices.find((quotation) => i > quotation.start && i < quotation.finish)) {
        continue;
      }

      if (childrenText[i] === Bracket.CurlyOpen) {
        currentScope++;
      } else if (childrenText[i] === Bracket.CurlyClose) {
        currentScope--;
        if (currentScope === 0) {
          const allOfChildFile = childrenText.substring(lastClosedIndex + 1, i + 1);
          const firstBracketOpening = allOfChildFile.indexOf(Bracket.CurlyOpen);
          const classDeclarations = allOfChildFile.substring(0, firstBracketOpening).split(" ");

          const classIndex = classDeclarations.findIndex((value) => value === "class");
          const interfaceIndex = classDeclarations.findIndex((value) => value === "interface");
          const enumIndex = classDeclarations.findIndex((value) => value === "enum");

          if (
            (classIndex !== -1 && (interfaceIndex !== -1 || enumIndex !== -1)) ||
            (interfaceIndex !== -1 && enumIndex !== -1) ||
            (classIndex === -1 && interfaceIndex === -1 && enumIndex === -1)
          ) {
            throw new Error("Class syntax error.");
          }

          let fileName = undefined;
          if (classIndex !== -1 && classDeclarations[classIndex + 1]) {
            fileName = classDeclarations[classIndex + 1];
          } else if (interfaceIndex !== -1 && classDeclarations[interfaceIndex + 1]) {
            fileName = classDeclarations[interfaceIndex + 1];
          } else if (enumIndex !== -1 && classDeclarations[enumIndex + 1]) {
            fileName = classDeclarations[enumIndex + 1];
          }

          if (fileName === undefined) {
            throw new Error("Class syntax error.");
          }

          this.children.push({
            name: fileName,
            parent: this.name,
            text: allOfChildFile,
          });

          lastClosedIndex = i;
        }
      }
    }
  };

  private setFileProperties() {
    const text = this.classDeclarations.split(" ");

    const abstractIndex = text.findIndex((value) => value === "abstract");
    const classIndex = text.findIndex((value) => value === "class");
    const interfaceIndex = text.findIndex((value) => value === "interface");
    const enumIndex = text.findIndex((value) => value === "enum");

    if (
      (classIndex !== -1 && (interfaceIndex !== -1 || enumIndex !== -1)) ||
      (interfaceIndex !== -1 && enumIndex !== -1) ||
      (classIndex === -1 && interfaceIndex === -1 && enumIndex === -1)
    ) {
      throw new Error("Class syntax error.");
    }

    if (classIndex !== -1 || interfaceIndex !== -1) {
      const extendsIndex = text.findIndex((value) => value === "extends") + 1;
      const extendsValue = extendsIndex === 0 ? undefined : text[extendsIndex].split(",");
      if (classIndex !== -1) {
        const abstract = abstractIndex === 0 && classIndex === 1;
        const implementsIndex = text.findIndex((value) => value === "implements") + 1;
        const implementsValue = implementsIndex === 0 ? undefined : text[implementsIndex].split(",");
        this.fileProperties = {
          type: abstract ? FileType.Abstract : FileType.Class,
          implements: implementsValue,
          extends: extendsValue,
        };
      } else {
        this.fileProperties = {
          type: FileType.Interface,
          extends: extendsValue,
        };
      }
    } else if (enumIndex !== -1) {
      this.fileProperties = {
        type: FileType.Enum,
      };
    }
  }

  private splitVariablesAndMethods({ text }: { text: string }) {
    const split: VariablesAndMethodsDeclarations[] = [];
    let currentScope = 0;
    let lastChangedScopeIndex = -1;

    const quotationIndices = this.getAllQuotationIndices({ text: text });

    for (let i = 0; i < text.length; i++) {
      // Make sure this index is not inside a quote because we want to know if the current scope is changing
      if (quotationIndices.find((quotation) => i > quotation.start && i < quotation.finish)) {
        continue;
      }

      if (text[i] === Bracket.CurlyOpen && !currentScope) {
        split.push({
          value: text.substring(lastChangedScopeIndex + 1, i),
          type: InnerValueType.Method,
          contains: [],
        });
        lastChangedScopeIndex = i;
        i = lastChangedScopeIndex;
      } else if (text[i] === Bracket.CurlyClose) {
        lastChangedScopeIndex = i;
        i = lastChangedScopeIndex;
      } else if (text[i] === ";") {
        const closingCurlyArray = [...text.matchAll(/}/g)];
        const closingCurlyAvailable = closingCurlyArray.filter((value) =>
          this.quotationIndices.find((quotation) => value && value.index !== undefined && value.index > quotation.start && value.index < quotation.finish),
        );
        if (!closingCurlyAvailable || !currentScope) {
          split.push({
            value: text.substring(lastChangedScopeIndex + 1, i + 1),
            type: InnerValueType.Variable,
          });
        } else if (currentScope && split.length && split[split.length - 1].type === InnerValueType.Method) {
          split[split.length - 1].contains?.push(text.substring(lastChangedScopeIndex + 1, i + 1));
        }
        lastChangedScopeIndex = i;
        i = lastChangedScopeIndex;
      }

      if (text[i] === Bracket.CurlyOpen) {
        currentScope++;
      } else if (text[i] === Bracket.CurlyClose) {
        currentScope--;
      }
    }

    return split;
  }

  private formatVariablesAndMethods({
    variablesAndMethods,
  }: {
    variablesAndMethods: VariablesAndMethodsDeclarations[];
  }): ((VariableType & { variable: true }) | (MethodType & { variable: false }))[] {
    return variablesAndMethods
      .map((property) => {
        let value = property.value;
        let quotationIndices = this.getAllQuotationIndices({ text: value });

        if (property.type === InnerValueType.Variable) {
          let defaultValue: string | undefined;

          const equalSignIndex = value.indexOf(" = ");
          if (equalSignIndex !== -1 && !quotationIndices.find((quotation) => equalSignIndex > quotation.start && equalSignIndex < quotation.finish)) {
            defaultValue = value.substring(equalSignIndex + 3, value.length - 1);
          }

          let name = defaultValue !== undefined ? value.match(/[^\s][\S]*(?=[\s]*=[\s]*)/) : value.match(/[\S]*(?=[\s]*;)/);
          if (!name || !name[0] || !name.length || name.index === undefined) throw new Error("Error parsing variables.");

          const prefixesWithType = value.substring(0, name.index - 1).split(" ");
          const { accessModifier, staticValue, finalValue, typeValue } = this.getValuesFromPrefixesWithType({ prefixesWithType });

          return {
            variable: true,
            type: typeValue,
            name: name[0],
            value: defaultValue,
            accessModifier: accessModifier || AccessModifier.Private,
            static: staticValue,
            final: finalValue,
          } as VariableType;
        } else if (property.type === InnerValueType.Method) {
          let prefixesWithType = value.replace(/[\s]*?\([\s\S]*?\)[\s]*/, "").split(" ");

          for (const prefix of prefixesWithType.filter((prefix) => prefix[0] === "@")) {
            const index = value.indexOf(prefix);
            value = value.slice(index, prefix.length);
            quotationIndices = this.getAllQuotationIndices({ text: value });
          }

          prefixesWithType = prefixesWithType.filter((prefix) => prefix[0] !== "@");

          const parameters = value
            .replace(/[\s\S]*?\([\s\S]*?/, "")
            .replace(/,[\s]*/, ",")
            .slice(0, -1)
            .split(",")
            .map((value) => {
              const split = value.split(" ");
              if (split.length !== 2) return undefined;

              return {
                type: split[0],
                name: split[1],
              } as VariableAndMethodParameters;
            })
            .filter((value) => value !== undefined) as VariableAndMethodParameters[];

          const abstract =
            (prefixesWithType.length === 4 && prefixesWithType[1] === FileType.Abstract) || (prefixesWithType.length === 3 && prefixesWithType[0] === FileType.Abstract);

          if (abstract) {
            const accessModifier =
              prefixesWithType[0] === AccessModifier.Public
                ? AccessModifier.Public
                : prefixesWithType[0] === AccessModifier.Protected
                ? AccessModifier.Protected
                : prefixesWithType[0] === AccessModifier.Private
                ? AccessModifier.Private
                : undefined;
            const typeValue = prefixesWithType.length === 4 ? prefixesWithType[2] : prefixesWithType[1];
            const name = prefixesWithType.length === 4 ? prefixesWithType[3] : prefixesWithType[2];

            return {
              variable: false,
              type: typeValue,
              name,
              accessModifier: accessModifier || AccessModifier.Private,
              abstract: true,
              parameters: parameters.length === 0 ? undefined : parameters,
            } as MethodType;
          }

          const isConstructor =
            (prefixesWithType.length === 2 && prefixesWithType[1] === this.name) || (prefixesWithType.length === 1 && prefixesWithType[0] === this.name);

          const { accessModifier, staticValue, finalValue, typeValue } = this.getValuesFromPrefixesWithType({ prefixesWithType });
          const name =
            accessModifier !== undefined && staticValue && finalValue
              ? prefixesWithType[4]
              : (accessModifier !== undefined && (staticValue || finalValue)) || (accessModifier === undefined && staticValue && finalValue)
              ? prefixesWithType[3]
              : (accessModifier === undefined && (staticValue || finalValue)) || accessModifier !== undefined
              ? prefixesWithType[2]
              : undefined;

          return {
            variable: false,
            constructor: isConstructor,
            accessModifier: accessModifier || AccessModifier.Private,
            static: staticValue,
            final: finalValue,
            type: typeValue,
            name: (isConstructor && this.name) || name || "method",
            parameters: parameters.length === 0 ? undefined : parameters,
          } as MethodType;
        }

        return undefined;
      })
      .filter((property) => property !== undefined) as ((VariableType & { variable: true }) | (MethodType & { variable: false }))[];
  }

  private getValuesFromPrefixesWithType({ prefixesWithType }: { prefixesWithType: string[] }) {
    if (prefixesWithType.length < 1 || prefixesWithType.length > 5) throw new Error("Invalid variable declaration.");

    const accessModifier =
      prefixesWithType[0] === AccessModifier.Public
        ? AccessModifier.Public
        : prefixesWithType[0] === AccessModifier.Protected
        ? AccessModifier.Protected
        : prefixesWithType[0] === AccessModifier.Private
        ? AccessModifier.Private
        : undefined;

    const staticValue =
      (prefixesWithType.length > 2 && accessModifier !== undefined && prefixesWithType[1] === "static") ||
      (accessModifier === undefined && prefixesWithType[0] === "static");

    const finalValue =
      (accessModifier !== undefined && prefixesWithType.length === 4 && prefixesWithType[2] === "final") ||
      (prefixesWithType.length === 3 && prefixesWithType[1] === "final") ||
      (accessModifier === undefined && prefixesWithType.length === 2 && prefixesWithType[0] === "final");

    const typeValue =
      accessModifier && finalValue && staticValue
        ? prefixesWithType[3]
        : (accessModifier && finalValue) || (accessModifier && staticValue) || (finalValue && staticValue)
        ? prefixesWithType[2]
        : accessModifier || finalValue || staticValue
        ? prefixesWithType[1]
        : prefixesWithType[0];

    return { accessModifier, staticValue, finalValue, typeValue };
  }
}
