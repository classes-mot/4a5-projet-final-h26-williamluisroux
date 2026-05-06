import { useTranslation } from 'react-i18next';
import ForumCard from './ForumCard';
import './ForumList.css';

const ForumList = ({ items, sortCritere, onDelete, isAdmin }) => {
  const {t} = useTranslation();
  if (items.length === 0) {
    return (
      <div className="center">
        <p>{t("messages-erreur.aucun-forum")}</p>
      </div>
    );
  }

  return (
    <div className="forum-list">
      {items.map(f => (
        <ForumCard 
          key={f.id} 
          forum={f} 
          showDelete={sortCritere === 'mine' || isAdmin} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ForumList;