
# SkillBridge User Flows

## 1. Visitor explores projects

1. Visitor opens SkillBridge.
2. Visitor navigates to Explore Projects.
3. Visitor searches projects by keyword.
4. Visitor filters projects by status.
5. Visitor opens a project detail page.
6. Visitor reviews its owner, goals, technologies, roles and capacity.
7. Visitor chooses to register or log in to apply.

Authentication is not required for public project discovery.

## 2. User registration

1. Visitor opens the registration page.
2. Visitor enters name, email and password.
3. Frontend validates required information.
4. Backend validates the request.
5. Backend creates the user and hashes the password.
6. Backend establishes the session cookie.
7. User is directed to profile setup.

## 3. Profile setup

1. Authenticated user opens profile setup.
2. User enters professional information.
3. User adds skills and interests.
4. User adds portfolio and social links.
5. User optionally selects a profile image.
6. The image is uploaded to Cloudinary when configured.
7. The resulting image URL is saved to the user profile.
8. User saves the profile.
9. User views the updated profile.

## 4. Project creation

1. Authenticated user opens Create Project.
2. User enters title and short description.
3. User enters the full description and project goals.
4. User lists technologies.
5. User adds roles, skills and required slots.
6. User sets maximum team capacity.
7. Frontend submits the project.
8. Backend validates the data.
9. Backend creates the project with the owner as the first member.
10. User is redirected to project details.

## 5. Project editing

1. Project owner opens their project.
2. Owner selects Edit Project.
3. Existing project data is loaded into the form.
4. Owner edits the project.
5. Backend verifies ownership.
6. Backend preserves occupied role capacity.
7. Updated project is saved.
8. Owner returns to project details.

An owner cannot remove an occupied role or reduce its capacity below existing members.

## 6. Join request

1. Authenticated user opens a project they do not own.
2. User reviews open roles.
3. User selects an available role.
4. User enters an optional message.
5. User submits a join request.
6. Backend verifies project status, membership, role availability and duplicate requests.
7. Request is saved as pending.
8. User sees the pending status.

## 7. Owner reviews a request

1. Project owner opens the owner dashboard.
2. Owner views pending requests.
3. Owner reviews applicant information and selected role.
4. Owner approves or declines.
5. Backend verifies ownership and request status.
6. On approval, backend checks project and role capacity.
7. Approved applicant is added to membership.
8. Role occupancy is updated.
9. Project status is updated when full.
10. Dashboard reflects the result.

## 8. Member removal

1. Project owner opens the owner dashboard.
2. Owner views current members.
3. Owner selects Remove Member.
4. Owner confirms the action.
5. Backend verifies ownership and membership.
6. Member is removed.
7. Assigned role occupancy decreases.
8. A previously full project reopens when capacity becomes available.

## 9. Applicant withdraws a request

1. Applicant opens their applications dashboard.
2. Applicant selects a pending request.
3. Applicant withdraws it.
4. Backend verifies request ownership and pending status.
5. Request becomes withdrawn.

## 10. Account settings

1. User opens Settings.
2. User changes supported preferences.
3. User saves changes.
4. Preferences remain available across navigation and refresh.

## 11. Logout

1. User selects Logout.
2. Frontend calls the logout endpoint.
3. Backend clears the session cookie.
4. Frontend clears the local session marker and user state.
5. User returns to the public experience.

## 12. Account deletion

1. User opens account settings.
2. User selects Delete Account.
3. User confirms permanent deletion.
4. Backend removes associated projects, requests and membership references.
5. Backend clears the authentication cookie.
6. Frontend clears user state.
7. User returns to the unauthenticated experience.

## 13. Failure and recovery flows

### Invalid credentials
The user sees a clear authentication error and can retry.

### Network unavailable
The user receives a friendly connection message and can retry after reconnecting.

### Database unavailable
The API returns a safe service-unavailable response instead of database connection details.

### Full role or project
The user cannot submit a request for unavailable capacity.

### Unauthorized action
The backend rejects operations that the current user does not own or have permission to perform.
