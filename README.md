
# Guidelines

## Table of Contents
1. [Folder Structure](#folder-structure)
2. [File Naming Conventions](#file-naming-conventions)
3. [Code Style](#code-style)
4. [TypeScript Guidelines](#typescript-guidelines)
5. [Versioning](#versioning)
6. [Error Handling](#error-handling)
7. [Database Access](#database-access)
8. [Middleware](#middleware)
9. [Testing](#testing)

---

## Folder Structure

The folder structure should be organized as follows to ensure clarity and scalability:

```
src/
│
├── routes/
│   ├── v1/
│   │   ├── index.ts
│   │   ├── user.routes.ts
│   │   └── post.routes.ts
│   ├── v2/
│   │   ├── index.ts
│   │   ├── user.routes.ts
│   │   └── post.routes.ts
│
├── controllers/
│   ├── user.controller.ts
│   ├── post.controller.ts
│   └── index.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── index.ts
│
├── services/
│   ├── user.service.ts
│   ├── post.service.ts
│   └── index.ts
│
├── utils/
│   ├── logger.ts
│   ├── response.ts
│   └── validation.ts
│
├── prisma/
│   ├── client.ts
│   └── schema.prisma
│
├── app.ts
├── server.ts
└── tsconfig.json
```

- All main logic should be placed under `src/`, separating different concerns into **routes**, **controllers**, **middlewares**, **services**, and **utils**.

---

## File Naming Conventions

1. **Use kebab-case** for all file and folder names. Example:
   - `user.controller.ts`
   - `auth.middleware.ts`
   - `user.routes.ts`
   
2. **For routes versions**, create folders like `v1`, `v2` and maintain versioned files. Example:
   - `routes/v1/user.routes.ts`
   - `routes/v2/user.routes.ts`

3. **No abbreviations** in filenames unless they are widely understood (e.g., `auth`, `user`, `post`).

4. **Use descriptive names**: The filename should clearly state the purpose of the file. Example:
   - `post.controller.ts` (instead of just `post.ts`)
   - `user.service.ts` (instead of `service.ts`)

---

## Code Style

1. **Consistent indentation**: Use **2 spaces** per indentation level (no tabs).
2. **No trailing spaces**: Ensure there are no trailing spaces at the end of lines.
3. **No unused imports**: Always remove imports that are not used in the file.
4. **Single quotes for strings**: Use single quotes for strings wherever possible (`'` vs `"`).
5. **No console.log in production**: Use a logger utility for logging, and remove `console.log` statements.

Example:

```ts
import logger from './utils/logger';

// Avoid
console.log('User created');

// Correct way
logger.info('User created');
```

---

## TypeScript Guidelines

1. **Type Safety**: Always use types for function parameters and return values, avoid `any`. If `any` is necessary, comment why it's used.
   
   ```ts
   // Avoid
   function createUser(data: any) { ... }
   
   // Correct
   function createUser(data: CreateUserDto): User { ... }
   ```

2. **Explicit types** for variables: Always explicitly define types for variables where applicable.

3. **Use interfaces for data structures**: When defining complex types or object shapes, always use `interface` over `type` unless you need union types.
   
   ```ts
   interface CreateUserDto {
     name: string;
     email: string;
   }
   ```

4. **Strict mode**: Enable TypeScript strict mode in `tsconfig.json` to catch potential issues early.

---

## Versioning

1. **Versioning API**: When adding a new feature that could potentially break backward compatibility, create a new version of the API under `routes/v2/` or higher.
   
   - Example: `user.routes.ts` becomes `v1.user.routes.ts` and the new version is placed under `v2/` as `v2.user.routes.ts`.

2. **Avoid breaking changes**: Always deprecate an endpoint gracefully and document the deprecation before removing it in the future version.

---

## Error Handling

1. **Centralized Error Handling**: All errors should be handled in a centralized way using a middleware.

   - Example:

     ```ts
     import { Request, Response, NextFunction } from 'express';

     function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
       res.status(err.status || 500).json({
         message: err.message || 'Internal Server Error',
       });
     }

     export default errorHandler;
     ```

2. **Throwing Errors**: In controllers, throw custom errors instead of using generic ones like `Error`.

   Example:
   ```ts
   class NotFoundError extends Error {
     constructor(message: string) {
       super(message);
       this.name = 'NotFoundError';
     }
   }

   throw new NotFoundError('User not found');
   ```

---

## Database Access

1. **Use Prisma ORM**: Always use Prisma for accessing the database, never raw SQL queries unless absolutely necessary.
   
2. **Separation of concerns**: Access to the database should only be done in the `services` folder, not directly in controllers or routes.
   
3. **Avoid N+1 queries**: Use Prisma's `include` or `select` clauses to optimize queries.

---

## Middleware

1. **Authentication and Authorization**: Place all authentication logic inside a middleware. Example:

   ```ts
   // auth.middleware.ts
   import { Request, Response, NextFunction } from 'express';

   const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
     const token = req.headers['authorization'];
     if (!token) {
       return res.status(401).json({ message: 'Unauthorized' });
     }
     // verify token logic
     next();
   };
   ```

2. **Error Handling Middleware**: Use a global error handling middleware at the end of your middleware stack.

---

## Testing

1. **Write Unit Tests**: Always write tests for your service layer. Use **Jest** or **Mocha** for testing.

2. **Test Coverage**: Ensure that tests cover at least 90% of your codebase, especially the business logic in the services.

3. **Test for Edge Cases**: Always test for edge cases (e.g., empty input, invalid data types, etc.).

Example test:

```ts
import { createUser } from './user.service';

test('should create a new user', () => {
  const newUser = createUser({ name: 'John', email: 'john@example.com' });
  expect(newUser.name).toBe('John');
});
```

---

## Conclusion

By following these guidelines, we ensure a consistent, scalable, and easy-to-understand codebase for both new and existing developers. Keep in mind that these rules help improve the overall developer experience, enhance maintainability, and ensure smoother collaboration within teams.
