import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface DateTimeFormatterFunction {
  (value: string | number | Date): string | JSX.Element;
}

export const formatDate: DateTimeFormatterFunction = date => {
  return date ? dayjs(date).format('YYYY-MM-DD') : null;
};

export const formatDateTime: DateTimeFormatterFunction = date => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : null;
};

export const formatDateWithTooltip: DateTimeFormatterFunction = date => {
  const formatted = formatDate(date);
  return date ? (
    <Tooltip title={formatDateTime(date)}>{formatted}</Tooltip>
  ) : (
    formatted
  );
};


export const timestampToTime = (timestamp, type="NONE") => {
  let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + '';
  let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
 
  if (type == 'second') {
    return Y + M + D + ' ' + h + m + s;
  } else {
    return Y + M + D
  }
}
