
// Utility functions for badge styling

/**
 * Get the appropriate color class for a project category badge
 */
export const getCategoryBadgeClass = (category: string = ''): string => {
  let colorClass = "bg-gray-100 text-gray-800";
  
  switch (category.toLowerCase()) {
    case 'web development':
    case 'web':
      colorClass = "bg-blue-100 text-blue-800";
      break;
    case 'mobile':
    case 'mobile development':
      colorClass = "bg-green-100 text-green-800";
      break;
    case 'ai':
    case 'machine learning':
      colorClass = "bg-purple-100 text-purple-800";
      break;
    case 'data science':
      colorClass = "bg-yellow-100 text-yellow-800";
      break;
    default:
      break;
  }
  
  return colorClass;
};

/**
 * Get the appropriate color class for a complexity badge
 */
export const getComplexityBadgeClass = (complexity: string = 'Միջին'): string => {
  let colorClass = "bg-yellow-100 text-yellow-800"; // Default for Միջին
  
  if (complexity === 'Սկսնակ') {
    colorClass = "bg-green-100 text-green-800";
  } else if (complexity === 'Առաջադեմ') {
    colorClass = "bg-red-100 text-red-800";
  }
  
  return colorClass;
};
