import React, { useState, useEffect } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from './css/userOrderConfirm.module.css';
import { useParams } from 'react-router-dom';
import Modal from './DeliveryModal.jsx';

const OrderIdConfirm = () => {
  const { orderId } = useParams();
  const jwtToken = localStorage.getItem("jwtToken")
  const [order, setOrder] = useState({});
  const [delivery, setDelivery] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = async () => {
    const response = await axios.get(`${baseApiUrl}/api/user/order/${orderId}/delivery`,{
      headers: {
        Authorization: `${jwtToken}`
      }});
    setDelivery(response.data);
    setIsModalOpen(true);
  }
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await axios.get(`${baseApiUrl}/api/user/order/${orderId}`, {
          headers: {
            Authorization: `${jwtToken}`
          }});
        console.log(response.data);
        setOrder(response.data); // setOrders 함수를 사용하여 상태 업데이트
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    loadOrder();
  }, [orderId]);

  // 주문 취소 함수
  const onOrderCancel = async (orderId) => {
    try {
      const cancelUrl = `${baseApiUrl}/api/user/order/${orderId}/cancel`;
      const response = await axios.get(cancelUrl, {
        headers: {
          Authorization: `${jwtToken}`
        }
      })
      alert("주문을 취소했습니다.");
      window.location.href = window.location.href;
    }
      catch (error) {
      // 오류 처리
      alert("주문을 취소할 수 없는 상태입니다.");
      window.location.href = window.location.href;
    }
  }


  const onmoveDeliveryModify = () => {
    window.location.href = `/user/order/${orderId}/modifyDelivery`;
  }


  return (
    <div className={styles.container}>
      <h2 style={{ marginLeft: '37vw' }}>Order</h2>
        <table className="container" >
          <thead>
          <tr>
            <th style={{fontSize:'20px'}}>주문 번호</th>
            <th style={{fontSize:'20px'}}>상품 정보</th>
            <th style={{fontSize:'20px'}}>주문 날짜</th>
            <th style={{fontSize:'20px'}}>주문 상태</th>
            <th style={{fontSize:'20px'}}>총 금액</th>
            <th style={{fontSize:'20px'}}>배송조회</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              {order.id}
              <button className={styles.cancelButton} onClick={() => onOrderCancel(order.id)}>주문 취소</button>
            </td>
            <td>
              <table >
                <tbody>
                <tr>
                  <th style={{ fontSize: "15px" }}>상품 이름</th>
                  <th style={{ fontSize: "15px" }}>상품 수량</th>
                  <th style={{ fontSize: "15px" }}>상품 금액</th>
                  <th style={{ fontSize: "15px" }}>상품 색상</th>
                  <th style={{ fontSize: "15px" }}>상품 사이즈</th>
                </tr>
                {order.products &&order.products.map((product) => (
                  <tr key={product.id}>
                    <td style={{ fontSize: "15px" }}>{Object.keys(product.productNameAndCount)[0]}</td>
                    <td style={{ fontSize: "15px" }}>{Object.values(product.productNameAndCount)[0]}</td>
                    <td style={{ fontSize: "15px" }}>{product.price}</td>
                    <td style={{ fontSize: "15px" }}>{product.color}</td>
                    <td style={{ fontSize: "15px" }}>{product.size}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </td>
            <td style={{ fontSize: "15px" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
            <td style={{ fontSize: "15px" }}>{order.status}</td>
            <td style={{ fontSize: "15px" }}>{order.totalPrice}</td>
            <td>{order.status != '주문취소'?(
              <>
                <button onClick={openModal} className={styles.cancelButton}>배송조회</button>
                <Modal isOpen={isModalOpen} closeModal={closeModal}>
                  <p style={{margin: '0'}}>주문번호: {order.id}  </p>
                  <p style={{margin: '15px 0px 0px 0px'}}>배송지: {delivery.address}</p>
                  <p style={{margin: '0'}}>{delivery.addressDetail}</p>
                  <p style={{margin: '15px 0px 0px 0px'}}>배송현황: {delivery.status}</p>
                </Modal>
              </>) :(<></>)}
            </td>
          </tr>
          </tbody>
        </table>
      <button className={styles.modifyButton} onClick={onmoveDeliveryModify}>배송지 변경</button>
    </div>
  );
};

export default OrderIdConfirm;
