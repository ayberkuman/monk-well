import { useRef, useEffect } from "react";
import {
  globalRoutes,
  guestRoutes,
  authRoutes,
} from "../App/routes";
import { matchPath } from "react-router";
import is from "is_js";
import API, { headers } from "./API";
import store from "../store";

export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const getCurrentRouteName = async (link, lang) => {
  const allRoutes = {
    ...globalRoutes,
    ...guestRoutes,
    ...authRoutes,
  };

  const currLocation = await Object.keys(allRoutes).filter((key) => {
    return matchPath(link, {
      path: allRoutes[key].links[lang],
      exact: allRoutes[key].exact,
      strict: false,
    });
  });

  return currLocation.length && currLocation[0];
};

export const getCurrentRoute = async (link, lang) => {
  const allRoutes = {
    ...globalRoutes,
    ...guestRoutes,
    ...authRoutes,
  };

  const currLocation = await Object.keys(allRoutes).filter((key) => {
    return matchPath(link, {
      path: allRoutes[key].links[lang],
      exact: allRoutes[key].exact,
      strict: false,
    });
  });

  return (
    currLocation.length && {
      name: currLocation[0],
      route: allRoutes[currLocation[0]],
    }
  );
};

export const getParamsFromLink = (link, routeName, lang) => {
  const allRoutes = {
    ...globalRoutes,
    ...guestRoutes,
    ...authRoutes,
  };

  return matchPath(link, {
    path: allRoutes[routeName].links[lang],
    exact: allRoutes[routeName].exact,
    strict: false,
  });
};

export const compareArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  const compArr = arr1.filter((data) => arr2.indexOf(data) === -1);
  return !Boolean(compArr.length);
};

export const getOrientation = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    img.onloadend = () => {
      resolve(img.naturalWidth > img.naturalHeight ? "landscape" : "portrait");
    };
  });
};

export const validateInput = (type, value) => {
  let regexp;

  if (type === "tel")
    regexp = /^[(]?[0-9]{4}[)]?[\s]?[0-9]{3}[\s]?[0-9]{2}[\s]?[0-9]{2}$/im;

  if (type === "website")
    regexp = /^(?:(?:(?:https?|ftp)?:)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  if (type === "email")
    // eslint-disable-next-line no-useless-escape
    regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (type === "tckn")
    // eslint-disable-next-line no-useless-escape
    regexp = /^[1-9]{1}[0-9]{9}[02468]{1}$/;

  if (type === "number") regexp = /^([0-9])+$/;

  if (type === "numberFormat") regexp = /^([0-9 .,])+$/;

  if (type === "creditCard") {
    return is.creditCard(value.trim());
  }

  return regexp ? regexp.test(value.trim()) : "";
};

export const makeURL = (text) =>
  text
    .replace(/Ğ/gim, "g")
    .replace(/Ü/gim, "u")
    .replace(/Ş/gim, "s")
    .replace(/I/gim, "i")
    .replace(/İ/gim, "i")
    .replace(/Ö/gim, "o")
    .replace(/Ç/gim, "c")
    .replace(/ğ/gim, "g")
    .replace(/ü/gim, "u")
    .replace(/ş/gim, "s")
    .replace(/ı/gim, "i")
    .replace(/ö/gim, "o")
    .replace(/ç/gim, "c")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();

export const getScrollY = () =>
  typeof window.pageYOffset == "number"
    ? window.pageYOffset
    : document.body && (document.body.scrollLeft || document.body.scrollTop)
    ? document.body.scrollTop
    : document.documentElement &&
      (document.documentElement.scrollLeft ||
        document.documentElement.scrollTop)
    ? document.documentElement.scrollTop
    : "";

export const setViewportHeight = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

export const isAuthExpired = (user) =>
  user.login_updated_at + user._expires >= Date.now;

export const copyCode = (e = null) => {
  const el = e ? e.target : document.querySelector(".copy-on-click");
  document.execCommand("copy");
  el.classList.add("copied");
  setTimeout(() => el.classList.add("exiting"), 400);

  setTimeout(() => {
    el.classList.remove("exiting");
    el.classList.remove("copied");
  }, 600);
};

export const setWidthForListItem = (ref) => {
  if (ref.current.offsetWidth) {
    document
      .querySelectorAll(`[data-id="${ref.current.dataset.ref}"]`)
      .forEach((el) => {
        el.style.width = `${ref.current.offsetWidth}px`;
      });
  }
};

export const currency = (type) => {
  if (type === 0) {
    return "TL";
  } else if (type === 10) {
    return "USD";
  } else if (type === 20) {
    return "EUR";
  }
};

export const calcMinute = (minute, period, extra = null) => {
  let calcedMin = 45 * (parseInt(period) - 1) + parseInt(minute);
  let extraTime = extra ? extra : calcMinute > 90 ? calcMinute - 90 : 0;

  return { min: calcedMin, period, extraTime };
};

export const getSingleItemFromArrayWithValue = (arr, attr, val) => {
  let itemIndex = 0;
  let isExist = false;

  const item = arr.filter((data, index) => {
    if (data[attr] === val) {
      itemIndex = index;
      isExist = true;
      return true;
    }
    return false;
  });

  return { ...item[0], index: itemIndex, isExist };
};

export const getLeagues = async () =>
  await API.post("League/GetLeagues", {}, { headers })
    .then(({ data }) => data.data)
    .catch((err) => {
      console.error(err);
      return [];
    });

export const getMyTeams = async (token) =>
  await API.post(
    "UserParticipant/GetParticipants",
    {},
    { headers: { ...headers, Authorization: `Bearer ${token}` } }
  )
    .then(({ data }) => data.data)
    .catch((err) => {
      console.error(err);
      return [];
    });

export const checkIfPhoneNumber = (value) =>
  value.length >= 2 && /^([0-9 ])+$/.test(value);

export const focusOnEndOfInput = (inputRef) => {
  inputRef.current.focus();

  const el = inputRef.current;

  if (typeof el.selectionStart === "number") {
    el.selectionStart = el.selectionEnd = el.value.length;
  } else if (typeof el.createTextRange != "undefined") {
    el.focus();
    const range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
};

export const shuffleArray = (array) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const scrollToTop = () => setTimeout(() => window.scrollTo(0, 0), 10);

export const generateUniqueUserId = () =>
  new Promise((resolve) =>
    resolve(("_" + Math.random().toString(36).substr(2, 9)).toUpperCase())
  );

export const getRefreshToken = (localUser = null) => {
  let user = localUser;

  if (!localUser) {
    const state = store.getState();
    user = state.auth.user;
  }

  API.get(
    `Account/RefreshToken?refreshToken=${user.refreshToken}&deviceId=${user.deviceId}`,
    {
      headers,
    }
  )
    .then((r) => {
      if (r.data.status) {
        const { data } = r.data;

        const user = {
          username: data.userName,
          fullName: data.fullName,
          avatar: data.photoUrl,
          email: data.email,
          phoneNumber: data.phoneNumber
            ? data.phoneNumber.replace("+90", "")
            : "",
          token: data.token,
          tokenExpire: data.tokenExpireTime,
          refreshToken: data.refreshToken,
          refreshTokenExpire: data.refreshTokenExpireTime,
        };

        store.dispatch({ type: "LOGIN", user });
      }
    })
    .catch((err) => {
      store.dispatch({ type: "LOGOUT" });
    });
};

export const handleErrors = (err, user = null) => {
  if (err.response) {
    if (err.response.status === 401) {
      getRefreshToken(user);
    }
  } else console.log(err);
};
