import Cloudflare from "cloudflare";

export default new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_KEY,
});
