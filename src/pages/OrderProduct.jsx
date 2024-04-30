import { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "../pages/css/order.module.css";
import Postcode2 from "../common/PostCode2.jsx";
import { useParams } from "react-router-dom";

const OrderProduct = () => {
  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) {
    alert("로그인 후 이용해주세요");
    window.location.href = "/";
  }
  const savedOrderProduct = localStorage.getItem("orderProduct");
  const orderProduct = savedOrderProduct ? JSON.parse(savedOrderProduct) : null;
  console.log(orderProduct);
  if (!orderProduct) {
    alert("주문을 진행할 수 없습니다");
    setTimeout(() => {
      window.location.href = "/";
    }, 0);
  }
  const [useMemberInfo, setUseMemberInfo] = useState({ state: true });
  const [userProfile, setuserProfile] = useState({
    address: "",
    addressDetail: "",
    name: "",
    phoneNumber: "",
    postNumber: "",
    point: "",
  });
  const [newDelivery, setnewDelivery] = useState({
    address: "",
    addressDetail: "",
    name: "",
    phoneNumber: "",
    postNumber: "",
  });

  useEffect(() => {
    axios.get(`${baseApiUrl}/api/myInfor`, {
      headers: {
        Authorization: `${jwtToken}`
      }
    }).then((response) => {
      const { name, address, addressDetail, phoneNumber, postNumber,point } = response.data.userProfileDTO;
      setuserProfile({ name, address, addressDetail, phoneNumber, postNumber,point });
    }).catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);

  const totalPrice = orderProduct.price;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };
  const handleRadioChange = (event) => {
    setUseMemberInfo({ state: event.target.value === "memberInfo" });
  };

  const handleAddressSelected = (zonecode, address) => {
    if (useMemberInfo.state) {
      setuserProfile((prevInfo) => ({
        ...prevInfo,
        postNumber: zonecode,
        address: address,
      }));
    } else {
      setnewDelivery((prevInfo) => ({
        ...prevInfo,
        postNumber: zonecode,
        address: address,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    onCreateOrder(orderProduct, userProfile, totalPrice, newDelivery);
  };
  const onCreateOrder = (orderProduct, userProfile, totalPrice, newDelivery) => {
    if (useMemberInfo.state) {
      const payload = {
        orderProductDTOS: orderProduct,
        deliveryDTO: userProfile,
        totalPrice: totalPrice,
      };

      axios
        .post(`${baseApiUrl}/api/user/order/create/product`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${jwtToken}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          localStorage.removeItem("orderProduct");
          console.log(orderProduct);
          window.location.href = `/user/order/${response.data.id}`;
        })
        .catch((error) => {
          console.log(error.response.data);
          alert(error.response.data);
        });
    } else {
      const payload = {
        orderProductDTOS: orderProduct,
        deliveryDTO: newDelivery,
        totalPrice: totalPrice,
      };

      axios
        .post(`${baseApiUrl}/api/user/order/create/product`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${jwtToken}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          window.location.href = `/user/order/${response.data.id}`;
        })
        .catch((error) => {
          console.log(error.response.data);
          alert(error.response.data);
        });
    }
  };

  return (
    <div className={styles.form}>
      {jwtToken ? (
        <>
          <h1 style={{ marginLeft: "25vw" }}>order</h1>
          <hr />
          <form>
            <div style={{ display: "flex", marginBottom: "3vw" }}>
              <div style={{ marginRight: "2vw" }}>
                <input
                  type="radio"
                  id="memberInfo"
                  name="addressOption"
                  value="memberInfo"
                  checked={useMemberInfo.state}
                  onChange={handleRadioChange}
                />
                <label htmlFor="memberInfo">회원 정보와 동일</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="newAddress"
                  name="addressOption"
                  value="newAddress"
                  checked={!useMemberInfo.state}
                  onChange={handleRadioChange}
                />
                <label htmlFor="newAddress">새로운 배송지</label>
              </div>
            </div>
            {useMemberInfo.state ? (
              <div>
                <label htmlFor="nameInput">이름</label>
                <input
                  id="nameInput"
                  className={styles.input_box}
                  type="text"
                  name="name"
                  placeholder="이름"
                  value={userProfile.name}
                  onChange={handleChange}
                />
                <label htmlFor="phoneNumberInput">핸드폰 번호</label>
                <input
                  id="phoneNumberInput"
                  className={styles.input_box}
                  type="text"
                  name="phoneNumber"
                  placeholder="핸드폰번호"
                  value={userProfile.phoneNumber}
                  onChange={handleChange}
                />
                <label htmlFor="postNumberInput">우편 번호</label>
                <div className={styles.postNumber}>
                  <input
                    id="postNumberInput"
                    className={styles.input_box}
                    type="text"
                    name="postNumber"
                    placeholder="우편번호"
                    value={userProfile.postNumber}
                    onChange={handleChange}
                  />
                  <Postcode2 onAddressSelected={handleAddressSelected} />
                </div>
                <label htmlFor="addressInput">주소</label>
                <input
                  id="addressInput"
                  className={styles.input_box}
                  type="text"
                  name="address"
                  placeholder="주소"
                  value={userProfile.address}
                  onChange={handleChange}
                />
                <label htmlFor="addressDetailInput">상세주소</label>
                <input
                  id="addressDetailInput"
                  className={styles.input_box}
                  type="text"
                  name="addressDetail"
                  placeholder="상세 주소"
                  value={userProfile.addressDetail}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="nameInput">이름</label>
                <input
                  id="nameInput"
                  className={styles.input_box}
                  type="text"
                  name="name"
                  placeholder="이름"
                  value={newDelivery.name}
                  onChange={handleChange}
                />
                <label htmlFor="phoneNumberInput">핸드폰 번호</label>
                <input
                  id="phoneNumberInput"
                  className={styles.input_box}
                  type="text"
                  name="phoneNumber"
                  placeholder="핸드폰번호"
                  value={newDelivery.phoneNumber}
                  onChange={handleChange}
                />
                <label htmlFor="postNumberInput">우편 번호</label>
                <div className={styles.postNumber}>
                  <input
                    id="postNumberInput"
                    className={styles.input_box}
                    type="text"
                    name="postNumber"
                    placeholder="우편번호"
                    value={newDelivery.postNumber}
                    onChange={handleChange}
                  />
                  <Postcode2 onAddressSelected={handleAddressSelected} />
                </div>
                <label htmlFor="addressInput">주소</label>
                <input
                  id="addressInput"
                  className={styles.input_box}
                  type="text"
                  name="address"
                  placeholder="주소"
                  value={newDelivery.address}
                  onChange={handleChange}
                />
                <label htmlFor="addressDetailInput">상세주소</label>
                <input
                  id="addressDetailInput"
                  className={styles.input_box}
                  type="text"
                  name="addressDetail"
                  placeholder="상세 주소"
                  value={newDelivery.addressDetail}
                  onChange={handleChange}
                />
              </div>
            )}
            <hr />
            <table className="container">
              <thead>
                <tr>
                  <th>상품 정보</th>
                  <th>수량</th>
                  <th>사이즈</th>
                  <th>색상</th>
                  <th>합계</th>
                </tr>
              </thead>
              <tbody>
                {orderProduct ? (
                  <tr>
                    <td>{orderProduct.name}</td>
                    <td>{orderProduct.count}</td>
                    <td>{orderProduct.size}</td>
                    <td>{orderProduct.color}</td>
                    <td>{orderProduct.price}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      상품이 없습니다.
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan="5" style={{ textAlign: "left" }}>
                    {"가격합계: " + totalPrice || 0}
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />
            <h5 style={{ marginTop: "0px", marginLeft: "10px" }}>
              결제수단 <span style={{ fontSize: "small" }}>적립금</span>
            </h5>
            <table className="container">
              <thead>
                <tr>
                  <td>결제정보</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>적립금</td>
                  <td>{userProfile.point}</td>
                </tr>
                <tr>
                  <td>주문상품</td>
                  <td>{totalPrice}</td>
                </tr>
                <tr>
                  <td className={styles.totalPrice}>결제후 잔액</td>
                  <td className={styles.totalPrice}>{userProfile.point - totalPrice}</td>
                </tr>
              </tbody>
            </table>
            <button type="submit" className={styles.button} onClick={handleSubmit}>
              결제하기
            </button>
          </form>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default OrderProduct;
