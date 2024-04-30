import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./css/Header.module.css";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import { LikeIcon } from "./LikeIcon.jsx";
import { CartIcon } from "./CartIcon.jsx";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [token, setToken] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [jwtToken, setJwtToken] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const location = useLocation();

  const Logout = () => {
    localStorage.removeItem("jwtToken");
    setAdmin(false);
    window.location.href = "/"; // 로그아웃 후 메인페이지로 이동
  };

  const MoveHome = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    // 경로가 변경될 때마다 실행되는 로직
    console.log("경로가 변경되었습니다:", location.pathname);
    const JWTToken = localStorage.getItem("jwtToken");
    if (JWTToken) {
      // JWT 토큰이 존재하는 경우
      const decodedToken = jwtDecode(JWTToken);
      const expirationTime = decodedToken.exp;
      console.log(decodedToken);
      // 현재 시간을 가져옵니다.
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime < expirationTime) {
        console.log("엑세스 토큰이 유효합니다.");
      }

      console.log(expirationTime);
      console.log(currentTime);
      setJwtToken(JWTToken);
      fetchData();
      setToken(true);
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

  return (
    <header style={{ backgroundColor: "back" }}>
      <div className={styles.nav}>
        <nav>
          <ul>
            <li>
              <h2>
                <strong onClick={MoveHome} className={styles.logo_style}>
                  Women's clothing shopping mall
                </strong>
              </h2>
            </li>
          </ul>
          <ul className={styles.temp}>
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
                  <Link to={"/mypage"} className={styles.nav_main_login_button}>
                    MyPage
                  </Link>
                )}
                {admin && (
                  <Link to={"/admin"} className={styles.nav_main_login_button}>
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <Link to={"/login"} className={styles.nav_main_login_button}>
                Login
              </Link>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
