import { useEffect, useState } from "react";
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
    <div className="px-4 sm:py-2 py-0 flex gap-4">
      <input
        type="text"
        placeholder="search"
        className="py-2 px-4 items-center flex justify-center rounded-full ring-0 focus:ring-2 focus:outline-none bg-searchbarColor w-full sm:w-[18rem]"
        value={localSearch}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchInput;
