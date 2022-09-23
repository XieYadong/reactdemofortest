import { Button, Card, List, Input, message, Space, DatePicker } from 'antd';
import { Rule } from 'antd/lib/form';

import { request } from 'utils/helpers/http';
// import { getCmsEndpoint } from 'lib/options/api.options';
import { useRouter } from 'next/dist/client/router';
// import { useUserInfo } from 'lib/hooks/userinfo';
import { destination } from 'pino';
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
  openId: string;
  clientName: string;
}
interface InsertFormProps {
  // onFinish(formValues: InsertFormFields): Promise<void>;
  openId: string;
  clientName: string;
}

export const CallLogList: FunctionComponent<InsertFormProps> = (
  props: PropsWithChildren<InsertFormProps>
) => {
  const [loading, setLoading] = useState(false);
  const [comments, setcomments] = useState([]);
  useEffect(() => {
    handleGetComment();
  }, []);
  const today = moment();

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
    // try {
    //   const comments = await request(`gs`, {});
    //   setcomments(comments);
    //   setLoading(false);
    // } catch (err) {
    //   setLoading(false);
    //   console.log(err);
    //   message.error('获取点评失败！');
    // }
  };

  return (
    <div>
      <>
        <h3 style={{ color: 'rgba(0, 0, 0, 0.45)', marginBottom: '10px' }}>
          【{props.clientName}】沟通记录
        </h3>
        <div className={styles.scrollBox}>
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
                        {moment(item.recordTime).format('yyyy-MM-DD HH:MM:SS')}
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
          ,
        </div>
      </>
    </div>
  );
};
