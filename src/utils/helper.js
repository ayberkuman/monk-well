import is from "is_js";

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

export const currency = (type) => {
  if (type === 0) {
    return "TL";
  } else if (type === 10) {
    return "USD";
  } else if (type === 20) {
    return "EUR";
  }
};

export const scrollToTop = () => setTimeout(() => window.scrollTo(0, 0), 10);

export function formatMoney(price) {
  
  var currency_symbol = "₺"

  var formattedOutput = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    });

  return formattedOutput.format(price).replace(currency_symbol, '')
}