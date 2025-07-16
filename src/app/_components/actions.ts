"use server";

import { BingoTile } from "@/types";
import service from "@/utils/supabase";

export async function toggleTile(tile_id: string, completed: boolean) {
  let start = performance.now();
  const { data: value, error: valueError } = await service
    .from("config")
    .select("*")
    .eq("id", "BINGO")
    .single();
  if (valueError) throw new Error(`Error fetching value: ${valueError.message}`);

  const grid = value.options as BingoTile[];
  console.log("get", performance.now() - start);
  start = performance.now();

  const newValue = grid.map((tile) => {
    if (tile.id === tile_id) {
      return { ...tile, completed };
    }
    return tile;
  });

  const { data: result } = await service
    .from("config")
    .update({ options: newValue })
    .eq("id", "BINGO")
    .select("*")
    .single();

  return (result as any).options as BingoTile[];
}
