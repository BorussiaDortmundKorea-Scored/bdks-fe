export const adminUserQueryKeys = {
  all: ["adminUser"] as const,
  users: () => [...adminUserQueryKeys.all, "users"] as const,
};
