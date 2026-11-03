import { useEffect } from "react";

const DEFAULT_TITLE = "SkillBridge | Build Projects Together";
const DEFAULT_DESCRIPTION =
  "Find collaborators, contribute your skills, and build real-world projects together with SkillBridge.";

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = url;
}

export function usePageMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = window.location.pathname,
  noIndex = false,
  image = "/images/skillbridge-logo.png",
}) {
  useEffect(() => {
    const siteUrl = (
      import.meta.env.VITE_SITE_URL || window.location.origin
    ).replace(/\/$/, "");

    const pageUrl = `${siteUrl}${path}`;
    const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

    const pageTitle = title.includes("SkillBridge")
      ? title
      : `${title} | SkillBridge`;

    document.title = pageTitle;

    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "SkillBridge");
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:image", imageUrl);

    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);

    if (!noIndex) {
      setCanonical(pageUrl);
    } else {
      const canonical = document.head.querySelector('link[rel="canonical"]');
      canonical?.remove();
    }
  }, [title, description, path, noIndex, image]);
}
