import { Dispatch, useState } from 'react';

export interface RiskLevelOption {
  _id: string;
  name: string;
  description: string;
}
export interface RulesetOption {
  _id: string;
  name: string;
  description: string;
}
export interface PrincipalOption {
  _id: string;
  amount: number;
  description: string;
}

export interface TermOption {
  _id: string;
  name: string;
  description: string;
}

export interface WechatOption {
  id: string;
  name: string;
  description: string;
}
export interface clientTypeOption {
  _id: string;
  clientType: string;
  remark: string;
}
export interface clientTagOption {
  _id: string;
  clientTag: string;
  remark: string;
}
export interface productOption {
  _id: string;
  productName: string;
  productType: string;
  transactionDate: string;
  description: string;
}

export interface UserOption {
  id: string | number;
  username?: string;
  nickname: string;
  attributes: any;
  role?: string[];
}

export function useRiskLevelOptions(
  initialState?: Partial<RiskLevelOption>[]
): [Partial<RiskLevelOption>[], Dispatch<Partial<RiskLevelOption>[]>] {
  const [riskLevelOptions, setRiskLevelOptions] = useState<
    Partial<RiskLevelOption>[]
  >(initialState ?? [{ name: '请选择' }]);

  return [riskLevelOptions, setRiskLevelOptions];
}

export function useRulesetOptions(
  initialState?: Partial<RulesetOption>[]
): [Partial<RulesetOption>[], Dispatch<Partial<RulesetOption>[]>] {
  const [rulesetOptions, setRulesetOptions] = useState<
    Partial<RulesetOption>[]
  >(initialState ?? [{ name: '请选择' }]);

  return [rulesetOptions, setRulesetOptions];
}

export function useTermOptions(
  initialState?: Partial<TermOption>[]
): [Partial<TermOption>[], Dispatch<Partial<TermOption>[]>] {
  const [termOptions, setTermOptions] = useState<Partial<TermOption>[]>(
    initialState ?? [{ name: '请选择' }]
  );

  return [termOptions, setTermOptions];
}

export function usePrincipalOptions(
  initialState?: Partial<PrincipalOption>[]
): [Partial<PrincipalOption>[], Dispatch<Partial<PrincipalOption>[]>] {
  const [principalOptions, setPrincipalOptions] = useState<
    Partial<PrincipalOption>[]
  >(initialState ?? [{ amount: 0 }]);

  return [principalOptions, setPrincipalOptions];
}

export function useUserOptions(
  initialState?: Partial<UserOption>[]
): [Partial<UserOption>[], Dispatch<Partial<UserOption>[]>] {
  const [userOptions, setUserOptions] = useState<Partial<UserOption>[]>(
    initialState ?? [{ username: '请选择' }]
  );

  return [userOptions, setUserOptions];
}

export function useWechatsetOptions(
  initialState?: Partial<WechatOption>[]
): [Partial<WechatOption>[], Dispatch<Partial<WechatOption>[]>] {
  const [wechatOptions, setWechatOptions] = useState<Partial<WechatOption>[]>(
    initialState ?? [{ name: '请选择' }]
  );

  return [wechatOptions, setWechatOptions];
}
