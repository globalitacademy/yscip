
// Main component export
import EducationalCycleInfographic from './EducationalCycleInfographic';

// Export as both default and named export for compatibility with different import styles
export { EducationalCycleInfographic };
export default EducationalCycleInfographic;

// Also export other components and types from this directory
export { default as HomePageModules } from './HomePageModules';
export { default as ModuleCard } from './ModuleCard';
export { educationalModules } from './moduleData';
export type { EducationalModule } from './types';
