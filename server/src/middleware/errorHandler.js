export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Route not found.' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.name === 'MulterError') {
    const messages = {
      LIMIT_FILE_SIZE: 'File is too large. Maximum size is 10MB.',
      LIMIT_UNEXPECTED_FILE: 'Unsupported file type.',
    };
    return res.status(400).json({ message: messages[err.code] || 'Unable to upload the file.' });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Something went wrong. Please try again.' : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
}
