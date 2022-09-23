import { Button, Form, Input, message, Space, DatePicker } from 'antd';
import { Rule } from 'antd/lib/form';
import { useRouter } from 'next/dist/client/router';
import {
  useEffect,
  useRef,
  useState,
  FunctionComponent,
  PropsWithChildren
} from 'react';
import moment, { Moment } from 'moment';
import styles from './index.module.scss';
const API_ROUTE_PATH = '/portfolio-term';

interface InsertFormFields {
  // 名称
  commentDate?: Moment;
  // 说明
  comment?: string;
}
interface InsertFormProps {
  onFinish(formValues: InsertFormFields): Promise<void>;
  onReset(): void;
  // initialcomment: string | boolean;
}

const formValidationRules: Partial<Record<keyof InsertFormFields, Rule[]>> = {
  commentDate: [{ required: true, message: '请输入持仓时间名称.' }],
  comment: [{ required: true, type: 'string', message: '请输入持仓点评' }]
};

export const IntradayCommentForm: FunctionComponent<InsertFormProps> = (
  props: PropsWithChildren<InsertFormProps>
) => {
  const [form] = Form.useForm<InsertFormFields>();
  useEffect(() => {
    // 自动加载数据
    // TODO: 可根据用户个性化配置
    // form.submit();
    // 自动获得焦点，进入页面加载完毕可以直接按回车搜索
  }, []);
  const today = moment();
  const initialValues: InsertFormFields = {
    comment: '',
    commentDate: moment(today)
  };

  const handleSubmit = async (values: InsertFormFields) => {
    try {
      await props.onFinish(values);
      message.success('盘中异动点评成功！');
      props.onReset();
    } catch (err) {
      console.log(err, '点评失败！');
      message.error('盘中异动点评失败！');
    }
  };
  return (
    <div>
      <>
        <Form
          name="update-form"
          layout="vertical"
          form={form}
          style={{ maxWidth: '640px' }}
          initialValues={initialValues}
          onFinish={handleSubmit}>
          <Form.Item name="commentDate" label="点评日期">
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="comment"
            label="盘中异动点评"
            className={styles.area}
            rules={formValidationRules.comment}>
            <Input.TextArea
              placeholder="请输入盘中异动点评"
              allowClear
              style={{ height: '230px' }}
            />
          </Form.Item>
          <Form.Item>
            <Space size="middle">
              <Button type="primary" size="large" htmlType="submit">
                提交
              </Button>
              <Button
                htmlType="button"
                size="large"
                onClick={() => {
                  props.onReset();
                }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </>
    </div>
  );
};
