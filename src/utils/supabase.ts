import { createClient } from "@supabase/supabase-js";

const service = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
export default service;
