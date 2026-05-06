import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';
import ProfilePicture from '../components/UI/ProfilePicture';
import './ProfilePage.css';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const {t} = useTranslation();
  const auth = useContext(AuthContext);
  const { userId } = useParams();
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  
  const [newName, setNewName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `users/profile/${userId}`,
          'GET',
          null,
          { 
            Authorization: 'Bearer ' + auth.token 
          });
        setLoadedUser(responseData.user);
        setNewName(responseData.user.name);
        setNewImageUrl(responseData.user.profilePicture);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [sendRequest, userId, auth.token]);

  // Modification du NOM
  const nameSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `users/profile/${userId}/name`,
        'PATCH',
        JSON.stringify({ name: newName }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      setLoadedUser(responseData.user);
      alert("Nom mis à jour !");
    } catch (err) {
        console.log(err);
    }
  };

  const imageSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `users/profile/${userId}/image`,
        'PATCH',
        JSON.stringify({ imageURL: newImageUrl }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      setLoadedUser(responseData.user);
      alert("Photo de profil mise à jour !");
    } catch (err) {
        console.log(err);
    }
  };

  if (isLoading && !loadedUser) {
    return <div className="center">{t("profile.chargement")}</div>;
  }

  const isOwnProfile = auth.userId === userId;

  return (
    <div className="profile-page">
      {loadedUser && (
        <div className="profile-container">
          <div className="profile-header">
            <ProfilePicture imageURL={loadedUser.profilePicture} size="large" />
            <h1>{loadedUser.name}</h1>
            <p className="basic-text">{t("profile.email")} : {loadedUser.email}</p>
            <p className="basic-text">{t("profile.role")} : {loadedUser.role}</p>
          </div>

          {isOwnProfile && (
            <div className="edit-sections">
              {/* Section nom */}
              <form className="edit-card" onSubmit={nameSubmitHandler}>
                <h3>{t("profile.label-modifier-nom")}</h3>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                />
                <button type="submit" className="theme-button">{t("profile.bouton-modifier-nom")}</button>
              </form>

              {/* Section image */}
              <form className="edit-card" onSubmit={imageSubmitHandler}>
                <h3>{t("profile.label-modifier-photo")}</h3>
                <input 
                  type="text" 
                  placeholder={t("profile.placeholder-image")} 
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)} 
                />
                <button type="submit" className="theme-button">{t("profile.bouton-modifier-photo")}</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;