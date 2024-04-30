import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./common/Header";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/LogIn.jsx";
import Join from "./pages/Join.jsx";
import Main from "./pages/Main.jsx";
import Cart from "./pages/Cart.jsx";
import OrderProduct from "./pages/OrderProduct.jsx";
import Mypage from "./pages/Mypage.jsx";
import FindId from "./pages/findid.jsx";
import FindPassword from "./pages/findPassword.jsx";
import OrderConfirm from "./pages/OrderConfirm.jsx";
import UserOrderConfirm from "./pages/UserOrderConfirm.jsx";
import OrderIdConfirm from "./pages/OrderIdConfirm.jsx";
import ModifyDelivery from "./pages/ModifyDelivery.jsx";
import MypageHeader from "./common/MypageHeader.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import ChangeProduct from "./pages/ChangeProduct.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AddCategory from "./pages/AddCategory.jsx";
import Product from "./pages/Product.jsx";
import ChangeInfo from "./pages/ChangeInfo.jsx";
import ChangeCategory from "./pages/ChangeCategory.jsx";
import OrderByCart from "./pages/OrderByCart.jsx";
import WishList from "./pages/WhishList.jsx";
import Footer2 from "./common/Footer2.jsx";
import { SearchProvider } from "./common/SearchProvider.jsx";
import AllUser from "./pages/allUser.jsx";
import NaverCallback from "./oauth2/naverCallback.jsx";
import KakaoCallback from "./oauth2/kakaoCallback.jsx";

const router = createBrowserRouter([
  {
    path: "/naverCallBack",
    element: [<NaverCallback />],
  },
  {
    path: "/kakaoCallBack",
    element: [<KakaoCallback />],
  },
  {
    path: "/",
    element: [<Main />],
  },
  {
    path: "/login",
    element: [<Header />, <Login />, <Footer2 />],
  },
  {
    path: "/join",
    element: [<Header />, <Join />, <Footer2 />],
  },
  {
    path: "/mypage",
    element: [<Header />, <Mypage />, <Footer2 />],
  },
  {
    path: "/findId",
    element: [<Header />, <FindId />, <Footer2 />],
  },
  {
    path: "/findPassword",
    element: [<Header />, <FindPassword />, <Footer2 />],
  },
  {
    path: "/changeInfo",
    element: [<Header />, <ChangeInfo />, <Footer2 />],
  },
  {
    path: "/details/:id/order", //상품으로 주문 조회
    element: [<Header />, <OrderProduct />, <Footer2 />],
  },
  {
    path: "/cart/order", //장바구니로 주문 조회
    element: [<Header />, <OrderByCart />, <Footer2 />],
  },
  {
    path: "/cart",
    element: [<Header />, <MypageHeader />, <Cart />, <Footer2 />],
  },
  {
    path: "/admin/order", //관리자 주문 조회 페이지
    element: [<Header />, <OrderConfirm />],
  },
  {
    path: "/user/order",
    element: [<Header />, <MypageHeader />, <UserOrderConfirm />, <Footer2 />],
  },
  {
    path: "/user/order/:orderId",
    element: [<Header />, <MypageHeader />, <OrderIdConfirm />, <Footer2 />],
  },
  {
    path: "/user/order/:orderId/modifyDelivery",
    element: [<Header />, <ModifyDelivery />, <Footer2 />],
  },
  {
    path: "/user/order/orderId",
    element: [<Header />, <OrderIdConfirm />, <Footer2 />],
  },
  {
    path: "/admin",
    element: [<Header />, <AdminPage />],
    children: [
      { path: "products", element: <AddProduct /> },
      { path: "productsChange", element: <ChangeProduct /> },
      { path: "users", element: <AllUser /> },
      { path: "categories", element: <AddCategory /> },
      { path: "categoriesChange", element: <ChangeCategory /> },
      { path: "order", element: <OrderConfirm /> },
    ],
  },
  {
    path: "details/:id",
    element: [<Header />, <Product />],
  },
  {
    path: "/wish",
    element: [<Header />, <MypageHeader />, <WishList />],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <SearchProvider>
    <RouterProvider router={router} />
  </SearchProvider>,
);
