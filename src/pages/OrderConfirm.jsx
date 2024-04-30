import { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from './css/orderConfirm.module.css'
import OrderPagination from "../common/OrderPagnation.jsx";

const OrderInfo = ({ order, onStatusChange, onDeleteOrder }) => {
  return (
    <tr>
      <td><a href={`/user/order/${order.id}`} className={styles.a}>{order.id}</a></td>
      <td>{order.userName}</td>
      <td>{order.totalPrice}원</td>
      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
      <td>{new Date(order.modifiedAt).toLocaleDateString()}</td>
      <td>
        <select value={order.statusIndex} onChange={(e) => onStatusChange(order.id, e.target.value)}>
          <option value="0">결제완료</option>
          <option value="1">배송준비</option>
          <option value="2">배송중</option>
          <option value="3">배송완료</option>
          <option value="4">주문취소</option>
        </select>
      </td>
      <td><button onClick={() => onDeleteOrder(order.id)} className={styles.button}>주문삭제</button></td>
    </tr>
  );
};
const queryParams = new URLSearchParams(location.search);
const OrderConfirm = ({ orderList = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState(orderList); // 상태를 관리 useState
  const [pageableInfo, setPageableInfo] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const jwtToken = localStorage.getItem("jwtToken"); 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(false);
        const page = parseInt(queryParams.get("page"), 10) || 0;
        const response = await axios.get(`${baseApiUrl}/api/admin/order?page=${page}`,{headers: {
          Authorization: `${jwtToken}`
        }});
        setOrders(response.data.content);
        setPageableInfo(response.data.pageable);
        setTotalElements(response.data.totalElements);
        setTotalPages(response.data.totalPages);
        setIsLoading(true);
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert("확인 권한이 없습니다");
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [queryParams.get("page")]); // 페이지가 변경될 때마다 요청 보냄

  const pageInfo = {
    currentPage: parseInt(queryParams.get("page"))+1 || pageableInfo.pageNumber + 1,
    perPage: pageableInfo.pageSize,
    totalCount: totalElements,
    totalPage: totalPages,
  };

  const onStatusChange = (orderId, newStatus) => {
    const updateStatusUrl = `${baseApiUrl}/api/admin/order/${orderId}/update`;
    axios.post(updateStatusUrl,JSON.stringify(newStatus), {
      headers: {
        Authorization: `${jwtToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Order status updated successfully:', response.data);
        window.location.href = window.location.href;
      })
      .catch(error => {
        console.error('Error updating order status:', error);
      });
  };

  const onDeleteOrder = (orderId) => {
    axios.get(`${baseApiUrl}/api/admin/order/${orderId}/delete`,{headers: {
        Authorization: `${jwtToken}`
      }})
      .then((response)=>{
          alert(`${orderId}번 주문이 취소되었습니다.`);
          window.location.href = window.location.href;
        }
      ).catch((error)=>{
      console.log("주문 취소 불가");
    });
  };
  return (
    <div className={styles.container}>
      {isLoading&& jwtToken? (
        <>
      <table>
        <thead>
        <tr>
          <th>주문번호</th>
          <th>주문자</th>
          <th>상품금액</th>
          <th>주문일시</th>
          <th>상태변경일시</th>
          <th>주문상태 변경</th>
          <th>주문삭제</th>
        </tr>
        </thead>
        <tbody>
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderInfo key={order.orderId} order={order} onStatusChange={onStatusChange} onDeleteOrder={onDeleteOrder}/>
          ))
        ) : (
          <tr>
            <td colSpan='8'>주문이 없습니다.</td>
          </tr>
        )}
        </tbody>
      </table>
        <div>
          <OrderPagination pageInfo={pageInfo}></OrderPagination>
        </div>
      </>
    ):(
        <div>주문 로딩중</div>
      )}
    </div>
  );
};

export default OrderConfirm;