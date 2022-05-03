# beancount-import-node

## 简介

本项目支持支付宝、微信、招行信用卡、招行储蓄卡账单导入，转换为 beancount 记录。这里的转换逻辑都很简单，可以根据自己的需求进行二开。

## 使用指南

1. 从各个平台下载账单（支付宝和微信在 app 里申请即可，招行的账单需要用 IE 模式进入招行网页版然后下载）
2. 将各个账单编码转为 UTF-8，前后的一些备注信息清除，仅保留表头和记录内容，放入本项目 `data` 目录
3. `yarn` 安装依赖
4. `yarn start` 执行脚本
5. 在 `output` 目录可以看到导出结果，expense: 支出，income: 收入，securities: 投资，transfer: 转账
