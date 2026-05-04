import './ForumForm.css';

const ForumForm = ({ title, setTitle, description, setDescription, onSubmit, isLoading, t }) => {
  return (
    <form className="forum-form" onSubmit={onSubmit}>
      <h2>{t("nouveau-forum.creation-forum")}</h2>
      
      <div className="form-control">
        <label htmlFor="title">Titre</label>
        <input 
          id="title" 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
        />
      </div>

      <div className="form-control">
        <label htmlFor="description">{t("nouveau-forum.label-description")}</label>
        <textarea 
          id="description" 
          rows="2" 
          value={description} 
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <button type="submit" className="theme-button" disabled={isLoading}>
        {isLoading ? t("nouveau-forum.publier-forum-loading") : t("nouveau-forum.bouton-publier-forum")}
      </button>
    </form>
  );
};

export default ForumForm;