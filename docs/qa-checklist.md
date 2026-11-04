
# SkillBridge QA Checklist

Use this checklist during development, integration and release testing.

## 1. Authentication

- [ ] A user can register with valid information.
- [ ] Duplicate email registration is rejected.
- [ ] Password requirements are enforced.
- [ ] Invalid login credentials are rejected.
- [ ] Successful login establishes an authenticated session.
- [ ] Refreshing the browser preserves a valid session.
- [ ] Expired sessions are rejected.
- [ ] Logging out clears the session.
- [ ] Protected pages redirect unauthenticated users.
- [ ] Passwords and authentication tokens are not exposed in API responses.
- [ ] Backend unavailability produces a friendly message.
- [ ] Offline login attempts produce a friendly message.
- [ ] Users can retry after restoring their connection.

## 2. Profiles

- [ ] A user can update their name, bio, title, skills and interests.
- [ ] Invalid profile values return a validation error.
- [ ] Profile links accept valid HTTP/HTTPS URLs.
- [ ] A user cannot modify another user's profile through the own-profile endpoint.
- [ ] Profile changes persist after refresh.
- [ ] Profile image preview works.
- [ ] JPG, PNG and WebP images are accepted.
- [ ] Unsupported image formats are rejected.
- [ ] Images larger than 5MB are rejected.
- [ ] Cloudinary uploads return a secure HTTPS URL.
- [ ] Uploaded profile images persist after refresh.
- [ ] Profile images render correctly in profile and project member views.

## 3. Projects

- [ ] Authenticated users can create projects.
- [ ] Required fields are validated.
- [ ] Projects appear in Explore after creation.
- [ ] Search and status filters work.
- [ ] Project details load from the API.
- [ ] Owners can update their own projects.
- [ ] Non-owners cannot update another user's project.
- [ ] Existing role occupancy is preserved during project editing.
- [ ] Occupied roles cannot be removed.
- [ ] Role capacity cannot be reduced below existing membership.
- [ ] Closed projects cannot accept new join requests.
- [ ] Project member limits are enforced.
- [ ] A full project reopens when a member is removed and capacity becomes available.

## 4. Role capacity

- [ ] Owners can create multiple required roles.
- [ ] Owners can specify the number of people required per role.
- [ ] Role skills display correctly.
- [ ] Available role slots display correctly.
- [ ] Filled role slots display correctly.
- [ ] Applicants can select an available role.
- [ ] Applicants cannot select a full role.
- [ ] The backend rejects invalid role identifiers.
- [ ] The backend rejects applications to full roles.
- [ ] Approval increments the correct role's filled count.
- [ ] Member removal decrements the correct role's filled count.
- [ ] Account deletion updates role occupancy.

## 5. Join requests

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
- [ ] Applicants can withdraw their own pending requests.
- [ ] Approved applicants are assigned to the selected role.

## 6. Member management

- [ ] Owners can view project members.
- [ ] Owners can remove other members.
- [ ] Non-owners cannot remove project members.
- [ ] The project owner cannot remove themselves.
- [ ] A non-member cannot be removed.
- [ ] Removing a member updates the member count.
- [ ] Removing a member updates role capacity.
- [ ] Removing a member reopens a full project when capacity becomes available.

## 7. Account deletion

- [ ] A user can permanently delete their account.
- [ ] Owned projects are deleted.
- [ ] Requests associated with owned projects are deleted.
- [ ] Requests submitted by the user are deleted.
- [ ] The user is removed from other owners' projects.
- [ ] Associated role occupancy is updated.
- [ ] The authentication cookie is cleared.
- [ ] The deleted user cannot restore the old session.

## 8. Error handling and security

- [ ] Invalid route identifiers return HTTP 400.
- [ ] Missing records return HTTP 404.
- [ ] Unauthorized requests return HTTP 401.
- [ ] Forbidden actions return HTTP 403.
- [ ] Conflicting operations return HTTP 409.
- [ ] Database unavailability returns HTTP 503.
- [ ] Unexpected server errors do not expose stack traces or secrets.
- [ ] API rate limiting is enabled.
- [ ] CORS allows only configured frontend origins.
- [ ] Ownership checks are enforced by the backend.
- [ ] MongoDB transactions work in the deployed database environment.

