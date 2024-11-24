import { useEffect, useState } from "react";
import Image from "next/image";
import searchIcon from "@public/icons/search_icon.png";

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
    <div className="relative w-full sm:w-[18rem]">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Image src={searchIcon} alt="search_icon" height={25} width={25} />
      </div>

      <input
        type="text"
        placeholder="Search"
        className="py-2 pl-10 pr-4 rounded-sm ring-0 focus:ring-2 focus:outline-none bg-[#ECE6F0] w-full"
        value={localSearch}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchInput;
