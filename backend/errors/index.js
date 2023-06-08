class UnauthorizedError extends Error {
  constructor(msg, errors = {}, title = "") {
    super(msg);
    this.title = title !== "" ? title : msg;
    this.status = 401;
    this.errors = errors;
  }
}

module.exports = { UnauthorizedError };
