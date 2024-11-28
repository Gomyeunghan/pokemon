export const findKoreanName = async (value: string) => {
  let currentUrl = "https://pokeapi.co/api/v2/pokemon-species/?limit=1500";

  while (currentUrl) {
    const response = await fetch(currentUrl);
    const data = await response.json();

    for (const item of data.results) {
      const response = await fetch(item.url);
      const pokedata = await response.json();
      const koreanNameEntry = pokedata.names.find(
        (name: { language: { name: string } }) => name.language.name === "ko"
      );

      if (koreanNameEntry?.name === value) {
        console.log(pokedata);
        return pokedata; // 한국어 이름을 찾으면 해당 포켓몬 데이터 반환
      } else {
        console.log("없음");
      }
    }

    // 현재 페이지에서 찾지 못한 경우 다음 페이지로 이동
    currentUrl = data.next;
  }

  return null; // 찾지 못한 경우 null 반환
};
