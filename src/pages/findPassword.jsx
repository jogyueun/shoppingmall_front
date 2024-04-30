import { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "./css/findpassword.module.css";
import { Link } from "react-router-dom";

const FindPassword = () => {
  const [inputs, setInputs] = useState({
    username: "",
    source: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    phoneNumber3: "",
    password: "",
    secondPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [modalVisible, setModalVisible] = useState(false); // 모달 창의 가시성을 나타내는 상태 변수 추가

  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onReset = () => {
    setInputs({
      ...inputs,
      email: "",
      phoneNumber1: "",
      phoneNumber2: "",
      phoneNumber3: "",
      username: "",
      password: "",
      secondPassword: "",
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

  const phoneNumber =
    inputs.phoneNumber1 + "-" + inputs.phoneNumber2 + "-" + inputs.phoneNumber3;

  const FindDTO = {
    username: inputs.username,
    source: inputs.source,
    email: inputs.email,
    phoneNumber: phoneNumber,
  };

  const ChangeDTO = {
    username: inputs.username,
    password: inputs.password,
    secondPassword: inputs.secondPassword,
  };

  const handleFindPassword = async () => {
    try {
      // 비밀번호 찾기 로직 실행
      const response = await axios.post(baseApiUrl + "/api/findPassword", FindDTO);
      const success = response.data; // 응답 데이터로부터 성공 여부를 가져옴
      if (success) {
        setModalVisible(true); // 성공 시 모달 창 열기
      }
    } catch (error) {
      onReset();
      alert("비밀번호 찾기에 실패했습니다. 다시 시도해주세요.");
      console.error("비밀번호 찾기 에러:", error);
      setError("비밀번호 찾기에 실패했습니다. 다시 시도해주세요."); // 에러 메시지 설정
    }
  };

  const handleChangePassword = async () => {
    try {
      // 비밀번호 변경 로직 실행
      const response = await axios.patch(baseApiUrl + "/api/findPassword", ChangeDTO);
      console.log(response.data); // 성공적으로 비밀번호 변경이 되었을 때 서버의 응답을 확인
      setSuccess(true); // 비밀번호 변경 성공 상태 업데이트
      window.location.href = "/"; // 로그인 성공시 메인페이지로 이동
    } catch (error) {
      setInputs({
        password: "",
        secondPassword: "",
      });
      resetData();
      alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      console.error("비밀번호 변경 에러:", error);
      setError("비밀번호 변경에 실패했습니다. 다시 시도해주세요."); // 에러 메시지 설정
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      alert("잘못된 접근입니다.");
      window.location.href = "/";
    }
  }, []);

  const resetData = () => {
    setInputs({
      password: "",
      secondPassword: "",
    });
  };

  return (
    <>
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
              무엇으로 비밀번호를 찾으시겠습니까?
            </option>
            <option value="EMAIL">이메일</option>
            <option value="PHONE">전화번호</option>
          </select>
          {renderEmailInput()}
          {renderPhoneNumberInput()}
          <input
            name="username"
            placeholder="아이디를 입력해 주세요."
            onChange={onChange}
            value={inputs.username}
            className={styles.input_box}
          />
          <button
            onClick={handleFindPassword}
            disabled={loading}
            className={styles.button}
          >
            {loading ? "검색 중..." : "Find Password"}
          </button>

          {success && <p>비밀번호검색이 완료되었습니다!</p>}
          {modalVisible && (
            <div className={styles.modal_background}>
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <div className={styles.modal_Header}>
                    변경할 비밀번호를 입력해 주세요.
                  </div>
                  <input
                    name="username"
                    placeholder="ID"
                    value={inputs.username}
                    className={styles.modal_input}
                    readOnly
                  />
                  <input
                    name="password"
                    placeholder="비밀번호를 입력해주세요."
                    type="password"
                    value={inputs.password}
                    className={styles.modal_input}
                    onChange={onChange}
                  />
                  <input
                    name="secondPassword"
                    placeholder="비밀번호를 한번 더 입력해주세요."
                    type="password"
                    value={inputs.secondPassword}
                    className={styles.modal_input}
                    onChange={onChange}
                  />
                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className={styles.modal_button}
                  >
                    {loading ? "검색 중..." : "Change Password"}
                  </button>
                  {/* <br></br>
                  <br></br> */}
                  <button
                    className={styles.modal_button}
                    onClick={() => {
                      setModalVisible(false);
                      onReset();
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FindPassword;
