import { Guesser } from "../../guesser";

export const CategoryGuesser = new Guesser();

CategoryGuesser.register([
  {
    test: /轨道交通/,
    fields: [6],
    value: "Expenses:Transport:Bus",
  },
  {
    test: /代发工资/,
    fields: [5],
    value: "Income:Salary",
  },
  {
    test: /房租/,
    fields: [6],
    value: "Expenses:Home:Rent",
  },
]);
