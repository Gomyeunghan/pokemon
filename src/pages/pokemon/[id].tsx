import { getOnePokemon } from "@/lib/onePokemon";
import { fetchKoreanName } from "@/lib/pokemonKorean";
import { korean } from "@/types/korean";
import { Pokemon } from "@/types/pokemon";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import S from "./[id].module.css";
import GlobalLayout from "@/layout/globalLayout";
import { ReactNode, useEffect, useState } from "react";

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { id: "1" } }],
    fallback: true,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  try {
    const id = context.params!.id;
    const [poke, pokeName] = await Promise.all([
      getOnePokemon(String(id)),
      fetchKoreanName(String(id)),
    ]);
    const flavorText = pokeName.flavor_text_entries.filter(
      (item) => item.language.name === "ko"
    );
    const randomText =
      flavorText[Math.floor(Math.random() * flavorText.length)];

    if (!poke || !pokeName) {
      return {
        notFound: true,
      };
    }
    if (!flavorText.length) {
      return {
        notFound: true,
      };
    }

    return {
      props: { poke, pokeName, randomText },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function Pokemon({
  poke,
  pokeName,
  randomText,
}: {
  poke: Pokemon;
  pokeName: korean;
  randomText: { flavor_text: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, [router.isFallback]);

  if (router.isFallback || isLoading) {
    return <div>Loading...</div>;
  }
  console.log(pokeName);

  return (
    <div className={S.box}>
      <h1>NAME : {pokeName.names[2].name}</h1>
      <div className={S.card}>
        <div className={S.container}>
          <img src={poke.sprites.front_default} alt="pokemon front" />
          <img src={poke.sprites.back_default} alt="pokemon back" />
          <img src={poke.sprites.back_shiny} alt="pokemon shiny back" />
          <img src={poke.sprites.front_shiny} alt="pokemon shiny front" />
        </div>
        <div className={S.info}>
          <p>{randomText.flavor_text}</p>
          <h2>TYPE</h2>
          <ul>
            {poke.types.map((type) => {
              return <li key={type.slot}>{type.type.name}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
Pokemon.getLayout = (page: ReactNode) => {
  return <GlobalLayout>{page}</GlobalLayout>;
};
