export const fetchLanguage = async (id: number | string) => {
  const response = await fetch(`https://pokeapi.co/api/v2/language/${id}`);
  const data = await response.json();
  return data;
};
