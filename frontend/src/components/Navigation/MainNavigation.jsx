import { useState, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import ProfilePicture from "../UI/ProfilePicture";
import HamburgerButton from "./HamburgerButton";
import "./MainNavigation.css";

const MainNavigation = (props) => {
  const auth = useContext(AuthContext);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawer = () => setDrawerIsOpen(true);
  const closeDrawer = () => setDrawerIsOpen(false);

  return (
    <>
      <HamburgerButton show={drawerIsOpen} onClick={closeDrawer}>
        <NavLinks onAuth={props.onAuth} />
      </HamburgerButton>

      <header className="main-header">
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>

        <h1 className="main-navigation__title">
          <Link to="/">GOLDENFORUMS</Link>
        </h1>

        <nav className="main-navigation__header-nav">
          <NavLinks onAuth={props.onAuth} />
        </nav>
        {auth.isLoggedIn && (
          <ProfilePicture 
            imageURL={auth.userImage}
            userId={auth.userId}
            size="medium"
          />
        )}
      </header>
    </>
  );
};

export default MainNavigation;