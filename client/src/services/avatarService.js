const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const RESUME_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_RESUME_UPLOAD_PRESET || UPLOAD_PRESET;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadAvatar(file) {
  if (!file || !(file instanceof File)) {
    throw new Error("Please select a profile image.");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Choose a JPG, PNG or WebP image.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Your profile image must be 5MB or smaller.");
  }

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Image uploads are not configured yet. Please configure Cloudinary.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "skillbridge/avatars");

  let response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
  } catch {
    throw new Error(
      "Unable to upload your image. Check your internet connection and try again.",
    );
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.secure_url) {
    throw new Error(
      result.error?.message || "Image upload failed. Please try again.",
    );
  }

  return result.secure_url;
}


export async function uploadResume(file) {
  if (!file || !(file instanceof File)) {
    throw new Error("Please select your CV.");
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Upload a PDF, DOC or DOCX CV.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Your CV must be 10MB or smaller.");
  }

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary upload is not configured.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", RESUME_UPLOAD_PRESET);
  formData.append("folder", "skillbridge/resumes");
  formData.append("resource_type", "raw");

  let response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
  } catch {
    throw new Error("Unable to upload your CV. Check your connection.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "CV upload failed.");
  }

  return data.secure_url;
}
