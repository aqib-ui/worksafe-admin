const DISABLE_SCROLLING_CLASS = "disable-scrolling";

export default {
  enable() {
    const body = document.body;
    body.classList.add(DISABLE_SCROLLING_CLASS);
  },
  disable() {
    const body = document.body;
    body.classList.remove(DISABLE_SCROLLING_CLASS);
  },
};
