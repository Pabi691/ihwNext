import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "@/components/compat/router";

const HeaderSearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query.trim()}`);
    }
  };

  return (
  <>
  <Link className="md:hidden text-white ml-auto mr-5 text-lg" to={'/search'}>
    <BiSearch />
  </Link>
  
  <form onSubmit={handleSearch} className="md:flex items-center w-1/3 mx-auto relative hidden">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="flex-grow px-4 py-2 rounded-md focus:outline-none bg-[#f6f6f6]"
      />
      <button
        type="submit"
        className="ml-2 text-black px-4 py-2 rounded-md  transition absolute right-0 h-full"
      >
        {/* <FaSearch /> */}
        <BiSearch />
      </button>
    </form>
  </>
    
  );
};

export default HeaderSearchBar;

