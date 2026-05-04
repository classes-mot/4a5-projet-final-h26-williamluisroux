import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ForumCard.css';

const ForumCard = ({ forum, isMine, onDelete }) => {
  const {t} = useTranslation();
  return (
    <Link to={`/forums/${forum.id}`} className="forum-card">
      <div className="card-content">
        <h3>{forum.titre}</h3>
        <p>{forum.description}</p>
      </div>

      <div className="card-footer">
        <span>{forum.messages?.length || 0} messages</span>
        
        {isMine ? (
          <button 
            className="delete-forum-btn" 
            onClick={(e) => onDelete(e, forum.id)}
          >
            {t("accueil.bouton-supprimer-forum")}
          </button>
        ) : (
          <span>→</span>
        )}
      </div>
    </Link>
  );
};

export default ForumCard;