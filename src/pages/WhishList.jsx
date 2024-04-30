import React, { useState, useEffect } from "react";
import styles from "../pages/css/cart.module.css";

const WishItem = ({ item, onCheckboxChange, isChecked }) => {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onCheckboxChange(item.id)}
        />
      </td>
      <td>{item.name}</td>
      <td>{item.size}</td>
      <td>{item.color}</td>
      <td>{item.count}</td>
      <td>{item.price}</td>
    </tr>
  );
};

const WishList = () => {
  const [wish, setWish] = useState(JSON.parse(localStorage.getItem("wishList")));
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleSelectionChange = (id) => {
    console.log(id);
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  console.log(selectedItems);
  const handleSelectDelete = () => {
    const filteredWish = wish.filter((item) => !selectedItems.has(item.id));
    setWish(filteredWish);
    localStorage.setItem("wishList", JSON.stringify(filteredWish));
    setSelectedItems(new Set()); // 선택된 아이템 상태 초기화
  };

  const handleDelete = () => {
    setWish(null);
    localStorage.removeItem("wishList");
    alert("위시리스트 삭제완료");
  };
  const onCart = () => {
    const storedCartList = JSON.parse(localStorage.getItem("cartList")) || [];
    const newCartList = storedCartList.concat(wish);
    localStorage.setItem("cartList", JSON.stringify(newCartList));
    alert("장바구니로 옮기기 완료");
    localStorage.removeItem("wishList");
    setWish(null);
  };

  return (
    <div style={{ width: "80vw", marginLeft: "10vw" }}>
      <table className="container">
        <thead>
          <tr>
            <th>선택</th>
            <th>상품</th>
            <th>사이즈</th>
            <th>색상</th>
            <th>수량</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
          {wish ? (
            wish.map((item) => (
              <WishItem
                key={item.id}
                item={item}
                isChecked={selectedItems.has(item.id)}
                onCheckboxChange={handleSelectionChange}
              />
            ))
          ) : (
            <tr>
              <td colSpan="6">위시리스트가 비어있습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      {wish ? (
        <>
          <div style={{ display: "flex", marginLeft: "10vw" }}>
            <button className={styles.deleteButton} onClick={handleSelectDelete}>
              선택 상품 삭제
            </button>
            <button
              className={styles.deleteButton}
              style={{ marginLeft: "43vw" }}
              onClick={handleDelete}
            >
              위시리스트 비우기
            </button>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: "10vw",
              marginTop: "3vw",
              width: "50vw",
            }}
          >
            <button
              className={styles.orderSelectButton}
              style={{ marginLeft: "250px" }}
              onClick={onCart}
            >
              장바구니로 옮기기
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WishList;
