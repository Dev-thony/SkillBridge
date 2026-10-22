# SkillBridge — 7-Day Full-Stack Implementation Plan

> **Product:** SkillBridge  
> **Tagline:** Build projects together. Gain real-world experience.  
> **Team:** 4 developers  
> **Timebox:** 7 days  
> **Primary goal:** Deliver a usable MVP that helps developers and designers discover projects and request to join teams.  
> **Rule:** Ship the smallest complete product before adding optional features.

---

## 1. Product overview

### Problem statement

Beginner developers, designers, and aspiring founders often have skills or project ideas but struggle to find collaborators with complementary skills. Project owners also lack a simple way to publish opportunities, receive join requests, and organise their initial team.

### Target users

- Beginner and intermediate developers
- UI/UX and graphic designers
- Students and self-taught learners
- Hackathon participants and aspiring founders
- Owners of small collaborative projects

### Proposed solution

SkillBridge is a web application where users can create a profile, list a project and the roles they need, discover projects by keyword or skill, and send a request to join. Project owners can review, approve, or decline requests.

### MVP success criteria

By the end of Day 7, a demo user must be able to:

1. Register or sign in.
2. Create and edit a basic developer profile.
3. Create a project with a description, tech stack, needed skills/roles, and member limit.
4. Browse, search, and filter open projects.
5. Open a project detail page.
6. Send one join request to a project that is open and not owned by that user.
7. See the request as pending.
8. Approve or decline requests as the project owner.
9. See approved members reflected in the project.
10. Use the deployed app on a mobile-sized screen.

**Out of scope for the one-week MVP:** real-time chat, payments, AI matching, Kanban boards, karma/reputation scores, complex social feeds, and mobile apps.

---

## 2. Recommended technology stack

The team knows JavaScript, React, MongoDB, HTML, and CSS. Keep the stack familiar.

### Frontend

- **React + Vite** — frontend app and development server.
- **React Router** — page navigation.
- **CSS Modules or plain CSS** — choose one approach and use it consistently. Tailwind is optional, not required.
- **Fetch API** — HTTP requests to the backend.
- **Lucide React** — optional icons.

### Backend recommendation

Use **Node.js + Express.js + Mongoose**.

- **Node.js:** runs JavaScript on the server.
- **Express.js:** defines API routes and middleware.
- **Mongoose:** schemas, validation, and MongoDB queries.
- **MongoDB Atlas Free cluster:** hosted database for development/demo.
- **Zod** (optional): request validation. If the team is new to it, use clear validation functions first.
- **bcryptjs:** password hashing if using custom email/password authentication.
- **jsonwebtoken:** short-lived access tokens if using custom authentication.
- **helmet, cors, express-rate-limit:** baseline API security and request controls.
- **dotenv:** local environment variables.
- **nodemon:** backend auto-restart during development.

**Authentication choice:** For a one-week MVP, choose one approach and do not mix systems:
- **Simplest custom backend route:** Express + bcryptjs + JWT. Store password hashes only, never plain-text passwords. Keep JWT secrets server-side.
- **Alternative:** Supabase Auth, with backend verification of Supabase-issued tokens. This is viable but adds integration work. If the team has not used it before, use custom auth for this MVP or postpone social login.

### Database

Use MongoDB Atlas for application data. Suggested collections:

- `users`
- `projects`
- `joinrequests`
- `notifications` (only if time allows; otherwise implement a simple notification list from request events or leave notifications for Phase 2)

MongoDB Atlas Free clusters are suitable for a small prototype but have storage and throughput limits. Keep demo data small and never store secrets in the database.

### Deployment

- **Frontend:** Vercel Hobby for the React/Vite frontend.
- **Backend:** Prefer deploying the Express API as Vercel Functions if the team is comfortable with serverless routing. Otherwise choose a free backend host whose current terms support your use case. Confirm current free-tier limits before deployment; free hosting plans can change.
- **Database:** MongoDB Atlas.
- **Images:** For MVP, use generated initials/avatar colours or a profile image URL. If uploads are essential, add a free image-storage provider only after the core flow works.

**Important:** Vercel Hobby is primarily intended for personal/non-commercial projects. Review its current terms and limits before using it for a commercial product. Do not assume every third-party service will remain free forever.

### What about Supabase?

Supabase is useful for hosted PostgreSQL, Auth, and Storage, but the chosen primary database is MongoDB. Using Supabase Auth together with MongoDB is possible, but it introduces a second identity service and token-verification work. For the one-week MVP:

