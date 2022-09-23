export enum PortfolioTypes {
  // 跟投账户
  Following = 'Following',
  // 智能策略
  Intelligent = 'Intelligent',
  // 私人订制 主账户
  Premium = 'Premium',
  // 私人订制 从属账户
  PremiumSub = 'PremiumSub',
  // 高端项目
  Advanced = 'Advanced',
  // 资管系统
  Probation = 'Probation'
}
export interface StockHolding {
  code: string;
  quantity: number;
  frozen: number;
  cost: number;
  market_value: number;
  industry?: string;
  name?: string;
  realtime_price?: number;
}
export interface UserType {
  text: string;
  _id: string;
}
export interface Order {
  // 账户 Id
  portfolio_id: string;
  // 股票代码
  code: string;
  // 委托价格
  price: number;
  // 买入或卖出
  type: 'buy' | 'sell';
  // 委托股数
  quantity: number;
  // 委托订单 Id
  order_id: string;
  // 委托时间
  order_time?: number;
  // 是否已撤单
  is_revoked?: 0 | 1;
}
export interface OrderEnhace extends Order {
  name: string;
}
export interface OrderHistory extends Order {
  market_value: number;
  buy_price: number;
  buy_num: number;
  buy_time: number;
  code: string;
  days?: number;
  empty: string;
  key: string;
  name: string;
  portfolioData: string[];
  profit_percent?: number;
  sell_price?: number;
  sell_time?: number;
}

export interface PortfolioProduct {
  productId: string;
  customerId: string;
}

export interface High {
  // 高端项目账户 Id
  _id: string;

  meta: {
    name: string;
    description: string;
    productId: string;
    customerId: string;
    portfolioType: PortfolioTypes;
    owner: Array<number | string>;
  };

  // 持仓列表
  stocks: StockHolding[];

  // 创建时间
  createdAt: number;
  // 更新时间
  updatedAt: number;
  // 删除时间
  deletedAt: number;
}
// export interface Portfolio {
//   // 模拟账户 Id
//   _id?: string;
//   id?: string;
//   correlationStocks?: any;
//   // 本金
//   principal: number;

//   // 可用资金
//   available: number;

//   // 冻结资金
//   frozen: number;

//   // 总资产
//   assets?: number;

//   // 总市值
//   marketValue?: number;

//   // Meta
//   meta: {
//     name: string;
//     description?: string;
//     term?: string;
//     termName?: string;
//     riskLevel?: string;
//     riskLevelName?: string;
//     initialPrincipal: string;
//     initialPrincipalAmount?: number;
//     product?: PortfolioProduct;
//     tags?: string[];
//     portfolioType?: PortfolioTypes;
//     shouldNotifyAfterBuy?: boolean;
//     shouldNotifyAfterSell?: boolean;
//     shouldNotifyStatistics?: boolean;
//     owner?: Array<number | string>;
//   };

//   // 持仓列表
//   stocks: StockHolding[];

//   // 委托订单
//   orders?: string[];

//   // 创建时间
//   createdAt?: number;
//   // 更新时间
//   updatedAt?: number;
//   // 删除时间
//   deletedAt?: number;
// }

export interface Portfolio {
  // 模拟账户 Id
  _id: string;

  // 模拟账户 Id
  id?: string;

  // 关联账户 Id
  correlationId?: string;

  // 关联账户可用资金
  correlationAssets?: number;

  // 关联账户最后买入时间
  correlationLastBuyAt?: number;

  // 关联账户盈亏比例
  correlationTotalIncomeRate?: number;

  // 本金
  principal: number;

  // 可用资金
  available: number;

  // 冻结资金
  frozen: number;

  // 总资产
  assets?: number;

  // 总市值
  marketValue?: number;

