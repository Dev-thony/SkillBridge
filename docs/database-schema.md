
# SkillBridge Database Schema

SkillBridge uses MongoDB with Mongoose.

## 1. User collection

Model: `User`

| Field | Type | Purpose |

|---|---|---|

| `_id` | ObjectId | User identifier |
| `name` | String | Required display name |
| `email` | String | Required, unique, lowercase |
| `password` | String | Bcrypt hash; excluded from normal queries |
| `bio` | String | Profile description |
| `title` | String | Professional title |
| `skills` | String array | User skills |
| `interests` | String array | Areas of interest |
| `links` | Object | Portfolio, GitHub, LinkedIn and X |
| `avatarUrl` | String | Hosted profile image URL |
| `profileCompleted` | Boolean | Profile completion state |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

### Security

- Passwords are hashed using bcrypt with 12 salt rounds.
- The password field has `select: false`.
- Email addresses are normalised to lowercase.
- Email has a unique index.

## 2. Project collection

Model: `Project`

| Field | Type | Purpose |

|---|---|---|

| `_id` | ObjectId | Project identifier |
| `owner` | ObjectId | Reference to User |
| `title` | String | Required project title |
| `shortDescription` | String | Required summary |
| `description` | String | Full description |
| `goals` | String array | Project objectives |
| `techStack` | String array | Technologies |
| `rolesNeeded` | Embedded documents | Role requirements |
| `members` | ObjectId array | References to User |
| `memberLimit` | Number | Maximum team size |
| `status` | String | open, full or closed |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

### Role subdocument

Each `rolesNeeded` entry contains:

| Field | Type | Purpose |

|---|---|---|

| `_id` | ObjectId | Stable role identifier |
| `role` | String | Role name |
| `skills` | String array | Skills required |
| `slots` | Number | Number of people required |
| `filled` | Number | Approved members assigned |

Role occupancy is updated during request approval, member removal and account deletion.

The owner is included in project membership and counts toward `memberLimit`. Role slots represent contributor positions.

### Project status

- `open`: accepts eligible join requests.
- `full`: maximum team membership reached.
- `closed`: owner has closed the project.

## 3. JoinRequest collection

Model: `JoinRequest`

| Field | Type | Purpose |

|---|---|---|

| `_id` | ObjectId | Request identifier |
| `project` | ObjectId | Reference to Project |
| `applicant` | ObjectId | Reference to User |
| `roleId` | ObjectId | Selected embedded project role |
| `roleName` | String | Role name snapshot |
| `message` | String | Applicant message |
| `matchedSkills` | String array | Optional matched skills |
| `status` | String | Request lifecycle state |
| `reviewedAt` | Date | Review/withdrawal timestamp |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

Allowed statuses:

- `pending`
- `approved`
- `declined`
- `withdrawn`

A partial unique compound index prevents duplicate pending requests for the same applicant and project.

## 4. Relationships

- A user can own many projects.
- A project belongs to one owner.
- A project can contain multiple members.
- A user can submit multiple join requests.
- A join request belongs to one project and one applicant.
- A join request can reference one selected project role.

## 5. Indexes

- Unique index on `User.email`.
- Index on `Project.owner`.
- Index on `Project.status`.
- Text index on project title, short description and technology stack.
- Indexes on `JoinRequest.project`, `JoinRequest.applicant` and `JoinRequest.status`.
- Partial unique index on pending project/applicant requests.

## 6. Account deletion

Deleting an account:

1. Finds projects owned by the user.
2. Finds projects where the user is a member.
3. Removes the user from other owners' projects.
4. Decreases the filled count for the user's assigned role.
5. Reopens projects that were full when capacity becomes available.
6. Deletes join requests submitted by the user.
7. Deletes join requests associated with projects owned by the user.
8. Deletes projects owned by the user.
9. Deletes the user.
10. Clears the authentication cookie.

These operations use a MongoDB transaction.

## 7. Data integrity rules

- A project cannot exceed its configured member limit.
- A role cannot exceed its configured slots.
- A role cannot be reduced below its existing assigned members.
- A project owner cannot approve their own join request.
- Only the project owner can review requests and remove members.
- Only the applicant can withdraw their pending request.
- Role identifiers should be preserved when project requirements are edited.

## 8. Storage boundaries

MongoDB stores user, project and join-request records.

Profile image binaries are not stored in MongoDB. Cloudinary hosts the images, while MongoDB stores the resulting `avatarUrl`.
