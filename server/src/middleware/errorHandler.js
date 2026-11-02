export function notFound(req, res) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: `Route ${req.method} ${req.originalUrl} was not found.` } });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error?.name === "ValidationError") {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: Object.values(error.errors)[0]?.message || "Invalid request data." } });
  }
  if (error?.name === "CastError") {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "A route identifier is invalid." } });
  }
  if (error?.code === 11000) {
    return res.status(409).json({ error: { code: "CONFLICT", message: "A record with that value already exists." } });
  }

  console.error(error);
  const status = error?.status || 500;
  const publicMessage = status >= 500 && process.env.NODE_ENV === "production"
    ? "An unexpected server error occurred."
    : error?.message || "An unexpected server error occurred.";

  res.status(status).json({
    error: { code: error?.codeName || (status === 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR"), message: publicMessage },
  });
}
