import { getOnePokemon } from "@/lib/onePokemon";
import { fetchKoreanName } from "@/lib/pokemonKorean";
import { korean } from "@/types/korean";
import type { Pokemon } from "@/types/pokemon";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import S from "./[id].module.css";
import GlobalLayout from "@/layout/globalLayout";
import { ReactNode, useEffect, useState } from "react";
import { fetchType } from "@/lib/fetchType";
import Head from "next/head";

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { id: "1" } }],
    fallback: true,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  try {
    const id = context.params!.id;
    const [poke, test] = await Promise.all([
      getOnePokemon(String(id)),
      fetchKoreanName(String(id)),
    ]);

    const type = await fetchType(poke.types);

    if (!poke && !test) {
      console.log(`No data found for Pokemon ID: ${id}`);
      return {
        notFound: true,
        revalidate: 60, // 1분 후 재시도
      };
    }

    return {
      props: { poke, type, test },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function Pokemon({
  poke,
  type,
  test,
}: {
  poke: Pokemon;
  pokeName: korean;
  randomText: { flavor_text: string };
  type: { name: string; names: { name: string }[] }[];
  test: korean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const testText =
    test?.flavor_text_entries.filter(
      (item: { language: { name: string } }) => item.language.name === "ko"
    ) || [];
  const testEnText =
    test?.flavor_text_entries.filter(
      (item: { language: { name: string } }) => item.language.name === "en"
    ) || [];

  const randomTestText =
    testText.length > 0
      ? testText[Math.floor(Math.random() * testText.length)]
      : null;
  const randomEnTestText =
    testEnText.length > 0
      ? testEnText[Math.floor(Math.random() * testEnText.length)]
      : { flavor_text: "영어 텍스트" };

  const [randomText, setRandomText] = useState<{ flavor_text: string } | null>(
    null
  );
  const [enRandomText, setEnRandomText] = useState<{
    flavor_text: string;
  } | null>(null);

  const filterName = test?.names.filter((item) => item.language.name === "ko");

  useEffect(() => {
    setEnRandomText(randomEnTestText);
    setRandomText(randomTestText);

    setIsLoading(false);
  }, [router.isFallback]);

  if (router.isFallback || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{filterName ? filterName[0].name : ""}</title>
        <meta
          property="og:image"
          content={poke.sprites.front_default || "/pokemon1702772640.png"}
        />
        <link rel="icon" href="/pokemon1702772640.png"></link>
      </Head>
      <div className={S.box}>
        <h1 className={S.h1}>NAME : {filterName ? filterName[0].name : ""}</h1>
        <div className={S.card}>
          <div className={S.container}>
            {poke.sprites.front_default ? (
              <img src={poke.sprites.front_default} alt="pokemon front" />
            ) : (
              ""
            )}
            {poke.sprites.back_default ? (
              <img src={poke.sprites.back_default} alt="pokemon back" />
            ) : (
              ""
            )}
            {poke.sprites.back_shiny ? (
              <img src={poke.sprites.back_shiny} alt="pokemon shiny back" />
            ) : (
              ""
            )}
            {poke.sprites.front_shiny ? (
              <img src={poke.sprites.front_shiny} alt="pokemon shiny front" />
            ) : (
              ""
            )}
          </div>
          <div className={S.info}>
            <p>
              {randomText?.flavor_text || (
                <span>
                  8세대 이후 포켓몬은 한글패치를 지원하지 않습니다.
                  <br />
                  {enRandomText?.flavor_text}
                </span>
              )}
            </p>
            <h2 className={S.h2}>TYPE</h2>
            <ul>
              {type.map((item, index) => {
                return (
                  <li key={index} className={S[item.name]}>
                    <span className={item.name}></span>
                    {item.names[1]?.name || "알수없음"}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
Pokemon.getLayout = (page: ReactNode) => {
  return <GlobalLayout>{page}</GlobalLayout>;
};
