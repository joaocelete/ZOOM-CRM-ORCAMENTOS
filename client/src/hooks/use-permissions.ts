import { useAuth } from "@/contexts/auth-context";
import { userPermissionsSchema } from "@shared/schema";
import { z } from "zod";

type UserPermissions = z.infer<typeof userPermissionsSchema>;

const defaultPermissions: UserPermissions = {
  dashboard: true,
  clientes: true,
  orcamentos: true,
  pipeline: true,
  produtos: true,
  producao: true,
  settings: false,
  users: false,
};

export function usePermissions() {
  const { user } = useAuth();

  const permissions: UserPermissions = (() => {
    // Admin has all permissions
    if (user?.role === "admin") {
      return {
        dashboard: true,
        clientes: true,
        orcamentos: true,
        pipeline: true,
        produtos: true,
        producao: true,
        settings: true,
        users: true,
      };
    }

    // Parse user's custom permissions
    if (user?.permissions) {
      try {
        const parsed = JSON.parse(user.permissions);
        return { ...defaultPermissions, ...parsed };
      } catch {
        return defaultPermissions;
      }
    }

    return defaultPermissions;
  })();

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return permissions[permission] === true;
  };

  const hasAnyPermission = (perms: Array<keyof UserPermissions>): boolean => {
    return perms.some((perm) => permissions[perm] === true);
  };

  const hasAllPermissions = (perms: Array<keyof UserPermissions>): boolean => {
    return perms.every((perm) => permissions[perm] === true);
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
