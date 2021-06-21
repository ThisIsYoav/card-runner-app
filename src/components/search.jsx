import React from "react";
import qs from "querystring";
import { useHistory } from "react-router-dom";

const Search = ({ query, handleChange, user }) => {
  
  let history = useHistory();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const searchUrl = "/cards/search";
      const parsedQuery = qs.parse(history.location.search);
      //check query to avoid repeating requests
      if (parsedQuery['?q'] === query) return;
      history.push({
        pathname: searchUrl,
        search: `q=${query}`,
      })
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      method="GET"
      className="form-inline my-1 my-lg-0"
    >
      {user && <input
        className="form-control mr-sm-1 order-1 order-sm-0"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
      />}
      <button
        className="btn btn-outline-dark mb-2 mb-sm-0 order-0 order-sm-1"
        type="submit" >
        Browse
        </button>
    </form>
  );
}
 
export default Search;