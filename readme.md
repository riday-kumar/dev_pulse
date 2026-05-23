## Project Name : DEV_PULSE

## Live URL : https://dev-pulse-issue-find.vercel.app

---

## 👥 User Roles & Permissions

| Role            | Allowed Actions                                                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **contributor** | • Register and log in<br>• Create new issues (bug or feature request)<br>• View all issues                                                                          |
| **maintainer**  | • All contributor permissions<br>• Update any issue field<br>• Delete any issue<br>• Change issue workflow status independently<br>• Access internal system metrics |

---

---

## 🔐 Authentication & Authorization System

- **JWT Flow:** Client sends credentials → Server validates & hashes/compares → Server returns signed JWT → Client attaches token to `Authorization: <token>` header → Server verifies signature & expiry before processing.
- **Security:**
  - Passwords are never exposed in responses or logs.
  - Protected endpoints reject requests without a valid JWT.
  - Role verification occurs before privileged operations.

---

---

## 🛠️ Technology Stack

| Technology   | Note                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| Node.js      | v24.15.0                                                                      |
| TypeScript   | Version 6.0.3                                                                 |
| Express.js   | Modular router architecture                                                   |
| PostgreSQL   | Relational database, native `pg` driver only                                  |
| Raw SQL      | Direct `pool.query()` calls, absolutely no query builders, ORMs, or SQL JOINs |
| bcrypt       | Password hashing, salt rounds between 8 and 12                                |
| jsonwebtoken | JWT generation & verification (standard tokens)                               |

---

## 🗄️ Database Schema Design

### Table 1: `users`

| Field        | Requirement (Plain Text)                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------- |
| `id`         | Auto-incrementing unique identifier for each account                                                |
| `name`       | Full display name of the team member, must be provided                                              |
| `email`      | Valid login address, must be unique across all accounts, must be provided                           |
| `password`   | Encrypted string stored securely, must be provided during registration, never returned in responses |
| `role`       | Determines system access level, defaults to `contributor`, must be `contributor` or `maintainer`    |
| `created_at` | Timestamp marking when the account was created, automatically generated on insert                   |
| `updated_at` | Timestamp marking when the account was last updated, automatically refreshed on update              |

### Table 2: `issues`

| Field         | Requirement (Plain Text)                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| `id`          | Auto-incrementing unique identifier for each reported item                                                      |
| `title`       | Short descriptive headline, must be provided, maximum 150 characters                                            |
| `description` | Detailed explanation of the problem or suggestion, must be provided, minimum 20 characters                      |
| `type`        | Categorizes the entry, must be either `bug` or `feature_request`                                                |
| `status`      | Current workflow state, defaults to `open`. Status must be one of: `open`, `in_progress`, `resolved`            |
| `reporter_id` | References the user who submitted the issue (no foreign key constraint required; validate in application logic) |
| `created_at`  | Timestamp marking when the issue was created, automatically generated on insert                                 |
| `updated_at`  | Timestamp marking when the issue was last updated, automatically refreshed on update                            |

---

## 🌐 API Endpoints Specification

### 🔹 Authentication Module

### 1. User Registration

**Access:** Public

**Description:** Register a new user account with contributor or maintainer role

**Endpoint**

`POST /api/auth/signup`

### 2. User Login

**Access:** Public

**Description:** Authenticate user and receive JWT token

**Endpoint**

`POST /api/auth/login`

### 🔹 Issues Module

### 3. Create Issue

**Access:** Authenticated users (`contributor`, `maintainer`)

**Description:** Create a new bug report or feature request

**Endpoint**

`POST /api/issues`

**Headers**

```
Authorization: <JWT_TOKEN>
```

### 4. Get All Issues

**Access:** Public

**Description:** Retrieve all issues with optional sorting and filtering

**Endpoint**

`GET /api/issues?sort=newest`

### 5. Get Single Issue

**Access:** Public

**Description:** Retrieve full details of a specific issue

**Endpoint**

`GET /api/issues/:id`

### 6. Update Issue

**Access:** Maintainer (any issue) OR Contributor (own issue, only if status is `open`)

**Description:** Update issue title, description, or type

**Endpoint**

`PATCH /api/issues/:id`

**Headers**

```
Authorization: <JWT_TOKEN>
```

### 7. Delete Issue

**Access:** Maintainer only

**Description:** Permanently remove an issue from the system

**Endpoint**

`DELETE /api/issues/:id`

**Headers**

```
Authorization: <JWT_TOKEN>
```

**HTTP Status Codes**

| Code  | Reason Phrase         | Usage                                                  |
| ----- | --------------------- | ------------------------------------------------------ |
| `200` | OK                    | Successful GET, PATCH, PUT, DELETE                     |
| `201` | Created               | Successful POST (resource created)                     |
| `204` | No Content            | Successful DELETE with no response body                |
| `400` | Bad Request           | Validation errors, invalid input, duplicate resource   |
| `401` | Unauthorized          | Missing, expired, or invalid JWT token                 |
| `403` | Forbidden             | Valid token but insufficient role/permissions          |
| `404` | Not Found             | Requested resource does not exist                      |
| `409` | Conflict              | Business logic conflict (e.g., editing resolved issue) |
| `500` | Internal Server Error | Unexpected server or database error                    |

---
