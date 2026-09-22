# Bloggers

Backend-сервис для управления блогами и постами. Express + MongoDB + TypeScript.

## Стек

- Node.js, Express 5
- MongoDB (драйвер `mongodb@6`)
- TypeScript, Zod (валидация)
- Jest + Supertest (e2e-тесты)
- Swagger (OpenAPI-документация)

## Требования

- Node.js ≥ 20.19
- pnpm 10
- Docker (для локального MongoDB)

## Быстрый старт

### 1. Установить зависимости

```bash
pnpm install
```

### 2. Настроить переменные окружения

Скопировать `.env.example` в `.env` и заполнить значения:

```bash
cp .env.example .env
```

| Переменная                               | Назначение                                                                                                                       |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `BASE_PATH`                              | Префикс всех маршрутов API (например, `/api`)                                                                                    |
| `AUTH_LOGIN` / `AUTH_PASSWORD`           | Basic Auth для операций записи (create/update/delete)                                                                            |
| `MONGO_PATH_DEV` / `MONGO_DB_NAME_DEV`   | Подключение к локальной базе для разработки                                                                                      |
| `MONGO_PATH_TEST` / `MONGO_DB_NAME_TEST` | Отдельная база для e2e-тестов (в том же локальном MongoDB)                                                                       |
| `MONGO_PATH_PROD` / `MONGO_DB_NAME_PROD` | Продакшн-подключение (MongoDB Atlas). На проде (Vercel) задаётся через Environment Variables в панели проекта, а не через `.env` |

### 3. Запустить в режиме разработки

```bash
pnpm dev
```

Локальный MongoDB (Docker-контейнер `bloggers-mongo`, см. `docker-compose.yml`) поднимается автоматически перед стартом сервера и перед прогоном тестов. Сервер поднимется на `http://localhost:3000`, подключаясь к `MONGO_PATH_DEV`.

## Документация API

Swagger UI доступен по адресу `{BASE_PATH}` (по умолчанию `http://localhost:3000/api/#`), JSON-спецификация — `{BASE_PATH}/swagger.json`.

### Основные маршруты

| Метод  | Путь                    | Auth  | Описание                              |
| ------ | ----------------------- | ----- | ------------------------------------- |
| GET    | `/api/blogs`            | —     | Список блогов                         |
| GET    | `/api/blogs/:id`        | —     | Блог по id                            |
| POST   | `/api/blogs`            | Basic | Создать блог                          |
| PUT    | `/api/blogs/:id`        | Basic | Обновить блог                         |
| DELETE | `/api/blogs/:id`        | Basic | Удалить блог                          |
| GET    | `/api/posts`            | —     | Список постов                         |
| GET    | `/api/posts/:id`        | —     | Пост по id                            |
| POST   | `/api/posts`            | Basic | Создать пост                          |
| PUT    | `/api/posts/:id`        | Basic | Обновить пост                         |
| DELETE | `/api/posts/:id`        | Basic | Удалить пост                          |
| DELETE | `/api/testing/all-data` | —     | Очистить всю базу (только для тестов) |

## Тесты

E2E-тесты используют отдельную базу `MONGO_PATH_TEST` в том же локальном MongoDB — dev-данные не затрагиваются.

```bash
pnpm test
```

## Прочие команды

```bash
pnpm typecheck    # проверка типов
pnpm lint         # eslint
pnpm format       # форматирование prettier
pnpm build        # сборка в dist/
pnpm start        # запуск собранной версии (NODE_ENV=production)
```
