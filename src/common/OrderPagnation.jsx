export default function OrderPagination({ pageInfo }) {
  const page_button = {
    margin: "0 15px 0 0",
    color: "black",
    fontFamily: "Volkhov",
    textDecoration: "none",

  };

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
        href={`/admin/order?page=${pageInfo.currentPage - 3}`}
      >
        {pageInfo.currentPage - 2}
      </a>
      <a
        style={Object.assign({}, page_button, {
          ...(pageInfo.currentPage - 1 < 1 ? { display: "none" } : { display: "block" }),
        })}
        href={`/admin/order?page=${pageInfo.currentPage - 2}`}
      >
        {pageInfo.currentPage - 1}
      </a>
      <a
        style={Object.assign({}, page_button, {
          color: "violet",
        })}
        href={`/admin/order?page=${pageInfo.currentPage}`}
      >
        {pageInfo.currentPage}
      </a>
      <a
        style={Object.assign({}, page_button, {
          ...(pageInfo.currentPage + 1 > pageInfo.totalPage ? { display: "none" } : { display: "block" }),
        })}
        href={`/admin/order?page=${pageInfo.currentPage}`}
      >
        {pageInfo.currentPage + 1}
      </a>
      <a
        style={Object.assign({}, page_button, {
          ...(pageInfo.currentPage + 2 > pageInfo.totalPage ? { display: "none" } : { display: "block" }),
        })}
        href={`/admin/order?page=${pageInfo.currentPage + 1}`}
      >
        {pageInfo.currentPage + 2}
      </a>
    </div>
  );
}