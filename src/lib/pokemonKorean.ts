import { korean } from "@/types/korean";

export const fetchKoreanName = async (
  id: number | string
): Promise<korean | null> => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`
    );

    if (!response.ok) {
      console.error(`Failed to fetch Korean name for Pokemon with ID ${id}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      `Error fetching Korean name for Pokemon with ID ${id}:`,
      error
    );
    return null;
  }
};
