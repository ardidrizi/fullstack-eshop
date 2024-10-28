// import ListAll from "./components/ListAll";
import Homepage from "./pages/HomePage";
import Navbar from "./components/navbar/Navbar";
import Categories from "./pages/Categories";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Shop from "./pages/Shop";
import Footer from "./components/Footer";
import SelectedCategory from "./pages/SelectedCategory";
import Search from "./components/Search";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <>
      <Navbar />
      <Search />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:category" element={<SelectedCategory />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
