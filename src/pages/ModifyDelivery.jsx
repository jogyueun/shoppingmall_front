import React, { useState, useEffect } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from './css/order.module.css';
import { useParams } from 'react-router-dom';
import Postcode2 from '../common/PostCode2.jsx';

const ModifyDelivery= () =>{
  const {orderId}= useParams();
  const jwtToken = localStorage.getItem("jwtToken");
  const [deliveryInfo, setDeliveryInfo] = useState({name: '',
    phoneNumber: '',
    postNumber: '',
    address: '',
    addressDetail: ''});


  useEffect (() => {
    axios.get(`${baseApiUrl}/api/user/order/${orderId}/modify`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${jwtToken}`
      }
    })
      .then(response => {
        fetchDeliveryInfo();
    })
  .catch(error => {
      alert('배송지 변경이 불가능합니다.');
    window.location.href = `/user/order/${orderId}`;
    });
  },[orderId]);

  const fetchDeliveryInfo = () => {
    axios.get(`${baseApiUrl}/api/user/order/${orderId}/delivery`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${jwtToken}`
      }
    })
      .then(response => {
        console.log("Delivery info fetched:", response.data);
        setDeliveryInfo(response.data);
      })
      .catch(error => {
        alert('배송지 정보를 불러오는 데 실패했습니다.');
        window.location.href = `/user/order/${orderId}`;
    })
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    console.log(deliveryInfo);
    try {
      const response = await axios.post(`${baseApiUrl}/api/user/order/${orderId}/modify`, deliveryInfo, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${jwtToken}`
        }
      });
      console.log(response.data);
      alert('배송지가 성공적으로 변경되었습니다.');
      window.location.href = `/user/order/${orderId}`;
    } catch (error) {
      console.error('배송지 변경에 실패했습니다:', error);
      alert('배송지 변경에 실패했습니다.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };
  const handleAddressSelected = (zonecode, address) => {
    setDeliveryInfo(prevInfo => ({
      ...prevInfo,
      postNumber: zonecode,
      address: address
    }));
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {deliveryInfo ? (
        <>
          <label htmlFor="nameInput" className={styles.label}>이름</label>
          <input id="nameInput" className={styles.input_box} type="text" name="name" placeholder="이름"
                 value={deliveryInfo.name || ""} onChange={handleChange} />

          <label htmlFor="phoneNumberInput" className={styles.label}>핸드폰번호</label>
          <input id="phoneNumberInput" className={styles.input_box} type="text" name="phoneNumber" placeholder="핸드폰번호"
                 value={deliveryInfo.phoneNumber || ""} onChange={handleChange} />
          <label htmlFor="postNumberInput" className={styles.label}>우편번호</label>
          <div style={{ display: "flex" }}>
            <input id="postNumberInput" className={styles.input_box} type="text" name="postNumber" placeholder="우편번호"
                   value={deliveryInfo.postNumber || ""} onChange={handleChange} />
            <Postcode2 onAddressSelected={handleAddressSelected} />
          </div>

          <label htmlFor="addressInput" className={styles.label}>주소</label>
          <input id="addressInput" className={styles.input_box} type="text" name="address" placeholder="주소"
                 value={deliveryInfo.address || ""} onChange={handleChange} />

          <label htmlFor="addressDetailInput" className={styles.label}>상세 주소</label>
          <input id="addressDetailInput" className={styles.input_box} type="text" name="addressDetail"
                 placeholder="상세 주소" value={deliveryInfo.addressDetail || ""} onChange={handleChange} />

          <button className={styles.button} style={{ marginLeft: "24vw" }}>배송지 변경하기</button>
        </>

      ) : (
        <>
          <label htmlFor="nameInput" className={styles.label}>이름</label>
          <input id="nameInput" className={styles.input_box} type="text" name="name" placeholder="이름"
                  onChange={handleChange} />

          <label htmlFor="phoneNumberInput" className={styles.label}>핸드폰번호</label>
          <input id="phoneNumberInput" className={styles.input_box} type="text" name="phoneNumber" placeholder="핸드폰번호"
                  onChange={handleChange} />
          <label htmlFor="postNumberInput" className={styles.label}>우편번호</label>
          <div style={{ display: "flex" }}>
            <input id="postNumberInput" className={styles.input_box} type="text" name="postNumber" placeholder="우편번호"
                    onChange={handleChange} />
            <Postcode2 onAddressSelected={handleAddressSelected} />
          </div>

          <label htmlFor="addressInput" className={styles.label}>주소</label>
          <input id="addressInput" className={styles.input_box} type="text" name="address" placeholder="주소"
              onChange={handleChange} />

          <label htmlFor="addressDetailInput" className={styles.label}>상세 주소</label>
          <input id="addressDetailInput" className={styles.input_box} type="text" name="addressDetail"
                 placeholder="상세 주소"  onChange={handleChange} />

          <button className={styles.button} style={{ marginLeft: "24vw" }}>배송지 변경하기</button>
        </>
        )}
    </form>
  )

}

export default ModifyDelivery;