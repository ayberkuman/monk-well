import React, { useEffect } from "react";

import { scrollToTop } from "../utils/helper";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <>
      <Helmet title="Sayfa bulunamadı" />
      <div className="NotFound">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
              <div className="top-area">
                <p>Hata</p>
                <p>Sayfa bulunamadı!</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3 d-flex justify-content-center">
              <div className="main text-center">404</div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3 justify-content-center">
              <div className="desc text-center">
                Üzgünüz, aradığınız sayfaya erişilemiyor.
                <br /> URL'yi kontrol edin.Eğer başka bir sorun olduğunu
                düşünüyorsanız bizimle iletişime geçmekten çekinmeyin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
