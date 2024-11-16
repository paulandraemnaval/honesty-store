import React, { useEffect, useState } from "react";
import FilterIcon from "@public/icons/filter_icon.png";
import Image from "next/image";
import FilterBar from "@components/FilterBar";
const SearchInput = ({ searchKeyword, setSearchKeyword }) => {
  const [localSearch, setLocalSearch] = useState(searchKeyword);
  const [filterVisible, setFilterVisible] = useState(false);
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
    <div className="px-4 sm:py-2 py-0 flex gap-4">
      <input
        type="text"
        placeholder="search"
        className="py-2 px-4 items-center flex justify-center rounded-full ring-0 focus:ring-2 focus:outline-none bg-searchbarColor w-full sm:w-[18rem]"
        value={localSearch}
        onChange={handleChange}
      />
      <div
        className="flex sm:hidden object-cover w-fit h-full items-center justify-center "
        onClick={() => setFilterVisible((prev) => !prev)}
      >
        <Image src={FilterIcon} alt="filter" width={30} height={30} />
      </div>
      {filterVisible && (
        <div className="absolute sm:hidden flex bg-white h-full top-0 right-0">
          <FilterBar />
        </div>
      )}
    </div>
  );
};

export default SearchInput;
