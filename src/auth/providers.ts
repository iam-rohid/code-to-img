import { GitHub, Google } from "arctic";

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID ?? "",
  process.env.GOOGLE_CLIENT_SECRET ?? "",
  `${process.env.AUTH_URL}/login/google/callback`,
);

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID ?? "",
  process.env.GITHUB_CLIENT_SECRET ?? "",
  `${process.env.AUTH_URL}/login/github/callback`,
);
