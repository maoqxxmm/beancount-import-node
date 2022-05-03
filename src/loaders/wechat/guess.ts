import { Guesser } from "../guesser";

export const CategoryGuesser = new Guesser();

CategoryGuesser.register([
  {
    test: /微信红包/,
    fields: [1],
    value: (item) => {
      if (item[4] === "支出") {
        return "Expenses:Social:RedEnvelope";
      } else {
        return "Income:RedEnvelope";
      }
    },
  },
  {
    test: /手机充值/,
    fields: [3],
    value: "Expenses:Home:Phone",
  },
  {
    test: /农夫山泉/,
    fields: [3],
    value: "Expenses:Food:Drink",
  },
  {
    test: /单车/,
    fields: [3],
    value: "Expenses:Transport:SharedBicycle",
  },
  {
    test: /晚饭/,
    fields: [3],
    value: (item) => {
      if (item[4] === "支出") {
        return "Expenses:Food:Dinner";
      } else {
        return "Unknown";
      }
    },
  },
]);
