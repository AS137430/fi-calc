export const morph = time => ({
  componentWillEnter(cb, overEl, triggerEl) {
    const bb = triggerEl.getBoundingClientRect();
    const mybb = overEl.getBoundingClientRect();
    overEl.style.pointerEvents = 'none';
    overEl.style.opacity = 0;
    overEl.style.transition = 'none';
    overEl.style.transformOrigin = 'top left';
    overEl.style.transform = `translate3d(calc(${bb.x - mybb.x}px), ${bb.y -
      mybb.y}px, 0)
        scale(${bb.width / mybb.width}, ${bb.height / mybb.height})`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overEl.style.transition = `opacity ${time}ms cubic-bezier(0.175, 0.885, 0.32, 1), transform ${time}ms cubic-bezier(0.175, 0.885, 0.32, 1)`;
        overEl.style.opacity = 1;
        overEl.style.transform = 'none';
        setTimeout(() => {
          overEl.style.pointerEvents = 'all';
          cb();
        }, time);
      });
    });
  },
  componentWillLeave(cb, overEl, triggerEl) {
    const bb = triggerEl.getBoundingClientRect();
    const mybb = overEl.getBoundingClientRect();
    overEl.style.transition = `opacity ${time}ms cubic-bezier(0.6, -0.28, 0.735, 0.045), transform ${time}ms cubic-bezier(0.6, -0.28, 0.735, 0.045)`;

    requestAnimationFrame(() => {
      overEl.style.opacity = 0;
      overEl.style.transformOrigin = 'top left';
      overEl.style.transform = `translate3d(calc(${bb.x - mybb.x}px), ${bb.y -
        mybb.y}px, 0)
          scale(${bb.width / mybb.width}, ${bb.height / mybb.height})`;

      setTimeout(() => {
        cb();
      }, time);
    });
  },
});
