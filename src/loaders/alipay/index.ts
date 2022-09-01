import moment from "moment";
import { Loader } from "..";
import { RecordGroup, RecordItem } from "../../types";
import { AccountGuesser, CategoryGuesser } from "./guess";

export class AlipayLoader extends Loader {
  rawToRecord(row: string[]): RecordItem {
    const mtime = moment(row[10], "YYYY-MM-DD HH:mm:ss");
    const isTransfer = row[3].includes("自动还款-花呗");
    return {
      type: row[0] === "收入" ? 1 : -1,
      date: mtime.format("YYYY-MM-DD"),
      title: row[1],
      desc: row[3],
      account: AccountGuesser.guess(row),
      value: parseFloat(row[5]),
      category: CategoryGuesser.guess(row),
      isSecurities: row[7] === "投资理财",
      isTransfer,
      transferDetail: isTransfer
        ? {
            from: AccountGuesser.guess(row),
            to: "Liabilities:CreditCard:Huabei",
          }
        : undefined,
      meta: {
        id: row[8],
        time: mtime.format("HH:mm:ss"),
      },
    };
  }

  handleRecords(records: string[][]): RecordGroup {
    const data = records
      .slice(1)
      .sort((a, b) => {
        return moment(a[10], "YYYY-MM-DD HH:mm:ss").diff(
          moment(b[10], "YYYY-MM-DD HH:mm:ss")
        );
      })
      .filter((raw) => {
        return raw[6] !== "交易关闭";
      })
      .map(this.rawToRecord);
    return this.groupRecords(data);
  }
}

