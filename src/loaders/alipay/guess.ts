import moment from "moment";
import { Guesser } from "../guesser";

export const AccountGuesser = new Guesser({
  defaultValue: "Assets:Current:Internet:Alipay:Cash",
});
export const CategoryGuesser = new Guesser();

AccountGuesser.register([
  {
    test: /医保支付/,
    fields: [4, 3],
    value: "Assets:Government:Medical",
  },
  {
    test: /余额宝/,
    fields: [4, 3],
    value: "Assets:Current:Alipay:Yuebao",
  },
  {
    test: /余额/,
    fields: [4, 3],
    value: "Assets:Current:Internet:Alipay:Cash",
  },
]);

CategoryGuesser.register([
  {
    test: /餐饮美食/,
    fields: [7],
    value: (item) => {
      const time = moment(item[10], "YYYY-MM-DD HH:mm:ss");
      const h = time.hour();
      if (h >= 4 && h <= 10) {
        return "Expenses:Food:Breakfast";
      } else if (h >= 11 && h <= 13) {
        return "Expenses:Food:Lunch";
      } else if (h >= 17 && h <= 20) {
        return "Expenses:Food:Dinner";
      } else if (h >= 21 || h <= 3) {
        return "Expenses:Food:Supper";
      } else {
        return "Expenses:Food:Other";
      }
    },
  },
  {
    test: /服饰装扮/,
    fields: [7],
    value: "Expenses:Shopping:Clothes",
  },
  {
    test: /日用百货/,
    fields: [7],
    value: "Expenses:Shopping:Commodity",
  },
  {
    test: /家居家装/,
    fields: [7],
    value: "Expenses:Shopping:Furniture",
  },
  {
    test: /数码电器/,
    fields: [7],
    value: "Expenses:Shopping:Electronics",
  },
  {
    test: /运动户外/,
    fields: [7],
    value: "Expenses:Shopping:Sports",
  },
  {
    test: /美容美发/,
    fields: [7],
    value: "Expenses:Shopping:Cosmetics",
  },
  {
    test: /宠物/,
    fields: [7],
    value: "Expenses:Pet:Unknown",
  },
  {
    test: /交通出行/,
    fields: [7],
    value: (item) => {
      const desc = item[3];
      if (/(打车|高德)/.test(desc)) {
        return "Expenses:Transport:Taxi";
      } else if (/(公交|地铁)/.test(desc)) {
        return "Expenses:Transport:Bus";
      } else if (/单车/.test(desc)) {
        return "Expenses:Transport:SharedBicycle";
      }
      return "Expenses:Transport:Unknown";
    },
  },
  {
    test: /住房物业/,
    fields: [7],
    value: "Expenses:Home:Unknown",
  },
  {
    test: /医疗保健/,
    fields: [7],
    value: "Expenses:Medical:Unknown",
  },
  {
    test: /公益捐赠/,
    fields: [7],
    value: "Expenses:Other:PublicWelfare",
  },
  {
    test: /保险/,
    fields: [7],
    value: "Expenses:Finance:Insurance",
  },
  {
    test: /退款/,
    fields: [7],
    value: "Income:Refund",
  },
  {
    test: /充值缴费/,
    fields: [7],
    value: (item) => {
      if (item[3].includes("电费") || item[3].includes("燃气")) {
        return "Expenses:Home:SDRQ";
      }
      return "Unknown";
    },
  },
  {
    test: /转账红包/,
    fields: [7],
    value: (item) => {
      return "Unknown";
    },
  },
  {
    test: /收入/,
    fields: [7],
    value: (item) => {
      if (item[3].includes("工资")) {
        return "Income:Salary";
      }
      return "Unknown";
    },
  },
  {
    test: /投资理财/,
    fields: [7],
    value: (item) => {
      return "Unknown";
    },
  },
]);
