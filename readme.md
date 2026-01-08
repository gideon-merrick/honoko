# Honoko

A lightweight, type-safe backend framework built on top of Hono, designed for building modular REST APIs with built-in authentication, validation and standardized responses.

## Overview

This framework provides a structured approach to building backend applications using Hono, with a focus on:

- **Modularity**: Controller-based architecture for organizing routes
- **Type Safety**: Full TypeScript support with Zod validation
- **Authentication**: Built-in JWT authentication middleware
- **Standardized Responses**: Consistent success/error response formats
- **Database Integration**: Seamless Prisma ORM integration

## Core Architecture

### Type definitions (`types.ts`)

The framework uses TypeScript to ensure type safety across the application.

`CurrentUser` extends JWT payload with specific user information. This type defines what data is stored in the JWT token and accessible via `currentUser(c)`
```ts
export type CurrentUser = JWTPayload & {
  id: string;
  username: string;
  email: string;
};
```

`AppVariables` defines variables available with the Hono context throughout the application. Currently stores the authenticated user.
```ts
export type AppVariables = {
  currentUser: CurrentUser;
};
```

These types ensure that when you call `this.currentUser(c)` or `c.get("currentUser")`, TypeScript knows exactly what properties are available and enforces type checking across your entire application.

### App Class (`core/app.ts`):

The main application bootstraps your backend application.

```ts
import { App } from "./core/app";
import { AuthController } from "./modules/auth/controller";
import { TodosController } from "./modules/todos/controller";

const app = new App([
  new AuthController(),
  new TodosController()
]);

export default app.instance;
```

### Features:

- Automatic controller mounting
- Global error handling
- 404 route handling
- Request logging via Hono's logger middleware

### Response format:

```ts
// Success response
{ success: true, data: any }
// Error response
{ success: false, errors: { [field]: string[] } }
```

### Abstract Controller (`core/controller.ts`)

Base class for all controllers providing common functionnality.

## Building controllers

Controllers extend `AbstractController` and define routes for a specific resource or feature.

### Basic structure:

```ts
import { z } from "zod";
import { AbstractController } from "../../core/controller";

export class MyController extends AbstractController {
  public path = "/my-resource";
  private service = new MyService();
  private middleware = this.createAuthMiddleware();

  public schemas = {
    create: z.object({
      name: z.string().min(3),
    }),
  };

  public mount() {
    // Define routes here
  }
}
```

### Controller methods:

#### Response methods

`ok(c, data)` returns a successful response with status 200.
```ts
return this.ok(c, { user: userData });
// Response: { success: true, data: { user: userData } }
```

`fail(c, fields)` returns an error response with status 400.
```ts
return this.fail(c, { email: ["Email already in use"] });
// Response: { success: false, errors: { email: ["Email already in use"] } }
```

#### validation

`validateUsing(schema)` creates a validation middleware using Zod schemas.
```ts
this.router.post("/create", this.validateUsing(this.schemas.create), async (c) => {
    const data = c.req.valid("json"); // Type-safe validated data
    // ...
  }
);
```
Validation errors are automatically formatted and returned:
```json
{
  "success": false,
  "errors": {
    "email": ["Invalid email"],
    "password": ["String must contain at least 8 character(s)"]
  }
}
```

#### Authentication

`createAuthMiddleware()` creates JWT authentication middleware.
```ts
private middleware = this.createAuthMiddleware();

this.router.get("/protected", this.middleware, async (c) => {
  // Route is now protected
});
```
Request requirements: `Authorization: Bearer <token>`

`currentUser(c)` retrieves the authenticated user from context.
```ts
this.router.get("/me", this.middleware, async (c) => {
  const user = this.currentUser(c);
  return this.ok(c, user);
});
```

`generateToken(payload)` generates a JWT token with 7-day expiration.
```ts
const token = await this.generateToken({
  id: user.id,
  email: user.email,
  username: user.username,
});
```
The `JWT_SECRET="your-jwt-secret"` environment variable is required.

