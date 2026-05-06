import './EditCard.css';

const EditCard = ({ title, value, onChange, onSubmit, buttonText, placeholder, type = "text" }) => {
  return (
    <form className="edit-card" onSubmit={onSubmit}>
      <h3>{title}</h3>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
      />
      <button type="submit" className="theme-button">
        {buttonText}
      </button>
    </form>
  );
};

export default EditCard;