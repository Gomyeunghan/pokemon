import { useEffect } from "react";
import { Pokemon } from "@/types/pokemon";

let pokemonCache: Array<{
  id: number;
  koreanName: string;
  data: Pokemon;
}> | null = null;

export const useFetchPokemonData = () => {
  useEffect(() => {
    const fetchData = async () => {
      if (!pokemonCache) {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon-species/?limit=1500"
        );
        const data = await response.json();

        // 모든 포켓몬 데이터를 병렬로 가져오기
        pokemonCache = await Promise.all(
          data.results.map(async (item: { url: string }) => {
            const response = await fetch(item.url);
            const pokedata = await response.json();
            const koreanName = pokedata.names.find(
              (name: { language: { name: string } }) =>
                name.language.name === "ko"
            )?.name;

            return {
              id: pokedata.id,
              koreanName,
              data: pokedata,
            };
          })
        );
      }
    };

    fetchData();
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행

  return pokemonCache;
};
