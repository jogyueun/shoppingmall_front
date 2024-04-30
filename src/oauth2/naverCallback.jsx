import React, { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";

const NaverCallback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const state = new URL(window.location.href).searchParams.get("state");

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(baseApiUrl + "/api/oauth2/login/code/naver", {
          authorizationCode: code,
          state: state,
        });
        const headers = response.headers; // AxiosHeaders 객체
        console.log(headers);
        const jwtToken = headers["authorization"]; // Authorization 헤더의 값
        console.log("Authorization Header:", jwtToken);

        localStorage.setItem("jwtToken", jwtToken); // 로컬 스토리지에 토큰 저장

        const temp = localStorage.getItem("jwtToken");

        console.log("로컬스토리지 토큰 : " + temp);

        localStorage.removeItem("state", state);

        window.location.href = "/"; // 로그인 성공시 메인페이지로 이동
      } catch (error) {
        localStorage.removeItem("state", state);
        //에러발생 시 경고처리 후 login 페이지로 전환
        alert(error);
        window.location.href = "/login";
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return null;
};

export default NaverCallback;
