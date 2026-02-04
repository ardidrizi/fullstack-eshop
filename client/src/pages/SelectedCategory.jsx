import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SelectedCategory.css";
import ProductCard from "../components/ProductCard";
import { PRODUCTS_URL } from "../services/api";

const SelectedCategory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log(products);

  const { category } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${PRODUCTS_URL}/categories/${category}`);
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch {
        setError("Failed to load products");
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading) return <p className="page-status">Loading products...</p>;
  if (error) return <p className="page-status">{error}</p>;

  return (
    <div className="selected-product-category">
      <h1>{category}</h1>
      <div className="products-card">
        {products.length === 0 ? (
          <p className="page-status">No products found in this category.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product._id}
              name={product.name}
              price={product.price}
              description={product.description}
              imgUrl={product.images?.[0] ?? ""}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SelectedCategory;
