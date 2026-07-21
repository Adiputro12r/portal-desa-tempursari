/**
 * AparatSlider — Server Component.
 *
 * Fetch data aparat dari Supabase di server,
 * lalu pass ke AparatSliderClient untuk ditampilkan secara interaktif.
 */
import { fetchAparat } from "@/lib/fetchData";
import AparatSliderClient from "@/components/sections/AparatSliderClient";

export default async function AparatSlider() {
  const aparatList = await fetchAparat();
  return <AparatSliderClient initialData={aparatList} />;
}
