export const fetchTotalPokemonCount = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon-species/");
  const data = await response.json();
  return data; // 전체 포켓몬 수 반환
};
