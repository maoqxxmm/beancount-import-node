import moment from "moment";
import { Loader } from "..";
import { RecordGroup, RecordItem } from "../../types";
import { CategoryGuesser } from "./guess";

export class WechatLoader extends Loader {
  getTime(row: string[]) {
    return moment(row[0], "YYYY-MM-DD HH:mm:ss");
  }

  rawToRecord(row: string[]): RecordItem {
    const mtime = this.getTime(row);
    const type = row[4] === "支出" ? -1 : 1;
    return {
      type,
      date: mtime.format("YYYY-MM-DD"),
      title: row[1],
      desc: `${row[2]}${row[3] && row[3] !== "/" ? ` ${row[3]}` : ""}`,
      account: "Assets:Current:Internet:WeChat:Cash",
      category: CategoryGuesser.guess(row),
      value: parseFloat(row[5].slice(1)),
      meta: {
        time: mtime.format("HH:mm:ss"),
      },
    };
  }

  handleRecords(records: string[][]): RecordGroup {
    const data = records
      .slice(1)
      .filter((row) => {
        return row[4] === "收入" || row[6] === "零钱";
      })
      .sort((a, b) => {
        return this.getTime(a).diff(this.getTime(b));
      })
      .map(this.rawToRecord.bind(this));
    return this.groupRecords(data);
  }
}
