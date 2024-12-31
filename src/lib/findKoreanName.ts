import { Pokemon } from "@/types/pokemon";

export const findKoreanName = (
  value: any,
  pokemonCache: Array<{
    id: number;
    koreanName: string;
    data: Pokemon;
  }> | null
) => {
  let found = null;
  // 캐시된 데이터에서 검색
  if (value / 1) {
    found = pokemonCache?.find((pokemon) => pokemon.id === Number(value));
    return found;
  } else {
    found = pokemonCache?.find((pokemon) => pokemon.koreanName === value);
    return found;
  }
};
