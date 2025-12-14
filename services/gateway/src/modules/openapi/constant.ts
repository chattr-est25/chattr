// tagGroups will group tags by name
// IMP: if tag not listed here will not be shown on docs
export const tagGroups: Array<{ name: string; tags: string[] }> = [
  {
    name: "Gateway",
    tags: ["gateway/health"],
  },
  {
    name: "User Service",
    tags: ["user/health"],
  },
  {
    name: "Chat Service",
    tags: ["chat/health"],
  },
] as const;
