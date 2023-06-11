class CustomError extends Error {
  constructor(msg, errors = {}, title = "") {
    super(msg);
    this.title = title !== "" ? title : msg;
    this.errors = errors;
    this.status = null;
  }
}

class UnauthorizedError extends CustomError {
  constructor(msg, errors = {}, title = "") {
    super(msg);
    this.status = 401;
  }
}

class BadReqestError extends CustomError {
  constructor(msg, errors = {}, title = "") {
    super(msg, errors, title);
    this.status = 400;
  }
}
class NotFoundError extends CustomError {
  constructor(msg, errors = {}, title = "") {
    super(msg, errors, title);
    this.status = 404;
  }
}

class ForbiddenError extends CustomError {
  constructor(msg, errors = {}, title = "") {
    super(msg, errors, title);
    this.status = 403;
  }
}

module.exports = {
  UnauthorizedError,
  BadReqestError,
  NotFoundError,
  ForbiddenError,
};
