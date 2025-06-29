
export const authConstraints = {
  email: {
    email: true,
  },
  password: {
    presence: {
      allowEmpty: false,
    },
  },
  confirmPassword: {
    presence: {
      allowEmpty: false,
    },
    equality: {
      attribute: "password",
      message: "^The passwords does not match",
    },
  },
  username: {
    presence: {
      allowEmpty: false,
      message: "^UsernameCannotBeBlank",
    },
    format: {
      pattern: /^[^\s]+$/,
      message: "^UsernameCannotContainSpaces",
    },
  },
};
