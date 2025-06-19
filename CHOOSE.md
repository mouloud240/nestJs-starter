# 🧭 Choosing Between Express and Fastify

This project provides two separate branches for the NestJS starter:

* `main` — Based on **Express** (default NestJS adapter)
* `fastify` — Based on **Fastify**, a high-performance alternative adapter

---

## ⚖️ Comparison Overview

| Feature                | Express (main)            | Fastify (fastify branch)        |
| ---------------------- | ------------------------- | ------------------------------- |
| **Performance**        | 🚶 Slower                 | 🏎️ Faster (great for APIs)     |
| **Maturity**           | ✅ Very stable             | 🚧 Still growing, stable core   |
| **Plugins/Ecosystem**  | 🧩 Massive plugin support | 📦 Smaller, but growing         |
| **TypeScript Support** | 🟡 Basic                  | 🟢 Rich typings out of the box  |
| **Swagger UI**         | ✅ Scalar (beautiful UI)   | ✅ Uses Swagger UI               |
| **Compatibility**      | 🧱 Widely supported       | 🔍 Some packages not compatible |
| **Learning Curve**     | 🟢 Low                    | 🟡 Slightly higher              |

---

## 🚀 Express (main branch)

Use this if:

* You want the most compatibility with existing NestJS ecosystem
* You prioritize documentation UI (Scalar)
* You need to use middleware-heavy libraries

🛠️ Swagger is powered by **Scalar UI**, providing a modern experience.

---

## ⚡ Fastify (fastify branch)

Use this if:

* You're building a high-performance API
* You want native JSON schema validation support
* You’re comfortable with slightly less plugin availability

🛠️ Swagger is powered by **standard Swagger UI** (no Scalar support).

---

## 📁 How to Switch

```bash
# Clone Fastify version
git clone -b fastify https://github.com/your-org/nestjs-starter.git

# Or switch inside the existing project
git fetch
git checkout fastify
```

> Both versions share the same folder structure, feature set, and environment setup.

---

## 📌 Recommendation

| Scenario                               | Recommended Adapter |
| -------------------------------------- | ------------------- |
| Full-stack app, standard backend needs | Express             |
| Microservices or blazing fast APIs     | Fastify             |
| Maximum ecosystem support              | Express             |
| Minimal resource usage/performance     | Fastify             |

---

Have feedback or suggestions? Feel free to open an issue!
