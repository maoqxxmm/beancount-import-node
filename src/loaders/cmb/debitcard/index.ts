import moment from "moment";
import { Loader } from "../..";
import { RecordGroup, RecordItem } from "../../../types";
import { CategoryGuesser } from "./guess";

export class CMBDebitCardLoader extends Loader {
  private getTime(row: string[]) {
    return moment(`${row[0]} ${row[1]}`, "YYYYMMDD HH:mm:ss");
  }

  rawToRecord(row: string[]): RecordItem {
    const isTransfer = row[5] === "客户转账" || row[5] == "信用卡存款";
    const mtime = this.getTime(row);
    return {
      type: row[3] ? -1 : 1,
      date: mtime.format("YYYY-MM-DD"),
      title: row[5],
      desc: row[6],
      account: "Assets:Current:Bank:CMB:xxxx:Cash",
      category: CategoryGuesser.guess(row),
      value: parseFloat(row[2] || row[3]),
      isTransfer,
      transferDetail: isTransfer
        ? {
            from: "Assets:Current:Bank:CMB:xxxx:Cash",
            to:
              row[5] === "信用卡存款" ? "Liabilities:CreditCard:CMB:xxxx" : "",
          }
        : undefined,
      meta: {
        time: mtime.format("HH:mm:ss"),
      },
    };
  }

  handleRecords(records: string[][]): RecordGroup {
    const data = records
      .slice(1)
      .filter((row) => {
        // 朝朝宝不作记录
        // 支付宝相关记录交由支付宝处理
        return !row[5].includes("朝朝宝") && !row[6].includes("支付宝");
      })
      .sort((a, b) => {
        return this.getTime(a).diff(this.getTime(b));
      })
      .map(this.rawToRecord.bind(this));
    return this.groupRecords(data);
  }
}

