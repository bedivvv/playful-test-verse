
export const productConstraints = {
  title: {
    presence: {
      allowEmpty: false,
    },
  },
  description: {
    presence: {
      allowEmpty: false,
    },
  },
  categoryTitle: {
    presence: true,
    length: {
      minimum: 1,
      maximum: 25,
    },
  },
  categoryDescription: {
    presence: true,
    length: {
      minimum: 0,
      maximum: 60,
    },
  },
  category: {
    presence: {
      allowEmpty: false,
    },
  },
  price: {
    presence: {
      allowEmpty: false,
    },
    numericality: {
      greaterThan: 0,
    },
  },
  discounted: {},
  stock: {
    presence: true,
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 0,
    },
  },
  tag: {
    presence: {
      allowEmpty: false,
    },
  },
  optionTitle: {
    presence: {
      allowEmpty: false,
    },
  },
  optionDescription: {
    presence: {
      allowEmpty: false,
    },
  },
  optionPrice: {
    presence: {
      allowEmpty: false,
    },
    numericality: {
      greaterThanOrEqualTo: 0,
    },
  },
  addonTitle: {
    presence: {
      allowEmpty: false,
    },
  },
  addonDescription: {
    presence: {
      allowEmpty: false,
    },
  },
  addonQuantityMinimum: {
    presence: {
      allowEmpty: false,
    },
    numericality: {
      greaterThanOrEqualTo: 0,
    },
  },
  addonQuantityMaximum: {
    presence: {
      allowEmpty: false,
    },
    numericality: {
      greaterThanOrEqualTo: 1,
    },
  },
};
