const initState = {
  user: {
    isLoggedIn: false,
  },
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN": {
      const user = { ...action.user, isLoggedIn: true };

      const localUser = {
        email: user.email,
        fullName: user.fullName,
        id: user.id,
        token: user.token,
        isLoggedIn: true,
      };
      window.cookies.set('user', JSON.stringify(localUser), { path: '/' });
      return { user };
    }
    case "LOGOUT": {
      const user = initState.user;

      window.cookies.set('user', JSON.stringify(user), { path: '/' });

      return { user };
    }
    case "UPDATE": {
      const user = action.user;

      window.cookies.set('user', JSON.stringify(user), { path: '/' });

      return { user };
    }
    default:
      return state;
  }
};

export default authReducer;
