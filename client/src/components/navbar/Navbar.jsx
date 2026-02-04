// import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Search from "../Search";
import useAuth from "../../context/useAuth";
// import { NavLink } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Navbar.css";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "Shop", path: "/shop" },
  { title: "Categories", path: "/categories" },
  // { title: "Deals", path: "deals" },
  { title: "About Us", path: "/about-us" },
  // { title: "Contact", path: "contact" },
];

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">E-Shop</Link>
        </div>

        <div className="navbar-menu">
          <ul className="navbar-links">
            {navLinks.map((link, index) => {
              return (
                <li key={index}>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                    to={link.path}
                  >
                    {link.title}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <Search />

        <div className="navbar-icons">
          {user ? (
            <>
              <Link to="/cart">
                <i className="fa fa-shopping-cart"></i>
              </Link>
              <Link to="/orders">
                <i className="fa fa-receipt"></i>
              </Link>
              {user.role === "admin" && (
                <Link to="/admin/products">
                  <i className="fa fa-toolbox"></i>
                </Link>
              )}
              <button className="navbar-logout" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
          <Link to="/wishlist">
            <i className="fa fa-heart"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