- Keep MongoDB as the main application database.
- Do not add Supabase unless the team specifically chooses Supabase Auth or Storage and assigns an owner to integrate it.
- Do not duplicate the same application records in Supabase and MongoDB.

### What about “Sendliberty”?

Confirm the exact product name, URL, and purpose with the teammate who suggested it. Do not add an unverified email provider to the critical path. Email notifications are **not required** for the MVP. If email becomes necessary, evaluate a free-tier transactional email service such as Resend or Brevo, verify its current sending limits and domain requirements, and keep API keys on the server only.

---

## 3. MVP features and priorities

### P0 — Must ship

| Feature | Acceptance criteria |
|---|---|
| Sign up / sign in | User can create an account and sign in; invalid credentials show a clear error. |
| Profile | User can edit name, bio, role/title, skills, and portfolio links. |
| Create project | Authenticated user can create a project with title, description, tech stack, roles/skills needed, and capacity. |
| Browse projects | Visitors or signed-in users can view project cards. |
| Search/filter | Keyword search and one or more skill filters work. |
| Project details | Details page shows owner, goals, tech stack, needed roles, current members, and remaining capacity. |
| Join request | Eligible user can submit one request with a short message. |
| Owner request management | Owner can approve or decline pending requests. |
| Membership update | Approving a request adds the user as a member and updates capacity. |
| Responsive UI | Core pages work on mobile and desktop widths. |
| Deployment | A working deployed URL is available for the demo. |

### P1 — Only if P0 is stable

- In-app notification dropdown
- Profile avatar upload
- GitHub/Google social login
- Pagination
- Sort by newest
- Basic owner dashboard

### P2 — Post-MVP

- In-app messaging or team chat
- Kanban task board
- Project showcase/portfolio wall
- Peer reviews or karma
- AI-based matching
- Email notifications
- Admin moderation dashboard

---

## 4. Four-person team allocation

Replace the role labels with your actual names on Day 1.

### Developer 1 — Frontend and design-system integration

**Owns:** React shell, reusable UI, landing page, browse/search pages, project cards, responsive styling.

**Folders:**
- `client/src/components/`
- `client/src/pages/LandingPage.jsx`
- `client/src/pages/ExplorePage.jsx`
- `client/src/pages/ProjectDetailsPage.jsx`
- `client/src/styles/`
- `client/src/assets/`

**Deliverables:**
- Responsive navigation and footer
- Buttons, inputs, badges, skill chips, project cards
- Landing and Explore pages
- Loading, empty, and error states
- Integration with API functions supplied by Developer 2

**Do not:** hardcode fake success responses in the final app. Use mock data only while developing the UI and label it clearly.

### Developer 2 — Backend and API lead (the strongest backend-capable developer)

**Owns:** Express server, authentication, authorisation, Mongoose models, API contracts, deployment of API.

**Folders:**
- `server/src/config/`
- `server/src/models/`
- `server/src/controllers/`
- `server/src/routes/`
- `server/src/middleware/`
- `server/src/utils/`
- `server/src/app.js`
- `server/src/server.js`

**Deliverables:**
- API skeleton and health endpoint
- User registration/login and protected routes
- Project CRUD and search/filter endpoints
- Join-request create/approve/decline endpoints
- Validation and consistent error responses
- Environment-variable documentation
- Backend deployment

**Pairing requirement:** Spend 20–30 minutes daily showing the other developers the API contract, how to run the server, and how to test one endpoint. Avoid becoming a single point of failure.

### Developer 3 — Database, frontend auth/profile, and integration

**Owns:** MongoDB schema review, sample seed data, authentication UI, profile pages, API integration support.

**Folders:**
- `server/src/models/` (coordinate changes with Developer 2; do not edit the same model independently)
- `server/src/seed/`
- `client/src/pages/LoginPage.jsx`
- `client/src/pages/RegisterPage.jsx`
- `client/src/pages/ProfilePage.jsx`
- `client/src/pages/EditProfilePage.jsx`
- `client/src/services/`
- `client/src/context/`

**Deliverables:**
- Agreed data model and sample records
- Login/register/profile UI
- API client module and loading/error handling
- Integration test checklist
- Confirm user profile updates persist after refresh

**Coordination:** Developer 2 owns backend model implementation; Developer 3 reviews and tests data shape. One person must be the final editor of each shared file.

### Developer 4 — Project creation, owner dashboard, QA, and release

**Owns:** Create-project form, owner dashboard, join-request management UI, testing, release checklist, demo preparation.

