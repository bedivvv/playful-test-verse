
import { authConstraints } from './auth';
import { restaurantConstraints } from './restaurant';
import { productConstraints } from './product';
import { financialConstraints } from './financial';
import { commonConstraints } from './common';

// Combine all constraints into a single object
export const constraints = {
  ...authConstraints,
  ...restaurantConstraints,
  ...productConstraints,
  ...financialConstraints,
  ...commonConstraints,
};
