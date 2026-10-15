export const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const loginRegex = /^[a-zA-Z0-9_-]*$/;

export const websiteUrlRegex =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const pepperRegex = /^[0-9a-fA-F]{64}$/;

export const JWTRegex = /^[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/;
