import React from "react";
import logo from '../../../assets/images/logo.png'
import auth from '../../../assets/images/auth.svg'
export const LeftSide = () => {
  return (
    <div className='left-side'>
      <div className='top text-center'>
        <img
          src={logo}
          alt="Monk Medical"
        />
        <p className='head'>Zamandan Tasaruf Artık Beklemek Yok</p>
        <p>Tüm hasta ve tedavi bilgilerine ve verilere telefonundan kolayca ulaş aradığın bilgiyi hemen bul.</p>
      </div>
      <img
          className='img-fluid'
          src={auth}
          alt="Monk Medical"
        />
    </div>
  );
};
