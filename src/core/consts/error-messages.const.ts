import { ValidationError } from "../types/validation-error.type";

export const ERROR_MESSAGES = {
  notFoundMessage(field: string, entity: string): ValidationError {
    return {
      field,
      message: `${entity} by ${field} not found`,
    };
  },
};
