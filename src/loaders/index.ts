import { createReadStream } from "fs";
import { parse as CSVParse } from "csv";
import { RecordGroup, RecordItem } from "../types";

export abstract class Loader {
  private path: string;

  abstract handleRecords(records: string[][]): RecordGroup;

  abstract rawToRecord(row: string[]): RecordItem;

  constructor(path: string) {
    this.path = path;
  }

  groupRecords(records: RecordItem[]): RecordGroup {
    const data: RecordGroup = {
      expense: [],
      income: [],
      securities: [],
      transfer: [],
    };
    records.forEach((item) => {
      if (item.isSecurities) {
        data.securities.push(item);
      } else if (item.isTransfer) {
        data.transfer.push(item);
      } else if (item.type === 1) {
        data.income.push(item);
      } else {
        data.expense.push(item);
      }
    });
    return data;
  }

  public async load(): Promise<RecordGroup> {
    return new Promise((resolve, reject) => {
      createReadStream(this.path).pipe(
        CSVParse((err, records) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          const group = this.handleRecords(
            records.map((row: any[]) => row.map((item) => item.trim()))
          );
          resolve(group);
        })
      );
    });
  }
}
