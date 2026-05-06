import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { AuthContext } from './context/auth-context';
import { ThemeProvider } from './context/ThemeProvider.jsx';

// Import des composants de structure et pages
import RootLayout from './Containers/Roots';
import HomePage from './pages/HomePage';
import ForumPage from './pages/ForumPage';
import ErrorPage from './pages/ErrorPage';
import CreerForumPage from './pages/CreerForumPage';
import ProfilePage from './pages/ProfilePage';

const routerLoggedIn = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "forums/:forumId", element: <ForumPage /> },
      { path: "/forums/create-forum", element: <CreerForumPage />},
      { path: "/users/profile/:userId", element: <ProfilePage />}
    ]
  }
]);

const routerNotLoggedIn = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "forums/:forumId", element: <ForumPage /> },
      { path: "/forums/create-forum", element: <CreerForumPage />}
    ]
  }
]);

export default function App() {
  const [token, setToken] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    return storedData?.token || null;
  });

  const [userId, setUserId] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    return storedData?.userId || null;
  });

  const [userImage, setUserImage] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    return storedData?.userImage || null;
  });

  const [role, setRole] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    return storedData?.role || null;
  });

  const loginHandler = useCallback((uid, token, role, image) => {
    setToken(token);
    setUserId(uid);
    setRole(role);
    setUserImage(image);
    localStorage.setItem(
      'userData',
      JSON.stringify({ 
        userId: uid, 
        token: token,
        role: role,
        userImage: image })
    );
  }, []);

  const logoutHandler = useCallback(() => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      setToken(null);
      setUserId(null);
      setRole(null);
      setUserImage(null);
      localStorage.removeItem('userData');
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          userImage: userImage,
          role: role,
          login: loginHandler,
          logout: logoutHandler  
        }}
      >
        <RouterProvider router={token ? routerLoggedIn : routerNotLoggedIn} />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}