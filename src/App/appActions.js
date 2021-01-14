export const alert = (alertType, title, content, timeout) => {
  return {
    type: "ALERT",
    alertType,
    title,
    content,
    timeout,
  };
};

export const resetAlert = () => {
  return {
    type: "RESET_ALERT",
  };
};

export const pageLoading = (pageLoading) => {
  return {
    type: "PAGE_LOADING",
    pageLoading,
  };
}