**Folders:**
- `client/src/pages/CreateProjectPage.jsx`
- `client/src/pages/OwnerDashboardPage.jsx`
- `client/src/components/JoinRequestCard.jsx`
- `client/src/components/ProjectForm.jsx`
- `client/src/tests/` (or the agreed test location)
- `docs/`

**Deliverables:**
- Create/edit project forms
- Pending requests with approve/decline controls
- Member list and capacity display
- Manual QA checklist and bug tracking
- README updates, screenshots, and demo script
- Verify deployed app on phone and desktop

**Shared responsibility:** Developer 4 should contribute to implementation, not only documentation. Pair with Developer 2 when API integration needs help.

---

## 5. Repository and folder structure

Use one GitHub repository with separate frontend and backend folders (a small monorepo).

```text
skillbridge/
├── README.md
├── .gitignore
├── .editorconfig
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
├── docs/
│   ├── product-scope.md
│   ├── api-contract.md
│   ├── database-schema.md
│   ├── user-flows.md
│   ├── qa-checklist.md
│   └── demo-script.md
├── client/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── ProjectCard.jsx
│       │   ├── SkillTag.jsx
│       │   ├── StatusBadge.jsx
│       │   └── JoinRequestCard.jsx
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── ExplorePage.jsx
│       │   ├── ProjectDetailsPage.jsx
│       │   ├── CreateProjectPage.jsx
│       │   ├── OwnerDashboardPage.jsx
│       │   ├── ProfilePage.jsx
│       │   └── EditProfilePage.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── projectService.js
│       │   └── requestService.js
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
└── server/
    ├── package.json
    ├── .env.example
    └── src/
        ├── config/
        │   └── db.js
        ├── controllers/
        ├── middleware/
        ├── models/
        │   ├── User.js
        │   ├── Project.js
        │   └── JoinRequest.js
        ├── routes/
        │   ├── auth.routes.js
        │   ├── users.routes.js
        │   ├── projects.routes.js
        │   └── requests.routes.js
        ├── seed/
        ├── utils/
        ├── app.js
        └── server.js
```

Keep each component focused. Do not create a separate file for every tiny line of JSX, and do not put the entire app into one component.

---

## 6. Database design (initial version)

### User

```js
{
  _id,
  name,                 // required
  email,                // required, unique, normalised to lowercase
  passwordHash,         // never return this from API responses
  bio,
  title,                // e.g. Frontend Developer, UI/UX Designer
  skills: [String],
  links: {
    portfolio,
    github,
    linkedin,
    x
  },
  avatarUrl,
  createdAt,
  updatedAt
}
```

### Project

```js
{
  _id,
  owner: ObjectId,      // reference to User
  title,                // required
  shortDescription,     // required
  description,
  goals: [String],
  techStack: [String],
  rolesNeeded: [{
    role: String,
    skills: [String],
    slots: Number,
    filled: Number
  }],
  members: [ObjectId],  // owner may be included consistently by design
  memberLimit: Number,
  status: "open" | "full" | "closed",
  createdAt,
  updatedAt
}
```

### JoinRequest

```js
{
  _id,
  project: ObjectId,
  applicant: ObjectId,
  message: String,
  matchedSkills: [String],
  status: "pending" | "approved" | "declined" | "withdrawn",
  reviewedAt,
  createdAt,
  updatedAt
}
```

### Database rules

- Add a unique index for `User.email`.
- Prevent duplicate active requests for the same applicant/project pair. A compound unique index can work if the data model is designed for it; otherwise enforce it carefully in the service layer.
- Only the project owner can approve or decline a request.
- A user cannot approve their own request or request to join their own project.
- Do not allow approval if the project is closed or full.
- Approval must not exceed the member limit. Use a transaction where supported, or an atomic conditional update to avoid two approvals filling the last slot simultaneously.
- Return only public profile fields to other users.
- Never accept `owner`, `members`, or request `status` blindly from the client. Derive privileged values on the server.
- Validate all IDs, strings, array sizes, and URLs.
- Use consistent timestamps and status enums.

For the one-week MVP, role-slot counts can be simplified if implementing role-level capacity creates too much complexity. Project-level member capacity is the minimum requirement.

---

## 7. API contract

Prefix all endpoints with `/api`.

### Health

- `GET /api/health` — returns `{ "status": "ok" }`.

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users

- `GET /api/users/:id`
- `PATCH /api/users/me`

### Projects

