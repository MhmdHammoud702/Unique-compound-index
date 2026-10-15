function asyncHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      if (error.statusCode >= 500 || !error.statusCode) {
        console.error("Request failed:", error);
      }

      res.status(error.statusCode || 500).json({
        ...(error.code && { code: error.code }),
        message:
          error.statusCode >= 500 || !error.statusCode
            ? "Could not process booking request."
            : error.message,
      });
    }
  };
}

module.exports = asyncHandler;
