export const getOnePokemon = async (id: string | number) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!res.ok) {
      // 404 or other error status
      console.error(`Failed to fetch Pokemon with ID ${id}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching Pokemon with ID ${id}:`, error);
    return null;
  }
};
