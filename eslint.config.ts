import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
// import js from "@eslint/js"; // Базовые правила самого ESLint (js.configs.recommended) — рекомендуемый набор для обычного JS без TS
// import globals from "globals"; // Готовые наборы глобальных переменных окружений (browser, node, jest и т.д.) для languageOptions.globals

export default defineConfig([
  // globalIgnores(["dist", "coverage", "node_modules"]), // Глобальные игнор-паттерны — применяются ко всем объектам конфига, аналог старого .eslintignore

  {
    // ===== Область действия конфига =====
    files: ["src/**/*.ts"], // Какие файлы обрабатывает этот блок конфига (glob-паттерны)
    // ignores: ["**/*.d.ts"], // Какие файлы исключить именно из этого блока конфига (не глобально)

    // ===== Настройки языка (Language Options) =====
    languageOptions: {
      parser: tsParser, // Парсер, превращающий исходный код в AST — здесь TS-парсер вместо встроенного Espree
      parserOptions: {
        project: "./tsconfig.json", // Путь к tsconfig — включает typed-правила (нужен доступ к TypeChecker для проверки типов, а не только синтаксиса)
        // tsconfigRootDir: __dirname, // Базовая директория для разрешения относительного пути в project (полезно в монорепо)
        // sourceType: "module", // Тип модуля исходников — "module" (import/export) | "commonjs" | "script"
        // ecmaFeatures: { jsx: false }, // Дополнительные синтаксические фичи парсера (JSX и т.п.) — не нужны в бэкенде без React
      },
      // ecmaVersion: "latest", // Версия ECMAScript синтаксиса, которую понимает парсер (обычно берётся из parserOptions у TS-парсера)
      // globals: { ...globals.node }, // Глобальные переменные окружения (process, __dirname и т.д.) — нужно при использовании встроенного парсера без TS
      // parserOptions: { ecmaVersion: 2023 }, // (пример) явное указание версии ES для обычного JS-парсера
    },

    // ===== Настройки линтера (Linter Options) =====
    linterOptions: {
      reportUnusedDisableDirectives: "error", // Считать ошибкой лишние (ничего не подавляющие) комментарии eslint-disable
      noInlineConfig: true, // Запретить/разрешить комментарии вида eslint-disable прямо в коде файлов
    },

    // ===== Плагины =====
    plugins: {
      // @ts-expect-error — типы @typescript-eslint/eslint-plugin ещё не синхронизированы с типами eslint@10 (RuleContext/RuleDefinition расходятся), при этом в рантайме плагин работает корректно
      "@typescript-eslint": tsPlugin, // Плагин с TS-специфичными правилами (no-unused-vars с учётом типов, no-explicit-any и т.д.)
      prettier: prettierPlugin, // Плагин, который гоняет Prettier как ESLint-правило и репортит расхождения форматирования как ошибки линта
    },

    // ===== Правила =====
    rules: {
      ...tsPlugin.configs.recommended.rules, // Базовый рекомендуемый набор правил от @typescript-eslint (без typed-check, т.е. без анализа типов)
      // ...tsPlugin.configs["recommended-type-checked"].rules, // Более строгий набор — включает typed-правила (требует parserOptions.project, работает медленнее)
      // ...tsPlugin.configs.strict.rules, // Ещё более строгий набор сверх recommended (стилевые и потенциально спорные проверки)
      ...prettierConfig.rules, // Отключает все правила ESLint, конфликтующие с Prettier (форматирование должно решаться только Prettier'ом)
      "prettier/prettier": "error", // Несоответствие Prettier-форматированию считать ошибкой ESLint (а не только warning при `prettier --check`)
    },

    // ===== Прочие настройки блока конфига =====
    // settings: {}, // Общие настройки, доступные всем правилам и плагинам через context.settings (например alias-резолвер для import-плагина)
    // processor: "some-plugin/processor-name", // Препроцессор для файлов не-JS/TS формата (например .vue, .md) — извлекает JS-блоки для линтинга
  },

  // ===== Дополнительные блоки конфигурации (примеры) =====
  // {
  //   files: ["**/*.test.ts", "**/__tests__/**/*.ts"],
  //   languageOptions: { globals: { ...globals.jest } }, // Глобальные переменные Jest (describe, it, expect) для тестовых файлов
  //   rules: { "@typescript-eslint/no-explicit-any": "off" }, // Точечное ослабление правил только для тестов
  // },
  // js.configs.recommended, // Пример подключения готового пресета конфигурации целиком как отдельного элемента массива
]);
