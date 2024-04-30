import React, { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [categoriesName, setCategoriesName] = useState([]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        categoryId,
        categoriesName,
        setSearchQuery,
        setCategoryId,
        setCategoriesName,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
