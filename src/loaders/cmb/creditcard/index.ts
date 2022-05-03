import moment from "moment";
import { Loader } from "../..";
import { RecordGroup, RecordItem } from "../../../types";

export class CMBCreditCardLoader extends Loader {
  rawToRecord(row: string[]): RecordItem {
    const isTransfer = row[2] === "自动还款";
    const type = parseFloat(row[6]) < 0 ? 1 : -1;
    const value = Math.abs(parseFloat(row[5].slice(1).replace(",", "")));
    const title = row[2];
    return {
      type,
      date: row[0],
      title,
      account: "Liabilities:CreditCard:CMB:xxxx",
      value,
      isTransfer,
      transferDetail: isTransfer
        ? {
            from: "Assets:Current:Bank:CMB:xxxx:Cash",
            to: "Liabilities:CreditCard:CMB:xxxx",
          }
        : undefined,
    };
  }

  handleRecords(records: string[][]): RecordGroup {
    const data = records
      .slice(1)
      // 支付宝相关记录交由支付宝处理
      .filter((row) => !row[2].includes("支付宝"))
      .sort((a, b) => {
        return moment(a[1], "YYYY-MM-DD").diff(moment(b[1], "YYYY-MM-DD"));
      })
      .map(this.rawToRecord);
    return this.groupRecords(data);
  }
}