- `GET /api/projects?search=&skill=&status=open&page=1`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id` — owner only; consider soft-closing instead of deleting.

### Join requests

- `POST /api/projects/:id/requests`
- `GET /api/projects/:id/requests` — project owner only
- `PATCH /api/requests/:requestId` — body status must be `approved` or `declined`; owner permission required.
- `GET /api/users/me/requests` — applicant's own requests.

### API response convention

Success:

```json
{
  "data": {},
  "message": "Optional human-readable message"
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the submitted fields"
  }
}
```

Use suitable HTTP statuses: `200`, `201`, `400`, `401`, `403`, `404`, `409`, and `500`. Never send stack traces, password hashes, JWT secrets, or database connection strings to the browser.

---

## 8. GitHub collaboration rules

### Branch strategy

- `main` — deployable, protected branch.
- `feat/<short-name>` — feature branches.
- `fix/<short-name>` — bug fixes.
- `docs/<short-name>` — documentation.

Examples:
- `feat/project-cards`
- `feat/auth-api`
- `feat/join-request-review`
- `fix/project-capacity`

### Daily workflow

1. Pull the latest `main`.
2. Create a branch for one small task.
3. Work only in the agreed folders/files.
4. Run the app and relevant checks locally.
5. Commit with a clear message.
6. Push and open a Pull Request (PR).
7. Ask one teammate to review it.
8. Resolve feedback, merge, and pull the latest `main`.

### Commit examples

```text
feat: add project browse cards
feat: implement project creation endpoint
fix: prevent duplicate join requests
docs: add API contract
test: cover project capacity rules
```

### Team rules

- No direct pushes to `main`.
- No committing `.env` files, passwords, API keys, database URLs, or access tokens.
- Commit `.env.example` with placeholder values only.
- One PR should solve one coherent task.
- Agree on shared filenames and API shapes before parallel implementation.
- Do not rewrite another developer's branch without discussing it.
- Merge small PRs early instead of saving all changes for Day 6.
- Use GitHub Issues or Projects to assign tasks and track status.
- If blocked for more than 30–45 minutes, ask for help and describe what you tried.

---

## 9. Free development tools

Free tiers and usage limits can change. Check the current terms when setting up accounts; do not enter payment details unless the team explicitly agrees.

### Core tools

| Tool | Purpose | Setup |
|---|---|---|
| Visual Studio Code | Code editor | Install VS Code and the extensions below. |
| Git | Version control | Install Git; set name/email with `git config --global`. |
| GitHub | Repository, Issues, PRs | Create one shared repository and invite all four developers. |
| Node.js LTS + npm | Run React and Express | Install the current LTS release from the official Node.js site. |
| MongoDB Atlas | Hosted MongoDB | Create a free cluster, database user, and allow-list the required development/deployment network. Avoid broad network access if possible. |
| Vercel | Frontend deployment and previews | Import the GitHub repository and configure the client root directory/build settings. |
| Figma Starter | UI design and prototype | Use the free Starter plan; AI credits are limited, so generate foundations and essential screens first. |
| GitHub Projects / Issues | Task board | Create one issue per deliverable and assign an owner. |
| Postman or Bruno | API testing | Save a collection of requests and share it with the team. |
| ESLint + Prettier | Code quality and formatting | Add to the React and backend projects if time permits. |
| Chrome DevTools | Debugging responsive UI and API calls | Use browser dev tools and test a mobile viewport. |

### Free AI tools to consider

1. **GitHub Copilot Free** — VS Code completions and limited chat/agent usage. Sign in with GitHub, install the official extension, and review the currently available quota. Do not expect unlimited use.
2. **ChatGPT Free** — use it for explaining errors, planning components, reviewing small snippets, generating test cases, and understanding code. Usage limits apply.
3. **Figma AI on Starter** — use for initial design exploration and selected screen generation. Free AI credits are limited; do not spend them generating every tiny variation.
4. **Local AI coding tools (optional)** — only add one if a team member already has a model/runtime working locally. Installing a large model on a low-spec laptop can consume disk, RAM, and time; it is not required for this sprint.

**AI usage rules:**
- Never paste `.env`, credentials, private user data, or production database content into AI tools.
- Ask AI to explain generated code, not merely dump large files.
- Review every diff and test it. AI output is not automatically secure or correct.
- Ask for small, file-scoped changes with acceptance criteria.
- Do not let two AI tools rewrite the same files simultaneously.
- Keep a human owner responsible for every merged change.

### VS Code extension setup

Install from the VS Code Extensions view:

- ESLint
- Prettier - Code formatter
- GitHub Pull Requests and Issues (optional)
- GitHub Copilot (optional)
- MongoDB for VS Code (optional)
- REST Client (optional; Postman/Bruno is an alternative)

Create `.vscode/extensions.json` if the team wants to recommend extensions. Avoid adding many extensions just because they exist.

### Initial setup commands

Install Node.js LTS and Git first. Then run:

```bash
# 1. Clone the shared repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd skillbridge

