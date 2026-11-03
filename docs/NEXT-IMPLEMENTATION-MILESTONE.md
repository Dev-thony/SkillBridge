
# SkillBridge — Next Implementation Milestone

## Current milestone

Presentation readiness, theme consistency, production deployment, and discoverability.

## 1. Project management improvements

- [ ] Add Edit Project functionality for project owners.
- [ ] Allow owners to specify the number of members required for each role.
- [ ] Allow project owners to remove existing project members.
- [ ] Keep project member counts and role capacity synchronized.
- [ ] Prevent users from joining projects when capacity is reached.

## 2. Profile improvements

- [ ] Add profile image upload.
- [ ] Add image validation and file-size restrictions.
- [ ] Add image preview before saving.
- [ ] Store uploaded images using a suitable image-storage service.
- [ ] Display profile images consistently across the application.

## 3. Authentication and network reliability

- [ ] Improve login handling when the backend or database is unavailable.
- [ ] Replace raw database/network errors with friendly messages.
- [ ] Distinguish invalid credentials from network and server errors.
- [ ] Add retry guidance when the connection is restored.
- [ ] Verify session restoration and logout behaviour in production.

## 4. Database and API improvements

- [ ] Review project ownership and membership relationships.
- [ ] Review join-request lifecycle and capacity validation.
- [ ] Validate all project update and member-removal operations.
- [ ] Review account deletion and associated data cleanup.
- [ ] Test API authorization and error responses.

## 5. UI and accessibility improvements

- [ ] Review responsive layouts across mobile, tablet and desktop.
- [ ] Verify Light, Dark and System themes on every route.
- [ ] Review empty, loading, success and error states.
- [ ] Improve form validation and feedback.
- [ ] Check keyboard navigation and accessible labels.

## 6. SEO and website branding

- [x] Add default page titles and meta descriptions.
- [x] Add reusable page-specific metadata.
- [x] Add Open Graph metadata for social sharing.
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

## 7. Production deployment

- [ ] Configure production environment variables.
- [ ] Configure production MongoDB access.
- [ ] Deploy the backend API.
- [ ] Deploy the frontend.
- [ ] Configure frontend API URL and CORS.
- [ ] Configure production cookie and HTTPS settings.
- [ ] Test registration, login, logout and profile restoration.
- [ ] Test project creation, browsing and join requests.
- [ ] Verify production logs and error handling.
- [ ] Verify the deployed website's metadata, favicon and social previews.

## Completion criteria

The milestone is complete when all planned features have been implemented,
tested, reviewed and deployed successfully.
