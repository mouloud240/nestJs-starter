# 🧪 NestJS Starter

A scalable, production-ready NestJS boilerplate with batteries included. This starter is built for teams and individuals who want a robust backend setup with Redis, Elasticsearch, WebSockets, and more.

---

## Status

This project is currently in active development. Most features should be done in a day or two. Contributions are welcome!

## 📖 Table of Contents

* [🚀 Features](#-features)
* [📂 Folder Structure](#-folder-structure)
* [🛠️ Setup & Run](#-setup--run)
* [🧪 Scripts](#-scripts)
* [📖 API Documentation](#-api-documentation)
* [📬 Mailer Setup](#-mailer-setup)
* [⚙️ Background Jobs](#-background-jobs)
* [🧠 Redis Usage](#-redis-usage)
* [🌐 WebSockets](#-websockets)
* [🔒 Security](#-security)
* [❤️ Health Checks](#-health-checks)
* [🐳 Docker Compose](#-docker-compose)
* [🚄 Fastify Support](#-fastify-support)
* [📦 License](#-license)
* [🤝 Contributing](#-contributing)
* [🧑‍💻 Author](#-author)
* [📬 Contact](#-contact)

## 🚀 Features

* ✅ **Modular Configuration**: Centralized config management via `.env` and `ConfigModule`.
* 🔐 **Authentication System**:

  * Passport.js integration
  * Built-in **JWT strategy**
  * Easily extendable to add OAuth, local, etc.
* 📦 **Elasticsearch**: Seamless integration for full-text search and analytics use-cases.
* 🧰 **Utility Functions**: Common helper functions to keep your code DRY and clean.
* 🧠 **Redis Integration** (via `ioredis`):

  * Caching layer
  * Pub/Sub support
  * Redis Streams support for message/event queues
* 🌐 **WebSocket Manager**:

  * Centralized gateway
  * **Redis adapter** for horizontal scaling
  * User connections registered for **1-to-1 messaging**
* 📬 **Mailing Module**: Easily plug in mailing services like SendGrid, Mailgun, or SMTP.
* 🛡️ **Security**:

  * CSRF protection (double-submit cookie strategy)
  * Secure headers via `Helmet`
  * **Rate Limiting** with `@nestjs/throttler`
* 📚 **API Documentation**:

  * Swagger auto-generated docs
  * Beautiful UI powered by **Scalar**
* 🎯 **Background Jobs**:

  * Bull Module with Redis backend
  * For tasks like email queues, notifications, etc.
* 🔁 **Health Checks**:

  * Exposed endpoint for service health & readiness using `@nestjs/terminus`
* 📦 **Docker Compose Ready**:

  * Includes services like Redis, Elasticsearch, and more
* 📑 **Request & Response Logging**:

  * Custom **interceptors** log HTTP traffic
  * Extendable for audit logging or debugging

---

## 📂 Folder Structure

```
src/
├── authentication/
│   ├── decorators/
│   ├── dtos/
│   ├── guards/
│   ├── strategies/
│   ├── types/
│   ├── authentication.controller.ts
│   ├── authentication.controller.spec.ts
│   ├── authentication.module.ts
│   └── authentication.service.ts
│
├── common/
│   ├── constants/
│   │   ├── jobs.ts
│   │   └── queues.ts
│   └── utils/
│       ├── authentication/
│       └── webSocket/
│           ├── index.ts
│           ├── json.utils.ts
│           ├── object.utils.ts
│           ├── query.utils.ts
│           └── result.util.ts
│
├── config/
├── redis/
├── user/
│
├── app.controller.ts
├── app.controller.spec.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

---

## 🛠️ Setup & Run

```bash
# Clone the repo
git clone https://github.com/your-org/nestjs-starter.git
cd nestjs-starter

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run the app
npm run start:dev
```

---

## 🧪 Scripts

| Script       | Description                   |
| ------------ | ----------------------------- |
| `start:dev`  | Start in development mode     |
| `start:prod` | Build and start in production |
| `test`       | Run unit tests                |
| `lint`       | Lint your codebase            |

---

## 📖 API Documentation

Swagger is auto-generated at runtime and available at:

```
http://localhost:3000/api-docs
```

Beautiful UI powered by [Scalar](https://github.com/sdorra/swagger-ui-scalar).

---

## 📬 Mailer Setup

Update your mailing provider details in the `.env` file:

```env
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=username
MAIL_PASS=securepassword
```

---

## ⚙️ Background Jobs

Jobs are processed using **Bull** and stored in Redis. Define jobs under `common/constants/` and register them in the job queues.

---

## 🧠 Redis Usage

You can use Redis for:

* Caching
* Pub/Sub (real-time messaging)
* Redis Streams (event queues)
* WebSocket scaling

Configured in `redis/` module.

---

## 🌐 WebSockets

Supports **single-user messaging** and **distributed WebSocket server** setup using Redis adapter. Define events in `common/utils/webSocket/`.

---

## 🔒 Security

This starter includes:

* Helmet for HTTP header protection
* Double CSRF strategy using cookie and token
* Rate limiting using `@nestjs/throttler`

---

## ❤️ Health Checks

* Powered by `@nestjs/terminus`
* Endpoint: `/health`
* Checks Redis, Elasticsearch, Database, etc.

---

## 🐳 Docker Compose

Use `docker-compose.yml` to spin up:

* Redis
* Elasticsearch
* (Add other services like Postgres, Mailhog, etc.)

---

## 🚄 Fastify Support

This project includes a `fastify` branch which provides the same feature set using NestJS with [Fastify](https://www.fastify.io/) instead of Express.

### 📘 How to Choose

Refer to [`CHOOSE.md`](CHOOSE.md) to decide whether to use the default (Express) or Fastify branch. It outlines:

* Pros and cons of each adapter
* Performance and ecosystem differences
* Compatibility notes

---

## 📦 License

MIT © 2025 Mouloud Hasrane

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.
**ps**: this folder will also include commits practices docuemnted here [COMMIT.md](COMMIT.md)

## 🧑‍💻 Author

Mouloud Hasrane

## 📬 Contact

If you have any questions or suggestions, feel free to reach out via: [mouloudhasrane@gmail.com](mailto:mouloudhasrane@gmail.com)
