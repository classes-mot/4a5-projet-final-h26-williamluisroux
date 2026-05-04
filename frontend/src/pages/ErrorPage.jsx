import { useTranslation } from "react-i18next";
import MainNavigation from "../components/Navigation/MainNavigation";
import "./ErrorPage.css";

const ErrorPage = () => {
  const {t} = useTranslation();
  return (
    <>
      <MainNavigation />
      <main className="error-container">
        <h1>{t("messages-erreur.erreur404-titre")}</h1>
        <p>{t("messages-erreur.erreur404-phrase")}</p>
      </main>
    </>
  );
};

export default ErrorPage;
