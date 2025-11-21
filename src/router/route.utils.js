import routes from '@/router/routes.json';

/**
 * Get route configuration by name or path
 * @param {string} identifier - Route name or path
 * @returns {Object|null} Route configuration object
 */
export function getRouteConfig(identifier) {
  function findRoute(routes, identifier) {
    for (const route of routes) {
      if (route.name === identifier || route.path === identifier) {
        return route;
      }
      if (route.children) {
        const found = findRoute(route.children, identifier);
        if (found) return found;
      }
    }
    return null;
  }
  
  return findRoute(routes.routes, identifier);
}

/**
 * Verify if user has access to a route
 * @param {Object} route - Route configuration
 * @param {Object} user - Current user object
 * @returns {boolean} Whether user can access the route
 */
export function verifyRouteAccess(route, user = null) {
  if (!route) return false;
  
  // Public routes are always accessible
  if (route.access === 'public') {
    return true;
  }
  
  // Private routes require authentication
  if (route.access === 'private') {
    return !!user;
  }
  
  // Admin routes require admin role
  if (route.access === 'admin') {
    return user && user.role === 'admin';
  }
  
  // Default to public access if no access level specified
  return true;
}

/**
 * Get all routes flattened
 * @returns {Array} Array of all route configurations
 */
export function getAllRoutes() {
  function flattenRoutes(routes, parent = null) {
    let flattened = [];
    
    for (const route of routes) {
      const routeWithParent = { ...route, parent };
      flattened.push(routeWithParent);
      
      if (route.children) {
        flattened = flattened.concat(flattenRoutes(route.children, route));
      }
    }
    
    return flattened;
  }
  
  return flattenRoutes(routes.routes);
}

/**
 * Build full path from route configuration
 * @param {Object} route - Route configuration
 * @returns {string} Full route path
 */
export function buildRoutePath(route) {
  if (!route.parent) {
    return route.path === '/' ? '/' : route.path;
  }
  
  const parentPath = buildRoutePath(route.parent);
  if (route.index) {
    return parentPath === '/' ? '/' : parentPath;
  }
  
  if (parentPath === '/') {
    return `/${route.path}`;
  }
  
  return `${parentPath}/${route.path}`;
}

/**
 * Get route metadata (title, description, etc.)
 * @param {string} identifier - Route name or path  
 * @returns {Object} Route metadata
 */
export function getRouteMeta(identifier) {
  const route = getRouteConfig(identifier);
  return route?.meta || {
    title: 'TrackFlow',
    description: 'Issue Tracking System'
  };
}