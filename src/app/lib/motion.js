export const motionDurations = {
  micro: 0.18,
  ui: 0.28,
  page: 0.34,
};

export const motionEase = [0.22, 1, 0.36, 1];

export const pageReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionDurations.page, ease: motionEase },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.page, ease: motionEase },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionDurations.ui, ease: motionEase },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.06,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.ui, ease: motionEase },
  },
};

export const drawerSlide = {
  hidden: { x: "100%", opacity: 0.98 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: motionDurations.page, ease: motionEase },
  },
  exit: {
    x: "100%",
    opacity: 0.98,
    transition: { duration: motionDurations.micro, ease: "easeIn" },
  },
};

export const modalFadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: motionDurations.ui, ease: motionEase },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: motionDurations.micro, ease: "easeIn" },
  },
};

export const scaleTap = {
  whileTap: { scale: 0.97 },
  transition: { duration: motionDurations.micro, ease: motionEase },
};

export const viewportOnce = { once: true, amount: 0.18 };
