import { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "./css/login.module.css";
import { Link } from "react-router-dom";
import Oauth2 from "../oauth2/oauth2";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const DTO = {
    username: inputs.username,
    password: inputs.password,
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      alert("잘못된 접근입니다.");
      window.location.href = "/";
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // 서버로 로그인 요청 보내기
      const response = await axios.post(baseApiUrl + "/api/login", DTO);

      console.log(response.data); // 성공적으로 로그인되었을 때 서버의 응답을 확인
      setSuccess(true); // 로그인 성공 상태 업데이트

      const headers = response.headers; // AxiosHeaders 객체
      console.log(headers);
      const jwtToken = headers["authorization"]; // Authorization 헤더의 값
      console.log("Authorization Header:", jwtToken);

      localStorage.setItem("jwtToken", jwtToken); // 로컬 스토리지에 토큰 저장

      const temp = localStorage.getItem("jwtToken");

      console.log("로컬스토리지 토큰 : " + temp);

      // localStorage.removeItem('jwtToken');

      window.location.href = "/"; // 로그인 성공시 메인페이지로 이동
    } catch (error) {
      setInputs({
        username: "",
        password: "",
      });
      // alert(error.response.data);
      console.log(error);
    }
    setLoading(false);
  };

  const onChange = (e) => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value, // name 키를 가진 값을 value 로 설정
    });
  };

  return (
    <>
      <div className={styles.main_box}>
        <form class="container" className={styles.login_box}>
          <input
            name="username"
            className={styles.input_box}
            type="text"
            placeholder="아이디"
            onChange={onChange}
            value={inputs.username}
          />
          <input
            name="password"
            className={styles.input_box}
            type="password"
            placeholder="비밀번호"
            onChange={onChange}
            value={inputs.password}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className={styles.login_button}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
          <div class="container" className={styles.SNS_Box}>
            <Oauth2 />
          </div>
          <div className={styles.login_footer}>
            <Link to="/findId" className={styles.login_footer_space_2}>
              아이디 찾기
            </Link>{" "}
            |{" "}
            <Link
              to="/findPassword"
              className={`${styles.login_footer_space_1} ${styles.login_footer_space_2}`}
            >
              비밀번호 찾기
            </Link>
            |{" "}
            <Link to="/join" className={styles.login_footer_space_1}>
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
