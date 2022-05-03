// 基础属性
export type RecordItem = {
  // 收支，-1 为支出，1 为收入
  type: -1 | 1;
  // 日期
  date: string;
  // 标题
  title: string;
  // 备注
  desc?: string;
  // 交易账号
  account: string;
  // 交易金额(单位：元)
  value: number;
  // 分类
  category?: string;
  // 是否是证券
  isSecurities?: boolean;
  // 是否是转账
  isTransfer?: boolean;
  // 转账详情
  transferDetail?: {
    from: string;
    to: string;
  };
  // 元数据
  meta?: {
    id?: string;
    time?: string;
  };
};

export type RecordGroup = {
  expense: RecordItem[];
  income: RecordItem[];
  securities: RecordItem[];
  transfer: RecordItem[];
};

