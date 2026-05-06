import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';
import ProfilePicture from '../components/UI/ProfilePicture';
import EditCard from '../components/UI/EditCard';
import './ProfilePage.css';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
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

  // Modification de l'IMAGE
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

  const deleteAccountHandler = async () => {
    const confirmDelete = window.confirm(t("profile.confirmation-suppression"));
    
    if (confirmDelete) {
      try {
        await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `users/profile/${userId}`,
          'DELETE',
          null,
          {
            Authorization: 'Bearer ' + auth.token
          }
        );
        
        if (auth.userId === userId) {
          auth.logout();
        }
        
        alert(t("profile.succes-suppression"));
        navigate('/');
      } catch (err) {
        console.log(err);
      }
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
              <EditCard 
                title={t("profile.label-modifier-nom")}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onSubmit={nameSubmitHandler}
                buttonText={t("profile.bouton-modifier-nom")}
              />

              <EditCard 
                title={t("profile.label-modifier-photo")}
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onSubmit={imageSubmitHandler}
                buttonText={t("profile.bouton-modifier-photo")}
                placeholder={t("profile.placeholder-image")}
              />

              <div className="edit-card danger-zone">
                <h3>{t("profile.zone-danger")}</h3>
                <p className="basic-text">{t("profile.info-suppression")}</p>
                <button 
                  type="button" 
                  className="theme-button delete-btn" 
                  onClick={deleteAccountHandler}
                >
                  {t("profile.bouton-supprimer-compte")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;