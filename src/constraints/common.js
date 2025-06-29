
export const commonConstraints = {
  prefix: {
    presence: {
      allowEmpty: false,
    },
  },
  phone: {
    presence: {
      allowEmpty: false,
    },
  },
  lat: {
    presence: {
      allowEmpty: false,
    },
  },
  long: {
    presence: {
      allowEmpty: false,
    },
  },
  type: {
    presence: true,
    length: {
      minimum: 1,
      maximum: 6,
    },
  },
  mongoUrl: {
    url: {
      scheme: ["mongodb"],
    },
  },
  reason: {
    presence: true,
    length: {
      minimum: 1,
      maximum: 30,
    },
  },
  bannerTitle: {
    presence: {
      allowEmpty: false,
    },
  },
  action: {
    presence: {
      allowEmpty: false,
    },
  },
  screen: {
    presence: {
      allowEmpty: false,
    },
  },
};
