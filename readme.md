## DEV_PULSE

## Live URL 
### https://dev-pulse-issue-find.vercel.app


# Features

## 👥 User Roles & Permissions

### Contributor
#### Contributor can:
- Register and authenticate their accounts
- Create new issues (bug reports or feature requests)
- View all submitted issues

### Maintainer can:
#### Maintainers have all contributor privileges, plus the ability to:
- Update any issue details
- Delete issues
- Manage and change issue workflow statuses independently


---

## 🔐 Authentication & Authorization System

**JWT-Based Authentication Flow:**
+ The client submits login credentials
+ The server validates user information and verifies hashed passwords
+ A signed JWT token is generated and returned to the client
+ The client includes the token in the Authorization header for protected requests
+ The server verifies the token’s validity and expiration before processing the request

**Security Features :**
- Protected routes require a valid JWT token
- Role-based access control (RBAC) is enforced before privileged actions are executed
- Passwords are securely hashed before storage
- Unauthorized requests are rejected automatically

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


