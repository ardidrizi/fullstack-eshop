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
          `http://localhost:3000/api/products/categories/${category}`
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

  if (loading) <p>Loading products...</p>;
  if (error) <p>{error}</p>;

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
            imgUrl={product.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectedCategory;
