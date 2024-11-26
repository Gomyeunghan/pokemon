import { PokemonBasic } from "@/types/pokemon";
import { getPokemons } from "./pokemonSelect";

export const getAllPokemon = async (url: string) => {
  const AllPokemon: string[] = [];
  try {
    const response = await fetch(url);
    const data = await response.json();
    // map 대신 forEach 사용
    data.results.forEach((poke: PokemonBasic) => {
      AllPokemon.push(poke.url);
    });
    const pokemon = await getPokemons(AllPokemon);
    return pokemon;
  } catch (error) {
    console.error(error);
  }
};
