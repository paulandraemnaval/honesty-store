import React, { useEffect, useState } from "react";

const SearchInput = ({ searchKeyword, setSearchKeyword }) => {
  const [localSearch, setLocalSearch] = useState(searchKeyword);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchKeyword(localSearch);
    }, 1000);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchKeyword]);

  const handleChange = (e) => {
    setLocalSearch(e.target.value);
  };

  return (
    <div className="p-1">
      <input
        type="text"
        placeholder="search"
        className="p-3 rounded-full ring-0 focus:ring-2 focus:outline-none bg-searchbarColor"
        value={localSearch}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchInput;
