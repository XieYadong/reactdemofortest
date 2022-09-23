import React, { useState, FunctionComponent, PropsWithChildren } from 'react';
import { Button, Row, DatePicker, Col, Select } from 'antd';
import { productOption } from './update-userList-Relationship-form';
import { UserFollowProducts } from 'lib/typings/portfolio.interface';

export interface UpdateFormRefs {
  productOptions: Partial<productOption>[];
  addProduct(value: UserFollowProducts): void;
}

export const AddUserProduct: FunctionComponent<UpdateFormRefs> = (
  props: PropsWithChildren<UpdateFormRefs>
) => {
  const [selectValue, setSelectValue] = useState('');
  const [dateValue, setDateValue] = useState(null);

  const onFinish = () => {
    const newValues = selectValue.split('-');
    const obj = {
      key: selectValue + new Date(dateValue).getTime(),
      productId: newValues[0],
      productName: newValues[1],
      productType: newValues[2],
      expiredAt: new Date(dateValue).getTime()
    };
    newValues[2] === 'Premium'
      ? (obj['portfolioId'] = [])
      : (obj['highId'] = '');
    props.addProduct(obj);
  };

  const selectChange = (value: string) => {
    setSelectValue(value);
  };

  const dateChange = (date: any, dateString: string) => {
    setDateValue(dateString);
  };

  return (
    <Row gutter={16}>
      <Col span={10}>
        {/* <Select
          showSearch
          placeholder="请选择产品名称"
          style={{ width: '100%' }}
          onChange={selectChange}>
          {props.productOptions.map(option => (
            <Select.Option
              value={`${option._id}-${option.productName}-${option.productType}`}
              key={`follow-product-${option._id}`}>
              {option.productName}
            </Select.Option>
          ))}
        </Select> */}
      </Col>
      <Col span={10}>
        <DatePicker
          placeholder="请选择到期日期"
          style={{ width: '100%' }}
          onChange={dateChange}
        />
      </Col>
      <Col span={4}>
        <Button
          type="primary"
          disabled={!(selectValue && dateValue)}
          onClick={onFinish}>
          确定
        </Button>
      </Col>
    </Row>
  );
};
