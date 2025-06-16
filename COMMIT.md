
# 📝 Commit Message Guide

This project follows the **Conventional Commits** standard. Clear and structured commit messages help with project readability, automation (like changelogs or versioning), and collaboration.

---

## ✅ Commit Format

```bash
<type>(optional-scope): <short summary>

[optional body]
[optional footer(s)]
```

---

## 🏷️ Commit Types

| Type       | Description                                                             |
| ---------- | ----------------------------------------------------------------------- |
| `feat`     | ✨ A new feature                                                         |
| `fix`      | 🐛 A bug fix                                                            |
| `chore`    | 🔧 Maintenance changes (build scripts, tools, dependencies)             |
| `docs`     | 📝 Documentation-only changes                                           |
| `style`    | 💅 Code style changes (white-space, formatting, etc — no logic changes) |
| `refactor` | ♻️ Code changes that neither fix a bug nor add a feature                |
| `perf`     | ⚡ Performance improvements                                              |
| `test`     | ✅ Adding or fixing tests                                                |
| `ci`       | 🤖 Changes to CI/CD configuration                                       |
| `build`    | 🏗️ Changes affecting the build system (e.g., webpack, Docker, etc.)    |
| `revert`   | ⏪ Reverts a previous commit                                             |

---

## 💡 Examples

```bash
feat(auth): add JWT refresh token logic

fix(redis): correct pub/sub channel typo

chore(deps): upgrade to NestJS 10.x

docs: update README with Redis setup info

refactor(ws): extract user socket manager into a service

style: format job constants file
```

---

## 🛠️ Tips

* Keep your commit titles under **72 characters**.
* Use imperative mood (`add` not `added` or `adds`).
* Squash commits if necessary to keep history clean.
* Use `BREAKING CHANGE:` footer if a commit introduces breaking behavior.

```bash
feat(config): restructure env loading for multi-env support

BREAKING CHANGE: Environment configs are now separated by folder.
```

---

For more details, check out [Conventional Commits](https://www.conventionalcommits.org/) 🌐
