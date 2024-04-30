import { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "./css/join.module.css";
import Postcode from "../common/postcode";

const Join = () => {
  const today = new Date().toISOString().split("T")[0];

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    secondPassword: "",
    name: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    phoneNumber3: "",
    gender: "",
    birthDate: "",
    addressDetail: "",
  });

  const [addressInfo, setAddressInfo] = useState({ fullAddress: "", zonecode: "" });

  const handleAddressComplete = ({ fullAddress, zonecode }) => {
    setAddressInfo({ fullAddress, zonecode }); // 주소 정보와 zonecode를 상태로 설정
  };

  const userDTO = {
    username: inputs.username,
    password: inputs.password,
    secondPassword: inputs.secondPassword,
  };

  const phoneNumber =
    inputs.phoneNumber1 + "-" + inputs.phoneNumber2 + "-" + inputs.phoneNumber3;

  const userProfileDTO = {
    name: inputs.name,
    email: inputs.email,
    phoneNumber: phoneNumber,
    postNumber: addressInfo.zonecode,
    address: addressInfo.fullAddress,
    addressDetail: inputs.addressDetail,
    gender: inputs.gender,
    birthDate: inputs.birthDate,
  };

  const data = {
    userDTO: userDTO,
    userProfileDTO: userProfileDTO,
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      // 서버로 회원가입 요청 보내기
      const response = await axios.post(baseApiUrl + "/api/join", data);
      console.log(response.data); // 성공적으로 회원가입되었을 때 서버의 응답을 확인
      setSuccess(true); // 회원가입 성공 상태 업데이트
      window.location.href = "/login"; // 회원가입 성공시 로그인페이지로 이동
    } catch (error) {
      console.error("회원가입 에러:", error, error.response.data);
      setError(error.response.data); // 에러 메시지 설정
      alert("회원가입 실패 : 정확한 정보를 입력해주세요.");
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
      <div className={styles.join_box}>
        <dev className={styles.join_inner_box}>
          <h1>Join us</h1>
          <label htmlFor="idInput">아이디</label>
          <div className={styles.inner_input}>
            <input
              id="idInput"
              name="username"
              placeholder="아이디"
              onChange={onChange}
              value={inputs.username}
              className={styles.input_box}
            />
          </div>
          <label htmlFor="PasswordInput">
            비밀번호 : 영문 + 숫자 + ! 또는 @ 를 포함하여 8자 이상
          </label>
          <input
            id="PasswordInput"
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={onChange}
            value={inputs.password}
            className={styles.input_box}
          />
          <label htmlFor="SecondPasswordInput">비밀번호 확인</label>
          <input
            id="SecondPasswordInput"
            name="secondPassword"
            type="password"
            placeholder="비밀번호 확인"
            onChange={onChange}
            value={inputs.secondPassword}
            className={styles.input_box}
          />
          <label htmlFor="name">이름</label>
          <input
            id="name"
            name="name"
            placeholder="이름"
            onChange={onChange}
            value={inputs.name}
            className={styles.input_box}
          />
          <label htmlFor="Email">이메일</label>
          <input
            id="Email"
            name="email"
            placeholder="이메일"
            onChange={onChange}
            value={inputs.email}
            className={styles.input_box}
          />
          <label htmlFor="PhoneNumber">전화번호</label>
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
          <label htmlFor="gender">성별</label>
          <select
            id="gender"
            aria-label="gender"
            name="gender"
            onChange={onChange}
            className={styles.input_select}
            required
          >
            <option selected disabled value="">
              성별을 선택하세요.
            </option>
            <option value="MALE">남자</option>
            <option value="FEMALE">여자</option>
          </select>
          <label htmlFor="BirthDate">생년월일</label>
          <input
            id="BirthDate"
            type="date"
            name="birthDate"
            aria-label="birthDate"
            onChange={onChange}
            className={styles.input_box}
            min="1900-01-01"
            max={today}
          />
          <div className={styles.address_box_1}>
            <input
              type="text"
              name="postNumber"
              aria-label="postNumber"
              placeholder="우편번호"
              className={styles.postNumber_box}
              value={addressInfo.zonecode}
              readOnly
            ></input>
            <Postcode onComplete={handleAddressComplete} />
          </div>
          <input
            type="text"
            name="address"
            aria-label="address"
            placeholder="주소"
            className={styles.input_box}
            value={addressInfo.fullAddress}
            readOnly
          ></input>
          <label htmlFor="addressDetail">상세주소</label>
          <input
            id="addressDetail"
            type="text"
            name="addressDetail"
            aria-label="addressDetail"
            placeholder="상세주소"
            className={styles.input_box}
            onChange={onChange}
            value={inputs.addressDetail}
          ></input>
          <button className={styles.button} onClick={handleSignUp} disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </dev>
      </div>
    </>
  );
};

export default Join;
