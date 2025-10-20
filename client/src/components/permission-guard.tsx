import { useEffect } from "react";
import { useLocation } from "wouter";
import { usePermissions } from "@/hooks/use-permissions";
import { userPermissionsSchema } from "@shared/schema";
import { z } from "zod";

type UserPermissions = z.infer<typeof userPermissionsSchema>;

interface PermissionGuardProps {
  permission: keyof UserPermissions;
  children: React.ReactNode;
}

export function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const { hasPermission } = usePermissions();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!hasPermission(permission)) {
      // Redirect to dashboard if user doesn't have permission
      setLocation("/");
    }
  }, [permission, hasPermission, setLocation]);

  // Don't render if no permission
  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}
