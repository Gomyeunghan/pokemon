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
import Head from "next/head";
import { fetchTotalPokemonCount } from "@/lib/pokemoncount";
import { motion } from "framer-motion";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { page = "0", pageGroup = "1" } = context.query;
  const offset = Number(page) * 20;
  const pokemon = await getAllPokemon(
    `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}/`
  );
  const koreanName = await Promise.all(
    (pokemon ?? []).map(async (poke) => fetchKoreanName(poke.id))
  );
  const allPokemon = await fetchTotalPokemonCount();

  return {
    props: { pokemon, koreanName, query: context.query, allPokemon },
  };
};

export default function Home({
  pokemon,
  koreanName,
  query,
  allPokemon,
}: {
  pokemon: Pokemon[];
  koreanName: korean[];
  query: { page: string; pageGroup: string };
  allPokemon: { count: number };
}) {
  const router = useRouter();
  const [pokemonList, setPokemonList] = useState(pokemon);
  const [koreanNameList, setKoreanNameList] = useState(koreanName);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(Number(query.page));
  const [isLoading, setLoading] = useState(false);

  const pageCount = Math.ceil(allPokemon.count / 20);
  const pageGrupCount = Math.ceil(pageCount / 5);
  const page = Number(query.page || "0");

  useEffect(() => {
    setLoading(true);

    router.push("/?page=0&pageGroup=1");
    const fetchPokemon = async () => {
      const offset = page * 20;
      const newPokemon: Pokemon[] =
        (await getAllPokemon(
          `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}/`
        )) || [];

      const newKoreanName = await Promise.all(
        pokemon!.map(async (poke) => {
          const data = await fetchKoreanName(poke.id);
          return data;
        })
      );
      setPokemonList(newPokemon);
      setKoreanNameList(
        newKoreanName.filter((name): name is korean => name !== null)
      );
      setLoading(false);
    };

    if (query.page) {
      fetchPokemon();
    }
  }, [query.page]);

  useEffect(() => {
    const pageGroupFromQuery = router.query.pageGroup
      ? Number(router.query.pageGroup)
      : 1;

    setCurrentPage(pageGroupFromQuery);
  }, [query.pageGroup]);

  const handlePageClick = async (page: number) => {
    setLoading(true);
    setPokemonList([]);
    await router.push(`?page=${page}&pageGroup=${currentPage}`, undefined, {
      shallow: false,
    });
    setLoading(false);
  };
  const handleNextGroup = () => {
    const nextGroup = currentPage + 1;
    setCurrentPage(nextGroup);
    router.push(`?pageGroup=${nextGroup}`, undefined, { shallow: true });
  };

  const handlePrevGroup = () => {
    const prevGroup = Math.max(currentPage - 1, 1);
    setCurrentPage(prevGroup);
    router.push(`?pageGroup=${prevGroup}`, undefined, { shallow: true });
  };

  console.log(koreanNameList);

  return (
    <>
      <Head>
        <title>포켓몬 도감</title>
        <meta
          property="og:image"
          content="International_Pokémon_logo.svg.webp"
        />
        <link rel="icon" href="/pokemon1702772640.png"></link>
      </Head>
      {!isLoading ? (
        <main className={S.container}>
          {pokemonList.map((poke: Pokemon, index: number) => {
            const koreanData = koreanNameList[index];

            return (
              <Card key={index} poke={poke} koreanData={koreanData}></Card>
            );
          })}
        </main>
      ) : (
        <div>loading...</div>
      )}
      {!isLoading ? (
        <div className={S.button_wrapper}>
          {currentPage > 1 ? (
            <motion.button
              onClick={handlePrevGroup}
              className={S.next_button}
              whileHover={{ scale: 1.07 }}
            >
              이전
            </motion.button>
          ) : (
            ""
          )}

          {Array.from({
            length: Math.max(
              0,
              Math.min(pageCount - (Math.max(1, currentPage) - 1) * 5, 5)
            ),
          }).map((_, index) => {
            const buttonPage = index + (Math.max(1, currentPage) - 1) * 5;

            return Number(buttonPage) === Number(query.page) ? (
              <button
                disabled
                className={S.active_button}
                key={index}
                onClick={() => {
                  handlePageClick(buttonPage);
                }}
              >
                {buttonPage + 1}
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.07 }}
                className={S.page_button}
                key={index}
                onClick={() => {
                  handlePageClick(buttonPage);
                }}
              >
                {buttonPage + 1}
              </motion.button>
            );
          })}

          {currentPage < pageGrupCount ? (
            <motion.button
              onClick={handleNextGroup}
              className={S.next_button}
              whileHover={{ scale: 1.07 }}
            >
              다음
            </motion.button>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
Home.getLayout = (page: ReactNode) => {
  return <GlobalLayout>{page}</GlobalLayout>;
};
