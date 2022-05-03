type RegisterRule = {
  test: RegExp;
  fields: number[];
  value: string | ((item: string[]) => string);
};

export class Guesser {
  private tester: Array<(item: any) => string | null>;
  defaultValue?: string;

  constructor(opts: { defaultValue?: string } = {}) {
    this.tester = [];
    this.defaultValue = opts.defaultValue;
  }

  register(list: RegisterRule[]) {
    list.forEach((data) => {
      const { test } = data;
      this.tester.push((item) => {
        const fieldsValues = data.fields!.map((field) => item[field]);
        const result = test.exec(fieldsValues.join(" "));
        if (result) {
          if (typeof data.value === "string") {
            return data.value;
          } else {
            return data.value(item);
          }
        }
        return null;
      });
    });
  }

  guess(item: any) {
    for (let i = 0; i < this.tester.length; i++) {
      const value = this.tester[i](item);
      if (value) {
        return value;
      }
    }
    return this.defaultValue || "Unknown";
  }
}