### Complete example: Authentication module

#### Controller (`modules/auth/controller.ts`)

```ts
import { z } from "zod";
import { AbstractController } from "../../core/controller";
import type { CurrentUser } from "../../types";
import { AuthService } from "./service";

export class AuthController extends AbstractController {
  public path = "/auth";
  private service = new AuthService();
  private middleware = this.createAuthMiddleware();

  public schemas = {
    login: z.object({
      email: z.email(),
      password: z.string().min(8),
    }),
    register: z.object({
      username: z.string().min(3).max(16),
      email: z.email(),
      password: z.string().min(8),
    }),
  };

  public mount() {
    // POST /auth/login
    this.router.post("/login", this.validateUsing(this.schemas.login), async (c) => {
      const { email, password } = c.req.valid("json");
      const user = await this.service.getWithEmail(email);
      
      if (!user) {
        return this.fail(c, { email: ["User not found"] });
      }
      
      const isValid = await Bun.password.verify(password, user.password);
      if (!isValid) {
        return this.fail(c, { password: ["Incorrect password"] });
      }
      
      const token = await this.generateToken<CurrentUser>({
        id: user.id,
        username: user.username,
        email: user.email,
      });
      
      return this.ok(c, { token });
    });

    // POST /auth/register
    this.router.post("/register", this.validateUsing(this.schemas.register), async (c) => {
      const { username, email, password } = c.req.valid("json");
      
      const existingUser = await this.service.getWithEmail(email);
      if (existingUser) {
        return this.fail(c, { email: ["Email already in use"] });
      }
      
      const hashedPassword = await Bun.password.hash(password);
      const user = await this.service.makeOne({
        username,
        email,
        password: hashedPassword
      });
      
      const token = await this.generateToken<CurrentUser>({
        id: user.id,
        email: user.email,
        username: user.username,
      });
      
      return this.ok(c, { token });
    });

    // GET /auth/me (protected route)
    this.router.get("/me", this.middleware, async (c) => {
      const currentUser = this.currentUser(c);
      return this.ok(c, currentUser);
    });
  }
}
```

#### Service (`modules/auth/service.ts`)
```ts
import { prisma } from "../../prisma";

export class AuthService {
  async getWithEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async makeOne(data: { username: string; email: string; password: string }) {
    return await prisma.user.create({ data });
  }
}
```

### Complete example: CRUD Module

#### Controller: (`modules/todo/controller.ts`)

```ts
import { z } from "zod";
import { AbstractController } from "../../core/controller";
import { TodosService } from "./service";

export class TodosController extends AbstractController {
  public path = "/todos";
  private service = new TodosService();
  private middleware = this.createAuthMiddleware();

  public schemas = {
    create: z.object({
      title: z.string().min(3).max(50),
      completed: z.boolean().optional(),
    }),
    update: z.object({
      title: z.string().min(3).max(50).optional(),
      completed: z.boolean().optional(),
    }),
  };

  public mount() {
    // GET /todos - List all todos for current user
    this.router.get("/", this.middleware, async (c) => {
      const result = await this.service.getAllFromUser(this.currentUser(c).id);
      return this.ok(c, result);
    });

    // GET /todos/:id - Get single todo
    this.router.get("/:id", this.middleware, async (c) => {
      const id = c.req.param("id");
      const result = await this.service.getOneFromUser(id, this.currentUser(c).id);
      return this.ok(c, result);
    });

    // POST /todos - Create new todo
    this.router.post("/", this.middleware, this.validateUsing(this.schemas.create), async (c) => {
      const data = c.req.valid("json");
      const result = await this.service.makeOne({
        ...data,
        userId: this.currentUser(c).id
      });
      return this.ok(c, result);
    });

    // PATCH /todos/:id - Update todo
    this.router.patch("/:id", this.middleware, this.validateUsing(this.schemas.update), async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const result = await this.service.updateOneFromUser(
        id,
        this.currentUser(c).id,
        data
      );
      return this.ok(c, result);
    });

    // DELETE /todos/:id - Delete todo
    this.router.delete("/:id", this.middleware, async (c) => {
      const id = c.req.param("id");
      const result = await this.service.deleteOneFromUser(id, this.currentUser(c).id);
      return this.ok(c, result);
    });

    // GET /todos/toggle/:id - Toggle completion status
    this.router.get("/toggle/:id", this.middleware, async (c) => {
      const id = c.req.param("id");
      const result = await this.service.toggleOneFromUser(id, this.currentUser(c).id);
      return this.ok(c, result);
    });
  }
}
```