  // Meta
  meta: {
    name: string;
    description: string;
    clientType?: string;
    term: string;
    termName?: string;
    riskLevel: string;
    riskLevelName?: string;
    initialPrincipal: string;
    initialPrincipalAmount?: number;
    product?: PortfolioProduct;
    tags: string[];
    ruleSet: string[];
    address: string;
    hasCustomer?: string;

    wid?: number;
    portfolioType: PortfolioTypes;
    shouldNotifyAfterBuy: boolean;
    shouldNotifyAfterSell: boolean;
    shouldNotifyStatistics: boolean;
    owner: Array<number | string>;
  };

  // 持仓列表
  stocks: StockHolding[];
  correlationStocks?: StockHolding[];
  position?: number;
  correlationPosition?: number;
  stocksMatched: StockHolding;

  // 委托订单
  orders: string[];

  lastBuyAt?: number;
  // 创建时间
  createdAt: number;
  // 更新时间
  updatedAt: number;
  // 删除时间
  deletedAt: number;
}
export interface UserFollowProducts {
  productId: string;
  productName: string;
  productType: string;
  portfolioId?: string[];
  highId?: string;
  expiredAt: number;
}

export interface StocksAllots {
  key: string;
  code: string;
  name: string;
  industry: string;
  cost: number | string;
  close: number | string;
  price?: number | string;
  clientType: string[];
  createdAt: moment.Moment;
  position: string;
  comment: string;
  portfolioId: string[];
  portfolioName: string[];
}

export interface followStocks {
  code: string;
  name: string;
  price: string;
  position: string;
  portfolioName: string[];
  portfolioId: string[];
  clientType: string[];
}

export interface followStock {
  followPortfolioName: string;
  followPortfolioId: string;
  totalIncomeRate: number;
  assets: number;
  grade: string;
  status: string;
  ratio: string;
  stocks: followStocks[];
  createdAt: number;
}

export interface UserBusiness {
  businessDirector: string;
  directorName: string;
  businessSell: string;
  sellName: string;
}

export interface UserList {
  // 模拟账户 Id
  _id: string;
  // Meta
  meta: {
    clientName: string;
    nickName: string;
    openId: string;
    followProducts?: UserFollowProducts[];
    business?: UserBusiness;
    clientType?: string;
    clientTags?: string[];
    initialFunding?: number;
    remark?: string;
  };

  // 创建时间
  createdAt: number;
  // 更新时间
  updatedAt: number;
  // 删除时间
  deletedAt: number;
  // 成交日期
  transactionDate: number;
}

export interface ClientList {
  // 模拟账户 Id
  id: string;
  // Meta
  name: string;
  nickName: string;
  openId?: string;
  followProducts?: UserFollowProducts[];
  business?: UserBusiness;
  clientType?: string;
  clientTags?: string[];
  initialFunding?: number;
  remark?: string;
  // 创建时间
  createdTime: number;
  // 更新时间
  modifyTime: number;
  // 删除时间
  deletedAt?: number;
  // 成交日期
  createdBy: string;
  // 更新时间
  modifyBy: string;
  productIds: Array<string>;
  productDetailsList: Array<any>;
}
export interface ProductList {
  // 模拟账户 Id
  _id: string;
  // Meta

  description: string;

  stocks: StockHolding[];
  product: string;
  // 创建时间
  createdAt: number;
  // 更新时间
  updatedAt: number;
  // 删除时间
  deletedAt: number;
  // 成交日期
  transactionDate: number;
}
export interface PortfolioHistory {
  // 模拟账户历史 Id
  _id: string;

  // 模拟账户 Id
  portfolio_id: string;

  // 账户名称
  name: string;

  // 本金
  principal: number;

  // 可用资金
  available: number;

  // 总资产
  assets?: number;

  // 总市值
  marketValue?: number;

  // 持仓列表
  stocks?: string[];

  // 委托订单
  orders: string[];

  // 结算时间
  date: number;

  // 总盈亏
  totalIncome: number;

  // 总收益率
  totalIncomeRate: number;
}

export interface OrderUpdateReq {
  portfolio: string;
}

export interface OrderUpdateReply {
  orderId: string;
  portfolioId: string;
}
