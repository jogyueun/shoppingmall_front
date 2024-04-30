import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { SearchContext } from "./SearchProvider.jsx";
import baseApiUrl from "../constants/apiUrl";
import { useLocation } from "react-router-dom";
import { LikeIcon } from "./LikeIcon.jsx";
import { CartIcon } from "./CartIcon.jsx";
import axios from "axios";
import styles from "./css/Header.module.css";

const nav_category_style = {
  backgroundColor: "transparent",
  borderColor: "transparent",
  fontFamily: "Volkhov",
  color: "black",
};

const logo_style = {
  cursor: "pointer",
};

export default function Header2() {
  const [token, setToken] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [jwtToken, setJwtToken] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categoryTree, setCategoryTree] = useState([]);

  const location = useLocation();

  const { setSearchQuery, setCategoryId, setCategoriesName } = useContext(SearchContext);

  const Logout = () => {
    localStorage.removeItem("jwtToken");
    setAdmin(false);
    window.location.href = "/"; // 로그아웃 후 메인페이지로 이동
  };

  const MoveHome = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchData = async () => {
      const categories = await fetchCategories();
      const newCategoryTree = buildCategoryTree(categories);
      setCategoryTree(newCategoryTree);
    };
    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(baseApiUrl + "/api/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const buildCategoryTree = (categories) => {
    const categoryTree = [];
    const categoryMap = new Map();

    // 각 카테고리를 맵에 저장
    categories.forEach((category) => {
      categoryMap.set(category.id, {
        ...category,
        children: [],
      });
    });

    // 루트 노드들을 찾아서 categoryTree에 추가
    categories.forEach((category) => {
      const categoryNode = categoryMap.get(category.id);
      if (!category.superId) {
        categoryTree.push(categoryNode);
      } else {
        const parentCategory = categoryMap.get(category.superId);
        if (parentCategory) {
          parentCategory.children.push(categoryNode);
        }
      }
    });

    return categoryTree;
  };

  useEffect(() => {
    setAdmin(false);
    const JWTToken = localStorage.getItem("jwtToken");

    if (JWTToken) {
      // JWT 토큰이 있는 경우
      setToken(true);
      setJwtToken(JWTToken);
      fetchData();
    } else {
      // JWT 토큰이 없는 경우
    }
  }, [location.pathname]); // 경로 정보가 업데이트 될 때마다 useEffect 훅 실행

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const JWTToken = localStorage.getItem("jwtToken");
    console.log(JWTToken);
    try {
      const config = {
        headers: {
          Authorization: JWTToken,
        },
      };

      const response = await axios.get(baseApiUrl + "/api/myInfor", config);
      // 요청 성공 시 처리
      setSuccess(true);
      const data = response.data;
      console.log(data);
      const userRole = data.userDTO.userRole;
      if (userRole == "ROLE_ADMIN") {
        setAdmin(true);
        console.log("확인완료");
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setLoading(false);
    console.log(role);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <header>
        <div className="container">
          <nav>
            <ul>
              <li>
                <h2>
                  <strong onClick={MoveHome} style={logo_style}>
                    Women's clothing shopping mall
                  </strong>
                </h2>
              </li>
            </ul>
            <ul>
              <li>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(e.target.elements.search.value);
                  }}
                >
                  <input
                    type="search"
                    name="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                </form>
              </li>
              <li>
                <Link to="/wish">
                  <LikeIcon></LikeIcon>
                </Link>
              </li>

              <li>
                <Link to="/cart">
                  <CartIcon></CartIcon>
                </Link>
              </li>
              {token ? (
                <>
                  <div className={styles.nav_logout} onClick={Logout}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="20"
                      viewBox="0 0 4 4"
                      fill="none"
                    >
                      <path
                        d="M0.40375 4C0.28875 4 0.19275 3.9615 0.11575 3.8845C0.03875 3.8075 0.000166667 3.71142 0 3.59625V0.40375C0 0.28875 0.0385833 0.19275 0.11575 0.11575C0.192917 0.03875 0.288917 0.000166667 0.40375 0H2.00475V0.25H0.40375C0.365417 0.25 0.330167 0.266 0.298 0.298C0.265833 0.33 0.249833 0.36525 0.25 0.40375V3.59625C0.25 3.63458 0.266 3.66983 0.298 3.702C0.33 3.73417 0.36525 3.75017 0.40375 3.75H2.00475V4H0.40375ZM3.1155 2.8845L2.94 2.70475L3.51975 2.125H1.298V1.875H3.51975L2.93975 1.295L3.1155 1.1155L4 2L3.1155 2.8845Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  {!admin && (
                    <Link to={"/mypage"} className={styles.nav_main_2_login_button}>
                      MyPage
                    </Link>
                  )}
                  {admin && (
                    <Link to={"/admin"} className={styles.nav_main_2_login_button}>
                      Admin
                    </Link>
                  )}
                </>
              ) : (
                <Link to={"/login"} className={styles.nav_main_2_login_button}>
                  Login
                </Link>
              )}
            </ul>
          </nav>
          <nav>
            <ul>
              {categoryTree.map((firstCategory) => (
                <>
                  <li>
                    <a className="contrast">
                      <details className="dropdown">
                        <summary style={nav_category_style}>{firstCategory.name}</summary>
                        <ul>
                          {firstCategory.children.map((secondCategory) => (
                            <li key={secondCategory.id}>
                              <a
                                style={{ fontFamily: "Volkhov" }}
                                onClick={() => {
                                  setCategoryId(secondCategory.id);
                                  setCategoriesName([
                                    firstCategory.name,
                                    secondCategory.name,
                                  ]);
                                  window.location.href = `/?categoryId=${secondCategory.id}`;
                                }}
                              >
                                {secondCategory.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </a>
                  </li>
                </>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
