
export const financialConstraints = {
  code: {
    presence: {
      allowEmpty: false,
    },
  },
  discount: {
    presence: {
      allowEmpty: false,
    },
    numericality: {
      greaterThan: 0,
      lessThan: 10000,
    },
  },
  tip: {
    presence: {
      allowEmpty: false,
    },
    numericality: {
      greaterThan: 0,
      lessThan: 100,
    },
  },
  tax: {
    presence: {
      allowEmpty: false,
    },
    numericality: {
      greaterThan: 0,
    },
  },
  taxationCharges: {
    presence: {
      allowEmpty: false,
    },
    numericality: {
      greaterThanOrEqualTo: 0,
    },
  },
  currencyCode: {
    presence: {
      allowEmpty: false,
    },
  },
  currencySymbol: {
    presence: {
      allowEmpty: false,
    },
  },
};