# 2. Create the React app
npm create vite@latest client -- --template react
cd client
npm install
npm install react-router-dom
cd ..

# 3. Create the Express backend
mkdir server
cd server
npm init -y
npm install express mongoose dotenv cors helmet express-rate-limit bcryptjs jsonwebtoken
npm install --save-dev nodemon
cd ..
```

Add the backend scripts in `server/package.json`:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

Create the folders in the structure above and commit the scaffold before splitting feature work. If the Vite command reports that a directory already exists, stop and inspect it rather than overwriting someone's files.

### Environment variables

`server/.env.example`:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
```

Create a local `server/.env` from this example and fill in your own values. Never commit it.

`client/.env.example`:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```

For Vite, only variables prefixed with `VITE_` are exposed to browser code. **Never put secrets in `VITE_` variables.** Configure production environment variables in the deployment provider dashboard.

### Basic Git setup

```bash
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"

git checkout -b feat/project-scaffold
git add .
git commit -m "chore: initialise SkillBridge scaffold"
git push -u origin feat/project-scaffold
```

Replace placeholders with the real repository URL and your own Git identity.

---

## 10. Seven-day execution plan

### Day 1 — Scope, design, and contracts

**Everyone**
- Agree on P0 scope and explicitly reject scope creep.
- Create GitHub repository, Issues/Projects, branches, and team permissions.
- Review the Figma design and agree on component names, page routes, colours, and spacing.
- Agree on API endpoints and database fields in `docs/api-contract.md` and `docs/database-schema.md`.

**Developer 1:** build React shell, navigation, shared styles, component skeletons.  
**Developer 2:** initialise Express, MongoDB connection, health endpoint, error middleware.  
**Developer 3:** define sample data, review user/profile schema, set up API service conventions.  
**Developer 4:** create QA checklist, project form wireframe, issues and release checklist.

**Day 1 exit condition:** Everyone can run their part locally; API and data contracts are written down.

### Day 2 — Foundation and authentication

**Developer 1:** landing page, navigation, button/input/card components.  
**Developer 2:** registration/login/me endpoints, password hashing, auth middleware.  
**Developer 3:** login/register/profile UI and API client.  
**Developer 4:** create-project form UI and first manual test cases.

**Day 2 exit condition:** A user can register and sign in in the development environment, or any auth blocker is identified with a clear owner and fallback.

### Day 3 — Profiles and project creation

**Developer 1:** Explore page layout and project cards.  
**Developer 2:** project schema, create/list/detail endpoints, owner-only update/delete rules.  
**Developer 3:** profile read/edit integration, seed data.  
**Developer 4:** connect create-project form and test project validation.

**Day 3 exit condition:** A signed-in user can create a project and see it persisted in the database.

### Day 4 — Discovery and details

**Developer 1:** connect project cards, search and skill filters, details page.  
**Developer 2:** search/filter queries, project capacity rules, request endpoints.  
**Developer 3:** integrate Explore and details API calls; handle loading and errors.  
**Developer 4:** build owner dashboard and request cards.

**Day 4 exit condition:** Users can browse real database projects and open details; the join-request workflow can be tested end-to-end.

### Day 5 — Join requests and membership

**Developer 1:** polish pending/approved/declined states and empty states.  
**Developer 2:** implement duplicate-request protection, owner authorization, capacity-safe approval.  
**Developer 3:** show a user's submitted requests and current projects.  
**Developer 4:** connect approve/decline UI, run end-to-end test cases, log bugs.

**Day 5 exit condition:** Owner can approve/decline a request; only approved members count toward capacity.

### Day 6 — Integration, security, and deployment

**Everyone**
- Merge feature branches through PRs.
- Test registration, project creation, discovery, request, approval, decline, and full-project cases.
- Fix critical bugs before visual polish.
- Configure production environment variables and deploy.
- Test on a phone and desktop browser.

**Day 6 exit condition:** A deployed end-to-end happy path works without manual database edits.

### Day 7 — Stabilise and present

- Freeze features; only fix bugs.
- Verify that secrets are absent from Git history and client bundles.
- Test error states, invalid forms, expired/invalid login, permissions, duplicate requests, and project capacity.
- Add README screenshots and setup steps.
- Prepare a 3–5 minute demo and a short presentation.
- Record known limitations and next steps.

**Day 7 exit condition:** Each teammate can explain their contribution, the architecture, one challenge, and what the team would improve next.

---

## 11. Quality and security checklist

- [ ] Passwords are hashed, never stored in plain text.
- [ ] Secrets are in environment variables, never committed.
- [ ] Backend validates all request bodies and route parameters.
- [ ] Protected routes authenticate the user.
- [ ] Ownership is checked on the backend, not just hidden in the UI.
- [ ] API responses never expose password hashes or private tokens.
- [ ] Duplicate join requests are blocked.
- [ ] A project cannot exceed its member limit.
- [ ] CORS allows only the intended frontend origins in production.
- [ ] Login and other sensitive endpoints have rate limiting.
- [ ] Empty/loading/error states are present.
- [ ] All core pages work at a mobile viewport.
- [ ] Deployment environment variables are configured correctly.
- [ ] Demo data contains no real private user information.

---

## 12. Demo script

1. Open the deployed SkillBridge landing page and explain the value proposition.
2. Register as a project owner.
3. Create a project that needs a frontend developer and a designer.
4. Sign in as a second demo user.
5. Complete the profile and add skills.
6. Browse projects and filter by a skill.
7. Open the project and request to join with a short message.
8. Return to the owner account and approve the request.
9. Show the updated project member list and capacity.
10. Explain what is in the MVP and what is planned for Phase 2.

Use fictional demo accounts and data. Never show credentials or API keys in a presentation.

---

## 13. Post-MVP roadmap

### Phase 2
- Email notifications
- GitHub/Google sign-in
- Profile image uploads
- Saved projects and pagination
- More complete notification centre
- Basic project task board

### Phase 3
- Project chat
- Portfolio showcase
- Peer feedback
- Skill-based recommendations
- Admin moderation and reporting

### Product principle

Build trust through clear profiles, transparent project requirements, owner-controlled requests, and reliable status updates. Do not add a scoring or reputation system until there is a fair, abuse-resistant design for it.

---

## 14. Team agreement

Before work starts, each developer should confirm:

- [ ] I understand my deliverables and folder ownership.
- [ ] I will push small, reviewable pull requests.
- [ ] I will not commit secrets.
- [ ] I will tell the team early when blocked.
- [ ] I will test my changes before requesting review.
- [ ] I will help with integration, not only my assigned feature.
- [ ] I will prioritise the MVP over optional features.

**Final reminder:** One complete workflow that works is more valuable than ten half-built screens.


---

## 15. Figma AI agent prompt — SkillBridge design system and MVP prototype

**How to use:** Open a new Figma Design file, open the Figma AI agent available on your plan, and paste the prompt below. Figma Starter has limited AI credits, so generate the design foundations and core screens first. If the agent cannot complete the entire brief in one pass, ask it to finish one section at a time using the follow-up prompts below.

### Main prompt

```text
Act as a senior product designer, UX researcher, and design-system specialist. Design a polished, realistic, responsive web application called SkillBridge.

