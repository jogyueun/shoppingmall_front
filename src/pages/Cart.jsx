import styles from "../pages/css/cart.module.css";
import { Link } from "react-router-dom";


// 체크 박스 선택 상태에 따라서 id 값을 배열에 넣거나 삭제
let selectedProductsId = [];

const checkHandled = (e) => {
  if (e.target.checked) {
    selectedProductsId.push(parseInt(e.target.id));
  } else if (!e.target.checked) {
    selectedProductsId = selectedProductsId.filter((id) => id !== parseInt(e.target.id));
  }
  console.log(e.target.id);
  console.log(selectedProductsId);
};

const CartItem = ({ item }) => {
  return (
    <tr>
      <td>
        <input id={item.id} type="checkbox" onChange={checkHandled} />
      </td>
      <td>{item.name}</td>
      <td>{item.size}</td>
      <td>{item.color}</td>
      <td>{item.count}</td>
      <td>{item.price}</td>
    </tr>
  );
};


// 장바구니 내역 전체 삭제
const clearCart = () => {
  localStorage.removeItem("cartList");
  location.reload();
};

// 장바구니 내역 선택 삭제
function removeSelectedCartItem(selectedId) {
  let cartProducts = JSON.parse(localStorage.getItem("cartList"));

  selectedId.forEach((id) => {
    console.log("selectedId >> ", id);

    cartProducts.map((cartProduct) => {
      console.log("cartProduct.id", cartProduct.id);
    });

    cartProducts = cartProducts.filter(cartProduct => cartProduct.id !== id);
    console.log(cartProducts);
  });

  localStorage.setItem("cartList", JSON.stringify(cartProducts));
  location.reload();
}

const Cart = () => {
  let cartProducts = JSON.parse(localStorage.getItem("cartList"));
  return (
    <div>
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
        {cartProducts?.length > 0 ? (
          cartProducts.map((item) => <CartItem key={item.id} item={item} />)
        ) : (
          <tr>
            <td colSpan="6" className="text-center">장바구니에 상품이 없습니다.</td>
          </tr>
        )}
        <tr>
          {
            cartProducts?.length > 0 ? (
              <td colSpan="6" style={{ textAlign: "left" }}>
                {"가격합계: " +
                  cartProducts.reduce((total, item) => total + item.price, 0)
                }
              </td>
            ) : (
              <td colSpan="6" style={{ textAlign: "left" }}>가격합계: 0</td>
            )
          }

        </tr>
        </tbody>
      </table>
      <div className="container">
        <nav>
          <ul>
            <li>
              <button className={styles.deleteButton} onClick={() => {
                removeSelectedCartItem(selectedProductsId);
              }}>삭제하기
              </button>
              <button className={styles.deleteButton} onClick={clearCart}>장바구니 비우기</button>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/cart/order">
                <button className={styles.orderAllButton}>상품 주문하기</button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Cart;
