import { User } from "../../lib/auth/types/auth-response";

export type SiteData = {
  id: string;
  name: string;
  folder: Record<string, any>;
  editors: [
    {
      user: User;
      can_delete: boolean;
      can_read: boolean;
      can_write: boolean;
      is_owner: boolean;
    },
  ];
};
