import { ValidationError, ValidationErrorMessages } from "../../types/validation-error";
import {
  ArrayValidation,
  BooleanValidation,
  NumberValidation,
  StringValidation,
} from "../../types/validation-scheme";

export const isInvalidString = (rules: StringValidation, value: unknown) => {
  if (rules.isNullable && value === null) {
    return false;
  }
  if (rules.required && (!value || typeof value !== "string")) {
    return true;
  }
  if (!rules.required && (value === null || value === undefined)) {
    return false;
  }

  if (
    typeof value === "string" &&
    (value.trim().length < (rules.minLength ?? 0) ||
      value.trim().length > (rules.maxLength ?? Infinity))
  ) {
    return true;
  }

  if (rules.pattern && !rules.pattern.test(value as string)) {
    return true;
  }
  return false;
};

export const isInvalidNumber = (rules: NumberValidation, value: unknown) => {
  if (rules.isNullable && value === null) {
    return false;
  }
  if (rules.required && (!value || typeof value !== "number")) {
    return true;
  }
  if (!rules.required && (value === null || value === undefined)) {
    return false;
  }
  if (
    typeof value === "number" &&
    (value < (rules?.min ?? -Infinity) || value > (rules?.max ?? Infinity))
  ) {
    return true;
  }

  return false;
};
export const isInvalidBoolean = (rules: BooleanValidation, value: unknown) => {
  if (rules.isNullable && value === null) {
    return false;
  }
  if (rules.required && (!value || typeof value !== "boolean")) {
    return true;
  }
  if (!rules.required && (value === null || value === undefined)) {
    return false;
  }
  if (typeof value !== "boolean") {
    return true;
  }

  return false;
};

export const isInvalidArray = <T>(rules: ArrayValidation<T>, value: unknown) => {
  if (rules.isNullable && value === null) {
    return false;
  }
  if (rules.required && (!value || !Array.isArray(value) || value.length === 0)) {
    return true;
  }
  if (!rules.required && Array.isArray(value) && value.length === 0) {
    return false;
  }
  if (!Array.isArray(value)) {
    return true;
  }
  if (Array.isArray(value) && rules.items) {
    for (const item of value) {
      const currentItem = item;
      if (!rules.items.has(currentItem)) {
        return true;
      }
    }
  }

  return false;
};

export const validationErrorOutput = (errors: ValidationError[]): ValidationErrorMessages => ({
  errorsMessages: errors,
});
