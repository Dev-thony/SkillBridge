
# SkillBridge API Contract

## 1. API configuration

Local base URL:

`http://localhost:5000/api`

Frontend environment variable:

`VITE_API_URL`

All request bodies use JSON except the direct Cloudinary image upload, which uses multipart FormData.

## 2. Authentication

Authentication uses an HTTP-only cookie named `skillbridge_session`.

- Token lifetime: 24 hours.
- Cookie: HTTP-only.
- Production: Secure HTTPS cookie.
- SameSite: Lax.
- Bearer authorization headers are also accepted by the authentication middleware.
- Registration and login are rate-limited.

### Register

`POST /auth/register`

Request:

```json
{
  "name": "Alex Builder",
  "email": "alex@example.com",
  "password": "SecurePass123!"
}
```

Success: `201`

Returns `data.user` and establishes an authentication cookie.

### Login

`POST /auth/login`

Request:

```json
{
  "email": "alex@example.com",
  "password": "SecurePass123!"
}
```

Success: `200`

Invalid credentials: `401`.

### Logout

`POST /auth/logout`

Success: `200`. Clears the authentication cookie.

### Current user

`GET /auth/me`

Authentication required.

Success: `200`.

Returns:

```json
{
  "data": {
    "user": {}
  }
}
```

## 3. User endpoints

| Method | Endpoint | Authentication | Purpose |

|---|---|---|---|

| GET | `/users/:id` | Public | Read a public user profile |
| PATCH | `/users/me` | Required | Update own profile |
| DELETE | `/users/me` | Required | Permanently delete own account |
| GET | `/users/me/requests` | Required | List own join requests |

Profile update fields:

- `name`
- `bio`
- `title`
- `skills`
- `interests`
- `links`
- `avatarUrl`
- `profileCompleted`

Profile links support `portfolio`, `github`, `linkedin`, and `x`.

Avatar uploads are handled by the frontend through the configured Cloudinary unsigned upload preset. The returned HTTPS URL is saved through `PATCH /users/me`.

Account deletion removes:

- The user account.
- Projects owned by the user.
- Join requests submitted by the user.
- Join requests belonging to projects owned by the user.
- Membership references in projects owned by other users.

## 4. Project endpoints

| Method | Endpoint | Authentication | Purpose |

|---|---|---|---|

| GET | `/projects` | Public | Browse projects |
| GET | `/projects/mine` | Required | List own projects |
| POST | `/projects` | Required | Create a project |
| GET | `/projects/:id` | Public | Read project details |
| PATCH | `/projects/:id` | Owner only | Update project |
| PATCH | `/projects/:id/close` | Owner only | Close project |
| DELETE | `/projects/:id` | Owner only | Delete a closed project |
| DELETE | `/projects/:id/members/:memberId` | Owner only | Remove a project member |

### Browse projects

`GET /projects`

Query parameters:

- `search`: matches project title and short description.
- `skill`: searches the project's technology stack.
- `status`: `open`, `full`, or `closed`.
- `page`: pagination page number.

Default page size: 20.

Closed projects are excluded by default.

### Create project

`POST /projects`

Request:

```json
{
  "title": "Collaborative Learning Platform",
  "shortDescription": "A platform for developers to learn together.",
  "description": "A longer project description.",
  "goals": ["Build the frontend", "Create the API"],
  "techStack": ["React", "Node.js"],
  "rolesNeeded": [
    {
      "role": "Frontend Developer",
      "skills": ["React", "CSS"],
      "slots": 2
    },
    {
      "role": "UI/UX Designer",
      "skills": ["Figma"],
      "slots": 1
    }
  ],
  "memberLimit": 5
}
```

The owner is automatically included in the project membership.

Project statuses:

- `open`
- `full`
- `closed`

### Update project

`PATCH /projects/:id`

Only the owner can update a project.

Supported fields are the project creation fields. Existing role occupancy is preserved when role names remain unchanged.

A role cannot be removed or reduced below its current assigned membership.

### Remove member

`DELETE /projects/:id/members/:memberId`

Only the owner can remove another member.

The owner cannot remove themselves through this endpoint.

Removing a member also decreases the associated role's filled count and reopens a project that was full.

## 5. Join-request endpoints

| Method | Endpoint | Authentication | Purpose |

|---|---|---|---|

| POST | `/projects/:id/requests` | Required | Submit a join request |
| GET | `/projects/:id/requests` | Owner only | View project requests |
| PATCH | `/requests/:requestId` | Required, owner checked | Approve or decline |
| PATCH | `/requests/:requestId/withdraw` | Required, applicant only | Withdraw own pending request |

### Submit request

`POST /projects/:id/requests`

Request:

```json
{
  "message": "I would like to contribute to this project.",
  "roleId": "MONGODB_ROLE_SUBDOCUMENT_ID"
}
```

`roleId` is required when the project has defined roles.

The applicant cannot:

- Apply to their own project.
- Apply to a full or closed project.
- Apply when already a member.
- Submit another pending request for the same project.

### Review request

`PATCH /requests/:requestId`

Request:

```json
{
  "status": "approved"
}
```

Allowed statuses: `approved` or `declined`.

Approval adds the applicant to the project and updates the corresponding role occupancy.

Membership and role capacity are checked during approval, not only during initial application.

### Withdraw request

`PATCH /requests/:requestId/withdraw`

Only the applicant can withdraw their own pending request.

## 6. Response and error conventions

Successful responses commonly use:

```json
{
  "data": {},
  "message": "Operation completed successfully."
}
```

Errors use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the submitted fields."
  }
}
```

| HTTP status | Meaning |

|---|---|

| 200 | Successful operation |
| 201 | Resource created |
| 400 | Invalid input |
| 401 | Authentication required or invalid |
| 403 | Authenticated user lacks permission |
| 404 | Resource not found |
| 409 | Conflicting operation |
| 429 | Rate limit exceeded |
| 503 | Database unavailable |
| 500 | Unexpected server error |

## 7. Security rules

- Password hashes are never returned.
- JWT secrets remain on the server.
- Ownership is verified by backend controllers.
- Authentication endpoints have a 10-request per 15-minute limit.
- General API requests have a 100-request per 15-minute limit.
- CORS uses configured frontend origins.
- Production cookies require HTTPS.
- Unexpected server errors must not expose stack traces or database credentials.

## 8. Transaction requirement

Join-request approval, member removal and account deletion use MongoDB transactions.

The MongoDB deployment must support transactions, such as MongoDB Atlas or a replica-set deployment.
