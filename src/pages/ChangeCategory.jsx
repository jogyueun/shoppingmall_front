import React, { useEffect, useState } from "react";
import axios from "axios";
import baseApiUrl from "../constants/apiUrl";
import styles from "./css/adminPage.module.css";

const ChangeCategory = () => {
  const [categoryTree, setCategoryTree] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [updateCategoryName, setUpdateCategoryName] = useState("");

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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const categoryDTO = {
      name: updateCategoryName,
      id: selectedCategories.slice(-1)[0].id,
      superId: selectedCategories.slice(-1)[0].superId,
    };
    try {
      const JWTToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: JWTToken,
        },
      };
      await axios
        .put(`${baseApiUrl}/api/admin/categories/${categoryDTO.id}`, categoryDTO, config)
        .then((response) => (window.location.href = "/admin/categoriesChange"));
      console.log("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    const categoryDTO = {
      name: updateCategoryName,
      id: selectedCategories.slice(-1)[0].id,
      superId: selectedCategories.slice(-1)[0].superId,
    };
    try {
      const JWTToken = localStorage.getItem("jwtToken");
      const config = {
        headers: {
          Authorization: JWTToken,
        },
      };
      await axios
        .delete(`${baseApiUrl}/api/admin/categories/${categoryDTO.id}`, config)
        .then((response) => (window.location.href = "/admin/categoriesChange"));
      console.log("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const renderCategoryTree = (categories, depth = 0) => {
    const selectedCategory = selectedCategories[depth] || null;

    return (
      <>
        <label style={{ fontWeight: "bold" }}> 상위 Category {depth + 1}</label>
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

  const handleUpdateCategoryNameChange = (e) => {
    setUpdateCategoryName(e.target.value);
  };

  const handleCategorySelect = (category, depth) => {
    const updatedCategories = selectedCategories.slice(0, depth);
    setSelectedCategories([...updatedCategories, category]);
    if (category == undefined) {
      setSelectedCategories([]);
    }
  };

  return (
    <>
      <div className="container">
        <label style={{ fontWeight: "bold" }}>변경할 카테고리명</label>
      </div>
      <div>
        <input
          className={styles.input_box}
          type="text"
          value={updateCategoryName}
          onChange={handleUpdateCategoryNameChange}
          placeholder="카테고리 이름 변경"
        />
        <div>{renderCategoryTree(categoryTree)}</div>
        <button className={styles.add_button} onClick={handleUpdateSubmit}>
          변경
        </button>
        <button className={styles.delete_button} onClick={handleDeleteSubmit}>
          삭제
        </button>
      </div>
    </>
  );
};

export default ChangeCategory;
