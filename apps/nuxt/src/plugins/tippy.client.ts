import tippy from 'tippy.js';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      tippy: tippy,
    },
  };
});
