import { korean } from "@/types/korean";

export const fetchKoreanName = async (id: number | string): Promise<korean> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`
  );
  const data = await response.json();
  return data;
};
