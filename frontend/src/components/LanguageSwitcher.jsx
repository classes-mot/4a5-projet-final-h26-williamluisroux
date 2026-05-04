import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };
    return (
        <div>
            <button onClick={() => changeLanguage('fr')}>
                Français
            </button>
            <button onClick={() => changeLanguage('en')}>
                English
            </button>
        </div>
    );
}
