import { ResultErrorStatus } from "../types/result.type";
import { ValidationError } from "../types/validation-error.type";

type ErrorMessages = Record<
  ResultErrorStatus,
  (field: string, entity?: string, options?: Record<string, unknown>) => ValidationError
>;

const collectEntityField = (field: string, entity?: string) =>
  entity ? `${field} by ${entity}` : null;

export const ERROR_MESSAGES: ErrorMessages = {
  [ResultErrorStatus.NotFound](field: string, entity?: string) {
    return {
      field,
      message:
        "The item you're looking for doesn't exist or has been removed. Check the link or go back to the home page.",
      entity: collectEntityField(field, entity),
    };
  },
  [ResultErrorStatus.Unauthorized](field: string, entity?: string) {
    return {
      field,
      message: "Your session has expired or you're not signed in. Please sign in and try again.",
      entity: collectEntityField(field, entity),
    };
  },
  [ResultErrorStatus.Conflict](field: string, entity?: string) {
    return {
      field,
      message:
        "This item already exists or was changed by someone else. Refresh the page and try again.",
      entity: collectEntityField(field, entity),
    };
  },
  [ResultErrorStatus.Forbidden](field: string, entity?: string) {
    return {
      field,
      message:
        "You don't have permission to do this. If you think this is a mistake, please contact your administrator.",
      entity: collectEntityField(field, entity),
    };
  },
  [ResultErrorStatus.BadRequest](field: string, entity?: string) {
    return {
      field,
      message: "Some fields are missing or invalid. Please correct them and try again.",
      entity: collectEntityField(field, entity),
    };
  },
  [ResultErrorStatus.InternalServerError](field: string, entity?: string) {
    return {
      field,
      message:
        "An error occurred on our end. We're aware of the issue — please try again in a few moments.",
      entity: collectEntityField(field, entity),
    };
  },
};
