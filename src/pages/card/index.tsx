import { korean } from "@/types/korean";
import { Pokemon } from "@/types/pokemon";
import S from "./index.module.css";
import Link from "next/link";

export default function Card({
  poke,
  koreanData,
}: {
  poke: Pokemon;
  koreanData: korean;
}) {
  return (
    <div key={poke.id} className={S.container}>
      <Link href={`pokemon/${poke.id}`} className={S.Link}>
        <img src={poke.sprites.front_default}></img>
        <span className={S.name}>
          {koreanData ? koreanData.names[2].name : "로딩중"}
        </span>
      </Link>
    </div>
  );
}
