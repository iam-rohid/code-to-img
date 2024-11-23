import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const domain = headersList.get("host") as string;

  const baseUrl =
    domain === "localhost:3000" ? `http://${domain}` : `https://${domain}`;

  return [{ url: baseUrl, lastModified: new Date() }];
}
