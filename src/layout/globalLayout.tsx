import React, { useState } from "react";
import S from "./globalLayout.module.css";
import { findKoreanName } from "@/lib/findKoreanName";
import { useRouter } from "next/router";
import Link from "next/link";
import { useFetchPokemonData } from "@/lib/useFetchPokemonData";
import Head from "next/head";
export default function GlobalLayout({
  children,
  pokemonCacheProp, // 옵셔널 prop 추가
}: {
  children: React.ReactNode;
  pokemonCacheProp?: ReturnType<typeof useFetchPokemonData>; // 타입 지정
}) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pokemonCache = useFetchPokemonData(); // 기본 캐시

  // 전달받은 prop이 있으면 그걸 사용, 없으면 useFetchPokemonData로 생성된 캐시 사용
  const finalPokemonCache = pokemonCacheProp || pokemonCache;

  const onClick = async () => {
    setIsLoading(true);
    const data = findKoreanName(value, finalPokemonCache);

    await router.push(`/pokemon/${data?.id}`);
    setValue("");
    setIsLoading(false);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>포켓몬도감</title>
        <meta property="og:image" content={"/pokemon1702772640.png"} />
        <link rel="icon" href="/pokemon1702772640.png"></link>
      </Head>
      <div className={S.container}>
        <header className={S.header}>
          <Link href="/?page=0&pageGroup=1">
            <img src="/International_Pokémon_logo.svg.webp" alt="logo" />
          </Link>
        </header>
        <div className={S.component}>
          <input
            className={S.input}
            type="text"
            value={value}
            placeholder="포켓몬 이름을 입력하세요"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClick();
              }
            }}
          />
          <button className={S.button} onClick={onClick}>
            검색
          </button>
        </div>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                pokemonCache: finalPokemonCache,
              } as any) // 타입 캐스팅 추가
            : child
        )}
      </div>
    </>
  );
}
