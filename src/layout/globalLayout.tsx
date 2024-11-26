import { useState } from "react";
import S from "./globalLayout.module.css";
import { findKoreanName } from "@/lib/findKoreanName";
import { useRouter } from "next/router";
import Link from "next/link";
export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    setIsLoading(true);
    const data = await Promise.all([findKoreanName(value)]);
    await router.push(`/pokemon/${data[0]?.id}`);
    setIsLoading(false);
  };
  if (isLoading || router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div className={S.container}>
      <header className={S.header}>
        <Link href="/">
          <img src="/International_Pokémon_logo.svg.webp" alt="logo" />
        </Link>
      </header>
      <div className={S.component}>
        <input
          className={S.input}
          type="text"
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
      {children}
    </div>
  );
}
