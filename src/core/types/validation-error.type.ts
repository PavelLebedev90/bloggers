export type ValidationError = {
  field: string;
  message: string;
  entity?: string | null;
};

export type ValidationErrorMessages = {
  errorsMessages: Omit<ValidationError, "entity">[];
};
