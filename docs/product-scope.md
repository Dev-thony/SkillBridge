
# SkillBridge Product Scope

## 1. Product overview

**Product:** SkillBridge

**Tagline:** Build projects together. Gain real-world experience.

SkillBridge is a collaboration platform that helps people discover projects, showcase their skills, find collaborators and gain practical experience by working with others.

## 2. Problem being solved

Beginner developers, designers and aspiring founders often struggle to find people with complementary skills.

Project owners also need a straightforward way to:
- Present their project ideas.
- Identify the roles they need.
- Receive applications.
- Review potential collaborators.
- Manage their growing teams.

## 3. Target users

- Beginner and intermediate developers.
- UI/UX and graphic designers.
- Students and self-taught developers.
- Hackathon participants.
- Aspiring founders.
- People looking for practical collaboration experience.

## 4. Proposed solution

SkillBridge provides user profiles, project discovery, project creation, role requirements, join requests and owner-controlled membership management.

## 5. Current feature scope

### Authentication
- Registration.
- Login.
- Logout.
- Protected routes.
- Session restoration.
- Account deletion.

### Profiles
- Name and professional title.
- Biography.
- Skills and interests.
- Portfolio and social links.
- Hosted profile image URL and upload integration.

### Projects
- Project creation.
- Project editing.
- Project descriptions and goals.
- Technology requirements.
- Role-specific capacity.
- Team member limits.
- Open, full and closed project states.

### Discovery
- Project browsing.
- Search.
- Status filtering.
- Project detail pages.

### Collaboration
- Join requests.
- Role selection.
- Request approval and decline.
- Request withdrawal.
- Member removal.
- Capacity tracking.

### Account and interface
- Theme preferences.
- Responsive navigation.
- Account settings.
- Metadata and branding.
- Loading, empty and error feedback.

## 6. Features requiring configuration or further work

- Cloudinary upload requires a configured cloud name and unsigned upload preset.
- Dynamic project social previews require server-rendered or pre-rendered metadata.
- Production deployment requires configured hosting, database access, environment variables and HTTPS.
- A dedicated 1200 × 630 social-sharing image still needs to be created and hosted.
- Production metadata and sharing previews require external verification.

## 7. Out of scope for the current release

- Real-time team chat.
- Payments.
- AI project matching.
- Advanced recommendation algorithms.
- Kanban boards.
- Reputation and ranking systems.
- Native mobile applications.
- Complex administrative moderation.

## 8. Product success criteria

A successful core workflow allows a user to:

1. Register and create a profile.
2. Discover projects.
3. Create and edit a project.
4. Specify required roles and capacity.
5. Apply for a suitable role.
6. Receive an owner decision.
7. Join an approved project.
8. View current team capacity.
9. Manage project membership as an owner.

## 9. Product principle

Prioritise reliable collaboration workflows, clear project requirements, transparent membership capacity and secure ownership controls before adding optional social features.
