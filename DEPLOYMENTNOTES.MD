📄 Backend Deployment & Troubleshooting Notes

1.  TS2307 / TS2339: Missing Module & Prisma Client Properties

    Error Log: Cannot find module '../generated/prisma/client' / Property 'user' does not exist on type 'PrismaService'.

    Root Cause: TypeScript tried to compile (tsc) before the Prisma Client was generated on the remote server.

    Solution: Run prisma generate prior to running the build command in package.json or netlify.toml:
    JSON

    "build": "bunx prisma generate && tsc"

2.  Netlify 404 "Page Not Found" on Express / NestJS Routes

    Error Log: Page not found ... entered a URL that doesn’t exist on this site.

    Root Cause: Netlify is designed for static site hosting / serverless functions. It tries to find static HTML files (/products.html) for incoming routes instead of running a long-running Node.js process.

    Solution: Switch persistent server backends (NestJS) to platforms designed for persistent processes (Render or Railway), OR use @vendia/serverless-express with a custom lambda handler and \_redirects configuration on Netlify.

3.  Missing DATABASE_URL during Prisma Build Step

    Error Log: PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL.

    Root Cause: During docker or containerized build steps, .env variables are deliberately omitted or unmounted for security, causing prisma generate to fail validation.

    Solution: Supply a fallback connection string directly in the build script:
    Bash

    DATABASE_URL="file:./dev.db" bunx prisma generate && bun run build

4.  Cannot find module '../generated/prisma/client' at Startup

    Error Log: error: Cannot find module '../generated/prisma/client' from '.../src/Prisma/prisma.service.ts'.

    Root Cause: The src/generated folder was included in .gitignore, so Render cloned the repo without it. Additionally, bun install alone was executed in the build phase without generating client assets.

    Solution: Trigger generation immediately before boot inside your "start" script:
    JSON

    "start": "bunx prisma generate && bun src/main.ts"

5.  Prisma 7 Missing Output Path Requirement

    Error Log: Error: An output path is required for the 'prisma-client' generator.

    Root Cause: Prisma 7 introduced breaking changes requiring explicit relative output paths when using custom output locations.

    Solution: Define the output property inside prisma/schema.prisma:
    Code snippet

    generator client {
    provider = "prisma-client"
    output = "../src/generated/prisma"
    }

6.  Application Exits Early (SIGTERM / Exit Code 0)

    Error Log: ==> Application exited early or script "start" was terminated by signal SIGTERM.

    Root Cause: Serverless boilerplate leftover from Vercel configurations (export default async function handler) skipped await app.listen() when NODE_ENV=production.

    Solution: Ensure src/main.ts directly initializes NestJS and binds to Render's dynamic port:
    TypeScript

    const port = parseInt(process.env.PORT ?? "3000", 10);
    await app.listen(port, "0.0.0.0");

7.  Extra Quotation Marks in Connection String (LibsqlError: URL_INVALID)

    Error Log: LibsqlError: URL_INVALID: The URL '"file:./dev.db"' is not in a valid format.

    Root Cause: Environmental configuration variables contained literal extra quotes (DATABASE_URL='"file:./dev.db"').

    Solution:

        Remove extra quotation marks from dashboard environment variable fields (file:./dev.db).

        Sanitize raw strings in prisma.service.ts:
        TypeScript

        const databaseUrl = rawDatabaseUrl?.replace(/^["']|["']$/g, "").trim() || "file:./dev.db";

8.  TS2724: Incorrect Adapter Class Casing

    Error Log: Module '"@prisma/adapter-libsql"' has no exported member named 'PrismaLibSQL'. Did you mean 'PrismaLibSql'?

    Root Cause: Incorrect casing on the class import from @prisma/adapter-libsql.

    Solution: Import using exact casing:
    TypeScript

    import { PrismaLibSql } from "@prisma/adapter-libsql";

9.  TS2345: Incompatible Client / Config Injection

    Error Log: Argument of type 'Client' is not assignable to parameter of type 'Config'.

    Root Cause: Passing an initialized Client object from @libsql/client into a PrismaLibSql adapter version expecting a raw options object.

    Solution: Pass the config object directly into new PrismaLibSql():
    TypeScript

    const adapter = new PrismaLibSql({ url: databaseUrl });
    export function createPrismaClient() {
    return new PrismaClient({ adapter });
    }
