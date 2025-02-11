export const applyTheme = (theme) => {
    const root = document.documentElement;

    root.removeAttribute("data-theme");

    setTimeout(() => {
        if (theme === "Dark") {
            console.log("Dark mode aktif ediliyor.");
            root.setAttribute("data-theme", "dark");
        } else {
            console.log("Light mode aktif ediliyor.");
            root.setAttribute("data-theme", "light");
        }
    }, 10);
};
