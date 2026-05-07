import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import { ThemeContext } from '../../context/theme-context.js';
import { useTranslation } from 'react-i18next';
import './NavLinks.css';
import LanguageSwitcher from '../LanguageSwitcher.jsx';

const NavLinks = (props) => {
  const {t} = useTranslation();
  const auth = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const logoutHandler = () => {
    auth.logout();
    navigate('/'); 
  };

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" end>{t("navigation.bouton-accueil")}</NavLink>
      </li>
      
      {!auth.isLoggedIn && (
        <>
          <li>
            <button onClick={() => props.onAuth('login')}>{t("navigation.bouton-login")}</button>
          </li>
          <li>
            <button onClick={() => props.onAuth('signup')}>{t("navigation.bouton-register")}</button>
          </li>
        </>
      )}

      {auth.isLoggedIn && (
        <>
          <li>
            <button className="btn-logout" onClick={logoutHandler}>{t("navigation.bouton-deconnexion")}</button>
          </li>
        </>
      )}
      <li>
        <button className="change-theme-button" onClick={toggleTheme}>
          {theme === 'black' ? t("navigation.theme-or") : t("navigation.theme-noir")}
        </button>
      </li>
      <li>
        <LanguageSwitcher />
      </li>
    </ul>
  );
};

export default NavLinks;