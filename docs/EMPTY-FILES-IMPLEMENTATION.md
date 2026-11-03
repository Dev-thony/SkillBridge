
# SkillBridge — Empty Files Review and Implementation Plan

This document records empty files found in the current project.
It explains their intended responsibilities and whether they should
be implemented, retained for future work, or removed.

## 1. Frontend components

### 1.1 `client/src/components/common/Button.jsx`

**Status:** Empty  
**Recommendation:** Remove if unused.

The project already has:

- `client/src/components/ui/Button.jsx`
- `client/src/components/ui/ui.css`

The UI Button should remain the primary reusable button component.
Avoid maintaining two separate button systems.

### 1.2 `client/src/components/common/Button.css`

**Status:** Empty  
**Recommendation:** Remove if unused.

Button styling is already maintained by the UI foundation.

### 1.3 `client/src/components/common/SkillTag.jsx`

**Status:** Empty  
**Recommendation:** Remove if unused.

The existing implementation is:
`client/src/components/ui/SkillTag.jsx`

Use the existing UI component across project cards, project details
and other pages.

### 1.4 `client/src/components/common/SkillTag.css`

**Status:** Empty  
**Recommendation:** Remove if unused.

Skill tag styles should remain in the existing UI styling system.

### 1.5 `client/src/components/layout/Footer.jsx`

**Status:** Empty  
**Recommendation:** Implement.

Responsibilities:

- Display the SkillBridge brand.
- Display a short platform description.
- Link to Explore Projects and How It Works.
- Provide relevant authentication links.
- Include copyright information.
- Support Light and Dark themes.
- Remain responsive on mobile and desktop.

Before implementation, decide whether the footer should be shared
across all pages or limited to public pages.

### 1.6 `client/src/components/layout/MobileNavigation.jsx`

**Status:** Empty  
**Recommendation:** Remove if unused.

The current `Navbar.jsx` already implements:

- Mobile menu toggle.
- Mobile navigation overlay.
- Navigation drawer.
- Authenticated and unauthenticated navigation.
- Profile and logout actions.
- Theme switching for visitors.

Do not duplicate this functionality.

### 1.7 `client/src/components/projects/MemberCapacity.jsx`

**Status:** Empty  
**Recommendation:** Implement in the project-management milestone.

Responsibilities:

- Display project member capacity.
- Display current member count against maximum capacity.
- Display role-specific required slots.
- Display filled and available slots.
- Prevent misleading capacity information.
- Support full and closed project states.

### 1.8 `client/src/components/projects/ProjectFilters.jsx`

**Status:** Empty  
**Recommendation:** Implement when refactoring Explore Projects.

Responsibilities:

- Search projects by title and description.
- Filter by project status.
- Filter by technology or skill.
- Provide a reset-filters action.
- Support mobile and desktop layouts.

The current Explore page already contains basic search and status
filtering, so avoid duplicating those controls before refactoring.

### 1.9 `client/src/components/ui/Input.jsx`

**Status:** Empty  
**Recommendation:** Review and remove if redundant.

The project already has `TextField.jsx` and `SelectField.jsx`.
Only implement a reusable Input if a genuine use case exists that
the current field components do not cover.

### 1.10 `client/src/components/ui/ProgressBar.jsx`

**Status:** Empty  
**Recommendation:** Optional future implementation.

Potential responsibilities:

- Display project completion progress.
- Display role capacity progress.
- Support accessible progress labels.
- Support minimum and maximum values.
- Support Light and Dark themes.

Implement only when the application has a meaningful progress
measurement to display.

### 1.11 `client/src/styles/utilities.css`

**Status:** Empty  
**Recommendation:** Optional implementation.

Potential responsibilities:

- Reusable spacing utilities.
- Text alignment utilities.
- Responsive visibility utilities.
- Flex and grid helpers.
- Consistent container utilities.

Avoid duplicating existing global CSS and component styles.

---

## 2. Empty documentation files

### 2.1 `docs/api-contract.md`

**Recommendation:** Implement.

Document:

- API base URL.
- Authentication requirements.
- HTTP methods and routes.
- Request body structures.
- Successful response structures.
- Error response structures.
- Authorization requirements.
- Pagination and filtering behaviour.

The document must reflect the actual Express routes and controllers.

### 2.2 `docs/database-schema.md`

**Recommendation:** Implement.

Document:

- User model.
- Project model.
- JoinRequest model.
- Field types and validation.
- Required fields and defaults.
- Relationships and references.
- Indexes and uniqueness constraints.
- Account deletion and associated data cleanup.

The document must reflect the actual Mongoose models.

### 2.3 `docs/product-scope.md`

**Recommendation:** Implement.

Document:

- SkillBridge's purpose.
- Target users.
- Core problems being solved.
- Current features.
- Features outside the current release.
- Future implementation priorities.
- Presentation and release scope.

### 2.4 `docs/user-flows.md`

**Recommendation:** Implement.

Document the main user journeys:

- Visitor explores projects.
- Visitor registers.
- User completes a profile.
- User creates a project.
- User applies to join a project.
- Project owner reviews applications.
- User manages their profile and settings.
- User logs out or deletes their account.

Include authentication and authorization requirements.

### 2.5 `docs/demo-script.md`

**Recommendation:** Implement.

Document:

- Presentation introduction.
- Platform overview.
- Registration and login demonstration.
- Profile setup.
- Project discovery.
- Project creation.
- Join-request workflow.
- Owner dashboard.
- Settings and theme switching.
- Closing summary.

Include fallback instructions if the live API or database becomes
unavailable during the demonstration.

---

## 3. File management rules

Before deleting any empty file:

1. Search the project for imports referencing the file.
2. Check whether another component already provides its functionality.
3. Confirm that no planned implementation depends on it.
4. Remove it only when it is genuinely redundant.

Do not delete:

- `docs/` files simply because they are currently empty.
- Components that have an approved future implementation.
- Files referenced by build configuration or application code.

## 4. Implementation priority

| Priority | Files or areas |

|---|---|
| High | `api-contract.md`, `database-schema.md` |
| High | `user-flows.md`, `product-scope.md` |
| High | `demo-script.md` |
| Medium | `Footer.jsx` |
| Medium | `MemberCapacity.jsx` |
| Medium | `ProjectFilters.jsx` |
| Low | `ProgressBar.jsx` |
| Review | Empty duplicate Button and SkillTag components |
| Review | Empty MobileNavigation and Input components |
| Optional | `utilities.css` |

## Completion criteria

Every empty file must have one of the following outcomes:

- Implemented and used by the application.
- Retained with a documented future purpose.
- Removed because it is redundant and unused.

The project should not accumulate duplicate components or
unnecessary empty files.
