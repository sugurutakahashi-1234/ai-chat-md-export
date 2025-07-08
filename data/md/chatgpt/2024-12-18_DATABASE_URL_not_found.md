# DATABASE_URL not found

Date: 2024-12-18

---

## 👤 User
*2024-12-18 11:43:03*

$ npx prisma migrate dev --name init
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database

Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Environment variable not found: DATABASE_URL.
  --&gt;  prisma/schema.prisma:14
   | 
13 |   provider = "postgresql"
14 |   url      = env("DATABASE_URL")
   | 

Validation Error Count: 1
[Context: getConfig]

Prisma CLI Version : 6.1.0

---

## 🤖 Assistant
*2024-12-18 11:43:17*

The error indicates that the `DATABASE_URL` environment variable is not set, which is required for Prisma to connect to your PostgreSQL database.

### Steps to Fix the Issue

1. **Define the `DATABASE_URL` Environment Variable**
   - Set the `DATABASE_URL` variable in your environment with the correct connection string for your PostgreSQL database.
   - The format for a PostgreSQL connection string is:
     ```
     DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
     ```
     Example:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
     ```

2. **Set the Environment Variable**
   - If you are running this locally, add the variable to a `.env` file in your project root directory. Prisma automatically loads environment variables from a `.env` file.
     ```
     .env
     DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
     ```

   - If the `.env` file is already present, ensure it contains the correct `DATABASE_URL`.

3. **Verify the Connection**
   - Test the connection to your database using Prisma's introspection command:
     ```
     npx prisma db pull
     ```
   - This will confirm that Prisma can connect to your database.

4. **Run the Migration**
   - After setting the environment variable, retry the migration command:
     ```
     npx prisma migrate dev --name init
     ```

5. **Debugging Tips**
   - Ensure your PostgreSQL server is running and accessible.
   - Check the username, password, host, port, and database name in the connection string for accuracy.

Let me know if you encounter any further issues!

---
