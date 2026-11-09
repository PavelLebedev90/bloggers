declare global {
  namespace Express {
    interface Request {
      validData: {
        body: any;
        query: any;
        params: any;
        cookies: any;
      };
      userSession: any;
    }
  }
}

export {};