PRODUCT PURPOSE
SkillBridge helps beginner and intermediate developers, UI/UX designers, students, and aspiring founders find collaborators for real projects. Project owners publish projects, specify skills and roles needed, review join requests, and approve or decline contributors.

PRODUCT VALUE PROPOSITION
“Build projects together. Gain real-world experience.”

DESIGN GOALS
- Developer-friendly, modern, trustworthy, clear, and welcoming.
- Prioritise usability and clarity over visual effects.
- Make it look like a credible early-stage technology product, not a crypto trading dashboard.
- Use a consistent component system, spacing, type scale, colours, radii, and states.
- Use Auto Layout and reusable components/variants wherever possible.
- Use realistic sample content and clear hierarchy.
- Do not invent complex features outside the MVP.
- Design both desktop (1440 px wide) and mobile (390 px wide) versions for the key responsive screens.
- Keep layouts feasible to implement with React, HTML, and CSS in one week.
- Use accessible contrast, readable text, visible focus states, and clear button labels.
- Avoid excessive gradients, glassmorphism, tiny text, unnecessary animation, and oversized empty hero sections.

BRAND IDENTITY
Create a simple, memorable SkillBridge logo and app icon based on a bridge, connected nodes, or two paths joining. The mark should be geometric, clean, and readable at small sizes. Include a wordmark “SkillBridge”. Avoid overly detailed illustrations.

