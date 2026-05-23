## Project Name : DEV_PULSE

## Live URL : https://dev-pulse-issue-find.vercel.app


## Features

## 👥 User Roles & Permissions

| Role            | Allowed Actions                                                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **contributor** | • Register and log in<br>• Create new issues (bug or feature request)<br>• View all issues                                                                          |
| **maintainer**  | • All contributor permissions<br>• Update any issue field<br>• Delete any issue<br>• Change issue workflow status independently<br> |



---

## 🔐 Authentication & Authorization System

- **JWT Flow:** Client sends credentials → Server validates & hashes/compares → Server returns signed JWT → Client attaches token to `Authorization: <token>` header → Server verifies signature & expiry before processing.
- **Security:**
  - Protected endpoints reject requests without a valid JWT.
  - Role verification occurs before privileged operations.

---

## 🛠️ Technology Stack

| Technology   | Note                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| Node.js      | v24.15.0                                                                      |
| TypeScript   | Version 6.0.3                                                                 |
| Express.js   | Modular router architecture                                                   |
| PostgreSQL   | Relational database, native `pg` driver only                                  |
| Raw SQL      | Direct `pool.query()` calls |
| bcrypt       | Password hashing, salt rounds 10                                |
| jsonwebtoken | JWT generation & verification (standard tokens)                               |

---

## Setup Steps
**1. Clone The Repository** <br>

   `
   git clone https://github.com/riday-kumar/dev_pulse.git
   `
   <br>
   
**2. Move To Your Project Directory** <br>

`cd dev_pluse`
<br>

**3. Install All The Dependencies** <br>

`npm install`
<br>

**4. Create .env File** <br>
```
PORT=5000
CONNECTION_STRING=your_database_url
SECRET=your_secret_key

```
<br>

**5. Run The Project**<br>

`npm run dev`


## 🗄️ Database Schema Design

### Table 1: `users`

`id`| `name` | `email` | `password` | `role` | `created_at` | `updated_at`


### Table 2: `issues` <br>

`id` | `title` | `description` | `type` | `status` | `reporter_id` |  `created_at` | `updated_at`

---

## 🌐 API Endpoints Specification

### 🔹 Authentication Module

### 1. User Registration

**Access:** Public

**Endpoint**

`POST /api/auth/signup`

### 2. User Login

**Access:** Public

**Endpoint**

`POST /api/auth/login`

### 🔹 Issues Module

### 3. Create Issue

**Access:** Authenticated users (`contributor`, `maintainer`)

**Endpoint**

`POST /api/issues`

**Headers**

```
Authorization: <JWT_TOKEN>
```

### 4. Get All Issues

**Access:** Public

**Endpoint**

`GET /api/issues?sort=newest`

### 5. Get Single Issue

**Access:** Public

**Endpoint**

`GET /api/issues/:id`

### 6. Update Issue

**Access:** Maintainer (any issue) OR Contributor (own issue, only if status is `open`)

**Endpoint**

`PATCH /api/issues/:id`

**Headers**

```
Authorization: <JWT_TOKEN>
```

### 7. Delete Issue

**Access:** Maintainer only

**Endpoint**

`DELETE /api/issues/:id`

**Headers**

```
Authorization: <JWT_TOKEN>
```


