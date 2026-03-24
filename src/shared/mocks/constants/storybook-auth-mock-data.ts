import type { Session, User } from "@supabase/supabase-js";

import type { IProfile } from "@auth/auth-profile/api/auth-profile-api";

interface IStorybookAuthMock {
  user: User;
  session: Session | null;
  profile: IProfile | null;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean }>;
  refreshProfile: () => Promise<void>;
}

export const storybookKakaoAuthMock: IStorybookAuthMock = {
  user: { id: "카카오id여", email: "user@example.com", is_anonymous: false } as User,
  session: null,
  profile: null,
  signOut: async () => {},
  deleteAccount: async () => ({ success: true }),
  refreshProfile: async () => {},
};

export const storybookAnonymousAuthMock: IStorybookAuthMock = {
  user: { id: "익명id여", email: "", is_anonymous: true } as User,
  session: null,
  profile: null,
  signOut: async () => {},
  deleteAccount: async () => ({ success: true }),
  refreshProfile: async () => {},
};
