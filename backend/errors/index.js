class CustomError extends Error {
  constructor(msg, errors = {}, title = "") {
    super(msg);
    this.title = title !== "" ? title : msg;
    this.errors = errors;
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

module.exports = { UnauthorizedError, BadReqestError };
