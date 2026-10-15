# Bloggers

Backend-сервис для управления блогами и постами. Express + MongoDB + TypeScript.

## Стек

- Node.js, Express 5
- MongoDB (драйвер `mongodb@7`), `mongodb-memory-server` для тестов
- TypeScript, Zod (валидация)
- JWT и JWE (`jose`) — аутентификация, `argon2` — хеширование паролей
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
| `AUTH_LOGIN` / `AUTH_PASSWORD`           | Basic Auth для операций записи (create/update/delete) над блогами, постами и пользователями                                      |
| `MONGO_PATH` / `MONGO_DB_NAME`           | Подключение к локальной базе для разработки                                                                                      |
| `MONGO_PATH_PROD` / `MONGO_DB_NAME_PROD` | Продакшн-подключение (MongoDB Atlas). На проде (Vercel) задаётся через Environment Variables в панели проекта, а не через `.env` |
| `PEPPER`                                 | Секрет для хеширования паролей (argon2), 64 hex-символа (32 байта)                                                               |
| `JWT_SECRET`                             | Секрет для подписи JWT access-токена, base64url-строка (32 байта)                                                                |
| `JWE_KEYS`                               | Набор ключей для шифрования JWE-сессии вида `YYYY-MM:key,...` (поддержка ротации ключей по месяцам)                              |

### 3. Запустить в режиме разработки

```bash
pnpm dev
```

Локальный MongoDB (Docker-контейнер `bloggers-mongo`, см. `docker-compose.yml`) поднимается автоматически перед стартом сервера. Сервер поднимется на `http://localhost:3000`, подключаясь к `MONGO_PATH`.

## Документация API

Swagger UI доступен по адресу `{BASE_PATH}` (по умолчанию `http://localhost:3000/api/#`), JSON-спецификация — `{BASE_PATH}/swagger.json`.

### Основные маршруты

| Метод  | Путь                                     | Auth   | Описание                                            |
| ------ | ---------------------------------------- | ------ | --------------------------------------------------- |
| GET    | `/api/blogs`                             | —      | Список блогов                                       |
| GET    | `/api/blogs/:id`                         | —      | Блог по id                                          |
| GET    | `/api/blogs/:blogId/posts`               | —      | Список постов блога                                 |
| POST   | `/api/blogs/:blogId/posts`               | Basic  | Создать пост в блоге                                |
| POST   | `/api/blogs`                             | Basic  | Создать блог                                        |
| PUT    | `/api/blogs/:id`                         | Basic  | Обновить блог                                       |
| DELETE | `/api/blogs/:id`                         | Basic  | Удалить блог                                        |
| GET    | `/api/posts`                             | —      | Список постов                                       |
| GET    | `/api/posts/:id`                         | —      | Пост по id                                          |
| GET    | `/api/posts/:postId/comments`            | —      | Список комментариев к посту                         |
| POST   | `/api/posts/:postId/comments`            | Bearer | Добавить комментарий к посту                        |
| POST   | `/api/posts`                             | Basic  | Создать пост                                        |
| PUT    | `/api/posts/:id`                         | Basic  | Обновить пост                                       |
| DELETE | `/api/posts/:id`                         | Basic  | Удалить пост                                        |
| GET    | `/api/comments/:id`                      | —      | Комментарий по id                                   |
| PUT    | `/api/comments/:id`                      | Bearer | Обновить свой комментарий                           |
| DELETE | `/api/comments/:id`                      | Bearer | Удалить свой комментарий                            |
| GET    | `/api/users`                             | Basic  | Список пользователей (пагинация, поиск, сортировка) |
| POST   | `/api/users`                             | Basic  | Создать пользователя                                |
| DELETE | `/api/users/:id`                         | Basic  | Удалить пользователя                                |
| GET    | `/api/auth/me`                           | Bearer | Текущий пользователь (JWT)                          |
| GET    | `/api/auth/me/jwe`                       | Bearer | Текущий пользователь (JWE-сессия)                   |
| POST   | `/api/auth/login`                        | —      | Логин по login/email и паролю, выдаёт JWT           |
| POST   | `/api/auth/login/jwe`                    | —      | Логин по login/email и паролю, выдаёт JWE-токен     |
| POST   | `/api/auth/registration`                 | —      | Регистрация нового пользователя                     |
| POST   | `/api/auth/registration-confirmation`    | —      | Подтверждение регистрации по коду из письма         |
| POST   | `/api/auth/registration-email-resending` | —      | Повторная отправка письма с кодом подтверждения     |
| DELETE | `/api/testing/all-data`                  | —      | Очистить всю базу (только для тестов)               |

## Тесты

E2E-тесты используют `mongodb-memory-server` .

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

Поднять локальный тоннель cloudflared
`docker run --rm cloudflare/cloudflared:latest tunnel --no-autoupdate --url http://host.docker.internal:3000`
