const userCreatedSuccessfully = (res) =>
  message(res, "User created successfully");
const todoCreatedSuccessfully = (res) =>
  message(res, "Todo created successfully");

const userUpdatedSuccessfully = (res) =>
  message(res, "User updated successfully");
const todoUpdatedSuccessfully = (res) =>
  message(res, "Todo updated successfully");

const userDeletedSuccessfully = (res) =>
  message(res, "User deleted successfully");
const todoDeletedSuccessfully = (res) =>
  message(res, "Todo deleted successfully");

const message = (res, message) => res.json({ message });

module.exports = {
  userCreatedSuccessfully,
  userDeletedSuccessfully,
  userUpdatedSuccessfully,
  todoCreatedSuccessfully,
  todoDeletedSuccessfully,
  todoUpdatedSuccessfully,
};
