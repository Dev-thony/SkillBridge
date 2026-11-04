export function notFound(req, res) {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} was not found.`,
    },
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error?.name === "ValidationError") {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message:
          Object.values(error.errors)[0]?.message || "Invalid request data.",
      },
    });
  }

  if (error?.name === "CastError") {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "A route identifier is invalid.",
      },
    });
  }

  if (error?.code === 11000) {
    return res.status(409).json({
      error: {
        code: "CONFLICT",
        message: "A record with that value already exists.",
      },
    });
  }

  console.error("[API Error]", error);

  const status = error?.status || 500;

  let code = error?.code || "INTERNAL_ERROR";
  let message = error?.message || "An unexpected error occurred.";

  if (status === 503) {
    code = "DATABASE_UNAVAILABLE";
    message =
      "SkillBridge is temporarily unable to connect to its database. Please try again shortly.";
  } else if (status >= 500) {
    code = "INTERNAL_ERROR";
    message = "Something went wrong on our server. Please try again.";
  }

  return res.status(status).json({
    error: { code, message },
  });
}
