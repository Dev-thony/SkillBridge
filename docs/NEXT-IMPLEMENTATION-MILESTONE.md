
# SkillBridge — Next Implementation Milestone

## Current milestone

Project management, profile improvements, reliability, documentation, SEO, accessibility and production readiness.

## 1. Project management improvements

Implementation supplied; pending integration and QA.

- [ ] Complete project editing through the owner interface.
- [ ] Allow owners to specify the number of members required for each role.
- [ ] Allow applicants to select a role when applying.
- [ ] Allow project owners to remove existing project members.
- [ ] Keep project member counts and role capacity synchronized.
- [ ] Prevent applications to unavailable roles.
- [ ] Prevent users from joining projects when capacity is reached.
- [ ] Preserve role identifiers and occupancy when editing projects.
- [ ] Keep role capacity correct after account deletion.
- [x] Display role selection only to eligible applicants.
- [x] Record the selected role on join requests.
- [x] Display selected roles in the owner dashboard.
- [x] Update role occupancy when requests are approved.
- [x] Capture removal reasons from project owners.
- [x] Show removal reasons to affected users.
- [x] Allow removed users to submit new join requests.
- [x] Provide links to applicant public profiles.
- [x] Add a role capacity summary to the owner dashboard.

## 2. Profile improvements

Implementation supplied; Cloudinary configuration and QA remain.

- [ ] Configure Cloudinary credentials and unsigned upload preset.
- [ ] Add profile image upload.
- [ ] Add image validation and file-size restrictions.
- [ ] Add image preview before saving.
- [ ] Store uploaded images using Cloudinary.
- [ ] Save the returned secure URL to the user profile.
- [ ] Display profile images consistently across the application.
- [ ] Test upload failure and retry feedback.
- [x] Add professional profile categories.
- [x] Support custom professional titles.
- [x] Show profile fields according to professional category.
- [x] Add contact information.
- [x] Add optional CV upload.
- [x] Display contact information and CV on user profiles.
- [x] Add authenticated applicant profile viewing.

## 3. Authentication and network reliability

Implementation supplied; integration and QA remain.

- [ ] Improve login handling when the backend or database is unavailable.
- [ ] Replace raw database/network errors with friendly messages.
- [ ] Distinguish invalid credentials from network and server errors.
- [ ] Add retry guidance when the connection is restored.
- [ ] Verify session restoration and logout behaviour in production.
- [ ] Ensure the API starts even when the database is temporarily unavailable.

## 4. Database and API improvements

Implementation supplied; integration and QA remain.

- [ ] Review project ownership and membership relationships.
- [ ] Review join-request lifecycle and capacity validation.
- [ ] Store selected role information in join requests.
- [ ] Update role occupancy during approval and member removal.
- [ ] Validate all project update and member-removal operations.
- [ ] Review account deletion and associated data cleanup.
- [ ] Keep account deletion operations transaction-safe.
- [ ] Test API authorization and error responses.
- [ ] Verify MongoDB transaction support in the production database.

## 5. Empty files and documentation

- [ ] Implement Footer.
- [ ] Implement MemberCapacity.
- [ ] Implement ProjectFilters.
- [ ] Implement ProgressBar.
- [ ] Remove redundant empty duplicate components.
- [ ] Complete API contract documentation.
- [ ] Complete database schema documentation.
- [ ] Complete product scope documentation.
- [ ] Complete user flow documentation.
- [ ] Complete demo script documentation.
- [ ] Update README setup instructions.
- [ ] Update QA checklist.

## 6. UI and accessibility improvements

- [ ] Review responsive layouts across mobile, tablet and desktop.
- [ ] Verify Light, Dark and System themes on every route.
- [ ] Review empty, loading, success and error states.
- [ ] Improve form validation and feedback.
- [ ] Check keyboard navigation and accessible labels.
- [ ] Review footer and reusable component styling.
- [ ] Verify role-capacity display at different screen sizes.

## 7. SEO and website branding

- [x] Add default page titles and meta descriptions.
- [x] Add reusable page-specific metadata.
- [x] Add Open Graph metadata.
- [x] Add Twitter/X card metadata.
- [ ] Create a dedicated 1200 × 630 social-sharing image.
- [x] Retain the existing SkillBridge favicon.
- [x] Add web app manifest and browser theme colour.
- [x] Add canonical URL support.
- [x] Add sitemap.xml for public static pages.
- [x] Add robots.txt.
- [ ] Verify metadata and social previews using preview/debugging tools.
- [x] Mark private pages as non-indexable.
- [ ] Implement server-side or pre-rendered metadata for dynamic project previews.
- [ ] Verify metadata on the deployed domain.

**Important:** React document metadata updates do not guarantee that social crawlers can read dynamic project metadata. Dynamic previews require server-side rendering or pre-rendering.

## 8. Production deployment

- [ ] Configure production environment variables.
- [ ] Configure production MongoDB access.
- [ ] Configure production Cloudinary uploads.
- [ ] Deploy the backend API.
- [ ] Deploy the frontend.
- [ ] Configure frontend API URL and CORS.
- [ ] Configure production cookie and HTTPS settings.
- [ ] Test registration, login, logout and profile restoration.
- [ ] Test project creation, editing and browsing.
- [ ] Test join requests and role capacity.
- [ ] Test approval, decline and member removal.
- [ ] Verify account deletion.
- [ ] Verify production logs and error handling.
- [ ] Verify the deployed website's metadata, favicon and social previews.
- [x] Add Vercel SPA fallback configuration for client-side routes.
- [ ] Verify direct URL refreshes on the deployed domain.

## Completion criteria

The milestone is complete when:

1. All project-management and profile features work.
2. Capacity and membership data remain consistent.
3. Authentication and network failures are handled safely.
4. Documentation accurately describes the implementation.
5. Empty-file review is complete.
6. QA acceptance criteria pass.
7. Production deployment works.
8. SEO and social previews are verified.

Do not mark deployment, Cloudinary configuration or social preview verification as complete until they have actually been tested.
