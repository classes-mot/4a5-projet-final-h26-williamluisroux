import { Link } from 'react-router-dom';
import './ProfilePicture.css';

const ProfilePicture = ({ imageURL, userId, size = 'medium' }) => {
  // URL de secours si imageURL est vide ou invalide
  const fallbackImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  
  const image = (
    <img 
      src={imageURL || fallbackImage}
      alt="Profil" 
      className={`profile-pic ${size}`}
      onError={(e) => { e.target.src = fallbackImage; }}
    />
  );

  // Si on passe un userId, l'image devient un lien vers le profil
  if (userId) {
    return (
      <Link to={`/users/profile/${userId}`} className="profile-pic-link">
        {image}
      </Link>
    );
  }

  return image;
};

export default ProfilePicture;