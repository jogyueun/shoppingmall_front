export default function Pagination({ pageInfo, categoryId, keyword }) {
  const page_button = {
    margin: "0 15px 0 0",
    color: "black",
    fontFamily: "Volkhov",
    textDecoration: "none",
  };
  let herfUri = `/?keyword=${keyword}&categoryId=${categoryId}`;

  const queryParams = new URLSearchParams(location.search)

  const params = {
    keyword: queryParams.get("keyword") ? queryParams.get("keyword") : "",
    categoryId: queryParams.get("categoryId")
      ? queryParams.get("categoryId")
      : 0,
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <a
        style={Object.assign({}, page_button, {
          ...(pageInfo.currentPage - 2 < 1 ? { display: "none" } : { display: "block" }),
        })}
        href={`/?keyword=${params.keyword}&categoryId=${params.categoryId}&page=${pageInfo.currentPage - 2}`}
      >
        {pageInfo.currentPage - 2}
      </a>
      <a
        style={Object.assign({}, page_button, {
          ...(pageInfo.currentPage - 1 < 1 ? { display: "none" } : { display: "block" }),
        })}
        href={`/?$keyword=${params.keyword}&categoryId=${params.categoryId}&page=${pageInfo.currentPage - 1}`}
      >
        {pageInfo.currentPage - 1}
      </a>
      <a
        style={Object.assign({}, page_button, {
          color: "violet",
        })}
        href={`/?keyword=${params.keyword}&categoryId=${params.categoryId}&page=${pageInfo.currentPage}`}
      >
        {pageInfo.currentPage}
      </a>
      <a
        style={Object.assign({}, page_button, {
          ...(pageInfo.currentPage + 1 > pageInfo.totalPage
            ? { display: "none" }
            : { display: "block" }),
        })}
        href={`/?keyword=${params.keyword}&categoryId=${params.categoryId}&page=${pageInfo.currentPage + 1}`}
      >
        {pageInfo.currentPage + 1}
      </a>
      <a
        style={Object.assign({}, page_button, {
          ...(pageInfo.currentPage + 2 > pageInfo.totalPage
            ? { display: "none" }
            : { display: "block" }),
        })}
        href={`/?keyword=${params.keyword}&categoryId=${params.categoryId}&page=${pageInfo.currentPage + 2}`}
      >
        {pageInfo.currentPage + 2}
      </a>
    </div>
  );
}
