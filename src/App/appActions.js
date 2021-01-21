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

export const pageLoadingSet = (pageLoading) => {
  return {
    type: "PAGE_LOADING",
    pageLoading,
  };
}
export const headerTitleSet = (text) => {
  return {
    type: "HEADER_TITLE",
    headerTitle: text
  };
}