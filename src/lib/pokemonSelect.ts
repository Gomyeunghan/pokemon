export const getPokemons = async (url: string[]) => {
  try {
    // Promise.all을 사용하여 모든 요청을 병렬로 처리
    const response = await Promise.all(
      url.map(async (url) => {
        const response = await fetch(url);
        return response.json();
      })
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error; // 에러를 상위로 전파
  }
};
