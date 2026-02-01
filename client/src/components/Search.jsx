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
        import.meta.env.VITE_SERVER_URL + "search?" + currentSearchInput,
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
