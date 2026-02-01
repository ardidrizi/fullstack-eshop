import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SelectedCategory.css";
import ProductCard from "../components/ProductCard";
import axios from "axios";

const SelectedCategory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log(products);

  const { category } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/categories/${category}`
        );
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="selected-product-category">
      <h1>{category}</h1>
      <div className="products-card">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            name={product.name}
            price={product.price}
            description={product.description}
            imgUrl={product.images?.[0] ?? ""}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectedCategory;
