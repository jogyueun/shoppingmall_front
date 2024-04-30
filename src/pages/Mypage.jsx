import { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "./css/mypage.module.css";
import { Link } from "react-router-dom";

const Mypage = () => {
  const [jwtToken, setJwtToken] = useState("");
  const [hello, setHello] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userDTO, setUserDTO] = useState({
    username: "",
    password: "",
    secondPassword: "",
  });
  const [userProfileDTO, setUserProfileDTO] = useState({
    address: "",
    addressDetail: "",
    birthDate: "",
    email: "",
    gender: "",
    name: "",
    phoneNumber: "",
    postNumber: null,
    point: null,
  });

  const errorLogout = () => {
    localStorage.removeItem("jwtToken");
    alert("잘못된 접근입니다.");
    window.location.href = "/login"; // 로그아웃 후 로그인 페이지로 이동
  };

  useEffect(() => {
    const LoginCheck = () => {
      const token = localStorage.getItem("jwtToken");
      if (token === null) {
        errorLogout();
      }
      return null;
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");
        if (token === null) {
          return null;
        }
        const config = {
          headers: {
            Authorization: token,
          },
        };

        const response = await axios.get(baseApiUrl + "/api/myInfor", config);
        // 요청 성공 시 처리
        setSuccess(true);
        const data = response.data;
        const userDTO = data.userDTO;
        const userProfileDTO = data.userProfileDTO;

        const { name, value } = userDTO;
        setUserDTO({
          ...userDTO, // 기존의 input 객체를 복사한 뒤
          [name]: value, // name 키를 가진 값을 value 로 설정
        });

        const { name1, value1 } = response.data.userProfileDTO;
        setUserProfileDTO({
          ...userProfileDTO, // 기존의 input 객체를 복사한 뒤
          [name1]: value1, // name 키를 가진 값을 value 로 설정
        });

        setJwtToken(token);
        setHello(response.data.userProfileDTO.name + "님의 회원정보");

        console.log(userDTO);
        console.log(userProfileDTO);
      } catch (error) {
        // 요청 실패 시 처리
        console.error(error.response.data);
        const type = error.response.data;
        if (
          type == "Expired token" ||
          type == "Invalid token" ||
          type == "User not found" ||
          type == "Token is null"
        ) {
          errorLogout();
        }
        setError(error);
      }
      setLoading(false);
    };
    LoginCheck();
    fetchData();
  }, []);

  //////////////////////////////////////////////////////////////////////////////////////
  // 충전 포인트
  //////////////////////////////////////////////////////////////////////////////////////

  const [modalVisible, setModalVisible] = useState(false); // 모달 창의 가시성을 나타내는 상태 변수 추가
  const [pointValue, setPointValue] = useState(null); // 충전 포인트 상태 변수

  const PointCheckboxChange = (event) => {
    setPointValue(parseInt(event.target.value)); // 선택된 체크박스의 값을 상태로 업데이트합니다.
    console.log(event.target.value);
    console.log(pointValue);
  };

  const AddPoint = async () => {
    setLoading(true);
    setError(null);
    console.log(setPointValue);
    try {
      const config = {
        headers: {
          Authorization: jwtToken,
        },
      };

      // 서버로 요청 보내기
      console.log(jwtToken);
      console.log(config);
      const response = await axios.patch(
        baseApiUrl + "/api/addPoint",
        {
          point: pointValue,
        },
        config,
      );

      setSuccess(true); // 성공 상태 업데이트
      setModalVisible(false);
      alert(pointValue + " 포인트 충전 완료");
      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
      alert("충전 할 포인트를 선택해 주세요.");
    }
    setLoading(false);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 회원 삭제 기능
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [checkPassword, setCheckPassword] = useState(false); // 모달 창의 가시성을 나타내는 상태 변수 추가

  const [inputs, setInputs] = useState({
    password: "",
    secondPassword: "",
  });

  const onChange = (e) => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value, // name 키를 가진 값을 value 로 설정
    });
  };

  const DeleteUser = async () => {
    setLoading(true);
    setError(null);
    const deleteDTO = {
      password: inputs.password,
      secondPassword: inputs.secondPassword,
    };
    try {
      const config = {
        headers: {
          Authorization: jwtToken,
        },
      };

      // 서버로 요청 보내기
      console.log(jwtToken);
      console.log(config);
      const response = await axios.patch(
        baseApiUrl + "/api/deleteUser",
        deleteDTO,
        config,
      );

      setSuccess(true); // 성공 상태 업데이트
      setCheckPassword(false);
      alert("계정이 삭제되었습니다.");
      localStorage.removeItem("jwtToken");
      window.location.href = "/"; // 삭제 성공 시 메인페이지 이동
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
    setLoading(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.main_box}>
        <input
          type="text"
          className={styles.inner_head_text}
          value={hello}
          readOnly
        ></input>
        <div className={styles.main_inner_box_1}>
          {/* <div className={styles.my_id}></div>
          <div className={styles.my_address}></div> */}
          <div className={styles.my_id_box}>
            <div className={styles.my_id_text}>아이디</div>
            <input className={styles.my_id} value={userDTO.username} readOnly></input>
          </div>

          <div className={styles.my_email_box}>
            <div className={styles.my_email_text}>이메일</div>
            <input
              className={styles.my_email}
              value={userProfileDTO.email}
              readOnly
            ></input>
          </div>
          <div className={styles.my_phone_box}>
            <div className={styles.my_phone_text}>전화번호</div>
            <input
              className={styles.my_phone}
              value={userProfileDTO.phoneNumber}
              readOnly
            ></input>
          </div>
        </div>
        <div className={styles.main_inner_box_2}>
          <div className={styles.address_text}>주소</div>
          <div className={styles.my_address_number_box}>
            <div className={styles.my_address_number_text}>우편번호</div>
            <input
              className={styles.my_address_number}
              value={userProfileDTO.postNumber}
              readOnly
            ></input>
          </div>
          <div>
            <div className={styles.my_address_detail_text}>상세 주소</div>
            <input
              className={styles.my_address}
              value={userProfileDTO.address}
              readOnly
            ></input>
            <input
              className={styles.my_address}
              value={userProfileDTO.addressDetail}
              readOnly
            ></input>
          </div>
        </div>
        <div className={styles.main_inner_box_3}>
          <div className={styles.order_box}>
            <div className={styles.order_box_text}>주문 조회</div>
            <div className={styles.order_box_inner}>
              <Link to={"/user/order"} className={styles.order_move_button}>
                이동하기
              </Link>
            </div>
          </div>
          <div className={styles.like_box}>
            <div className={styles.like_box_text}>장바구니</div>
            <div className={styles.like_box_inner}>
              <Link to={"/cart"} className={styles.cart_move_button}>
                이동하기
              </Link>
            </div>
          </div>
          <div className={styles.point_box}>
            <div className={styles.point_box_text}>적립금</div>
            <div className={styles.point_box_inner}>
              <input
                className={styles.point_input_box}
                value={userProfileDTO.point}
                readOnly
              ></input>
            </div>
            <button
              className={styles.point_add_button}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              적립금 충전
            </button>
          </div>
        </div>
        <Link to={"/changeInfo"} className={styles.my_info_change}>
          정보 변경
        </Link>
        <button
          className={styles.delete_button}
          onClick={() => {
            setCheckPassword(true);
          }}
        >
          계정 삭제
        </button>
        {modalVisible && (
          <div className={styles.modal_background}>
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modal_Header}>충전할 금액을 선택해 주세요.</div>
                <div className={styles.modal_select_box}>
                  <div className={styles.modal_select_1}>
                    <div className={styles.modal_select_text_1}>
                      <input
                        type="radio"
                        name="addPoint"
                        value={5000}
                        onChange={PointCheckboxChange}
                      />
                      <div>5000</div>
                    </div>
                    <div className={styles.modal_select_text_2}>
                      <input
                        type="radio"
                        name="addPoint"
                        value={10000}
                        onChange={PointCheckboxChange}
                        className={styles.modal_select_1_check_2}
                      />
                      <div>10000</div>
                    </div>
                  </div>
                  <div className={styles.modal_select_2}>
                    <div className={styles.modal_select_text_3}>
                      <input
                        type="radio"
                        name="addPoint"
                        value={30000}
                        onChange={PointCheckboxChange}
                      />
                      <div>30000</div>
                    </div>
                    <div className={styles.modal_select_text_4}>
                      <input
                        type="radio"
                        name="addPoint"
                        className={styles.modal_select_2_check_2}
                        value={50000}
                        onChange={PointCheckboxChange}
                      />
                      <div>50000</div>
                    </div>
                  </div>
                </div>
                <button
                  disabled={loading}
                  className={styles.modal_button}
                  onClick={AddPoint}
                >
                  {loading ? "충전 중..." : "포인트 충전"}
                </button>
                <br></br>
                <br></br>
                <button
                  className={styles.modal_button}
                  onClick={() => {
                    setModalVisible(false);
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
        {checkPassword && (
          <div className={styles.modal_background}>
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modal_Header}>
                  계정을 삭제하기 위해 비밀번호를 입력해주세요.
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={onChange}
                  value={inputs.password}
                  className={styles.input_box}
                />
                <input
                  name="secondPassword"
                  type="password"
                  placeholder="Check Password"
                  onChange={onChange}
                  value={inputs.secondPassword}
                  className={styles.input_box}
                />
                <button
                  disabled={loading}
                  className={styles.modal_button}
                  onClick={DeleteUser}
                >
                  {loading ? "계정 삭제 중..." : "Delete"}
                </button>
                <br></br>
                <br></br>
                <button
                  className={styles.modal_button}
                  onClick={() => {
                    setCheckPassword(false);
                  }}
                >
                  Close
                </button>
                {error && checkPassword && <p>{error}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mypage;
