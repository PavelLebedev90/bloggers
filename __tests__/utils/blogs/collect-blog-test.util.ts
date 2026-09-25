import { BlogInputModel } from "../../../src/routers/blogs/types/blogs-input.type";

export const collectBlogToCreate = (): BlogInputModel => {
  return {
    name: "Код и Кофе",
    description:
      "Практические руководства по веб-разработке, архитектуре систем и карьере в ИТ. Пишем простым языком о сложных вещах.",
    websiteUrl: "https://code-and-coffee.com",
  };
};
