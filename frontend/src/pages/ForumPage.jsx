import { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';
import MessageList from '../components/Messages/MessageList';
import MessageSend from '../components/Messages/MessageSend';
import './ForumPage.css';
import { useTranslation } from 'react-i18next';

const ForumPage = () => {
    const {t} = useTranslation();
    const auth = useContext(AuthContext);
    const { forumId } = useParams();
    const { isLoading, sendRequest } = useHttpClient();
    const [loadedForum, setLoadedForum] = useState(null);
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef(null);

    const fetchForum = useCallback(async () => {
        try {
            const responseData = await sendRequest(import.meta.env.VITE_BACKEND_URL + `forums/${forumId}`);
            setLoadedForum(responseData.forum);
        } catch (err) {
            console.log(err);
        }
    }, [forumId, sendRequest]);

    useEffect(() => {
        if (!loadedForum) {
            fetchForum();
        }
    }, [fetchForum, loadedForum]);

    const sendMessageHandler = async (event) => {
        event.preventDefault();
        const cleanedText = messageText.replace(/\n{2,}/g, '\n');
        if (cleanedText.trim().length === 0) return;
        
        try {
            await sendRequest(
                import.meta.env.VITE_BACKEND_URL + `messages/${forumId}`, 
                'POST',
                JSON.stringify({
                    contenu: cleanedText,
                    forumId: forumId,
                    auteurId: auth.userId
                }),
                { 
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token 
                }
            );
            setMessageText('');
            fetchForum();
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            console.log(err);
        }
    };

    const deleteMessageHandler = async (messageId) => {
        if (!window.confirm(t("confirmation.suppression-message"))) return;
        try {
            await sendRequest(
                import.meta.env.VITE_BACKEND_URL + `messages/${messageId}`,
                'DELETE',
                null,
                { Authorization: 'Bearer ' + auth.token }
            );
            fetchForum();
        } catch (err) {
            console.log(err);
        }
    };

    if (isLoading && !loadedForum) {
        return <div className="center">{t("forum.chargement")}</div>;
    }

    return (
        <div className="forum-page">
            <header className="forum-header">
                <h1>{loadedForum?.titre}</h1>
                <p>{loadedForum?.description}</p>
            </header>

            <MessageList 
                messages={loadedForum?.messages}
                currentUserId={auth.userId}
                currentUserRole={auth.role}
                onDelete={deleteMessageHandler}
                messagesEndRef={messagesEndRef}
            />

            <MessageSend 
                messageText={messageText}
                onMessageChange={setMessageText}
                onSend={sendMessageHandler}
                isLoading={isLoading}
                isLoggedIn={auth.isLoggedIn}
            />
        </div>
  );
};

export default ForumPage;