#### Service (`modules/todos/service.ts`)

```ts
import { prisma } from "../../prisma";

export class TodosService {
  async getAllFromUser(userId: string) {
    return await prisma.todo.findMany({ where: { userId } }).catch(() => {
      throw new Error("Can't search for todos for this user right now");
    });
  }

  async getOneFromUser(id: string, userId: string) {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== userId) {
      throw new Error("Could not find todo for this user");
    }
    return todo;
  }

  async makeOne(data: { userId: string; title: string; completed?: boolean }) {
    return await prisma.todo.create({ data }).catch(() => {
      throw new Error("Could not create todo");
    });
  }

  async updateOneFromUser(
    id: string,
    userId: string,
    data: { title?: string; completed?: boolean }
  ) {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== userId) {
      throw new Error("Could not update todo for this user");
    }
    return await prisma.todo.update({ where: { id }, data });
  }

  async deleteOneFromUser(id: string, userId: string) {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== userId) {
      throw new Error("Could not delete todo for this user");
    }
    return await prisma.todo.delete({ where: { id } });
  }

  async toggleOneFromUser(id: string, userId: string) {
    const todo = await prisma.todo.findUnique({ where: { id, userId } }).catch(() => {
      throw new Error("Could not find the todo to toggle for this user");
    });
    if (!todo) throw new Error("This todo doesn't exist");
    
    return await prisma.todo.update({
      where: { id, userId },
      data: { completed: !todo.completed }
    }).catch(() => {
      throw new Error("Could not toggle the todo for this user");
    });
  }
}
```

## Project structure

```
src/
├── app.ts                    # Application entry point
├── prisma.ts                 # Prisma client instance
├── types.ts                  # Shared TypeScript types
├── core/
│   ├── app.ts               # App bootstrap class
│   └── controller.ts        # AbstractController base class
└── modules/
    ├── auth/
    │   ├── controller.ts    # Authentication routes
    │   └── service.ts       # Authentication business logic
    └── todos/
        ├── controller.ts    # Todo CRUD routes
        └── service.ts       # Todo business logic
```

## Best practices

### Controllers

- Keep controllers thin - delegate business logic to services
- Define all validation schemas in the `schemas` property
- Use meaningful route names and HTTP methods
- Always protect sensitive routes with authentication middleware
- Return consistent response formats using `ok()` and `fail()`

### Services

- Handle all database operations in services
- Implement proper error handling with descriptive messages
- Validate user ownership for user-specific resources
- Use try-catch blocks for database operations
- Keep services focused on a single resource or domain

### Validation

- Define strict Zod schemas for all inputs
- Use descriptive error messages
- Validate both required and optional fields
- Consider using `.optional()` for partial updateOneFromUser

### Authentication

- Store JWT secret in environment variables
- Hash passwords before storing
- Verify passwords
- Include necessary user data in JWT payload
- set appropriate JWT token expiration dates

## Getting started

1. Create a new module:
```
src/modules/your-module/
 - controller.ts
 - service.ts
```

2. Define your controller:
```ts
export class YourController extends AbstractController {
     public path = "/your-path";
     public mount() {
       // Define routes
     }
   }
```

3. Register in in `app.ts`
```ts
new App([
     new YourController()
   ]);
```

4. Start building your API!
