import { useTranslation } from 'react-i18next';
import './MessageSend.css';

const MessageSend = ({ messageText, onMessageChange, onSend, isLoading, isLoggedIn }) => {
    const {t} = useTranslation()

    if (!isLoggedIn) {
        return (
            <div className="send-area locked">
                <p>{t("messages-erreur.pas-connecte")}</p>
            </div>
        );
    }

    return (
        <form className="send-area" onSubmit={onSend}>
            <textarea 
                value={messageText}
                onChange={(e) => {
                    const val = e.target.value.replace(/\n{2,}/g, '\n');
                    onMessageChange(val);
                }}
                placeholder={t("message.placeholder")}
                required
            />
            <button type="submit" className="theme-button" disabled={isLoading}>
                {isLoading ? '...' : t("message.bouton-envoyer-message")}
            </button>
        </form>
    );
};

export default MessageSend;