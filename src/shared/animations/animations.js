export const createContainerVariants = (delayChildren = 0.3, staggerChildren = 0.2) => ({
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren,
            staggerChildren,  // Burada her bir öğe arasında bir gecikme ekliyoruz
        },
    },
});

export const createItemVariants = (y = 20, opacity = 0) => ({
    hidden: { y, opacity },
    visible: {
        y: 0,
        opacity: 1
    }
});

export const opacityEffect = (duration = 0.8) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration }
});
