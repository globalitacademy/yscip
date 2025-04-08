
// Import modules from separate category files
import { algorithmModules } from './algorithmModules';
import { programmingModules } from './programmingModules';
import { webDevelopmentModules } from './webDevelopmentModules';
import { networkingModules } from './networkingModules';
import { graphicsModules } from './graphicsModules';
import { securityModules } from './securityModules';
import { databaseModules } from './databaseModules';
import { interfaceModules } from './interfaceModules';

// Re-export all modules together
import { EducationalModule } from '../types';

// Combine all module categories
export const educationalModules: EducationalModule[] = [
  ...algorithmModules,
  ...programmingModules,
  ...webDevelopmentModules,
  ...networkingModules,
  ...databaseModules,
  ...graphicsModules,
  ...interfaceModules,
  ...securityModules,
];

// Export individual categories for more granular access if needed
export {
  algorithmModules,
  programmingModules,
  webDevelopmentModules,
  networkingModules,
  databaseModules,
  graphicsModules,
  interfaceModules,
  securityModules
};
