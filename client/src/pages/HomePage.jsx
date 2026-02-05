import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import Categories from "./Categories";
import { motion } from "framer-motion";
// import { useParams } from "react-router-dom";
// import "./HomePage.css ";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { PRODUCTS_URL } from "../services/api";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  // console.log(products);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(PRODUCTS_URL);
        if (!resp.ok) {
          throw new Error("Failed to load products");
        }
        const data = await resp.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <p className="hero-kicker">Fresh drops every week</p>
          <h1>Welcome to E-Shop</h1>
          <p>Curated essentials, fast checkout, and delivery you can trust.</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn-hero">
              Shop Now
            </Link>
            <Link to="/about-us" className="btn-hero-secondary">
              About us
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        className="categories"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* <Link to={``} className="btn-view-all"> */}
        <Categories />
        {/* </Link> */}
      </motion.section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <p className="featured-subtitle">
          Hand-picked items with the best balance of quality and value.
        </p>
        <motion.div
          className="product-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to={`/shop/${product._id}`} className="no-underline">
                <ProductCard
                  name={product.name}
                  price={product.price}
                  imgUrl={product.images[0] ?? ""}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Homepage;
