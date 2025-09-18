export const successResponse = (res, data, message = "Success") => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = "Error", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

export const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors
  });
};