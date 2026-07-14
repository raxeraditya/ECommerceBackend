# 🛒 E-Commerce Backend API

A high-performance, modular RESTful e-commerce API built with **Bun**, **TypeScript**, **NestJS**, and **Prisma ORM**. Engineered with production-ready practices including structured Pino logging, type-safe validation, and JWT authentication.

---

## ⚡ Tech Stack

* **Runtime:** [Bun](https://bun.sh/)
* **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
* **Database & ORM:** PostgreSQL / MySQL + [Prisma ORM](https://www.prisma.io/)
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt
* **Logging:** [Pino Logger](https://github.com/pinojs/pino) (`nestjs-pino`)
* **Validation:** `class-validator` & `class-transformer`

---

## ✨ Features

* **Authentication & Authorization:** Secure user registration, password hashing, and JWT-based authentication.
* **Product Management:** Efficient database query pagination, search filtering, and sorted listings.
* **User Engagement:** Like and bookmark products with idempotent toggle operations.
* **Structured Logging:** Asynchronous, non-blocking JSON logging using Pino for development and production telemetry.
* **Type Safety:** Strict DTO validation with automatic runtime type casting for query parameters.

---

## 🚀 Getting Started

### Prerequisites

* [Bun](https://bun.sh/) installed locally
* PostgreSQL / MySQL database running

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:raxeraditya/ECommerceBackend.git
   cd ECommerceBackend
