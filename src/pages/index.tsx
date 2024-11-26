import GlobalLayout from "@/layout/globalLayout";
import { getAllPokemon } from "@/lib/pokemon";
import { fetchKoreanName } from "@/lib/pokemonKorean";
import { korean } from "@/types/korean";
import { Pokemon } from "@/types/pokemon";
import { ReactNode, useState } from "react";
import Card from "./card";
import S from "./index.module.css";
export const getStaticProps = async () => {
  const pokemon = await getAllPokemon(
    `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0/`
  );
  const koreanName = await Promise.all(
    pokemon!.map(async (poke) => {
      const data = await fetchKoreanName(poke.id);
      console.log(data);
      return data;
    })
  );
  return { props: { pokemon, koreanName } };
};

export default function Home({
  pokemon,
  koreanName,
}: {
  pokemon: Pokemon[];
  koreanName: korean[];
}) {
  const [pokemonList, setPokemonList] = useState(pokemon);
  const [koreanNameList, setKoreanNameList] = useState(koreanName);
  const [offset, setOffset] = useState(0);
  const handleClick = async () => {
    const newOffset = offset + 20;
    setOffset(newOffset);

    try {
      const newPokemon = await getAllPokemon(
        `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${newOffset}/`
      );

      if (newPokemon) {
        setPokemonList([...pokemonList, ...newPokemon]);
        console.log(pokemonList);
        const koreanName = await Promise.all(
          newPokemon!.map(async (poke: Pokemon): Promise<korean> => {
            const data = await fetchKoreanName(poke.id);
            return data;
          })
        );
        if (koreanName && koreanName.length > 0) {
          setKoreanNameList([...koreanNameList, ...koreanName]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {pokemonList.map((poke: Pokemon) => {
          const koreanData = koreanNameList[poke.id - 1];
          return (
            <Card key={poke.id} poke={poke} koreanData={koreanData}></Card>
          );
        })}
      </div>
      <button onClick={handleClick} className={S.button}>
        더보기
      </button>
    </>
  );
}
Home.getLayout = (page: ReactNode) => {
  return <GlobalLayout>{page}</GlobalLayout>;
};