Use this initial colour direction and document the final chosen hex values:
- Primary: deep indigo/blue, approximately #4F46E5
- Dark text/background accent: #111827
- Main light background: #F8FAFC
- Card background: #FFFFFF
- Borders: #E2E8F0
- Muted text: #64748B
- Success/approved: #15803D
- Pending/requested: #B45309
- Rejected/closed/full: #B91C1C
- Frontend skill tag: blue
- Backend skill tag: violet
- Design skill tag: pink
- Mobile skill tag: teal
Use accessible contrast and do not rely on colour alone to communicate status.

TYPOGRAPHY
Use a legible modern sans-serif such as Inter. Establish and show a type scale for page titles, section headings, card titles, body text, helper text, labels, and metadata. Use a restrained monospace accent only for code/tech-stack labels if useful.

DESIGN SYSTEM PAGE
Create a “Foundations & Components” page containing:
1. Logo, app icon, and clear-space examples.
2. Colour tokens with names and hex codes.
3. Typography hierarchy with sizes, weights, and line heights.
4. Spacing scale, border radii, shadows, and layout/container guidance.
5. Buttons: primary, secondary, ghost, disabled, and danger; default, hover, focus, and loading states where useful.
6. Inputs: text field, password field, textarea, search bar, dropdown, multi-select skill picker, checkbox, and validation/error states.
7. Cards: project card, developer profile card, role-needed row, team member row.
8. Skill tags and status badges: open, pending, approved, declined, full, closed.
9. Avatars, avatar groups, navigation items, tabs, dropdown menus, modal, confirmation dialog, toast, alert, skeleton/loading state, empty state, and error state.
10. A responsive navigation pattern for desktop and mobile.

CORE SCREENS
Create a clearly named page/frame for every screen below. Reuse components from the design system.

A. Landing page
- Top navigation with logo, Explore Projects, Sign In, and Create Profile.
- Hero headline: “Build projects together. Gain real-world experience.”
- Supporting copy explaining that users can find collaborators by skills and project needs.
- Primary CTA: “Browse Projects”.
- Secondary CTA: “Create Profile”.
- A concise “How it works” section with three steps: Create your profile, Discover a project, Build together.
- A small featured-project preview section and a trustworthy footer.
- Do not use fake statistics or unverified testimonials.

B. Sign up and sign in
- Simple forms with email and password.
- Include clear validation, loading, and error states.
- Show GitHub/Google sign-in buttons only as optional visual placeholders; the MVP may ship with email/password only.
- Include links between sign-in and sign-up.

C. Profile setup and edit profile
- Avatar or initials fallback.
- Full name, role/title, short bio, skills multi-select, portfolio URL, GitHub URL, LinkedIn URL, and optional X URL.
- Show character limits and form validation.
- Public profile page with bio, skill tags, links, projects owned, and projects joined.

D. Explore projects
- Responsive top navigation with profile menu and a notification indicator placeholder.
- Search field, skill filters/chips, and a clear-filter action.
- Project cards must show project title, short description, owner, required skills/roles, current members versus capacity, and an action to view details.
- Use believable sample projects such as “Open-source Learning Tracker”, “Local Services Directory”, and “Developer Portfolio Builder”.
- Include loading, no-results, and no-projects-yet states.
- Do not show a real-time notification feature as implemented if it is only a placeholder.

E. Project details
- Project title, owner profile, description, goals, tech stack, timeline, and member capacity.
- Roles needed with skill tags and open/filled status.
- Current team member list with avatars and profile links.
- Primary CTA “Request to Join”.
- Also design states for “Request Pending”, “Member”, “Project Full”, and “Project Closed”.
- Include a clearly labelled back-to-projects link.

F. Request to join modal
- Short intro/pitch textarea.
- Select or confirm relevant skills.
- Show the project title and role(s) requested.
- Primary action “Send Request” and secondary action “Cancel”.
- Include submitting, success, and error states.

G. Create project
- Title, short description, detailed description, goals, tech stack, roles/skills needed, member limit, and optional timeline.
- Use grouped form sections, helpful examples, validation, and a preview of the resulting project card.
- Make the form realistic and achievable for an MVP.

H. Project owner dashboard
- Project summary and current capacity.
- Pending join requests with applicant avatar, name, title, relevant skills, short message, and “Approve” / “Decline” actions.
- Current members list.
- Empty state: “No join requests pending.”
- Show confirmation before declining or removing a member.
- Do not allow an owner to approve beyond the member limit; represent a full-project state.

I. Notifications
- Design a small dropdown/panel pattern for “New join request”, “Your request was approved”, and “Your request was declined”.
- Treat this as a visual pattern only if backend notifications are not in the first MVP.
- Include an empty state.

UX FLOWS
Create a user-flow diagram on a separate page with labelled nodes, arrows, and decision points.

