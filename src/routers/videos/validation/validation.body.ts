import { ValidationScheme } from "../../../core/types/validation-scheme";
import { Resolutions } from "../types/video.db";
import { VideoCreateModel, VideoUpdateModel } from "../types/video.input";
import { ValidationError, ValidationErrorMessages } from "../../../core/types/validation-error";
import {
  isInvalidArray,
  isInvalidBoolean,
  isInvalidNumber,
  isInvalidString,
  validationErrorOutput,
} from "../../../core/utils/validation/validation.utils";

const validationCreate: Record<keyof VideoCreateModel, ValidationScheme<Resolutions>> = {
  title: {
    required: true,
    type: "string",
    maxLength: 40,
  },
  author: {
    required: true,
    type: "string",
    maxLength: 20,
  },
  availableResolutions: {
    required: true,
    type: "array",
    items: new Set(Object.values(Resolutions)),
  },
};

const validationUpdate: Record<keyof VideoUpdateModel, ValidationScheme<Resolutions>> = {
  ...validationCreate,
  canBeDownloaded: {
    required: true,
    type: "boolean",
  },
  minAgeRestriction: {
    required: true,
    type: "number",
    isNullable: true,
    min: 1,
    max: 18,
  },
  publicationDate: {
    required: true,
    type: "string",
  },
};

const validationBody: Record<
  ValidationType,
  Record<keyof ValidationData<ValidationType>, ValidationScheme<Resolutions>>
> = {
  create: validationCreate,
  update: validationUpdate,
};

export enum ValidationType {
  CREATE = "create",
  UPDATE = "update",
}
type ValidationData<T extends ValidationType> = T extends "create"
  ? VideoCreateModel
  : VideoUpdateModel;

export const validateVideosInput = <T extends ValidationType>(
  validationType: T,
  data: ValidationData<T>,
): ValidationErrorMessages => {
  const errors: ValidationError[] = [];

  for (const field in validationBody[validationType]) {
    const rules =
      validationBody[validationType][
        field as keyof Record<keyof ValidationData<ValidationType>, ValidationScheme<Resolutions>>
      ];
    const value = data[field as keyof ValidationData<T>];
    if (rules.type === "string" && isInvalidString(rules, value)) {
      errors.push({ field, message: `Invalid value for ${field}` });
    }
    if (rules.type === "boolean" && isInvalidBoolean(rules, value)) {
      errors.push({ field, message: `Invalid value for ${field}` });
    }
    if (rules.type === "number" && isInvalidNumber(rules, value)) {
      errors.push({ field, message: `Invalid value for ${field}` });
    }
    if (rules.type === "array" && isInvalidArray(rules, value)) {
      errors.push({ field, message: `Invalid value for ${field}` });
    }
  }
  return validationErrorOutput(errors);
};
