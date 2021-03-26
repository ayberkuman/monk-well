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
          width='52'
        />
        <p className='head'>Kliniğinizin ihtiyaçları için özel olarak oluşturulmuş ön muhasebe takip sistemi</p>
        <p>Monk Pay’i kullanarak hastalarınızın ödemelerini tamamlamalarını, ödeme geçmişini kolayca görüntüleyerek ve gerekli bildirimleri göndererek sağlayabilir, istediğiniz tarihler için genel veya doktor ve tedavi bazlı ciro analizlerini görüntüleyebilir, giderlerinizin günlük takibini yapabilirsiniz.</p>
      </div>
      <img
          className='img-fluid'
          src={auth}
          alt="Monk Medical"
        />
    </div>
  );
};