Project owner flow:
Landing → Sign Up → Profile Setup → Create Project → Project Dashboard → Review Join Request → Approve or Decline → Updated Member List.

Contributor flow:
Landing → Sign Up → Profile Setup → Explore Projects → Search/Filter by Skill → Project Details → Request to Join → Pending State → Approved or Declined.

Include decision branches for:
- Project full or closed.
- User already requested to join.
- User is the project owner.
- No projects match the filters.
- No pending requests.

INTERACTIVE PROTOTYPE
Connect the main screens into a clickable prototype. Create two clear starting points: “Start Owner Flow” and “Start Contributor Flow”.

Prototype interactions:
- Landing “Browse Projects” opens Explore.
- “Create Profile” opens Sign Up.
- Sign Up continues to Profile Setup.
- Explore project card opens Project Details.
- Skill filter chips and search can be represented with sensible prototype interactions or alternate filtered frames.
- “Request to Join” opens the modal.
- “Send Request” opens a success/pending state.
- Owner dashboard request card opens or displays Approve/Decline controls.
- “Approve” opens a confirmation or success state and then shows the updated member list.
- Profile links open the public profile screen.
- Navigation links work.
Use clear prototype hotspots and sensible back navigation. If true dynamic form behaviour is not supported, create linked state frames.

FILE ORGANISATION
Create pages named:
1. Cover
2. Foundations & Components
3. User Flows
4. Desktop Screens
5. Mobile Screens
6. Prototype States

Keep frames and components consistently named. Use Auto Layout, reusable components, and variants. Include a brief handoff note describing the main components and responsive behaviour.

DELIVERABLE PRIORITY
If the full scope cannot be generated in one pass, prioritise:
1. Foundations & Components
2. Explore Projects
3. Project Details
4. Request to Join modal
5. Owner Dashboard
6. Landing page
7. Sign Up / Profile Setup
8. User Flow Diagram
9. Mobile versions
10. Remaining states and prototype links

Before finishing, review consistency, accessibility, responsive layouts, and whether every core user flow can be demonstrated without dead-end prototype links. Do not generate production code. Produce editable Figma design frames, components, and prototype connections.
```

### Follow-up prompts if the agent runs out of credits or scope

Use these one at a time, rather than asking the agent to regenerate everything:

**Prompt 1 — Foundations**
```text
Continue the SkillBridge file. Create only the Foundations & Components page from the existing brief. Define reusable colour and typography styles, spacing tokens, buttons, inputs, project cards, profile cards, skill tags, status badges, modals, toasts, and empty/loading/error states. Use Auto Layout and component variants. Do not redesign unrelated screens.
```

**Prompt 2 — Core project discovery**
```text
Using the existing SkillBridge design system, create the responsive Explore Projects and Project Details screens, including search, skill filters, project cards, member capacity, roles needed, owner/member information, and the states Request to Join, Request Pending, Member, Project Full, and Project Closed. Keep every component consistent with the established design system.
```

**Prompt 3 — Request and owner flow**
```text
Using the existing SkillBridge design system, create the Request to Join modal and Project Owner Dashboard. Include applicant message and skills, Approve and Decline actions, current members, project capacity, confirmation/success states, and the empty state “No join requests pending.” Add prototype links for the owner flow.
```

**Prompt 4 — Onboarding and profile**
```text
Using the existing SkillBridge design system, create the Landing Page, Sign Up, Sign In, Profile Setup/Edit Profile, and Public Profile screens. Use the exact product value proposition “Build projects together. Gain real-world experience.” Include validation and responsive mobile layouts. Connect the screens with prototype links.
```

**Prompt 5 — Flow diagram and final prototype**
```text
Complete the SkillBridge User Flows page and clickable prototype. Show the Project Owner and Contributor flows, including decision branches for full/closed projects, duplicate requests, owners attempting to join their own projects, no search results, and no pending requests. Connect the existing screens without redesigning them. Check for dead-end prototype links and provide separate Owner and Contributor starting points.
```

### Design review checklist

- [ ] The same colour, type, spacing, button, and card system is used across all screens.
- [ ] Desktop and mobile layouts are represented.
- [ ] Skill and request statuses are labelled in text, not colour alone.
- [ ] Project cards show role/skill needs and member capacity.
- [ ] Owner-only controls are visually distinct from contributor actions.
- [ ] Loading, empty, validation, success, and error states exist.
- [ ] The owner and contributor prototype flows are clickable from start to finish.
- [ ] The design is feasible for the team to implement with React and CSS in one week.
