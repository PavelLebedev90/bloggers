import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { setupApp } from "./setup-app";

const app = express();
setupApp(app);

// На Vercel файл импортируется как serverless-функция (см. vercel.json) — там нет
// долгоживущего процесса и app.listen не нужен, платформа сама вызывает экспортированный app.
// Локально (pnpm dev / node dist/index.js) файл запускается напрямую — тогда поднимаем сервер как обычно.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log("Server is running");
  });
}

module.exports = app;
