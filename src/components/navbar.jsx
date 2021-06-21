import React from "react";
import { Link, NavLink } from "react-router-dom";
import Search from "./search";

const Navbar = ({ user, query, handleChange }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          CardRunner
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto order-lg-2">
            {!user && (
              <React.Fragment>
              <li className="nav-item">
                <NavLink className="nav-link" to="/signin">
                  Signin
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/signup">
                  Signup
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/biz-signup">
                  Business
                </NavLink>
              </li>
              </React.Fragment>
            )}
            {user && (
              <li className="nav-item dropdown mb-2">
              <a className="nav-link dropdown-toggle text-capitalize" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Hi, {user.name}
              </a>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                  {user && user.biz && (
                      <Link className="dropdown-item" to="/my-cards">
                        My Cards
                      </Link>
                  )}
                <Link className="dropdown-item" to="/my-favorites">
                  My Favorites
                </Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item font-weight-light" to="/logout">
                  Logout
                </Link>
                <Link className="dropdown-item font-weight-light" to="/delete-user">
                  Delete User
                </Link>
              </div>
            </li>
            )}
          </ul>
          
          <ul className="navbar-nav order-lg-1">
            <li className="nav-item">
              <Search query={query} handleChange={handleChange} user={user} />
            </li>
          </ul>
          <ul className="navbar-nav mr-auto order-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
 
export default Navbar;