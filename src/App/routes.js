import Login from "../Auth/pages/Login";
import Home from "../Home/Home";
import Payments from "../Payments/Payments";
import PatientRegistry from "../PatientRegistry/PatientRegistry";
import { UserPayments } from "../UserPayments/UserPayments";
import NotFound from "../NotFound/NotFound";
import ForgotPassword from "../Auth/pages/ForgotPassword";
import GetPaid from "../GetPaid/GetPaid";


export const globalRoutes = {
  notFound: {
    id: "global-00",
    property: NotFound,
    links: { en: "/404", tr: "/404" },
    name: "not_found",
    exact: true,
    onNav: false,
  },
  userPayments: {
    id: "auth-02",
    property: UserPayments,
    links: { en: `/payments/:id`, tr: "/odemeler/:id" },
    name: "user_payments",
    exact: true,
    onNav: false,
    navExact: false,
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
    links: { en: "/payments", tr: "/odemeler" },
    name: "payments",
    exact: true,
    onNav: false,
    navExact: false,
  },
  patientRegistry: {
    id: "auth-02",
    property: PatientRegistry,
    links: { en: "/patient-registry", tr: "/hasta-kaydi" },
    name: "patientRegistry",
    exact: true,
    onNav: false,
    navExact: false,
  },
  getPaid: {
    id: "auth-03",
    property: GetPaid,
    links: { en: "/get-paid", tr: "/odeme-al" },
    name: "getPaid",
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

