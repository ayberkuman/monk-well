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
        <p className='head'>Sağlık kuruluşları için bulut tabanlı hasta etkileşim platformu</p>
        <p>Monk Medikal uygulamasını kullanarak hastalarınızın tedavi ve randevu durumlarını takip edebilir, laboratuvar ve radyoloji raporları görüntüleyebilir, hastalarınıza tedavileri ve randevuları hakkında gerekli bildirimleri gönderebilir ve anlık mesajlaşma servisini kullanarak hastalarınızın soru ve ihtiyaçlarıyla hızlıca ilgilenebilirsiniz.</p>
      </div>
      <img
          className='img-fluid'
          src={auth}
          alt="Monk Medical"
        />
    </div>
  );
};
