<h1>포켓몬 도감 웹사이트</h1>

- Next.Js를 사용하여 SSR 을 사용하여 포켓몬 도감을 만듬
- 포켓몬 api를 활용하여 1세대부터 8세대 포켓몬 도감
- 새로고침을해도 원하는 페이지에 유지할수있도록 페이지값을 파라미터에 저장하여 새로고침 하여도 원하는 페이지에서 유지가능
- 무한스크롤로 구현하려했으나, UX관점에서 내가 원하는 포켓몬의 위치를 찾는것이 옳은 기능이라 생각하여 구식이지만, 페이지 방식으로 구현함
- 검색기능 구현시 검색된 포켓몬의 이름을 찾고자할때, 하나씩 패칭하는것이 비효율적이라고 깨닳음 너무느림,
- 그래서 처음에 많은 데이터를 불러오더라도 첫패칭시 1500개의 데이터를 한번에 가져와 그안에서 값을 찾도록 기능을 구현함
