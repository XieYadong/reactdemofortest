import { message, Table } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { request, shallowCopySkipEmptyString } from 'utils/helpers/http';
import { SorterResult } from 'antd/lib/table/interface';
import user from 'utils/helpers/user';

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
  id: string | number;
  feachUrl: string;
  formValues?: any;
  idKey?: string;
  sorter?: SorterProps[];
  stockNumber?: any;
}
interface SorterQuery {
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

export const IndividualTable = forwardRef<
  ReloadableComponentRefs,
  StateTableProps
>((props: PropsWithChildren<StateTableProps>, ref) => {
  const hasId = props.idKey ? { [props.idKey]: props.id } : {};

  const [isLoading, setIsLoading] = useState(false);
  const [collection, setCollection] = useState([]);
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
      page: pagination.current,
      page_size: pagination.pageSize
    });

    // 排序参数
    if ((sorter as SorterResult<any>).column) {
      // 单列排序
      sorterQuery = {
        sortby: (sorter as SorterResult<any>).field as string,
        order: (sorter as SorterResult<any>).order === 'ascend' ? 'asc' : 'desc'
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
      defaultOptions.pagination.total / defaultOptions.pagination.pageSize > 7,
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
    handleFinish();
  }, [paginationMemo, filters, sorter, props.formValues]);

  const handleTableChangeNoform = (
    pagination: TablePaginationConfig,
    filters: Record<string, React.ReactText[]>,
    sorter: SorterResult<any>[]
  ) => {
    console.log(pagination, 'sortpaginationer');
    console.log(sorter, 'sorter');
    setPagination(prevCount => {
      return { ...prevCount, ...pagination };
    });
    setSorter([].concat(sorter).filter(elem => elem && elem.order));
    setFilters(filters);
  };
  const handleFinish = async () => {
    const nextQuery = shallowCopySkipEmptyString({
      ...hasId,
      ...composeQuery(),
      ...props.formValues
    });
    setIsLoading(true);

    try {
      const token = user.verifyToken();
      const response = await request(props.feachUrl, {
        token: token,
        query: nextQuery
      });
      const transactionStock = response.items.filter(
        item => item.sell_time !== undefined
      );
      const totalIncome = transactionStock.filter(item => item.totalIncome > 0);

      setCollection(transactionStock);
      setPagination(prevCount => {
        return { ...prevCount, ...response.meta };
      });
      if (props.idKey == 'portfolio_id') {
        props.stockNumber({
          transactionStock: response.items.length,
          profitStock: totalIncome.length
        });
      }
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
    setIsLoading(false);
  };
  return (
    <div>
      <div className="tableBox">
        <Table
          rowKey="_id"
          loading={isLoading}
          columns={props.columns}
          dataSource={collection}
          pagination={pagination}
          onChange={handleTableChangeNoform}
        />
      </div>
    </div>
  );
});
