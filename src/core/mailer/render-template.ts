import Handlebars from "handlebars";

const compiledTemplates = new Map<string, HandlebarsTemplateDelegate>();

export const renderTemplate = <T extends object>(source: string, context: T): string => {
  let template = compiledTemplates.get(source);
  if (!template) {
    template = Handlebars.compile(source);
    compiledTemplates.set(source, template);
  }
  return template(context);
};
