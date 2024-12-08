import GlobalLayout from "@/layout/globalLayout";
import { getAllPokemon } from "@/lib/pokemon";
import { fetchKoreanName } from "@/lib/pokemonKorean";
import { korean } from "@/types/korean";
import { Pokemon } from "@/types/pokemon";
import { ReactNode, useEffect, useState } from "react";
import Card from "./card";
import S from "./index.module.css";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { useFetchPokemonData } from "@/lib/useFetchPokemonData";
import Head from "next/head";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const query = context.query;
  const pokemon = await getAllPokemon(
    `https://pokeapi.co/api/v2/pokemon/?limit=${Number(query.limit)}&offset=0/`
  );
  const koreanName = await Promise.all(
    pokemon!.map(async (poke) => {
      const data = await fetchKoreanName(poke.id);
      return data;
    })
  );

  return {
    props: { pokemon, koreanName, query: context.query },
  };
};

export default function Home({
  pokemon,
  koreanName,
  query,
}: {
  pokemon: Pokemon[];
  koreanName: korean[];
  query: { limit: string };
}) {
  const router = useRouter();
  const [currentLimit, setCurrentLimit] = useState(Number(query.limit));
  const [pokemonList, setPokemonList] = useState(pokemon);
  const [koreanNameList, setKoreanNameList] = useState(koreanName);
  useEffect(() => {
    router.push(`/?limit=${currentLimit}`);
  }, []);

  const handleClick = async () => {
    const newLimit = currentLimit + 20;
    setCurrentLimit(newLimit);
    await router.push(`?limit=${newLimit}`, undefined, {
      shallow: true,
    });
    try {
      const newPokemon = await getAllPokemon(
        `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${currentLimit}}/`
      );

      if (newPokemon) {
        setPokemonList([...pokemonList, ...newPokemon]);
        const koreanName = await Promise.all(
          newPokemon!.map(async (poke: Pokemon): Promise<korean> => {
            const data = await fetchKoreanName(poke.id);

            return data!;
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
      <Head>
        <title>포켓몬 도감</title>
        <meta
          property="og:image"
          content="/International_Pokémon_logo.svg.webp"
        />
        <link rel="icon" href="/pokemon1702772640.png"></link>
      </Head>

      <main
        style={{ display: "flex", flexWrap: "wrap", gap: "50px" }}
        className={S.container}
      >
        {pokemonList.map((poke: Pokemon, index: number) => {
          const koreanData = koreanNameList[poke.id - 1];
          return <Card key={index} poke={poke} koreanData={koreanData}></Card>;
        })}
      </main>
      <button onClick={handleClick} className={S.button}>
        더보기
      </button>
    </>
  );
}
Home.getLayout = (page: ReactNode) => {
  return <GlobalLayout>{page}</GlobalLayout>;
};
