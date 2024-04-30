import React, { useState, useEffect } from "react";
import Sidebar from "../common/AdminSideBar";
import { Outlet, useLocation } from "react-router-dom";
import styles from "./css/adminPage.module.css";

const AdminPage = () => {
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
      setJwtToken(JWTToken);
      fetchData();
      setToken(true);
    } else {
      alert("권한이 없습니다.");
      MoveHome();
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
      if (userRole !== "ROLE_ADMIN") {
        alert("권한이 없습니다.");
        MoveHome();
      }

      setAdmin(true);
      console.log("확인완료");
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setLoading(false);
    console.log(role);
  };

  return (
    <div className="container">
      <Sidebar />
      <div className={styles.main_content}>
        <Outlet />
      </div>
    </div>
  );
};
export default AdminPage;
