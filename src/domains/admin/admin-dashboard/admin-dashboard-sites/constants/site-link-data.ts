import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

export const GITHUB_LOGO = `${SUPABASE_STORAGE_URL}/asset/admin/github.png`;
export const SENTRY_LOGO = `${SUPABASE_STORAGE_URL}/asset/admin/sentry.png`;
export const STORYBOOK_LOGO = `${SUPABASE_STORAGE_URL}/asset/admin/storybook.png`;
export const SUPABASE_LOGO = `${SUPABASE_STORAGE_URL}/asset/admin/supabase.png`;
export const VERCEL_LOGO = `${SUPABASE_STORAGE_URL}/asset/admin/vercel.png`;

export const SITE_LINK_DATA = [
  {
    id: 1,
    link: "https://github.com/BorussiaDortmundKorea-Scored/bdks-fe",
    name: "github",
    logo: GITHUB_LOGO,
  },
  {
    id: 2,
    link: "https://supabase.com/dashboard/project/abxgeyabzwzrorecsjcd",
    name: "supabase",
    logo: SUPABASE_LOGO,
  },
  {
    id: 3,
    link: "https://vercel.com/youngducks-projects/bdks-fe",
    name: "vercel",
    logo: VERCEL_LOGO,
  },
  {
    id: 4,
    link: "https://yd-sentry-labs.sentry.io/insights/projects/bdks-fe/?project=4510211370713088&statsPeriod=14d",
    name: "sentry",
    logo: SENTRY_LOGO,
  },
  {
    id: 5,
    link: "https://main--6763900058319587c2573609.chromatic.com/",
    name: "storybook",
    logo: STORYBOOK_LOGO,
  },
];
