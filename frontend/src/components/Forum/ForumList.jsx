import { useTranslation } from 'react-i18next';
import ForumCard from './ForumCard';
import './ForumList.css';

const ForumList = ({ items, sortCriterion, onDelete }) => {
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
          isMine={sortCriterion === 'mine'} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ForumList;