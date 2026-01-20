# Project Context & Coding Conventions

This file defines the coding standards, architectural guidelines, and preferred patterns for this workspace. All code generated or reviewed must adhere to these rules.

## 1. Core Principles (The "North Star")
- **Clarity over Cleverness**: Write code that is easy to read and understand. Avoid obscure one-liners unless performance critically demands it.
- **Minimalism**: Adhere to YAGNI (You Aren't Gonna Need It). Do not over-engineer solutions for hypothetical future problems.
- **Security First**: Never hardcode secrets. Always validate inputs. Sanitize data at boundaries.
- **Functional & Stateless**: Prefer pure functions and immutable data structures where possible to reduce side effects.

## 2. Language-Specific Guidelines

### 🐍 Python (Backend & AI)
- **Style**: Follow PEP 8 strictly. Use `Black` formatting conventions.
- **Typing**: **Mandatory Type Hinting**. Use the `typing` module (List, Dict, Optional, Union) for all function arguments and return values.
  - *Good*: `def process_data(data: Dict[str, Any]) -> List[str]:`
  - *Bad*: `def process_data(data):`
- **Docstrings**: Use **Google Style** docstrings. Every public function/method must describe Args, Returns, and Raises.
- **Async**: Prefer `async/await` patterns for I/O bound operations over threading.
- **Environment**: Use `pydantic` for environment variable and configuration management.

### 📱 Swift (iOS)
- **Architecture**: MVVM-C (Model-View-ViewModel-Coordinator) or clean SwiftUI architecture.
- **Concurrency**: Use Swift Concurrency (`async`/`await`) over Closures/GCD where possible.
- **Optionals**: Avoid Force Unwrapping (`!`). Use `guard let` or `if let` for safe unwrapping.
- **Naming**: Follow API Design Guidelines.
  - Protocols should describe capability (e.g., `Movable`, `NetworkRequesting`).
  - Variables should be clear and concise (e.g., `userProfile` vs `data`).

### 🌐 TypeScript / JavaScript (Frontend & Node)
- **Strictness**: `noImplicitAny` must be enabled. Do not use `any` unless absolutely necessary; use `unknown` or specific interfaces instead.
- **Immutability**: Prefer `const` over `let`. Never use `var`.
- **Async**: Always handle Promise rejections. Use `try/catch` blocks inside async functions.
- **React (if applicable)**:
  - Use Functional Components with Hooks.
  - Avoid Prop Drilling; use Context or State Management for deep trees.

## 3. General Architecture & Structure
- **Folder Structure**: Feature-based grouping is preferred over Type-based grouping.
  - *Good*: `src/features/auth/` (contains controller, service, model)
  - *Bad*: `src/controllers/`, `src/models/` (separated by technical layer)
- **Error Handling**:
  - Define custom error classes for domain-specific errors.
  - Never swallow errors silently. Log them with context.

## 4. Documentation & Commits
- **Code Comments**: Explain *WHY*, not *WHAT*. The code shows what it does; the comment should explain the business logic or complexity.
- **Commit Messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/).
  - Format: `<type>(<scope>): <description>`
  - Example: `feat(auth): implement JWT token refresh logic`
  - Example: `fix(ios): resolve keychain data migration issue`

## 5. Testing
- **Unit Tests**: Business logic must have 80%+ coverage.
- **Mocks**: Mock external services (APIs, Databases) in unit tests.
- **Naming**: Test files should mirror source files (e.g., `UserService.ts` -> `UserService.test.ts`).

---
**Note to AI**: When reviewing code, reference this file. If code violates these principles, list it under "Opportunities" in your feedback.