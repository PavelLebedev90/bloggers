import { BlogCreateModel } from "../../../src/routers/blogs/types/blogs-input.type";

export const collectBlogToCreate = (): BlogCreateModel => {
  return {
    name: "Код и Кофе | Блог о разработке",
    description:
      "Практические руководства по веб-разработке, архитектуре систем и карьере в ИТ. Пишем простым языком о сложных вещах.",
    websiteUrl: "https://code-and-coffee.com",
  };
};
