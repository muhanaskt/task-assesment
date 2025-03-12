import { useState } from "react";

const useFilter = (data) => {
  const [selectedFilters, setSelectedFilters] = useState({});
  
  

  const getFilteredItems = () => {
    if (!data?.items) return [];

    return data.items.filter((item) => {
      return Object.entries(selectedFilters).every(([attribute, values]) => {
        if (attribute === "price") {
          return item.sale_price >= values;
        }
        return values.length === 0 || values.includes(item[attribute]);
      });
    });
  };

  return {
    selectedFilters,
    setSelectedFilters,
    filteredItems: getFilteredItems(),
  };
};

export default useFilter;
