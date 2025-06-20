import cote from "cote";

const requester = new cote.Requester({ name: "app" });

const event = {
  type: "convert-currency",
  amount: 100,
  from: "USD",
  to: "EUR",
};

setInterval(() => {
  requester.send(event, (result) => {
    console.log(Date.now(), "app obtain result:", result);
  });
}, 1000);
