"use server";

import { BingoTile } from "@/types";
import cloudflare from "@/utils/cloudflare";
import service from "@/utils/supabase";

export async function toggleTile(tile_id: string, completed: boolean) {
  // let start = performance.now();
  // const value = await cloudflare.kv.namespaces.values.get(
  //   "c13c717e93bd44729d3ff17d52faea4a",
  //   "bingo",
  //   {
  //     account_id: "e79d69962669039b1d3c7484307acb2d",
  //   }
  // );
  // const response = await value.json();
  // const grid = JSON.parse(response.value) as BingoTile[];
  // console.log("get", performance.now() - start);
  // start = performance.now();

  // const newValue = grid.map((tile) => {
  //   if (tile.id === tile_id) {
  //     return { ...tile, completed };
  //   }
  //   return tile;
  // });

  // await cloudflare.kv.namespaces.values.update("c13c717e93bd44729d3ff17d52faea4a", "bingo", {
  //   account_id: "e79d69962669039b1d3c7484307acb2d",
  //   value: JSON.stringify(newValue),
  //   metadata: "",
  // });
  // console.log("update", performance.now() - start);

  // return newValue;

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
