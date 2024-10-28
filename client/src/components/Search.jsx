import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Search.css";

const Search = () => {
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchChange = (e) => {
    setCurrentSearchInput(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:3000/api/products/search?" + currentSearchInput,
        {
          params: { keyword: currentSearchInput },
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
      setSearchResults(response.data);
    } catch (error) {
      setError("Failed to fetch search results.");
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="navbar-search" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={currentSearchInput}
          onChange={handleSearchChange}
          placeholder="Search products..."
        />
        <button type="submit">
          <i className="fa fa-search"></i>
        </button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="search-results">
        {searchResults.length > 0
          ? searchResults.map((product) => (
              <div key={product._id} className="search-result-item">
                <Link to={`/product/${product._id}`}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </Link>
              </div>
            ))
          : !isLoading && <p></p>}
      </div>
    </div>
  );
};

export default Search;
