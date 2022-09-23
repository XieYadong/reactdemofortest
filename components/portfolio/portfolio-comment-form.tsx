import { Button, Form, Input, message, Space, DatePicker } from 'antd';
import { Rule } from 'antd/lib/form';
import {
  useEffect,
  useState,
  FunctionComponent,
  PropsWithChildren
} from 'react';
import moment, { Moment } from 'moment';
import styles from './index.module.scss';

interface InsertFormFields {
  // 名称
  commentDate?: Moment;
  // 说明
  comment: string;
}
interface InsertFormProps {
  onFinish(formValues: InsertFormFields): Promise<void>;
  onReset(): void;
  initialcomment: string | boolean;
}

const formValidationRules: Partial<Record<keyof InsertFormFields, Rule[]>> = {
  commentDate: [{ required: true, message: '请输入持仓时间名称.' }],
  comment: [{ required: true, type: 'string', message: '请输入持仓点评' }]
};

export const CommentForm: FunctionComponent<InsertFormProps> = (
  props: PropsWithChildren<InsertFormProps>
) => {
  const [form] = Form.useForm<InsertFormFields>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // 自动加载数据
    // TODO: 可根据用户个性化配置
    // form.submit();
    // 自动获得焦点，进入页面加载完毕可以直接按回车搜索
  }, []);
  const today = moment();
  const initialValues: InsertFormFields = {
    comment:
      typeof props.initialcomment === 'string' ? props.initialcomment : '',
    commentDate: moment(today)
  };

  const handleSubmit = async (values: InsertFormFields) => {
    setLoading(true);
    try {
      await props.onFinish(values);
      message.success('点评成功！');
      props.onReset();
    } catch (err) {
      setLoading(false);
      message.error('点评失败！');
    }
  };
  return (
    <div>
      <>
        <h3 style={{ color: 'rgba(0, 0, 0, 0.45)', marginBottom: '10px' }}>
          每天15:45系统自动结算，所以请在16:00以后填写提交！
        </h3>
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
            label="持仓点评"
            className={styles.area}
            rules={formValidationRules.comment}>
            <Input.TextArea
              placeholder="请输入持仓点评"
              allowClear
              style={{ height: '230px' }}
            />
          </Form.Item>
          <Form.Item>
            <Space size="middle">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                disabled={typeof props.initialcomment == 'string' || loading}>
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
