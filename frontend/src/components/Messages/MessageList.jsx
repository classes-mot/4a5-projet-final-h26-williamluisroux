import { useTranslation } from 'react-i18next';
import MessageItem from './MessageItem';

const MessageList = ({ messages, currentUserId, currentUserRole, onDelete, messagesEndRef }) => {
    const {t} = useTranslation();
    return (
        <div className="messages-container">
            {messages && messages.map((msg, index) => (
                <MessageItem 
                    key={msg._id || msg.id || index}
                    msg={msg}
                    canDelete={msg.auteurId?._id === currentUserId || currentUserRole === 'admin'}
                    isMyMessage={msg.auteurId?._id === currentUserId}
                    onDelete={onDelete}
                />
            ))}
            
            {(!messages || messages.length === 0) && (
                <p className="center" style={{opacity: 0.5}}>
                    {t("message.aucun-message")}
                </p>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;