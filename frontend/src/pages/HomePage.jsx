import { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import ForumList from '../components/Forum/ForumList.jsx';
import './HomePage.css';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const {t} = useTranslation();
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [forums, setForums] = useState([]);
  const [sortCritere, setSortCritere] = useState('recent');

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const data = await sendRequest(import.meta.env.VITE_BACKEND_URL + 'forums');
        setForums(data.forums);
      } catch (err) {
        console.log(err);
      }
    };
    fetchForums();
  }, [sendRequest]);

  const deleteForumHandler = async (event, forumId) => {
    event.preventDefault();
    if (!window.confirm(t("confirmation.suppression-forum"))) return;

    try {
      await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `forums/${forumId}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + auth.token }
      );
      setForums(prevForums => prevForums.filter(f => f.id !== forumId));
    } catch (err) {
      console.log(err);
    }
  };

  // Logique de Tri et Filtre
  let displayedForums = [...forums];
  if (sortCritere === 'mine') {
    displayedForums = displayedForums.filter(f => f.createurId?.toString() === auth.userId?.toString());
  }

  displayedForums.sort((a, b) => {
    if (sortCritere === 'recent') {
      return new Date(b.dateCreation || b.id) - new Date(a.dateCreation || a.id);
    }
    if (sortCritere === 'oldest') {
      return new Date(a.dateCreation || a.id) - new Date(b.dateCreation || b.id);
    }
    if (sortCritere === 'popular') { 
      return (b.messages?.length || 0) - (a.messages?.length || 0);
    }
    return 0;
  });

  return (
    <div className="home">
      <div className="home-header">
        <h1>FORUMS</h1>
        {auth.isLoggedIn && (
          <Link to="/forums/create-forum" className="create-forum-btn">
            {t("accueil.bouton-nouveau-forum")}
          </Link>
        )}
        <div className="filter-area">
          <select 
            value={sortCritere} 
            onChange={(e) => setSortCritere(e.target.value)}
          >
            <option value="recent">{t("accueil.option-plus-recent")}</option>
            <option value="oldest">{t("accueil.option-plus-anciens")}</option>
            <option value="popular">{t("accueil.option-plus-populaires")}</option>
            {auth.isLoggedIn && <option value="mine">{t("accueil.option-mes-forums")}</option>}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p className="center">{t("accueil.chargement-forums")}</p>
      ) : (
        <ForumList 
          items={displayedForums} 
          sortCriterion={sortCritere} 
          onDelete={deleteForumHandler} 
        />
      )}
    </div>
  );
}