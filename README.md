# 🛒 E-Commerce Backend API

A high-performance, asynchronous RESTful API built with **NestJS 11**, **Bun v1.3**, and **Prisma ORM v7** using the **LibSQL database adapter**. Architected with strict DTO validation, JWT authentication, and structured Pino logging.

---

## ⚡ Tech Stack & Tools

* **Runtime & Package Manager:** [Bun](https://bun.sh/) (v1.3.14)
* **Framework:** [NestJS](https://nestjs.com/) (v11)
* **Database & ORM:** [Prisma ORM](https://www.prisma.io/) (v7.8) with `@prisma/adapter-libsql` & `@libsql/client`
* **Authentication:** `@nestjs/jwt` & `bcrypt`
* **Logging:** [Pino](https://github.com/pinojs/pino) (`nestjs-pino`, `pino-http`, `pino-pretty`)
* **Validation & Transformation:** `class-validator` & `class-transformer`
* **Testing & Seeding:** `@faker-js/faker`, Jest

---

## ✨ Features

* **⚡ Bun-Native Engine:** Uses Bun's fast watcher (`bun --watch`) and native package execution.
* **🔒 Authentication:** Password hashing via `bcrypt` and stateless session verification with JWT.
* **🗄️ LibSQL Integration:** Configured with modern Prisma v7 drivers and LibSQL / Turso database support.
* **🔍 Clean Input Validation:** Global transformation pipe for URL queries, auto-converting strings to integers and sanitizing strings.
* **📊 Asynchronous Structured Logging:** High-speed, non-blocking JSON logging using Pino with formatted console output in development via `pino-pretty`.
* **🌱 Automated Database Seeding:** Integrated `@faker-js/faker` script for populating development environments.

---

## 🚀 Getting Started

### Prerequisites

* Ensure [Bun](https://bun.sh/) (v1.3.14 or higher) is installed globally.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:raxeraditya/ECommerceBackend.git
   cd ECommerceBackend
---

## 🏗️ High-Level Architecture

```text
┌──────────────┐      ┌─────────────────────────┐      ┌─────────────────┐
│              │      │     NestJS API Layer    │      │                 │
│  Client App  │ ───► │  - Auth / JWT Guards    │ ───► │   LibSQL / DB   │
│ (Next.js 16) │ ◄─── │  - Validation Pipes     │ ◄─── │   via Prisma    │
│              │      │  - Async Pino Logger    │      │                 │
└──────────────┘      └─────────────────────────┘      └─────────────────┘
