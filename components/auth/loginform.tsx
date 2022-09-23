import styles from './loginform.module.scss';

import Link from 'next/link';
import { Rule } from 'antd/lib/form';
import { Typography, Avatar, Form, Input, Button, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

export interface LoginFormFields {
  username: string;
  password: string;
  remember: boolean;
}

interface PasswordFormProps {
  onFinish: (formValues: LoginFormFields) => void;
}

const formValidationRules: Partial<Record<keyof LoginFormFields, Rule[]>> = {
  username: [{ required: true, message: '请输入用户名!' }],
  password: [{ required: true, message: '请输入密码!' }]
};

export default function LoginForm(props: PasswordFormProps): JSX.Element {
  const [form] = Form.useForm<LoginFormFields>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitBtnRef: any = useRef();

  const { onFinish } = props;

  const handleFinish = async (formValues: LoginFormFields) => {
    setIsSubmitting(true);
    await onFinish(formValues);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (submitBtnRef) {
      // 自动获得焦点，进入页面加载完毕可以直接按回车登录
      submitBtnRef.current.focus();
    }
  });

  return (
    <Form
      name="form-password-login"
      method="post"
      size="large"
      className={styles.passwordForm}
      form={form}
      onFinish={handleFinish}>
      <Form.Item name="username" rules={formValidationRules.username}>
        <Input
          prefix={<UserOutlined />}
          autoComplete="username"
          placeholder="用户名"
        />
      </Form.Item>
      <Form.Item name="password" rules={formValidationRules.password}>
        <Input.Password
          prefix={<LockOutlined />}
          autoComplete="current-password"
          placeholder="密码"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          ref={submitBtnRef}
          style={{ backgroundColor: 'red', border: 'none' }}
          block>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
}
