import Login from "../Auth/pages/Login";
import Home from "../Home/Home";
import Payments from "../Payments/Payments";
import CreatePatient from "../CreatePatient/CreatePatient";
import NotFound from "../NotFound/NotFound";
import ForgotPassword from "../Auth/pages/ForgotPassword";
import CreatePaid from "../CreatePaid/CreatePaid";
import UserDetail from "../UserDetail/UserDetail";
import Expense from "../Expense/Expense";
import Analysis from "../Analysis/Analysis";

export const globalRoutes = {
  notFound: {
    id: "global-00",
    property: NotFound,
    links: { en: "/404", tr: "/404" },
    name: "not_found",
    exact: true,
    onNav: false,
  },
};

export const authRoutes = {
  home: {
    id: "auth-00",
    property: Home,
    links: { en: "/", tr: "/" },
    name: "home",
    exact: true,
    onNav: false,
    navExact: false,
  },
  payments: {
    id: "auth-01",
    property: Payments,
    links: { en: "/payments", tr: "/odemeler/" },
    name: "payments",
    exact: true,
    onNav: false,
    navExact: true,
    strict: true,
  },
  //Kullanici detayi
  userDetail: {
    id: "auth-03",
    property: UserDetail,
    links: {
      en: `/payments/detail/user::id`,
      tr: "/odemeler/detail/user::id/",
    },
    name: "user_detail",
    exact: true,
    onNav: false,
    navExact: false,
  },
  //Hasta kaydi
  createPatient: {
    id: "auth-04",
    property: CreatePatient,
    links: { en: "/payments/create-patient", tr: "/odemeler/hasta-kaydi/" },
    name: "createPatient",
    exact: true,
    onNav: false,
    navExact: false,
    strict: true,
  },
  //Tedavi olustur
  addTreatment: {
    id: "auth-05",
    property: CreatePaid,
    links: {
      en: "/payments/treatment-add/user:id",
      tr: "/odemeler/tedavi-ekle/user::id",
    },
    name: "addTreatment",
    exact: true,
    onNav: false,
    navExact: false,
  },
  //Kullanicidan odeme al
  addPaid: {
    id: "auth-07",
    property: CreatePaid,
    links: {
      en: "/payments/get-paid/user:id",
      tr: "/odemeler/odeme-al/user::id",
    },
    name: "addPaid",
    exact: true,
    onNav: false,
    navExact: false,
  },
  //Kullanicidan odeme düzenle
  editPaid: {
    id: "auth-08",
    property: CreatePaid,
    links: {
      en: "/payments/edit-paid/user:id/paid::paid",
      tr: "/odemeler/odeme-duzenle/user::id/paid::paid",
    },
    name: "addTreatment",
    exact: true,
    onNav: false,
    navExact: false,
  },
  //Giderler
  expense: {
    id: "auth-09",
    property: Expense,
    links: { en: "/expense", tr: "/giderler" },
    name: "expense",
    exact: true,
    onNav: false,
    navExact: false,
  },
  //Analizler
  analysis: {
    id: "auth-10",
    property: Analysis,
    links: { en: "/analysis", tr: "/analizler" },
    name: "analysis",
    exact: true,
    onNav: false,
    navExact: false,
  },
};
export const guestRoutes = {
  login: {
    id: "guest-00",
    property: Login,
    links: { en: "/login", tr: "/uye-girisi" },
    name: "login",
    exact: true,
    onNav: false,
  },
  changePassword: {
    id: "guest-02",
    property: ForgotPassword,
    links: { en: "/forgot-password", tr: "/sifremi-unuttum" },
    name: "forgot_password",
    exact: true,
    onNav: false,
  },
};
