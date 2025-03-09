import { Roles } from "@/types/global";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();
  const roleSession = sessionClaims?.metadata
  return roleSession?.role === role;
};
