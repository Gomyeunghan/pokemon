import { Pokemon } from "@/types/pokemon";

type pokemonCache = Array<{
  id: number;
  koreanName: string;
  data: Pokemon;
}>;

export const fetchData = async (): Promise<pokemonCache> => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species/?limit=1500"
  );
  const data = await response.json();

  // 모든 포켓몬 데이터를 병렬로 가져오기
  const pokemonCache = await Promise.all(
    data.results.map(async (item: { url: string }) => {
      const response = await fetch(item.url);
      const pokedata = await response.json();
      const koreanName = pokedata.names.find(
        (name: { language: { name: string } }) => name.language.name === "ko"
      )?.name;

      return {
        id: pokedata.id,
        koreanName,
        data: pokedata,
      };
    })
  );
  return pokemonCache;
};
