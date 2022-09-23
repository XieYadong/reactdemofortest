import { Button, Card, Form, Input, message, Space, DatePicker } from 'antd';
import { Rule } from 'antd/lib/form';

import { request } from 'utils/helpers/http';
import { getAuldAPIEndpoint } from 'lib/options/api.options';
import { useRouter } from 'next/dist/client/router';
import { destination } from 'pino';
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
  portfolioId: string;
  code: any;
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
  const [commentObj, setCommentObj] = useState<any>({});
  useEffect(() => {
    // 自动加载数据
    // TODO: 可根据用户个性化配置
    // form.submit();
    // 自动获得焦点，进入页面加载完毕可以直接按回车搜索
    handleGetComment();
  }, []);
  const today = moment();
  const initialValues: InsertFormFields = {
    comment:
      typeof props.initialcomment === 'string' ? props.initialcomment : '',
    commentDate: moment(today)
  };
  const handleReset = () => {
    form.resetFields();
  };
  const getMin = arr => {
    return arr.reduce((last, current) => {
      return new Date(last.commentDate).getTime() >
        new Date(current.commentDate).getTime()
        ? last
        : current;
    });
  };
  const handleGetComment = async () => {
    setLoading(true);
    try {
      const comments = await request(
        getAuldAPIEndpoint(
          `/portfolio/${props.portfolioId}/code/${props.code.code}`
        )
      );
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: code-comment-form.tsx ~ line 76 ~ handleGetComment ~ comments`,
        comments
      );
      setLoading(false);
      let minDate =
        comments['items'].length > 0 ? getMin(comments['items']) : {};
      setCommentObj(minDate);
    } catch (err) {
      setLoading(false);
      console.log(err);
      message.error('获取点评失败！');
    }
  };
  const handleSubmit = async (values: InsertFormFields) => {
    setLoading(true);
    try {
      await props.onFinish(values);
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
          【{props.code.name}】点评
        </h3>
        <div>
          {commentObj.commentDate && (
            <h3>
              上次点评时间 :
              {commentObj.commentDate &&
                moment(commentObj.commentDate).format('YYYY-MM-DD HH:MM:SS')}
            </h3>
          )}
          {commentObj.content && (
            <div>
              上次点评内容 :{' '}
              <p style={{ textIndent: '2em' }}>{commentObj.content}</p>
            </div>
          )}
        </div>
        <Form
          name="update-form"
          layout="vertical"
          form={form}
          style={{ maxWidth: '640px' }}
          initialValues={initialValues}
          onFinish={handleSubmit}>
          {/* <Form.Item name="commentDate" label="点评日期">
            <DatePicker />
          </Form.Item> */}
          <Form.Item
            name="comment"
            label="持仓股票点评"
            // className={styles.area}
            rules={formValidationRules.comment}>
            <Input.TextArea
              placeholder="请输入持仓股票点评"
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
