export const applyTheme = (theme) => {
    const root = document.documentElement;

    if (theme === "Dark") {
        root.setAttribute("data-theme", "dark");
    } else {
        root.setAttribute("data-theme", "light");
    }
};