export const fetchType = async (
  arr: [{ slot: number; type: { name: string; url: string } }]
) => {
  const typeArr = await Promise.all(
    arr.map(async (item) => {
      const res = await fetch(item.type.url);
      const data = await res.json();
      return data;
    })
  );
  return typeArr;
};