## 9. UI and accessibility

- [ ] Loading states are displayed correctly.
- [ ] Empty states are displayed correctly.
- [ ] Success feedback is displayed correctly.
- [ ] Error feedback is displayed correctly.
- [ ] Forms have accessible labels.
- [ ] Buttons can be used with a keyboard.
- [ ] Focus indicators are visible.
- [ ] Colour is not the only way status is communicated.
- [ ] Light theme works across all routes.
- [ ] Dark theme works across all routes.
- [ ] System theme works across all routes.
- [ ] Layouts work on mobile, tablet, laptop and desktop.

## 10. Empty files and reusable components

- [ ] Footer is implemented and displayed.
- [ ] MemberCapacity is implemented and used.
- [ ] ProjectFilters is implemented and used.
- [ ] ProgressBar is implemented and used.
- [ ] Redundant empty duplicate components are removed.
- [ ] No active import references a removed file.

## 11. SEO and branding

- [ ] Default page title and description are correct.
- [ ] Page-specific metadata is correct.
- [ ] Canonical URLs are correct.
- [ ] Open Graph metadata is correct.
- [ ] Twitter/X metadata is correct.
- [ ] Social-sharing image is 1200 × 630.
- [ ] Dynamic project metadata is server-rendered or pre-rendered.
- [ ] Private routes are not indexable.
- [ ] Favicon appears correctly.
- [ ] Manifest loads correctly.
- [ ] Sitemap contains the intended public pages.
- [ ] robots.txt points to the deployed sitemap.
- [ ] Social preview tools display the correct title, description and image.

## 12. Frontend and build

- [ ] No uncaught errors appear during normal navigation.
- [ ] No active page relies on demo project data.
- [ ] All application routes work after browser refresh.
- [ ] Frontend lint passes.
- [ ] Frontend production build succeeds.
- [ ] Production assets load correctly.
- [ ] No required environment variable is missing.

## 13. Production deployment

- [ ] Production environment variables are configured.
- [ ] Production MongoDB access is configured.
- [ ] Backend is deployed.
- [ ] Frontend is deployed.
- [ ] Frontend API URL points to the production backend.
- [ ] CORS allows the production frontend.
- [ ] Production cookies and HTTPS settings work.
- [ ] Registration, login, logout and profile restoration work.
- [ ] Project creation, browsing and join requests work.
- [ ] Project approval, member removal and role capacity work.
- [ ] Production logs do not expose sensitive information.
- [ ] Deployed metadata, favicon and social previews are verified.

## Profile categories and CV

- [ ] Developer profiles show skills, interests and individual links.
- [ ] Designer profiles show skills, interests and individual links.
- [ ] Company profiles show website and optional GitHub.
- [ ] Student profiles show skills, interests and individual links.
- [ ] Freelancer profiles show skills, interests and individual links.
- [ ] Other allows a custom professional title.
- [ ] Contact phone and location save correctly.
- [ ] CV upload is optional.
- [ ] PDF, DOC and DOCX files upload correctly.
- [ ] CV URLs remain available after refreshing the profile.
- [ ] Authenticated users can view permitted public profile information.

## Applicant and member management

- [ ] Project owners do not see the application role selector.
- [ ] Applicants see the role selector.
- [ ] Applicants can select a role with available positions.
- [ ] Owners see the applicant's selected role.
- [ ] Role occupancy decreases the available positions after approval.
- [ ] Owners must provide a removal reason.
- [ ] Removed members can see the removal reason.
- [ ] Removed members can apply again when the project is open.
- [ ] Applicant profile links open the correct user's profile.

## Vercel routing

- [ ] Refreshing /dashboard works.
- [ ] Refreshing /applications works.
- [ ] Refreshing /profile works.
- [ ] Refreshing /projects/:projectId works.
- [ ] Refreshing /projects/:projectId/edit works.
- [ ] Invalid routes display the application's own 404 page.
