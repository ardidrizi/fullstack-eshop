import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS_URL } from "../services/api";
import "./Categories.css";

const categoryVisuals = {
  Electronics: {
    icon: "💻",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  Audio: {
    icon: "🎧",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
  "Home & Kitchen": {
    icon: "🍳",
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
  },
  Furniture: {
    icon: "🛋️",
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
  },
  Fitness: {
    icon: "🏋️",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
  },
  Outdoors: {
    icon: "🏕️",
    imageUrl:
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80",
  },
  Beauty: {
    icon: "💄",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
  },
  "Books & Stationery": {
    icon: "📚",
    imageUrl:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
  },
  default: {
    icon: "🛍️",
    imageUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80",
  },
};

const getCategoryVisual = (category) => {
  return categoryVisuals[category] || categoryVisuals.default;
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(PRODUCTS_URL);
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }
        const products = await response.json();

        const uniqueCategories = Array.from(
          new Set(products.map((product) => product.category))
        ).map((category) => ({
          name: category,
          ...getCategoryVisual(category),
        }));

        setCategories(uniqueCategories);
        setLoading(false);
      } catch {
        setError("Failed to load categories");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="page-status">Loading categories...</p>;
  }

  if (error) {
    return <p className="page-status">{error}</p>;
  }

  return (
    <div className="categories-container">
      <h1 className="categories-title">Shop by Category</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <Link
            key={category.name}
            className="category-card"
            to={`/categories/${category.name}`}
            aria-label={`Shop ${category.name}`}
          >
            <img
              src={category.imageUrl}
              alt=""
              className="category-image"
              loading="lazy"
            />
            <div className="category-overlay" aria-hidden="true" />
            <div className="category-content">
              <span className="emoji" role="img" aria-label={`${category.name} icon`}>
                {category.icon}
              </span>
              <h2 className="category-name">{category.name}</h2>
              <span className="category-link">Shop Now</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
