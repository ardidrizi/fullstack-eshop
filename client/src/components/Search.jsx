import { useState } from "react";
import { Link } from "react-router-dom";
import "./Search.css";
import { PRODUCTS_URL } from "../services/api";

const Search = () => {
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchChange = (e) => {
    setCurrentSearchInput(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!currentSearchInput.trim()) {
      setSearchResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${PRODUCTS_URL}/search?keyword=${encodeURIComponent(
          currentSearchInput.trim()
        )}`
      );
      if (!response.ok) {
        throw new Error("Search request failed");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setError("Failed to fetch search results.");
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="navbar-search-wrapper">
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

      {isLoading && <p className="search-status">Loading...</p>}
      {error && <p className="search-status error-message">{error}</p>}

      <div className="search-results" aria-live="polite">
        {searchResults.length > 0
          ? searchResults.map((product) => (
              <Link
                key={product._id}
                to={`/shop/${product._id}`}
                className="search-result-item"
              >
                <span className="search-result-name">{product.name}</span>
                <span className="search-result-description">
                  {product.description}
                </span>
              </Link>
            ))
          : !isLoading && currentSearchInput && (
              <p className="search-status">No results found.</p>
            )}
      </div>
    </div>
  );
};

export default Search;
