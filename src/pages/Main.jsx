import Header2 from "../common/Header2.jsx";
import Footer2 from "../common/Footer2.jsx";
import Pagination from "../common/Pagnaition.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl.js";
import { Link } from "react-router-dom";
import { SearchContext } from "../common/SearchProvider.jsx";

const imageBox = {
  width: 500,
  height: 500,
};

export default function Main() {
  const [products, setProducts] = useState([]);
  const [pageableInfo, setPageableInfo] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { searchQuery, categoryId, categoriesName } = useContext(SearchContext);
  const queryParams = new URLSearchParams(location.search);
  const params = {
    keyword: queryParams.get("keyword") ? queryParams.get("keyword") : searchQuery,
    page: parseInt(queryParams.get("page")) || 1,
    size: 6,
    categoryId: queryParams.get("categoryId")
      ? queryParams.get("categoryId")
      : categoryId,
  };

  // Product 정보를 불러오는 과정
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(false);
        const response = await axios.get(baseApiUrl + "/api/products/search", { params });

        setProducts(response.data.content);
        setPageableInfo(response.data.pageable);
        setTotalElements(response.data.totalElements);
        setTotalPages(response.data.totalPages);

        console.log("로딩 전");
        console.log("params >>", params);
        console.log("response.data >> ", response.data);
        console.log("product >>", products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [searchQuery, categoryId]);

  useEffect(() => {
    setIsLoading(true);
    console.log("로딩 후");
    console.log("params >>", params);
    console.log("product >>", products);
    console.log(products.slice(0, 3));
  }, [products, pageableInfo, totalElements, totalPages]);

  const pageInfo = {
    currentPage: parseInt(queryParams.get("page")) || pageableInfo.pageNumber + 1,
    perPage: pageableInfo.pageSize,
    totalCount: totalElements,
    totalPage: totalPages,
  };

  return (
    <>
      <article>
        <Header2></Header2>
        <div className="container">
          {categoriesName.length > 1 && (
            <h1 style={{ fontSize: "50px", textAlign: "center" }}>
              {categoriesName[0]}/{categoriesName[1]}
            </h1>
          )}
          <div className="grid">
            {isLoading &&
              products &&
              products.slice(0, 3).map((product) => (
                <div>
                  <div key={product.id}>
                    <Link to={"/details/" + product.id}>
                      <img style={imageBox} src={product.imageUrl} alt="" />
                    </Link>
                    <p>{product.name}</p>
                    <p>
                      <strong>{product.price}원</strong>
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <hr />
          <div className="grid">
            {isLoading &&
              products &&
              products.slice(3, 6).map((product) => (
                <div>
                  <div key={product.id}>
                    <Link to={"/details/" + product.id}>
                      <img style={imageBox} src={product.imageUrl} alt="" />
                    </Link>
                    <p>{product.name}</p>
                    <p>
                      <strong>{product.price}원</strong>
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <Pagination
            pageInfo={pageInfo}
            categoryId={categoryId}
            keyword={params.keyword}
          ></Pagination>
        </div>
      </article>
      <Footer2></Footer2>
    </>
  );
}
