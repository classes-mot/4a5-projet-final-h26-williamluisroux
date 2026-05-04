import ProfilePicture from '../UI/ProfilePicture';
import './MessageItem.css';

const MessageItem = ({ msg, isMyMessage, onDelete }) => {
    const auteurImage = msg.auteurId?.profilePicture;
    const auteurName = msg.auteurId?.name || "Anonyme";

    return (
        <div className={`message-bubble ${isMyMessage ? 'sent' : 'received'}`}>
            <div className="msg-info">
                <ProfilePicture 
                    imageURL={auteurImage} 
                    size="small" 
                />
                <span className="msg-author">{auteurName}</span>
                <div className="msg-actions">
                    <span className="msg-date">
                        {msg.dateEnvoi ? new Date(msg.dateEnvoi).toLocaleString() : ""}
                    </span>
                    
                    {isMyMessage && (
                        <button 
                            className="delete-msg-btn"
                            onClick={() => onDelete(msg._id || msg.id)}
                            title="Supprimer ce message"
                        >
                            x
                        </button>
                    )}
                </div>
            </div>
            <p className="msg-content">{msg.contenu}</p>
        </div>
    );
};

export default MessageItem;