import { useState } from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "../components/Navigation/MainNavigation";
import Modal from "../components/UI/Modal";
import Auth from "./Auth";

export default function RootLayout() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const openAuth = (mode) => {
    setIsLogin(mode === 'login');
    setShowAuth(true);
  };

  return (
    <>
      {showAuth && (
        <Modal onClose={() => setShowAuth(false)}>
          <Auth isLoginMode={isLogin} onClose={() => setShowAuth(false)} />
        </Modal>
      )}
      <MainNavigation onAuth={openAuth} />
      <main><Outlet /></main>
    </>
  );
}