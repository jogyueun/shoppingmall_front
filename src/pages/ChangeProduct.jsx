import React, { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "./css/adminPage.module.css";

const ChangeProduct = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [productBodies, setProductBodies] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [options, setOptions] = useState([{ color: "", size: "", quantity: 0 }]);
  const [nameOrId, setNameOrId] = useState("");
  const [productDTOList, setProductDTOList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const colors = [
    "BLACK",
    "WHITE",
    "RED",
    "ORANGE",
    "YELLOW",
    "GREEN",
    "BLUE",
    "INDIGO",
    "PURPLE",
    "BROWN",
    "GRAY",
    "NAVY",
    "KHAKI",
  ];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    const fetchData = async () => {
      const categories = await fetchCategories();
      const newCategoryTree = buildCategoryTree(categories);
      setCategoryTree(newCategoryTree);
    };
    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(baseApiUrl + "/api/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const buildCategoryTree = (categories) => {
    const categoryTree = [];
    const categoryMap = new Map();

    // 각 카테고리를 맵에 저장
    categories.forEach((category) => {
      categoryMap.set(category.id, {
        ...category,
        children: [],
      });
    });

    // 루트 노드들을 찾아서 categoryTree에 추가
    categories.forEach((category) => {
      const categoryNode = categoryMap.get(category.id);
      if (!category.superId) {
        categoryTree.push(categoryNode);
      } else {
        const parentCategory = categoryMap.get(category.superId);
        if (parentCategory) {
          parentCategory.children.push(categoryNode);
        }
      }
    });

    return categoryTree;
  };

  const renderCategoryTree = (categories, depth = 0) => {
    const selectedCategory = selectedCategories[depth] || null;

    return (
      <>
        <label style={{ fontWeight: "bold" }}> 카테고리 {depth + 1}</label>
        <hr />
        <select
          className={styles.select_option_box}
          value={selectedCategory ? selectedCategory.id : ""}
          onChange={(e) => {
            const selectedCategoryId = e.target.value;
            const category = categories.find(
              (category) => category.id === parseInt(selectedCategoryId),
            );
            handleCategorySelect(category, depth);
          }}
        >
          <option value="">{"카테고리 선택"}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {selectedCategory &&
          depth < selectedCategories.length &&
          selectedCategories[depth].children.length > 0 && (
            <div>{renderCategoryTree(selectedCategories[depth].children, depth + 1)}</div>
          )}
      </>
    );
  };
  const nameOrIdSubmit = async (e) => {
    e.preventDefault();
    try {
      const JWTToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: JWTToken,
        },
      };
      const response = await axios.get(`${baseApiUrl}/api/admin/products`, {
        params: { nameOrId: nameOrId },
        headers: {
          Authorization: JWTToken,
        },
      });
      setProductDTOList(response.data);
      console.log("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleSelectedProductDTO = async (e) => {
    if (e.target.value === "") {
      setSelectedProduct(null);
      return;
    }
    const id = e.target.value;
    try {
      const response = await axios.get(`${baseApiUrl}/api/products/${id}`);
      setSelectedProduct(response.data);
      setTitle(response.data.name);
      setPrice(response.data.price);
      setProductBodies(response.data.productBodyDTOList);
      setProductImages(response.data.productImageDTOList);
      setOptions(response.data.productDetailsDTOList);
      console.log("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const JWTToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: JWTToken,
          "Content-Type": "application/json",
        },
      };

      const requestBody = {
        id: selectedProduct.id,
        name: title,
        price: price,
        imageUrl: productImages[0].url,
        categoryDTO: selectedCategories.slice(-1)[0], // splice 대신 slice 사용
      };

      await axios.put(
        `${baseApiUrl}/api/admin/products/${selectedProduct.id}`,
        requestBody,
        config,
      );

      console.log("Data submitted successfully!");
      alert("변경 완료");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleDeleteSubmit = async () => {
    if (options.length > 0) {
      alert("상품 옵션을 모두 제거해야 합니다.");
      return;
    }

    try {
      const JWTToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: JWTToken,
        },
      };
      await axios
        .delete(`${baseApiUrl}/api/admin/products/${selectedProduct.id}`, config)
        .then((response) => (window.location.href = "/admin/productsChange"));

      console.log("Data submitted successfully!");
      alert("변경 완료");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const deleteFile = async (e, type) => {
    const JWTToken = localStorage.getItem("jwtToken");
    const config = {
      headers: {
        Authorization: JWTToken,
      },
    };
    e.preventDefault();
    if (type === "image") {
      await axios.delete(
        `${baseApiUrl}/api/admin/products/${selectedProduct.id}/image`,
        config,
      );
      const deletedFile = productImages.slice(-1)[0];
      const updatedImages = productImages.filter(
        (productImage) => productImage !== deletedFile,
      );
      setProductImages(updatedImages);
    } else if (type === "body") {
      await axios.delete(
        `${baseApiUrl}/api/admin/products/${selectedProduct.id}/body`,
        config,
      );
      const deletedFile = productBodies.slice(-1)[0];
      const updatedBodies = productBodies.filter(
        (productBody) => productBody !== deletedFile,
      );
      setProductBodies(updatedBodies);
    }
  };

  const handleCategorySelect = (category, depth) => {
    const updatedCategories = selectedCategories.slice(0, depth);
    setSelectedCategories([...updatedCategories, category]);
  };

  const handleFileSelect = (e, image, type) => {
    if (image === null) {
      if (type === "image") {
        image = {
          sequence: productImages.length + 1,
        };
      } else if (type === "body") {
        image = {
          sequence: productBodies.length + 1,
        };
      }
    }
    e.preventDefault();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const formData = new FormData();
          formData.append("productImageFile", file);
          formData.append("productId", selectedProduct.id);
          if (type === "image") {
            formData.append(
              "productImageDTO",
              new Blob([JSON.stringify(image)], {
                type: "application/json",
              }),
            );
          }
          if (type === "body") {
            formData.append(
              "productBodyDTO",
              new Blob([JSON.stringify(image)], {
                type: "application/json",
              }),
            );
          }

          try {
            const JWTToken = localStorage.getItem("jwtToken");
            let imageUrl;
            if (type === "image") {
              imageUrl = "/images/image";
            }
            if (type === "body") {
              imageUrl = "/images/body";
            }
            const response = await axios.put(
              baseApiUrl + "/api/admin" + imageUrl,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: JWTToken,
                },
              },
            );

            if (type === "image") {
              const updatedProductImages = [...productImages];

              updatedProductImages[image.sequence - 1] = response.data;
              setProductImages(updatedProductImages);
            }
            if (type === "body") {
              const updatedProductBodies = [...productBodies];

              updatedProductBodies[image.sequence - 1] = response.data;
              setProductBodies(updatedProductBodies);
            }

            console.log("Data submitted successfully!");
          } catch (error) {
            console.error("Error submitting data:", error);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    fileInput.click();
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const addOption = (e) => {
    e.preventDefault();
    setOptions([...options, { id: undefined, color: "", size: "", quantity: 0 }]);
  };

  const updateOption = async (e, index) => {
    e.preventDefault();

    try {
      const productDetailsDTO = {
        id: options[index].id,
        size: options[index].size,
        color: options[index].color,
        quantity: options[index].quantity,
      };

      if (productDetailsDTO.id !== undefined) {
        await axios.put(
          `${baseApiUrl}/api/products/${selectedProduct.id}/details`,
          JSON.stringify(productDetailsDTO),
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      if (productDetailsDTO.id === undefined) {
        const response = await axios.post(
          `${baseApiUrl}/api/products/${selectedProduct.id}/details`,
          JSON.stringify(productDetailsDTO),
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const updatedOptions = [...options];
        updatedOptions[index].id = response.data.id;
        setOptions(updatedOptions);
      }

      console.log("Data submitted successfully!");
      alert("변경 완료");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const removeOption = async (e, index) => {
    e.preventDefault();

    if (options[index].id !== undefined) {
      try {
        const JWTToken = localStorage.getItem("jwtToken");
        const config = {
          headers: {
            Authorization: JWTToken,
          },
        };
        await axios.delete(
          `${baseApiUrl}/api/admin/products/${selectedProduct.id}/details/${options[index].id}`,
          config,
        );

        console.log("Data submitted successfully!");
        alert("변경 완료");
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }

    const updatedOptions = options.filter((option) => option !== options[index]);
    console.log(updatedOptions);
    setOptions(updatedOptions);
  };

  return (
    <>
      <div className="grid">
        <ul>
          <li style={{ listStyle: "none" }}>
            <label htmlFor="nameOrId" style={{ fontWeight: "bold" }}>
              이름 / 상품번호
            </label>
          </li>
          <li style={{ listStyle: "none" }}>
            <input
              className={styles.input_box}
              type="text"
              id="nameOrId"
              value={nameOrId}
              onChange={(e) => setNameOrId(e.target.value)}
            />
          </li>
        </ul>

        <button
          className={styles.search_product_button}
          type="submit"
          onClick={nameOrIdSubmit}
        >
          상품 찾기
        </button>
      </div>

      {productDTOList.length > 0 && (
        <select
          className={styles.select_option_box}
          onChange={(e) => handleSelectedProductDTO(e)}
        >
          <option value=""> 선택하세요</option>
          {productDTOList.map((productDTO) => (
            <option value={productDTO.id}>
              상품 번호: {productDTO.id}, 상품 이름: {productDTO.name}
            </option>
          ))}
        </select>
      )}
      {selectedProduct && (
        <>
          <h3>조회된 상품</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="container">
                <label htmlFor="title" style={{ fontWeight: "bold" }}>
                  상품명
                </label>
                <hr />
                <input
                  className={styles.input_box}
                  type="text"
                  id="title"
                  value={title}
                  placeholder="상품 이름을 적어주세요"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="container">
                <label htmlFor="price" style={{ fontWeight: "bold" }}>
                  상품가격
                </label>
                <hr />
                <input
                  className={styles.input_box}
                  type="text"
                  id="price"
                  value={price}
                  placeholder="상품 가격을 적어주세요"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="container">
                <div>{renderCategoryTree(categoryTree)}</div>
              </div>
            </div>
            <br />
            <div className="grid">
              <button className={styles.search_product_button} type="submit">
                상품 기본 정보 수정
              </button>
              <button
                className={styles.search_product_button}
                type="button"
                onClick={handleDeleteSubmit}
              >
                상품 삭제
              </button>
            </div>
          </form>

          {
            <>
              <label style={{ fontWeight: "bold" }}>상품 대표 이미지</label>
              <ul>
                {productImages.length > 0 &&
                  productImages.map((productImage) => (
                    <>
                      <img
                        style={{ width: 250, height: 250 }}
                        src={`${baseApiUrl}${productImage.url}`}
                      />
                      <button
                        className={styles.select_button}
                        onClick={(e) => handleFileSelect(e, productImage, "image")}
                      >
                        수정
                      </button>
                    </>
                  ))}
              </ul>
              <button
                className={styles.add_button}
                onClick={(e) => handleFileSelect(e, null, "image")}
              >
                사진 추가
              </button>
              <button
                className={styles.delete_button}
                onClick={(e) => deleteFile(e, "image")}
              >
                사진 삭제
              </button>
            </>
          }
          {
            <>
              <label style={{ marginTop: 30, fontWeight: "bold" }}>
                상품 본문 이미지
              </label>
              <ul>
                {productBodies.length > 0 &&
                  productBodies.map((productBody) => (
                    <>
                      <img
                        style={{ width: 250, height: 250 }}
                        src={`${baseApiUrl}${productBody.url}`}
                      />
                      <button onClick={(e) => handleFileSelect(e, productBody, "body")}>
                        수정
                      </button>
                    </>
                  ))}
              </ul>
              <button
                className={styles.add_button}
                onClick={(e) => handleFileSelect(e, null, "body")}
              >
                사진 추가
              </button>
              <button
                className={styles.delete_button}
                onClick={(e) => deleteFile(e, "body")}
              >
                사진 삭제
              </button>
              <hr
                style={{
                  background: "black",
                  height: 1,
                  border: 0,
                }}
              />
            </>
          }

          {options.map((option, index) => (
            <div className="grid" key={index}>
              <div className="container">
                <label style={{ fontWeight: "bold" }}>색상</label>
                <select
                  className={styles.select_option_box}
                  value={option.color}
                  onChange={(e) => handleOptionChange(index, "color", e.target.value)}
                >
                  <option value=""> 색상 선택</option>
                  {colors.map((color) => (
                    <option value={color}> {color}</option>
                  ))}
                </select>
              </div>
              <div className="container">
                <label style={{ fontWeight: "bold" }}>사이즈</label>
                <select
                  value={option.size}
                  className={styles.select_option_box}
                  onChange={(e) => handleOptionChange(index, "size", e.target.value)}
                >
                  <option value=""> 사이즈 선택</option>
                  {sizes.map((size) => (
                    <option value={size}> {size}</option>
                  ))}
                </select>
              </div>
              <div className="container">
                <label style={{ fontWeight: "bold" }}>수량</label>
                <input
                  className={styles.input_box}
                  type="number"
                  placeholder="상품 수량을 입력하세요"
                  value={option.quantity}
                  onChange={(e) => handleOptionChange(index, "quantity", e.target.value)}
                />
              </div>
              <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
                <button
                  className={styles.add_button}
                  onClick={(e) => updateOption(e, index)}
                >
                  옵션 수정
                </button>
                <button
                  className={styles.delete_button}
                  onClick={(e) => removeOption(e, index)}
                >
                  옵션 삭제
                </button>
              </div>
            </div>
          ))}

          {/*{options.map((option, index) => (*/}
          {/*  <div key={index}>*/}
          {/*    <label> Color</label>*/}
          {/*    <select*/}
          {/*      value={option.color}*/}
          {/*      onChange={(e) => handleOptionChange(index, "color", e.target.value)}*/}
          {/*    >*/}
          {/*      <option value=""> 선택하세요</option>*/}
          {/*      {colors.map((color) => (*/}
          {/*        <option value={color}> {color}</option>*/}
          {/*      ))}*/}
          {/*    </select>*/}
          {/*    <label> Size</label>*/}

          {/*    <select*/}
          {/*      value={option.size}*/}
          {/*      onChange={(e) => handleOptionChange(index, "size", e.target.value)}*/}
          {/*    >*/}
          {/*      <option value=""> 선택하세요</option>*/}
          {/*      {sizes.map((size) => (*/}
          {/*        <option value={size}> {size}</option>*/}
          {/*      ))}*/}
          {/*    </select>*/}
          {/*    <label>Quantity</label>*/}
          {/*    <input*/}
          {/*      type="number"*/}
          {/*      placeholder="Quantity"*/}
          {/*      value={option.quantity}*/}
          {/*      onChange={(e) => handleOptionChange(index, "quantity", e.target.value)}*/}
          {/*    />*/}
          {/*    <button onClick={(e) => updateOption(e, index)}>수정</button>*/}
          {/*    <button onClick={(e) => removeOption(e, index)}>제거</button>*/}
          {/*  </div>*/}
          {/*))}*/}
          <div className="grid">
            <button className={styles.select_button} onClick={(e) => addOption(e)}>
              Add Option
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ChangeProduct;
