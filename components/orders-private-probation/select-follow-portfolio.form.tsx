import React, { forwardRef, PropsWithChildren, useState } from 'react';
import { Transfer } from 'antd';
import { GenericCallback } from 'lib/typings/common.interface';
import { followStock } from 'lib/typings/portfolio.interface';

export interface SelectFollowChildrenFields {
  key: string;
  title: string;
}

export interface SubmitValues {
  key: string[];
}

export interface SelectFormProps {
  onFinish(formValues: SubmitValues): Promise<void | GenericCallback>;
  followPortfolio: SelectFollowChildrenFields[];
  selectFollowPortfolio: followStock[];
}

export interface SelectFormRefs {
  submit: () => void | Promise<void>;
}

export const SelectGangedForm = forwardRef<SelectFormRefs, SelectFormProps>(
  (props: PropsWithChildren<SelectFormProps>, ref) => {
    const [treeData, setTreeData] = useState<SelectFollowChildrenFields[]>(
      props.followPortfolio
    );
    const [targetKeys, setTargetKeys] = useState(
      props.selectFollowPortfolio.map(item => item.followPortfolioId) || []
    );

    const filterOption = (
      inputValue: string,
      option: SelectFollowChildrenFields
    ) => option.title.indexOf(inputValue) > -1;

    const handleChange = (targetKeys: string[]) => {
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: select-follow-portfolio.form.tsx ~ line 111 ~ handleChange ~ targetKeys`,
        targetKeys
      );
      setTargetKeys(targetKeys);
      props.onFinish({ key: targetKeys });
    };

    return (
      <Transfer
        dataSource={treeData}
        showSearch
        listStyle={{
          width: 355,
          height: 550
        }}
        filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={item => item.title}
      />
    );
  }
);
