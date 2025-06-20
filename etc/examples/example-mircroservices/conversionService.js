// currency conversion micro-service
import cote from "cote";

// exchange rate database
const tasas = {
  USD_EUR: 0.85,
  EUR_USD: 1.15,
};

const responder = new cote.Responder({ name: "currency-converter" });

responder.on("convert-currency ", (event, callback) => {
  const { cantidad, desde, hacia } = event;

  console.log(Date.now(), cantidad, desde, hacia);

  // consult the exchange rate database
  const tasa = tasas[`${desde}_${hacia}`];

  const resultado = cantidad * tasa;

  callback(resultado);
});
