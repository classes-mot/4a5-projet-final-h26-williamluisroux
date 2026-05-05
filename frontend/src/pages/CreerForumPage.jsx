import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';
import { useTranslation } from 'react-i18next';

import ForumForm from '../components/Forum/ForumForm';
import './CreerForumPage.css';

const CreerForumPage = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const forumSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        import.meta.env.VITE_BACKEND_URL + 'forums',
        'POST',
        JSON.stringify({
          titre: title,
          description: description,
          auteurId: auth.userId 
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      navigate('/'); 
    } catch (err) {
        console.log(err);
    }
  };

  return (
    <div className="new-forum-container">
      <ForumForm 
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        onSubmit={forumSubmitHandler}
        isLoading={isLoading}
        t={t}
      />
    </div>
  );
};

export default CreerForumPage;