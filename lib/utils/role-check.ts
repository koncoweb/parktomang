export type UserRole = 'owner' | 'admin' | 'sales';

export function hasPermission(userRole: UserRole | null | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    owner: 3,
    admin: 2,
    sales: 1,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canAccessAllData(userRole: UserRole | null | undefined): boolean {
  return userRole === 'owner' || userRole === 'admin';
}

export function isOwner(userRole: UserRole | null | undefined): boolean {
  return userRole === 'owner';
}

export function isAdmin(userRole: UserRole | null | undefined): boolean {
  return userRole === 'admin';
}

export function isSales(userRole: UserRole | null | undefined): boolean {
  return userRole === 'sales';
}

