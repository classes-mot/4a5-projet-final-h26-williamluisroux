import { useState, useEffect } from 'react';
import { ThemeContext } from './theme-context.js';

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('appTheme') || 'black');

    const toggleTheme = () => {
        const newTheme = theme === 'gold' ? 'black' : 'gold';
        setTheme(newTheme);
        localStorage.setItem('appTheme', newTheme);
    };

    useEffect(() => {
        document.body.className = `theme-${theme}`;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};