const serverError = (res) => message(res, "Internal server error");
const invalidRequest = (res) => message(res, "Invalid request");
const userAlreadyExists = (res) => message(res, "user already exists");

const invalidUsernamePassword = (res) =>
  message(res, "username or password is incorrect");

const message = (res, message) => res.json({ message });

module.exports = {
  serverError,
  invalidRequest,
  invalidUsernamePassword,
  userAlreadyExists,
};
