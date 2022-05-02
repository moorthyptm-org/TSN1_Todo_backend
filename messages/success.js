const userCreatedSuccessfully = (res) =>
  message(res, "User created successfully");
const userUpdatedSuccessfully = (res) =>
  message(res, "User updated successfully");
const userDeletedSuccessfully = (res) =>
  message(res, "User deleted successfully");

const message = (res, message) => res.json({ message });

module.exports = {
  userCreatedSuccessfully,
  userDeletedSuccessfully,
  userUpdatedSuccessfully,
};
