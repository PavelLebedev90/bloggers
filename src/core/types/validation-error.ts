export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationErrorMessages = {
  errorsMessages: ValidationError[];
};
