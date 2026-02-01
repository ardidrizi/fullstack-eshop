import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Categories.css";

const emoji = [
  { name: "Electronics", emoji: "💻" },
  { name: "Audio", emoji: "🎧" },
  { name: "Wearables", emoji: "👔" },
  { name: "Books", emoji: "📚" },
  { name: "Furniture", emoji: "🛋️" },
  { name: "Sports", emoji: "🏀" },
  { name: "Kitchen", emoji: "🔪" },
  { name: "Transport", emoji: "🚌" },
  { name: "Home Appliances", emoji: "🍳" },
  { name: "Home Security", emoji: "🔒" },
  { name: "Accessories", emoji: "🧳" },
  { name: "Beauty", emoji: "💄" },
  { name: "Food", emoji: "🍕" },
  { name: "Cameras", emoji: "🎥" },
  { name: "Clothing", emoji: "👕" },
  { name: "Mobile Phones", emoji: "📱" },
  { name: "Computers", emoji: "🖥️" },
];

const categoryImages = {
  Electronics: "/images/banner.avif",
  Clothing: "/images/banner2.avif",
  "Home & Kitchen": "/images/banner.avif",
  "Sports & Outdoors": "/images/banner2.avif",
  default: "/images/banner.avif",
};

const getCategoryImageUrl = (category) => {
  return categoryImages[category] || categoryImages.default;
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL);
        const products = response.data;

        // Extract unique categories from the products
        const uniqueCategories = Array.from(
          new Set(products.map((product) => product.category))
        ).map((category) => ({
          name: category,
          imageUrl: getCategoryImageUrl(category),
        }));

        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="categories-container">
      <h1 className="categories-title">Shop by Category</h1>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <Link to={`/categories/${category.name}`}>
              <span className="emoji" role="img" aria-label={category.name}>
                {emoji.find((e) => e.name === category.name)?.emoji}
              </span>
            </Link>
            <img
              src={category.imageUrl}
              alt={category.name}
              className="category-image"
            />
            <h2 className="category-name">{category.name}</h2>
            <Link to={`/categories/${category.name}`} className="category-link">
              Shop Now
            </Link>
          </div>
        ))}

        <div className="category-card">
          <img
            src="/images/banner2.avif"
            alt="More categories"
            className="category-image"
          />
          <h2 className="category-name">More Categories</h2>
          <Link to="/categories" className="category-link">
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;
