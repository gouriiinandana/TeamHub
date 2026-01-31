import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Force light mode - clear any saved dark mode preference
        localStorage.removeItem('teamhub_theme');
        return 'light';
    });

    useEffect(() => {
        // Always ensure light mode
        localStorage.setItem('teamhub_theme', 'light');
        // Remove dark class if it exists
        document.documentElement.classList.remove('dark');
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
