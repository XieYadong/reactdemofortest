import {
  Button,
  Card,
  Form,
  Input,
  message,
  Space,
  DatePicker,
  List
} from 'antd';
import { Rule } from 'antd/lib/form';

import { request } from 'utils/helpers/http';
import { getAPIEndpoint } from 'lib/options/api.options';
import { useRouter } from 'next/dist/client/router';
import {
  useEffect,
  useRef,
  useState,
  FunctionComponent,
  PropsWithChildren
} from 'react';
import moment, { Moment } from 'moment';
// import styles from './index.module.scss';
const API_ROUTE_PATH = '/portfolio-term';
// import styles from './userinfo.module.scss';
export interface InsertFormFields {
  // 名称
  recordTime?: Moment;
  // 说明
  comment: string;
  openId: string;
  clientName?: string;
  customerService?: string;
}
interface InsertFormProps {
  onFinish(formValues: InsertFormFields): Promise<void>;
  onReset(): void;
  clientInfo: any;
}

const formValidationRules: Partial<Record<keyof InsertFormFields, Rule[]>> = {
  recordTime: [{ required: true, message: '请输入通话时间' }],
  comment: [{ required: true, type: 'string', message: '请输入持仓点评' }],
  customerService: [
    { required: true, type: 'string', message: '请输入沟通人姓名' }
  ]
};

export const TelRecordForm: FunctionComponent<InsertFormProps> = (
  props: PropsWithChildren<InsertFormProps>
) => {
  const [form] = Form.useForm<InsertFormFields>();
  const [loading, setLoading] = useState(false);
  const [comments, setcomments] = useState([]);

  const [initialValues, setInitialValues] = useState({
    openId: props.clientInfo?.id
  });
  const today = moment();

  const handleReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    handleGetComment();
  }, []);
  const handleGetComment = async () => {
    setLoading(true);
    try {
      const comments = await request(
        `https://cms.zfxfzb.com/private-calllogs`,
        {
          query: {
            openId: props.clientInfo?.id,
            _limit: 50,
            _sort: 'recordTime:desc'
          }
        }
      );
      setcomments(comments);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      message.error('获取点评失败！');
    }
  };
  const handleSubmit = async (values: InsertFormFields) => {
    setLoading(true);
    try {
      const formValue = {
        ...values,
        clientName: props.clientInfo?.name
      };
      await props.onFinish(formValue);
      message.success('点评成功！');
      setLoading(false);
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
          【{props.clientInfo?.name}】沟通记录录入
        </h3>
        <Card>
          {/* <div className={styles.scrollBox}> */}
          <div>
            <List
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <>
                        <a>
                          通话时间:
                          {moment(item.recordTime).format(
                            'yyyy-MM-DD HH:MM:SS'
                          )}
                        </a>
                        &nbsp;
                        <span>沟通人员</span>：{item.customerService}
                      </>
                    }
                    description={item.comment}
                  />
                </List.Item>
              )}
            />
          </div>
        </Card>
        <Form
          name="update-form"
          layout="vertical"
          form={form}
          initialValues={initialValues}
          style={{ maxWidth: '640px' }}
          onFinish={handleSubmit}>
          <Form.Item
            name="comment"
            label="通话记录录入"
            // className={styles.area}
            rules={formValidationRules.comment}>
            <Input.TextArea
              placeholder="请输入通话记录"
              allowClear
              rows={5}
              style={{ height: '90px' }}
            />
          </Form.Item>

          <Form.Item hidden name="openId">
            <Input hidden autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="recordTime"
            label="通话时间"
            rules={formValidationRules.recordTime}>
            <DatePicker showTime />
          </Form.Item>

          <Form.Item
            name="customerService"
            label="沟通人"
            // className={styles.area}
            rules={formValidationRules.customerService}>
            <Input
              placeholder="请输入沟通人姓名"
              style={{ width: '200px' }}
              allowClear
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
