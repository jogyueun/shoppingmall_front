import { useState, useEffect } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "./css/findid.module.css";

const FindId = () => {
  const [inputs, setInputs] = useState({
    name: "",
    source: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    phoneNumber3: "",
  });

  const phoneNumber =
    inputs.phoneNumber1 + "-" + inputs.phoneNumber2 + "-" + inputs.phoneNumber3;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState("");

  const onChange = (e) => {
    console.log(e);
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onReset = () => {
    setInputs({
      ...inputs,
      name: "",
      source: "",
      email: "",
      phoneNumber1: "",
      phoneNumber2: "",
      phoneNumber3: "",
    });
  };

  // 이메일 선택 시 이메일 입력 창 보이기
  const renderEmailInput = () => {
    if (inputs.source === "EMAIL") {
      return (
        <input
          name="email"
          placeholder="이메일을 입력해 주세요."
          onChange={onChange}
          value={inputs.email}
          className={styles.input_box}
        />
      );
    }
    return null;
  };
  // 전화번호 선택 시 전화번호 입력 창 보이기
  const renderPhoneNumberInput = () => {
    if (inputs.source === "PHONE") {
      return (
        <>
          <div className={styles.phone_box}>
            <input
              name="phoneNumber1"
              placeholder="전화번호 앞자리"
              onChange={onChange}
              value={inputs.phoneNumber1}
              className={styles.input_box}
            />
            <div className={styles.phone_box_devide}>-</div>
            <input
              name="phoneNumber2"
              placeholder="전화번호 가운데"
              onChange={onChange}
              value={inputs.phoneNumber2}
              className={styles.input_box}
            />
            <div className={styles.phone_box_devide}>-</div>
            <input
              name="phoneNumber3"
              placeholder="전화번호 뒷자리"
              onChange={onChange}
              value={inputs.phoneNumber3}
              className={styles.input_box}
            />
          </div>
        </>
      );
    }
    return null;
  };

  const DTO = {
    email: inputs.email,
    phoneNumber: phoneNumber,
    source: inputs.source,
    name: inputs.name,
  };

  const handleFindId = async () => {
    setLoading(true);
    setError(null);
    try {
      // 서버로 아이디찾기 검색 요청 보내기
      const response = await axios.post(baseApiUrl + "/api/findID", DTO);
      console.log(inputs);
      console.log(response.data); // 성공적으로 검색되었을 때 서버의 응답을 확인
      setResult(response.data);
      setSuccess(true); // 검색 성공 상태 업데이트
      alert(response.data);
    } catch (error) {
      onReset();
      alert("아이디 찾기에 실패했습니다. 다시 시도해주세요.");
      console.error("아이디 찾기 에러:", error, DTO);
      setError("아이디 찾기에 실패했습니다. 다시 시도해주세요."); // 에러 메시지 설정
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      alert("잘못된 접근입니다.");
      window.location.href = "/";
    }
  }, []);

  return (
    <div className={styles.box}>
      <div className={styles.inner_box}>
        <select
          name="source"
          aria-label="source"
          required
          onChange={onChange}
          value={inputs.source}
          className={styles.input_select}
        >
          <option disabled value="">
            무엇으로 아이디를 찾으시겠습니까?
          </option>
          <option value="EMAIL">이메일</option>
          <option value="PHONE">전화번호</option>
        </select>
        {renderEmailInput()}
        {renderPhoneNumberInput()}
        <input
          name="name"
          placeholder="이름을 입력해 주세요."
          onChange={onChange}
          value={inputs.name}
          className={styles.input_box}
        />
        <button className={styles.button} onClick={handleFindId} disabled={loading}>
          {loading ? "검색 중..." : "Find ID"}
        </button>
      </div>
    </div>
  );
};

export default FindId;
