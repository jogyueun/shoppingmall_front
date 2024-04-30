import React, { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "./oauth2.module.css";
import naverLoginImg from "./img/naver_login.png";
import kakaoLoginImg from "./img/kakao_login.png";

const Oauth2 = () => {
  const generateState = () => {
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    return randomString;
  };

  const naverLogin = () => {
    localStorage.removeItem("state");
    const clientId = "9Q8c9IK6So2HtQXhhMIS"; // 클라이언트 아이디
    const redirectUri = encodeURIComponent(
      "http://localhost:8080/api/oauth2/login/code/naver", // 콜백 URL(URL 인코딩)
    );

    const state = generateState(); // 상태토큰 생성
    localStorage.setItem("state", state);

    // 실제 네이버 로그인 URL 생성
    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;

    // 네이버 로그인 URL로 이동
    window.location.href = naverLoginUrl;
  };

  const kakaoLogin = () => {
    localStorage.removeItem("state");
    const clientId = "970cbe2ef7655253c4bdd40bbf7de07a"; // 클라이언트 아이디
    const redirectUri = "http://localhost:8080/api/oauth2/login/code/kakao"; // 콜백 URL

    const state = generateState(); // 상태토큰 생성
    localStorage.setItem("state", state);

    // 실제 카카오 로그인 URL 생성
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;

    // 카카오 로그인 URL로 이동
    window.location.href = kakaoLoginUrl;
  };

  return (
    <>
      <div className={styles.naver_login} onClick={naverLogin}>
        <img src={naverLoginImg} alt="네이버 로그인" className={styles.img}></img>
      </div>
      <div className={styles.kakao_login} onClick={kakaoLogin}>
        <img src={kakaoLoginImg} alt="카카오 로그인" className={styles.img}></img>
      </div>
    </>
  );
};

export default Oauth2;
