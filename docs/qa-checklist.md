# SkillBridge QA Checklist

## 1. Authentication

- [ ] A user can register with valid information.
- [ ] Duplicate email registration is rejected.
- [ ] Invalid login credentials are rejected.
- [ ] Successful login establishes an authenticated session.
- [ ] Refreshing the browser preserves a valid session.
- [ ] Logging out clears the session.
- [ ] Protected pages redirect unauthenticated users.
- [ ] Passwords and authentication tokens are not exposed in API responses.

## 2. Profiles

- [ ] A user can update their name, bio, title, skills, and interests.
- [ ] Invalid profile values return a validation error.
- [ ] Profile links accept valid HTTP/HTTPS URLs.
- [ ] A user cannot modify another user's profile through the own-profile endpoint.
- [ ] Profile changes persist after refresh.

## 3. Projects

- [ ] Authenticated users can create projects.
- [ ] Required fields are validated.
- [ ] Projects appear in Explore after creation.
- [ ] Search and status filters work.
- [ ] Project details load from the API.
- [ ] Owners can update their own projects.
- [ ] Non-owners cannot update or close another user's project.
- [ ] Closed projects cannot accept new join requests.
- [ ] Project member limits are enforced.

## 4. Join Requests

- [ ] Applicants can submit join requests.
- [ ] Applicants cannot request to join their own project.
- [ ] Duplicate pending requests are rejected.
- [ ] Project owners can view requests for their projects.
- [ ] Non-owners cannot review another owner's requests.
- [ ] Owners can approve or decline pending requests.
- [ ] Reviewed requests cannot be reviewed again.
- [ ] Approved applicants are added to project membership.
- [ ] Project membership never exceeds the configured limit.
- [ ] Applicants can view their own request statuses.

## 5. Error Handling and Security

- [ ] Invalid route identifiers return HTTP 400.
- [ ] Missing records return HTTP 404.
- [ ] Unauthorized requests return HTTP 401.
- [ ] Forbidden actions return HTTP 403.
- [ ] Conflicting operations return HTTP 409.
- [ ] Unexpected server errors do not expose stack traces or secrets.
- [ ] API rate limiting is enabled.
- [ ] CORS allows only configured frontend origins.

## 6. Frontend and Build

- [ ] No uncaught errors appear during normal navigation.
- [ ] Loading, error, and empty states are displayed correctly.
- [ ] No active page relies on demo project data.
- [ ] All application routes work after browser refresh.
- [ ] Frontend lint passes.
- [ ] Frontend production build succeeds.
- [ ] Layouts are tested on mobile, tablet, laptop, and desktop.
