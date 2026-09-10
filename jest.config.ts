import type { Config } from "jest";

const config: Config = {
  // Пресет ts-jest — компилирует .ts файлы через реальный TypeScript-компилятор
  // и попутно проверяет типы прямо в тестах (в отличие от swc/babel-транспайлеров)
  preset: "ts-jest",

  // Окружение выполнения тестов — "node", т.к. это бэкенд без DOM (браузерных API)
  testEnvironment: "node",

  // Где искать корень проекта для тестов (обычно совпадает с расположением jest.config)
  rootDir: ".",

  // Паттерны файлов, которые Jest считает тестами
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],

  // Алиасы путей импорта в тестах — должны совпадать с "paths" в tsconfig.json
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Расширения файлов, которые Jest умеет разрешать при импорте без указания расширения
  moduleFileExtensions: ["ts", "js", "json", "node"],

  // Очищать состояние всех моков (jest.fn()) перед каждым тестом автоматически
  clearMocks: true,

  // Собирать отчёт о покрытии кода тестами
  collectCoverage: true,

  // В какую папку сохранять отчёт о покрытии (актуально при collectCoverage: true)
  // coverageDirectory: "coverage",

  // Из каких файлов собирать покрытие — весь src, кроме файлов с типами и точки входа
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/types/**"],

  // Провайдер инструментации для сбора покрытия — v8 быстрее и точнее, чем babel
  coverageProvider: "v8",

  // Выводить подробный результат по каждому тесту, а не только сводку
  verbose: true,
};

export default config;
