const serverError = (res) => res.json({ message: "Internal server error" });
const invalidRequest = (res) => res.json({ message: "Invalid request" });

module.exports = { serverError, invalidRequest };
