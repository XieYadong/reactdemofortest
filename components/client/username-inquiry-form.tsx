import {
  AutoComplete,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space
} from 'antd';
import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
// import styles from 'components/orders-private/search.orders.module.scss';
import { debounce } from 'lodash';
import { request } from 'utils/helpers/http';
import user from 'utils/helpers/user';

import { getAPIEndpoint } from 'lib/options/api.options';
import { UserList } from 'lib/typings/portfolio.interface';
// import { useUserInfo } from 'lib/hooks/userinfo';

export interface SearchFormFields {
  // 客户姓名
  clientName?: string;
  // 是否显示仓位、总市值和盈亏比例
  display_position: string;
  // 交易账户类型
  portfolioType_In: string[];
}

export interface ClientSelect {
  children: string;
  key: string;
  meta: UserList['meta'];
  value: string;
}

export interface SearchFormProps {
  isLoading: boolean;
  onSubmit: (formValues: SearchFormFields) => void;
  onReset: () => void;
  accountDispose: (selectOption: UserList) => void;
}

export interface SearchFormRefs {
  submit: () => void | Promise<void>;
}

const API_ROUTE_PATH = '/invest-admin/admin/userInfo/client/indistinct-query';

export const SearchUserNameForm = forwardRef<SearchFormRefs, SearchFormProps>(
  (props: PropsWithChildren<SearchFormProps>, ref) => {
    const submitBtnRef: any = useRef();
    const [form] = Form.useForm<SearchFormFields>();
    const [options, setOptions] = useState<UserList[]>([]);
    // const { token } = useUserInfo();
    const [initialValues, setInitialValues] = useState({
      clientName: undefined,
      // 是否显示仓位数据
      display_position: 'Premium',
      portfolioType_In: ['Premium', 'PremiumSub']
    });

    useImperativeHandle(ref, () => ({
      submit() {
        form.submit();
      }
    }));

    const handleReset = () => {
      setInitialValues({
        clientName: undefined,
        // 是否显示仓位数据
        display_position: 'Premium',
        portfolioType_In: ['Premium', 'PremiumSub']
      });
      props.onReset();
      requestAnimationFrame(() => form.resetFields());
      submitBtnRef.current.focus();
    };

    const handleSearch = useCallback(
      debounce(
        async (keyword: string) => {
          try {
            const token = user.verifyToken();

            if (keyword) {
              const { data } = await request(
                `${getAPIEndpoint(API_ROUTE_PATH)}/${keyword}`,
                {
                  method: 'GET',
                  token
                }
              );
              console.log(
                `🚀 ${new Date().toLocaleString()} ~ file: username-inquiry-form.tsx ~ line 86 ~ options`,
                data
              );
              if (data.length === 1) {
                props.accountDispose(data[0]);
              }
              setOptions(data);
            }
          } catch (err) {
            console.error(
              `🚀 ${new Date().toLocaleString()} ~ file: deal-orders.form.tsx ~ line 194 ~ err`,
              err
            );
          }
        },
        800,
        { leading: true }
      ),
      []
    );

    const handleSelect = async (value: string, option: ClientSelect) => {
      const selectOption = options.filter(item => {
        return item.meta.clientName === value;
      });
      setOptions(selectOption);
      props.accountDispose(selectOption[0]);
    };

    return (
      <Card style={{ marginTop: '20px' }}>
        <Form
          // className={styles['searchForm']}
          name="search-form"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={initialValues}
          onFinish={props.onSubmit}>
          <Form.Item name="display_position" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="portfolioType_In" hidden>
            <Input />
          </Form.Item>
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item name="clientName" label="客户姓名">
                <AutoComplete
                  filterOption={false}
                  onSearch={handleSearch}
                  onSelect={handleSelect}
                  placeholder="请输入客户姓名">
                  {options.map(option => (
                    <AutoComplete.Option
                      value={option.meta.clientName}
                      meta={option.meta}
                      key={option.meta.openId}>
                      {`${option.meta.clientName} (${option.meta.nickName})`}
                    </AutoComplete.Option>
                  ))}
                </AutoComplete>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={props.isLoading}
                  ref={submitBtnRef}>
                  查询
                </Button>
                <Button htmlType="button" onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
);
