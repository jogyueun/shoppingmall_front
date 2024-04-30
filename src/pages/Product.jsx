import Footer2 from "../common/Footer2.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl.js";

const button_style_1 = {
  backgroundColor: "black",
  borderColor: "transparent",
  fontFamily: "Volkhov",
  width: "100%",
};

const button_style_2 = {
  backgroundColor: "#fffafaff",
  borderColor: "black",
  color: "black",
  fontFamily: "Volkhov",
  width: "100%",
};

const select_option_style = {
  backgroundColor: "transparent",
  color: "black",
  fontFamily: "Volkhov",
  fontColor: "black",
};

const quantity_box_style = {
  backgroundColor: "transparent",
  display: "flex",
  width: "80px",
  height: "30px",
};

const quantity_button_style = {
  width: "100px",
  height: "43px",
  borderColor: "grey",
  backgroundColor: "white",
};

const quantity_input_style = {
  fontWeight: "bold",
  width: "50px",
  height: "43px",
  border: "1px solid rgb(243, 243, 243)",
  boxSizing: "border-box",
  fontSize: "15px",
  textAlign: "center",
  color: "rgb(0, 0, 0)",
  backgroundColor: "transparent",
};

export default function Product() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [value, setValue] = useState(1);
  const [price, setPrice] = useState(0);
  const [productDetails, setProductDetails] = useState([]);
  const [productBodies, setProductBodies] = useState([]);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const productDetailColorList = [];
  const productDetailSizeList = [];
  const productDetailQuantityList = [];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(false);
        const response = await axios.get(baseApiUrl + "/api/products/" + params.id);
        setProduct(response.data);
        setProductDetails(response.data.productDetailsDTOList);
        setProductBodies(response.data.productBodyDTOList);
      } catch (error) {
        console.error("Error fetching productDetails:", error);
      }
    };
    fetchProductDetails();
  }, []);

  const handleMinusValue = () => {
    let afterValue = value - 1;
    setValue(afterValue);
  };

  const handlePlusValue = () => {
    const afterValue = value + 1;
    setValue(afterValue);
  };

  useEffect(() => {
    setIsLoading(false);
    const afterPrice = product.price * value;
    setPrice(afterPrice);
  }, [value, product]);

  {
    productDetails.map((productDetail) => {
      productDetailColorList.push(productDetail.color);
      productDetailSizeList.push(productDetail.size);
      productDetailQuantityList.push(productDetail.quantity);
    });
  }

  const productDetailColorData = [...new Set(productDetailColorList)];
  const productDetailSizeData = [...new Set(productDetailSizeList)];
  const productDetailQuantityData = [...new Set(productDetailQuantityList)];

  useEffect(() => {
    setIsLoading(true);

    console.log("productDetails", productDetails);
    console.log("productDetailColorData", productDetailColorData);
    console.log("productDetailSizeData", productDetailSizeData);
    console.log("productDetailQuantityData", productDetailQuantityData);
    console.log("product: ", product);
  }, [product, productDetails, productBodies, size, color, value]);

  const cartContent = {
    id: product.id,
    name: product.name,
    price: product.price * value,
    count: value,
    size: size,
    color: color,
  };

  // 장바구니 추가 클릭 이벤트 함수
  function addToCart() {
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price * value,
      count: value,
      size: size,
      color: color,
    };

    if (cartContent.size === "" && cartContent.color === "") {
      alert("사이즈와 색상을 선택해주세요.");
      return;
    }

    if (cartContent.size === "" && cartContent.color) {
      alert("사이즈를 선택해 주세요.");
      return;
    }

    if (cartContent.color === "" && cartContent.size) {
      alert("색상을 선택해 주세요.");
      return;
    }
    const storedCartList = JSON.parse(localStorage.getItem("cartList")) || [];

    const productExists = storedCartList.some(
      (item) =>
        item.name === cartProduct.name &&
        item.size === cartProduct.size &&
        item.color === cartProduct.color,
    );
    if (!productExists) {
      storedCartList.push(cartProduct);
      localStorage.setItem("cartList", JSON.stringify(storedCartList));
      alert("장바구니에 추가되었습니다.");
    } else {
      alert("이미 장바구니에 있는 상품입니다.");
    }

    // const cartList = JSON.parse(localStorage.getItem("cartList")) || [];
    // cartList.push(cartContent);
    // alert("장바구니에 담겼습니다.");
    // localStorage.setItem("cartList", JSON.stringify(cartList));
  }

  const handleChangeSize = (e) => {
    setSize(e.target.value);
    console.log(size);
  };

  const handleChangeColor = (e) => {
    setColor(e.target.value);
    console.log(color);
  };

  const onOrder = () => {
    const orderProduct = {
      id: product.id,
      name: product.name,
      price: product.price * value,
      count: value,
      size: size,
      color: color,
    };
    if (orderProduct.size === "" && orderProduct.color === "") {
      alert("사이즈와 색상을 선택해주세요.");
      return;
    }

    if (orderProduct.size === "" && orderProduct.color) {
      alert("사이즈를 선택해 주세요.");
      return;
    }

    if (orderProduct.color === "" && orderProduct.size) {
      alert("색상을 선택해 주세요.");
      return;
    }
    localStorage.setItem("orderProduct", JSON.stringify(orderProduct));

    window.location.href = window.location.href + `/order`;
  };

  const onWish = () => {
    const wishProduct = {
      id: product.id,
      name: product.name,
      price: product.price * value,
      count: value,
      size: size,
      color: color,
    };
    if (wishProduct.size === "" && wishProduct.color === "") {
      alert("사이즈와 색상을 선택해주세요.");
      return;
    }

    if (wishProduct.size === "" && wishProduct.color) {
      alert("사이즈를 선택해 주세요.");
      return;
    }

    if (wishProduct.color === "" && wishProduct.size) {
      alert("색상을 선택해 주세요.");
      return;
    }
    const storedWishList = JSON.parse(localStorage.getItem("wishList")) || [];
    const productExists = storedWishList.some(
      (item) =>
        item.name === wishProduct.name &&
        item.size === wishProduct.size &&
        item.color === wishProduct.color,
    );
    if (!productExists) {
      storedWishList.push(wishProduct);
      localStorage.setItem("wishList", JSON.stringify(storedWishList));
      alert("위시리스트에 추가되었습니다.");
    } else {
      alert("이미 위시리스트에 있는 상품입니다.");
    }
  };

  const chanedInput = () => {
    console.log("changed input!");
  };

  useEffect(() => {
    console.log("test", productDetails);
  }, []);

  return (
    <>
      {/* <div style={{ backgroundColor: "white", height: "5px", border: "none" }}></div> */}
      <article>
        <div className="container">
          <div className="grid" style={{ left: 100, right: 100 }}>
            <div className="container">
              <img
                style={{ width: 500, height: 500 }}
                src={product.imageUrl}
                alt={product.name}
              />
            </div>
            <div className="container">
              <nav>
                <ul>
                  <li>
                    <h4>{product.name}</h4>
                  </li>
                </ul>
                <ul>
                  <li>
                    <h4>{product.price}원</h4>
                  </li>
                </ul>
              </nav>
              <hr />
              <nav>
                <ul>
                  <li>
                    <select
                      name="favorite-cuisine"
                      aria-label="Select your favorite cuisine..."
                      required
                      style={select_option_style}
                      onChange={handleChangeColor}
                    >
                      <option selected disabled value="">
                        Color
                      </option>
                      {productDetailColorData &&
                        productDetailColorData.map((productColor, index) => (
                          <option key={index} value={productColor}>
                            {productColor}
                          </option>
                        ))}
                    </select>
                  </li>
                  <li>
                    <select
                      name="favorite-cuisine"
                      aria-label="Select your favorite cuisine..."
                      required
                      style={select_option_style}
                      onChange={handleChangeSize}
                    >
                      <option selected disabled value="">
                        Size
                      </option>
                      {productDetailSizeData &&
                        productDetailSizeData.map((productSize, index) => (
                          <option key={index} value={productSize}>
                            {productSize}
                          </option>
                        ))}
                    </select>
                  </li>
                </ul>
              </nav>
              <nav>
                <li>
                  <div className="container" style={quantity_box_style}>
                    <button
                      className=""
                      type="button"
                      disabled={value === 1}
                      aria-label="수량 내리기"
                      onClick={handleMinusValue}
                      style={quantity_button_style}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 3 18 18"
                        fill="none"
                      >
                        <path d="M15 8.99995H3" stroke="#000000"></path>
                      </svg>
                    </button>
                    <input
                      type="text"
                      value={value}
                      style={quantity_input_style}
                      readOnly
                      onChange={chanedInput}
                    />
                    <button
                      type="button"
                      disabled={
                        productDetailQuantityData[0] < 1 ||
                        value === productDetailQuantityData[0]
                      }
                      aria-label="수량 올리기"
                      onClick={handlePlusValue}
                      style={quantity_button_style}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 3 18 18"
                        fill="none"
                      >
                        <path d="M9 3V15M15 9H3" stroke="#000000"></path>
                      </svg>
                    </button>
                  </div>
                </li>
                <li
                  style={{
                    fontFamily: "Volkhov",
                    fontColor: "black",
                  }}
                >
                  Total: {price}원
                </li>
              </nav>
              <br />
              <nav>
                <button style={button_style_1} onClick={onOrder}>
                  Buy it now
                </button>
              </nav>
              <br />
              <nav>
                <button style={button_style_2} onClick={onWish}>
                  Wish list
                </button>
                <button style={button_style_2} onClick={addToCart}>
                  Add to cart
                </button>
              </nav>
            </div>
          </div>
        </div>
        <hr />
        {isLoading &&
          productBodies.map((body) => (
            <div
              className="container"
              style={{ textAlign: "center" }}
              key={body.sequence}
            >
              <img src={body.url} alt={product.name} />
            </div>
          ))}
        <Footer2></Footer2>
      </article>
    </>
  );
}
