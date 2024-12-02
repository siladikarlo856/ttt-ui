export const useVisibilityController = () => {
  const isVisible = ref(false);

  function show() {
    isVisible.value = true;
  }

  function hide() {
    isVisible.value = false;
  }

  function toggle() {
    isVisible.value = !isVisible.value;
  }

  return {
    isVisible,
    show,
    hide,
    toggle,
  };
};
