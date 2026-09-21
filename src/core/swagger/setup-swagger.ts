import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bloggers API",
      version: "1.0.0",
      description: "Bloggers API documentation",
    },
  },
  apis: ["./src/**/*.swagger.yml"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.get("/api/swagger.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  app.use(
    "/api",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css",
      customJs: [
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-standalone-preset.min.js",
      ],
      swaggerOptions: {
        url: "/api/swagger.json", // явно указываем откуда брать spec
      },
    }),
  );
};
