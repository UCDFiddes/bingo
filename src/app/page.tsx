import { BingoTile } from "@/types";
import cloudflare from "@/utils/cloudflare";
import BingoGrid from "./_components/BingoGrid";
import service from "@/utils/supabase";

export default async function Page() {
  const { data: value, error: valueError } = await service
    .from("config")
    .select("*")
    .eq("id", "BINGO")
    .single();
  if (valueError) throw new Error(`Error fetching value: ${valueError.message}`);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center">
      <BingoGrid initalGrid={value.options} />
    </div>
  );
}
