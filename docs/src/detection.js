/*Dark Theme*/
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}
function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    }
    else {
        setTheme('theme-dark');
    }
}
/*Определить тему системы*/
const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
if (darkThemeMq.matches) {
    setTheme('theme-dark');
}
else {
	setTheme('theme-light');
}

/* Определить язык системы */
var language = window.navigator ? (window.navigator.language ||
              window.navigator.systemLanguage ||
              window.navigator.userLanguage) : "ru";
language = language.substr(0, 2).toUpperCase();