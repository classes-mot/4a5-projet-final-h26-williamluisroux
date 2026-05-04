import { useContext, useState } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import { useTranslation } from 'react-i18next';
import './AuthForm.css';

export default function AuthForm({ isLoginMode, onClose }) {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest } = useHttpClient();
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError(null);
    
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    if (!isLoginMode && data.password !== data.confirmPassword) {
      setValidationError(t("messages-erreur.mdp-match"));
      return;
    }

    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/users/${isLoginMode ? 'login' : 'register'}`,
        'POST',
        JSON.stringify(data)
      );
      auth.login(responseData.userId, responseData.token, responseData.user?.profilePicture || responseData.profilePicture);
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{isLoginMode ? t("connexion.titre-connexion") : t("inscription.titre-inscription")}</h2>
      
      {(error || validationError) && (
        <p className="error-msg">{error || validationError}</p>
      )}
      
      {!isLoginMode && (
        <div className="control">
          <label>{t("inscription.label-nom")}</label>
          <input type="text" name="name" required />
        </div>
      )}

      <div className="control">
        <label>{t("connexion.label-email")}</label>
        <input type="email" name="email" required />
      </div>

      <div className="control">
        <label>{t("connexion.label-password")}</label>
        <input 
          type="password" 
          name="password" 
          required 
          minLength={6} 
        />
      </div>

      {!isLoginMode && (
        <div className="control">
          <label>{t("inscription.label-password-confirme")}</label>
          <input 
            type="password" 
            name="confirmPassword" 
            required 
          />
        </div>
      )}

      <button className="theme-button" disabled={isLoading} type="submit">
        {isLoading ? t("connexion.bouton-confirmer-loading") : t("connexion.bouton-confirmer")}
      </button>
    </form>
  );
}