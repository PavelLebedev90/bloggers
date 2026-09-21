import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { errorMessage } from "../../utils/error-formatter/error-messages.formatter";
import { HttpStatus } from "../../types/http-statuses.type";
import { ValidationError } from "../../types/validation-error.type";

export const captureErrorValidation = (schema: z.ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sanitizedResult = await schema.parseAsync(
        {
          body: req.body,
          query: req.query,
          params: req.params,
          cookies: req.cookies,
        },
        {
          reportInput: true,
        },
      );

      req.body = sanitizedResult.body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages: Record<string, ValidationError> = error.issues.reduce(
          (acc, issue) => {
            const path = issue.path[issue.path.length - 1]?.toString() ?? "";
            if (!acc[path]) {
              acc[path] = {
                field: path,
                message: issue.message,
                //   input: issue.input,
              };
            }

            return acc;
          },
          {} as Record<string, ValidationError>,
        );
        errorMessage({
          res,
          httpStatus: HttpStatus.BadRequest,
          errors: Object.values(errorMessages),
        });
      } else {
        errorMessage({
          res,
          httpStatus: HttpStatus.InternalServerError,
          errors: [
            {
              field: "",
              message: "Internal Server Error",
            },
          ],
        });
      }
    }
  };
};
