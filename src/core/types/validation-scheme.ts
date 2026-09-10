export type StringValidation = {
  type: "string";
  isNullable?: boolean;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
};

export type NumberValidation = {
  type: "number";
  isNullable?: boolean;
  required: boolean;
  min?: number;
  max?: number;
};

export type BooleanValidation = {
  type: "boolean";
  isNullable?: boolean;
  required: boolean;
};

export type ArrayValidation<T> = {
  type: "array";
  isNullable?: boolean;
  required: boolean;
  items?: Set<T>;
};

export type ValidationScheme<T> =
  StringValidation | NumberValidation | ArrayValidation<T> | BooleanValidation;
