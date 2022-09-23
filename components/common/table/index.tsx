import { message, Col, Row, Table } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { request, shallowCopySkipEmptyString } from 'utils/helpers/http';
import { SorterResult, SortOrder } from 'antd/lib/table/interface';
import user from 'utils/helpers/user';

import { getAPIEndpoint } from 'lib/options/api.options';
import { omitEmptyQuery } from 'utils/helpers/http';
import { ReloadableComponentRefs } from 'lib/typings/common.interface';
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';

interface StateTableProps {
  columns: any;
  id?: string | number;
  fetchApi?: Function;
  dataSource?: Array<any>;
  formValues?: any;
  idKey?: string;
  sorter?: SorterProps[];
}
export interface SorterQuery {
  sortby: string | string[];
  order: string | string[];
}
interface SorterProps {
  field: string;
  order: string;
}
export interface InsertFormFields {
  meta: {
    name: string;
    description: string;
    term: string;
    riskLevel: string;
    initialPrincipal: string;
  };
}

export const StateTable = forwardRef<ReloadableComponentRefs, StateTableProps>(
  (props: PropsWithChildren<StateTableProps>, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [collection, setCollection] = useState([]);
    // const inputRef: any = useRef();
    // const { userinfo, token } = useUserInfo();
    const defaultOptions = {
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0
      },
      filters: {},
      sorter: props.sorter ? props.sorter : []
    };
    useImperativeHandle(
      ref,
      () => ({
        reload: handleReload
      }),
      [props.id]
    );
    const handleReload = () => {
      if (pagination.current === 1) {
        handleFinish();
      } else {
        setPagination(prevCount => {
          return { ...prevCount, current: 1 };
        });
      }
    };
    const composeQuery = () => {
      let sorterQuery: SorterQuery;
      // 分页参数
      const paginationQuery = omitEmptyQuery({
        pageNo: pagination.current,
        pageSize: pagination.pageSize
      });

      // 排序参数
      if ((sorter as SorterResult<any>).column) {
        // 单列排序
        sorterQuery = {
          sortby: (sorter as SorterResult<any>).field as string,
          order:
            (sorter as SorterResult<any>).order === 'ascend' ? 'asc' : 'desc'
        };
      } else if ((sorter as SorterResult<any>[]).length) {
        // 多列排序
        sorterQuery = (sorter as SorterResult<any>[]).reduce<SorterQuery>(
          (
            query: { sortby: string[]; order: string[] },
            col: SorterResult<any>
          ) => {
            return {
              sortby: [...query.sortby, col.field as string],
              order: [...query.order, col.order === 'ascend' ? 'asc' : 'desc']
            };
          },
          {
            sortby: [],
            order: []
          }
        );
      }

      return {
        ...paginationQuery,
        ...sorterQuery
      };
    };
    const [pagination, setPagination] = useState<any>({
      ...defaultOptions.pagination,
      showSizeChanger: true,
      showQuickJumper:
        defaultOptions.pagination.total / defaultOptions.pagination.pageSize >
        7,
      showTotal: (total: number, range: number[]): React.ReactNode =>
        total ? `当前 ${range[0]} - ${range[1]}, 总计 ${total} 条` : '',
      pageSizeOptions: ['5', '10', '20', '50']
    });
    const paginationMemo = useMemo(() => {
      return pagination;
    }, [pagination.size, pagination.current]);

    const [filters, setFilters] = useState(defaultOptions.filters);
    const [sorter, setSorter] = useState(defaultOptions.sorter);
    useEffect(() => {
      handleFinish().then(r => {});
    }, [paginationMemo, filters, sorter, props.formValues]);

    const handleTableChange = (
      pagination: TablePaginationConfig,
      filters: Record<string, React.ReactText[]>,
      sorter: SorterResult<any>[]
    ) => {
      setPagination(prevCount => {
        return { ...prevCount, ...pagination };
      });
      setSorter([].concat(sorter).filter(elem => elem && elem.order));
      setFilters(filters);
    };
    const handleFinish = async () => {
      const nextQuery = shallowCopySkipEmptyString({
        ...composeQuery(),
        ...props.formValues
      });
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: state-table.tsx ~ line 156 ~ handleFinish ~ nextQuery`,
        nextQuery
      );
      setIsLoading(true);

      const response = await props.fetchApi(nextQuery)
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: state-table.tsx ~ line 163 ~ handleFinish ~ response`,
        response
      );
      if(response.code === 200) {
        setCollection(response.data.resultList);
        setPagination(prevCount => {
          return { ...prevCount, total: response.data.total };
        });
      } else {
        message.error(response.message);
      }

      setIsLoading(false);
    };
    return (
      <div>
        <div className="tableBox">
          <Table
            rowKey="id"
            loading={isLoading}
            columns={props.columns}
            dataSource={collection}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </div>
      </div>
    );
  }
);

export default StateTable
