import React, { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "./css/changeInfo.module.css";
import { Link } from "react-router-dom";
import Postcode from "../common/postcode";

const ChangeInfo = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const LoginCheck = () => {
    const token = localStorage.getItem("jwtToken");
    if (token === null) {
      errorLogout();
    }
    return null;
  };

  const [inputs, setInputs] = useState({
    username: "",
    name: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    phoneNumber3: "",
    gender: "",
    birthDate: "",
    addressDetail: "",
    address: "",
    postNumber: null,
  });

  const phoneNumber =
    inputs.phoneNumber1 + "-" + inputs.phoneNumber2 + "-" + inputs.phoneNumber3;

  const [addressInfo, setAddressInfo] = useState({ fullAddress: "", zonecode: "" });

  const userDTO = {
    username: inputs.username,
  };

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

  const handleAddressComplete = ({ fullAddress, zonecode }) => {
    setAddressInfo({ fullAddress, zonecode }); // 주소 정보와 zonecode를 상태로 설정
  };

  const errorLogout = () => {
    localStorage.removeItem("jwtToken");
    alert("잘못된 접근입니다.");
    window.location.href = "/login"; // 로그아웃 후 로그인 페이지로 이동
  };

  const handleChangeInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          Authorization: jwtToken,
        },
      };
      // 서버로 회원정보 변경 요청 보내기
      const response = await axios.patch(baseApiUrl + "/api/changeInfo", data, config);
      console.log(response.data);
      setSuccess(true);
      alert("회원정보 변경이 완료되었습니다.");
      window.location.href = "/myPage"; // 변경 후 마이페이지로 이동
    } catch (error) {
      console.error("회원정보 변경 에러:", error, data);
      setError("정보변경에 실패했습니다. 다시 시도해주세요."); // 에러 메시지 설정
      alert("정보변경에 실패했습니다. 다시 시도해주세요.");
      window.location.reload();
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");

        const config = {
          headers: {
            Authorization: token,
          },
        };

        console.log(token);

        const response = await axios.get(baseApiUrl + "/api/myInfor", config);
        // 요청 성공 시 처리
        setSuccess(true);
        const data = response.data;
        const userDTO = data.userDTO;
        const userProfileDTO = data.userProfileDTO;
        const phoneNumberArray = data.userProfileDTO.phoneNumber.split("-");
        const phoneNumber1 = phoneNumberArray[0];
        const phoneNumber2 = phoneNumberArray[1];
        const phoneNumber3 = phoneNumberArray[2];

        setInputs((prevInputs) => ({
          ...prevInputs,
          phoneNumber1: phoneNumber1,
          phoneNumber2: phoneNumber2,
          phoneNumber3: phoneNumber3,
        }));

        const fullAddress = response.data.userProfileDTO.address;
        const zonecode = response.data.userProfileDTO.postNumber;
        setAddressInfo({ fullAddress, zonecode }); // 주소 정보와 zonecode를 상태로 설정

        setInputs((prevInputs) => ({
          ...prevInputs,
          ...userDTO, // userDTO 객체의 모든 속성을 inputs에 병합
        }));

        setInputs((prevInputs) => ({
          ...prevInputs,
          ...userProfileDTO, // userProfileDTO 객체의 모든 속성을 inputs에 병합
        }));

        setJwtToken(token);

        console.log(userDTO);
        console.log(userProfileDTO);
      } catch (error) {
        // 요청 실패 시 처리
        console.error(error.response.data); // 에러 로그에 응답 데이터를 출력합니다.
        alert("회원정보를 가져올 수 없습니다.");
        window.location.href = "/myPage"; // 마이페이지로 이동
      }
      setLoading(false);
    };

    LoginCheck();
    fetchData();
  }, []);
  return (
    <>
      <div className={styles.join_box}>
        <dev className={styles.join_inner_box}>
          <h1>Change Information</h1>
          <div className={styles.inner_input}>
            <input
              name="username"
              placeholder="ID"
              onChange={onChange}
              value={inputs.username}
              className={styles.input_box}
              readOnly
            />
          </div>
          <input
            name="name"
            placeholder="Name"
            onChange={onChange}
            value={inputs.name}
            className={styles.input_box}
          />
          <input
            name="email"
            placeholder="Email"
            onChange={onChange}
            value={inputs.email}
            className={styles.input_box}
          />
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
          <select
            aria-label="gender"
            name="gender"
            onChange={onChange}
            className={styles.input_select}
            value={inputs.gender}
            required
          >
            <option selected disabled value="">
              성별을 선택하세요.
            </option>
            <option value="MALE">남자</option>
            <option value="FEMALE">여자</option>
          </select>

          <input
            type="date"
            name="birthDate"
            aria-label="birthDate"
            onChange={onChange}
            className={styles.input_box}
            value={inputs.birthDate}
            min="1900-01-01"
            max={today}
          />
          <div className={styles.address_box_1}>
            <input
              type="text"
              name="postNumber"
              aria-label="postNumber"
              placeholder="PostNumber"
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
            placeholder="Address"
            className={styles.input_box}
            value={addressInfo.fullAddress}
            readOnly
          ></input>
          <input
            type="text"
            name="addressDetail"
            aria-label="addressDetail"
            placeholder="AddressDetail"
            className={styles.input_box}
            onChange={onChange}
            value={inputs.addressDetail}
          ></input>
          <button className={styles.button} onClick={handleChangeInfo} disabled={loading}>
            {loading ? "변경 중..." : "Change"}
          </button>
        </dev>
      </div>
    </>
  );
};
export default ChangeInfo;
