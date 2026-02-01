import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  // console.log(products);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(import.meta.env.VITE_SERVER_URL, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setProducts(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="products-section">
      {/* Featured Products Section */}
      <section className="section-featured-products">
        <h2 className="section-title">Featured Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <Link
              to={`/shop/${product._id}`}
              key={product._id}
              className="no-underline"
            >
              {" "}
              {/* Wrap ProductCard with Link */}
              <ProductCard
                name={product.name}
                price={product.price}
                imgUrl={product.images[0] ?? ""}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Shop;
