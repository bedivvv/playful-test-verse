
import { validate } from "validate.js";
import { constraints } from './index';

export const validateFunc = (value, constraint) => {
  return validate(value, { [constraint]: constraints[constraint] });
};

export const validateFuncForRider = (value, constraint) => {
  const validationResult = validate(value, {
    [constraint]: constraints[constraint],
  });
  if (validationResult !== undefined && validationResult !== null) {
    if (!constraints[constraint]) {
      return { isValid: false, errorMessage: "Invalid constraint" };
    }
    return { isValid: false, errorMessage: validationResult[constraint][0] };
  } else {
    return { isValid: true, errorMessage: null };
  }
};
