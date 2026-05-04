import { createContext } from 'react';

export const ThemeContext = createContext({
    theme: 'black',
    toggleTheme: () => { }
});