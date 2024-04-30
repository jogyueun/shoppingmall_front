import React, { useState, useEffect } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from './css/userOrderConfirm.module.css';

const OrderInfo = ({order,onGoOrderId})=>{
  const handleRowClick = () => {
    onGoOrderId(order.id);
  };
  return (
      <tr onClick={handleRowClick} style={{cursor:'pointer'}}>
        <td>
          {order.id}
        </td>
        <td style={{ fontSize: "15px" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
        <td style={{ fontSize: "15px" }}>{new Date(order.modifiedAt).toLocaleDateString()}</td>
        <td style={{ fontSize: "15px" }}>{order.status}</td>
        <td style={{ fontSize: "15px" }}>{order.totalPrice}</td>
      </tr>
)
}
const onGoOrderId = (orderId) => {
  window.location.href = `/user/order/${orderId}`;
}
const UserOrderConfirm = ({orderList = []}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState(orderList);
  const jwtToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(false);
        const response = await axios.get(baseApiUrl+`/api/user/order/user`,{
          headers: {
          Authorization: `${jwtToken}`
        }
        });
        setOrders(response.data); // setOrders 함수를 사용하여 상태 업데이트
        setIsLoading(true);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className={styles.container}>
      {isLoading&&jwtToken? (
        <>
      <h2 style={{ marginLeft: "34vw" }}>Order List</h2>
      <table className="container">
        <thead>
        <tr>
          <th style={{ fontSize: "20px" }}>주문번호</th>
          <th style={{ fontSize: "20px" }}>주문날짜</th>
          <th style={{ fontSize: "20px" }}>변경날짜</th>
          <th style={{ fontSize: "20px" }}>주문상태</th>
          <th style={{ fontSize: "20px" }}>총 금액</th>
        </tr>
        </thead>
        <tbody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderInfo key={order.orderId} order={order} onGoOrderId={onGoOrderId} />
          ))
        ) : (
          <tr>
          <td colSpan='6'>주문이 없습니다.</td>
          </tr>
          )}
        </tbody>
      </table> 
        </>) : (<div>주문 로딩중</div>)}
    </div>
  );
};
export default UserOrderConfirm;