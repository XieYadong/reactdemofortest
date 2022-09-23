import React, { createElement, useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Space,
  AutoComplete,
  Radio
} from 'antd';
import { timestampToTime } from 'utils/helpers/date-format';
import { OptionCoreData } from 'rc-select/lib/interface';
const { RangePicker } = DatePicker;
const FormItem = Form.Item,
  { Password } = Input,
  { Option } = Select,
  h = createElement;
const InputGroup = ({ onChange, nameArr }) => {
  console.log(nameArr, 'nameArr');
  return (
    <Input.Group>
      <FormItem name={nameArr[0]} noStyle>
        <Input style={{ width: '30%' }} />
      </FormItem>

      <FormItem name={nameArr[1]} noStyle>
        <Input style={{ width: '30%' }} />
      </FormItem>
    </Input.Group>
  );
};
const FormComponent = ({
  columns,
  initialValues,
  cRef,
  onFinish,
  footerStyle
}) => {
  const [form] = Form.useForm();
  //cRef就是父组件传过来的ref
  useImperativeHandle(cRef, () => ({
    getForm: () => form,
    getFormValues() {
      return form.getFieldsValue();
    }
  }));

  const layout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    },
    tailLayout = {
      // wrapperCol: {  span: 1 },
      labelCol: { span: 24 }
    };

  const onReset = () => {
    form.resetFields();
  };

  //form表单的回显
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, []);

  const components = {
    select: ({ label, mode, list = [], callback = (e, v) => {} }) =>
      h(
        Select,
        { placeholder: label, mode, onChange: (v, option) => callback(v, option) },
        list.map(c =>
          h(Option, { key: c.value, value: c.value, children: <></> }, c.label)
        )
      ),
    input: ({ label, callback = e => {} }) => (
      <Input placeholder={label} onChange={e => callback(e)} />
    ),
    textarea: ({ label, rows = 4, callback = e => {} }) => (
      <Input.TextArea rows={rows} placeholder={label} onChange={e => callback(e)} />
    ),
    inputgroup: ({ label, nameArr, callback = e => {} }) => (
      <InputGroup onChange={e => callback(e)} nameArr={nameArr} />
    ),
    password: ({ label }) => h(Password, { placeholder: label }),
    datePicker: ({ label }) => (
      <DatePicker placeholder={label} format="YYYY-MM-DD" />
    ),
    radio: ({ list, callback = e => {} }) => {
      let radioItem = list.map((item:OptionCoreData) => (<Radio value={item.value} key={item.value}>{item.label}</Radio>))
      return (<Radio.Group onChange={callback}>{radioItem}</Radio.Group>);
    },
    RangePicker: ({ label }) => <RangePicker />,
    AutoComplete: ({
      label,
      onSearch = e => {},
      onSelect = (v, option) => {},
      list = []
    }) =>
      h(
        AutoComplete,
        {
          placeholder: label,
          onSearch: v => onSearch(v),
          onSelect: (v, option) => onSelect(v, option)
        },
        list.map(c =>
          h(
            AutoComplete.Option,
            { key: c.key, value: c.value, ext: c.ext || '', children: <></> },
            c.label
          )
        )
      )
  };

  return (
    <Form {...layout} form={form} onFinish={onFinish}>
      <Row gutter={8}>
        {columns.map((n, i) => {
          const { type = 'input' } = n,
            C = components[type];
          return (
            <Col key={i} span={n.span || 6}>
              <FormItem label={n.label} name={n.name} rules={n.rules}>
                {C(n)}
              </FormItem>
            </Col>
          );
        })}
        <Col
          span={24}
          style={footerStyle ? footerStyle : { textAlign: 'right' }}>
          <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 23 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
              <Button htmlType="button" onClick={onReset}>
                重置
              </Button>
            </Space>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};

FormComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  initialValues: PropTypes.object,
  cRef: PropTypes.object,
  onFinish: PropTypes.func,
  footerStyle: PropTypes.object
};

export default FormComponent;
