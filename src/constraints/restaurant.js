
export const restaurantConstraints = {
  name: {
    presence: {
      allowEmpty: false,
    },
  },
  address: {
    presence: {
      allowEmpty: false,
    },
  },
  deliveryCharges: {
    presence: {
      allowEmpty: false,
    },
  },
  deliveryRate: {
    presence: {
      allowEmpty: false,
    },
  },
  deliveryTime: {
    presence: {
      allowEmpty: false,
    },
  },
  minimumOrder: {
    presence: {
      allowEmpty: false,
    },
  },
  orderPrefix: {
    presence: true,
  },
  zone: {
    presence: true,
    length: {
      minimum: 5,
    },
  },
};
