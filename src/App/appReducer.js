import { alert } from "./appActions";

const initState = {
  alert: {
    type: "",
    content: "",
    timeout: 0,
    isActive: false,
  },
  connection: "",
  pageLoading: false,
  headerTitle: ''
};

const appReducer = (state = initState, action) => {
  switch (action.type) {
    case "ALERT": {
      const alert = {
        type: action.alertType,
        title: action.title,
        content: action.content,
        timeout: action.timeout,
        isActive: true,
      };

      const app = { ...state, alert };

      return { ...app };
    }

    case "RESET_ALERT": {
      const alert = {
        type: "",
        title: "",
        content: "",
        timeout: 0,
        isActive: false,
      };

      const app = { ...state, alert };

      return { ...app };
    }

    case 'PAGE_LOADING': {
      return { ...state, pageLoading: action.pageLoading } 
    }

    case 'HEADER_TITLE': {
      return { ...state, headerTitle: action.headerTitle } 
    }

    default:
      return state;
  }
};

export default appReducer;
