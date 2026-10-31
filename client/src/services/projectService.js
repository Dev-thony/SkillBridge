const API_URL = import.meta.env.VITE_API_URL || "/api";

async function projectRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.error?.message || data.message || "Project request failed.",
    );

    error.status = response.status;
    error.code = data.error?.code;

    throw error;
  }

  return data;
}

function normalizeProject(project) {
  const members = Array.isArray(project.members) ? project.members : [];

  const rolesNeeded = Array.isArray(project.rolesNeeded)
    ? project.rolesNeeded.map((role) =>
        typeof role === "string" ? role : role.role,
      )
    : [];

  return {
    ...project,
    id: project._id || project.id,
    ownerId:
      typeof project.owner === "object"
        ? project.owner?._id || project.owner?.id
        : project.owner,
    rolesNeededDetails: Array.isArray(project.rolesNeeded)
      ? project.rolesNeeded
      : [],
    summary: project.shortDescription || project.description || "",
    technologies: project.techStack || [],
    rolesNeeded,
    members,
    memberCount: members.length,
    teamCapacity: project.memberLimit ?? 0,
    owner:
      typeof project.owner === "object"
        ? project.owner?.name || "SkillBridge member"
        : project.owner || "SkillBridge member",
    status: project.status || "open",
  };
}

export async function listProjects(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.skill?.trim()) {
    params.set("skill", filters.skill.trim());
  }

  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (filters.page) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();
  const response = await projectRequest(`/projects${query ? `?${query}` : ""}`);

  return {
    projects: (response.data?.projects || []).map(normalizeProject),
    pagination: response.data?.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
    },
  };
}

export async function getProject(projectId) {
  const response = await projectRequest(
    `/projects/${encodeURIComponent(projectId)}`,
  );

  return normalizeProject(response.data.project);
}

export async function createProject(projectData) {
  const response = await projectRequest("/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });

  return normalizeProject(response.data.project);
}

export async function updateProject(projectId, projectData) {
  const response = await projectRequest(
    `/projects/${encodeURIComponent(projectId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(projectData),
    },
  );

  return normalizeProject(response.data.project);
}

export async function closeProject(projectId) {
  const response = await projectRequest(
    `/projects/${encodeURIComponent(projectId)}`,
    {
      method: "DELETE",
    },
  );

  return normalizeProject(response.data.project);
}

export async function submitJoinRequest(projectId, message = "") {
  const response = await projectRequest(
    `/projects/${encodeURIComponent(projectId)}/requests`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
  );

  return response.data.request;
}

export async function getProjectRequests(projectId) {
  const response = await projectRequest(
    `/projects/${encodeURIComponent(projectId)}/requests`,
  );

  return response.data.requests || [];
}

export async function reviewJoinRequest(requestId, status) {
  const response = await projectRequest(
    `/requests/${encodeURIComponent(requestId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );

  return response.data.request;
}

export async function getMyJoinRequests() {
  const response = await projectRequest("/users/me/requests");

  return response.data.requests || [];
}

export async function listMyProjects() {
  const response = await projectRequest("/projects/mine");

  return (response.data?.projects || []).map(normalizeProject);
}
