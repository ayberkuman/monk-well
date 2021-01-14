import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/images/payment-logo.svg'
import homeMenu from '../assets/images/home-menu.svg'
import homeMenuActive from '../assets/images/home-menu-active.svg'
import paymentsMenu from '../assets/images/payments-menu.svg'
import paymentsMenuActive from '../assets/images/payments-menu-active.svg'
import analysesMenu from '../assets/images/analyses-menu.svg'
import analysesMenuActive from '../assets/images/analyses-menu-active.svg'
import expensesMenu from '../assets/images/expenses-menu.svg'
import expensesMenuActive from '../assets/images/expenses-menu-active.svg'
import doctor_settingsMenu from '../assets/images/doctor_settings-menu.svg'
import doctor_settingsMenuActive from '../assets/images/doctor_settings-menu-active.svg'
import system_settingsMenu from '../assets/images/system_settings-menu.svg'
import system_settingsMenuActive from '../assets/images/system_settings-menu-active.svg'
import clinicMenu from '../assets/images/clinic-menu.svg'
import clinicMenuActive from '../assets/images/clinic-menu-active.svg'
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { authRoutes } from "../App/routes"
const Header = React.lazy(() => import("./Layout/Header"));
const Layout = (props) => {
  const {location} = props;
  return (
    <>
      <div className='d-flex'>
      {
        props.user.isLoggedIn && <div className="left-side-menu min-vh-100" id="sidebar-wrapper">
          <Link
            to={authRoutes.home.links[props.lang]}
          >
            <img src={logo} alt={props.translate('payments')}/>
          </Link>
          <Link
          className={location.pathname === '/' ? 'active' : ''}
            to={authRoutes.home.links[props.lang]}
          >
            <img src={location.pathname === authRoutes.home.links[props.lang] ? homeMenuActive : homeMenu} alt={props.translate('home')}/>
            {props.translate('home')}
          </Link>
          
          <Link
            className={location.pathname === authRoutes.payments.links[props.lang] ? 'active' : ''}
            to={authRoutes.payments.links[props.lang]}
          >
            <img src={location.pathname === authRoutes.payments.links[props.lang] ? paymentsMenuActive : paymentsMenu} alt={props.translate('payments')}/>
            {props.translate('payments')}
          </Link>
          <Link
          >
            <img src={analysesMenu} alt={props.translate('analyses')}/>
            {props.translate('analyses')}
          </Link>
          <Link
          >
            <img src={expensesMenu} alt={props.translate('expenses')}/>
            {props.translate('expenses')}
          </Link>
          <Link
          className='border-top'
          >
            <img src={doctor_settingsMenu} alt={props.translate('doctor_settings')}/>
            {props.translate('doctor_settings')}
          </Link>
          
          <Link
          className='border-top'
          >
            <img src={system_settingsMenu} alt={props.translate('system_settings')}/>
            {props.translate('system_settings')}
          </Link>
          <hr/>
          <Link
          >
            <img src={clinicMenu} alt={props.translate('clinic')}/>
            {props.translate('clinic')}
          </Link>
        
      </div>
      }
        <div  className='container-fluid p-0'>
          <Header
            lang={props.lang}
            user={props.user}
            location={props.location}
            translate={props.translate}
          />
          <div id="main">{props.children}</div>
        </div>
      </div>
    </>
  );
};

export default connect()(withRouter(Layout));
