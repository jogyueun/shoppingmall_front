import React, { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "./css/adminPage.module.css";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [productBodies, setProductBodies] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categoryTree, setCategoryTree] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [options, setOptions] = useState([{ color: "", size: "", quantity: 0 }]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (title.trim() == "") {
      alert("이름을 입력하세요.");
      return;
    }
    formData.append("title", title);

    if (price == null || price < 1) {
      alert("가격을 제대로 입력하세요.");
      return;
    }
    formData.append("price", price);

    if (selectedCategories.length < 2) {
      alert("카테고리를 제대로 정해주세요.");
      return;
    }

    formData.append(
      "categoryDTO",
      new Blob([JSON.stringify(selectedCategories.slice(-1)[0])], {
        type: "application/json",
      }),
    );

    options.forEach((option) => {
      if (option.color === "") {
        alert("색상을 제대로 입력해주세요.");
        return;
      }
      if (option.size === "") {
        alert("사이즈를 제대로 입력해주세요.");
        return;
      }
      if (option.quantity <= 0 || option.quantity === null) {
        alert("수량을 제대로 입력해주세요.");
        return;
      }
    });

    formData.append(
      "productDetails",
      new Blob([JSON.stringify(options)], {
        type: "application/json",
      }),
    );

    if (productImages.length == 0) {
      alert("상품 대표 이미지를 넣어주세요.");
      return;
    }

    productImages.forEach((file) => {
      formData.append("productImages", file);
    });

    if (productBodies.length == 0) {
      alert("상품 본문 이미지를 넣어주세요.");
      return;
    }

    productBodies.forEach((file) => {
      formData.append("productBodies", file);
    });

    try {
      const JWTToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: JWTToken,
        },
      };
      await axios
        .post(baseApiUrl + "/api/admin/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: JWTToken,
          },
        })
        .then((response) => (window.location.href = "/admin/products"));
      console.log("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleFileChange = (e, type) => {
    const newFiles = Array.from(e.target.files);
    const updatedPreviews = [...previews];

    newFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          updatedPreviews.push({ file, preview: reader.result });
          setPreviews(updatedPreviews);
          if (type === "images") {
            setProductImages((prevImages) => [...prevImages, file]);
          } else if (type === "bodies") {
            setProductBodies((prevBodies) => [...prevBodies, file]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const deleteFile = (e, type) => {
    e.preventDefault();
    if (type === "images") {
      const deletedFile = productImages.slice(-1)[0];
      const updatedImages = productImages.filter(
        (productImage) => productImage !== deletedFile,
      );
      setProductImages(updatedImages);
      setPreviews(previews.filter((preview) => preview.file !== deletedFile));
    } else if (type === "bodies") {
      const deletedFile = productBodies.slice(-1)[0];
      const updatedBodies = productBodies.filter(
        (productBody) => productBody !== deletedFile,
      );
      setProductBodies(updatedBodies);
      setPreviews(previews.filter((preview) => preview.file !== deletedFile));
    }
  };

  const handleCategorySelect = (category, depth) => {
    const updatedCategories = selectedCategories.slice(0, depth);
    setSelectedCategories([...updatedCategories, category]);
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const addOption = (e) => {
    e.preventDefault();
    setOptions([...options, { color: "", size: "", quantity: 0 }]);
  };

  const removeOption = (e, index) => {
    e.preventDefault();
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  return (
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
        <div className="container">
          <label htmlFor="productImages" style={{ fontWeight: "bold" }}>
            상품 대표 이미지
          </label>
          <input
            type="file"
            id="productImages"
            multiple
            onChange={(e) => handleFileChange(e, "images")}
          />
        </div>
      </div>
      <button
        className={styles.delete_button}
        onClick={(e) => deleteFile(e, "images")}
        style={{ marginBottom: 20 }}
      >
        사진 삭제
      </button>
      <br />
      <div className="container">
        <ul>
          {previews
            .filter((preview) => productImages.includes(preview.file))
            .map((preview, index) => (
              <li style={{ listStyle: "none", fontWeight: "bold" }} key={index}>
                {preview.file.name}
                <div className="container"></div>
                <br />
                <img
                  style={{ width: 250, height: 250 }}
                  src={preview.preview}
                  alt="Preview"
                />
                <hr />
              </li>
            ))}
        </ul>
      </div>
      <hr
        style={{
          background: "black",
          height: 1,
          border: 0,
        }}
      />

      <div className="grid">
        <div className="container">
          <label htmlFor="productBodies" style={{ fontWeight: "bold" }}>
            상품 본문 이미지
          </label>
          <input
            type="file"
            id="productBodies"
            multiple
            onChange={(e) => handleFileChange(e, "bodies")}
          />
        </div>
      </div>
      <button
        className={styles.delete_button}
        onClick={(e) => deleteFile(e, "bodies")}
        style={{ marginBottom: 20 }}
      >
        사진 삭제
      </button>
      <br />
      <div className="container">
        <ul>
          {previews
            .filter((preview) => productBodies.includes(preview.file))
            .map((preview, index) => (
              <li style={{ listStyle: "none", fontWeight: "bold" }} key={index}>
                {preview.file.name}
                <div className="container"></div>
                <br />
                <img
                  style={{ width: 250, height: 250 }}
                  src={preview.preview}
                  alt="Preview"
                />
                <hr />
              </li>
            ))}
        </ul>
      </div>
      <hr
        style={{
          background: "black",
          height: 1,
          border: 0,
        }}
      />

      {options.map((option, index) => (
        <div className="grid" key={index}>
          <div className="container">
            <label style={{ fontWeight: "bold" }}>색상</label>
            <select
              className={styles.select_option_box}
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
              className={styles.delete_button}
              onClick={(e) => removeOption(e, index)}
            >
              옵션 삭제
            </button>
          </div>
        </div>
      ))}
      <div className="grid">
        <button className={styles.select_button} onClick={(e) => addOption(e)}>
          옵션 추가
        </button>
        <button className={styles.select_button} type="submit">
          상품 등록
        </button>
      </div>
    </form>
  );
};
export default AddProduct;
