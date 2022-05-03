import { resolve } from "path";
import moment from "moment";
import { AlipayLoader } from "./loaders/alipay";
import { CMBCreditCardLoader } from "./loaders/cmb/creditcard";
import { CMBDebitCardLoader } from "./loaders/cmb/debitcard";
import { WechatLoader } from "./loaders/wechat";
import { RecordGroup, RecordItem } from "./types";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";

const alipayDataPath = resolve(__dirname, "../data/alipay.csv");
const cmbCreditCardDataPath = resolve(__dirname, "../data/cmb-creditcard.csv");
const cmbDebitCardDataPath = resolve(__dirname, "../data/cmb-debitcard.csv");
const wechatDataPath = resolve(__dirname, "../data/wechat.csv");

const alipayLoader = new AlipayLoader(alipayDataPath);
const cmbCreditCardLoader = new CMBCreditCardLoader(cmbCreditCardDataPath);
const cmbDebitCardLoader = new CMBDebitCardLoader(cmbDebitCardDataPath);
const wechatLoader = new WechatLoader(wechatDataPath);

if (!existsSync("output")) {
  mkdirSync("output");
}

Promise.all([
  alipayLoader.load(),
  cmbCreditCardLoader.load(),
  cmbDebitCardLoader.load(),
  wechatLoader.load(),
]).then(([alipay, cmbCreditCard, cmbDebitCard, wechat]) => {
  const merged = mergeGroup(alipay, cmbCreditCard, cmbDebitCard, wechat);
  const expenseData = merged.expense.map(generateBeancountRecord).join("\n\n");
  const incomeData = merged.income.map(generateBeancountRecord).join("\n\n");
  const securitiesData = merged.securities
    .map(generateBeancountRecord)
    .join("\n\n");
  const transferData = merged.transfer
    .map(generateBeancountRecord)
    .join("\n\n");
  writeFile("output/expense.bean", expenseData, { flag: "w+" }).then(() => {
    console.log("expense 导出成功");
  });
  writeFile("output/income.bean", incomeData, { flag: "w+" }).then(() => {
    console.log("income 导出成功");
  });
  writeFile("output/securities.bean", securitiesData, { flag: "w+" }).then(
    () => {
      console.log("securities 导出成功");
    }
  );
  writeFile("output/transfer.bean", transferData, { flag: "w+" }).then(() => {
    console.log("transfer 导出成功");
  });
});

const mergeGroup = (...groups: RecordGroup[]) => {
  const merged: RecordGroup = {
    expense: [],
    income: [],
    securities: [],
    transfer: [],
  };
  let key: keyof RecordGroup;
  for (key in merged) {
    merged[key] = groups
      .reduce((acc, cur) => {
        return acc.concat(cur[key]);
      }, [] as RecordItem[])
      .sort((a, b) => {
        const aTime = moment(
          `${a.date} ${a?.meta?.time || "00:00:00"}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        const bTime = moment(
          `${b.date} ${b?.meta?.time || "00:00:00"}`,
          "YYYY-MM-DD HH:mm:ss"
        );
        return aTime.diff(bTime);
      });
  }
  return merged;
};

const generateBeancountRecord = (item: RecordItem) => {
  const lines: string[] = [];
  // 第一行
  lines.push(
    `${item.date} * "${item.title}" ${item.desc ? `"${item.desc}"` : ""}`
  );
  if (item.meta) {
    // meta 数据
    lines.push(
      `  ${Object.keys(item.meta || {})
        .map(
          (key) =>
            `${key}: ${JSON.stringify(
              item.meta?.[key as keyof RecordItem["meta"]]
            )}`
        )
        .join("\n  ")}`
    );
  }
  // 账户
  lines.push(
    `  ${item.account || "Unknown"} ${(item.type * item.value).toFixed(2)} CNY`
  );
  // 转账
  if (item.isTransfer) {
    lines.push(
      `  ${
        item.account === item.transferDetail!.from
          ? item.transferDetail!.to
          : item.transferDetail!.from
      }`
    );
  } else {
    // 分类
    lines.push(`  ${item.category || "Unknown"}`);
  }
  return lines.join("\n");
};
