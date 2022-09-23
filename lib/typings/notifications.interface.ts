import {
  EmittableEvents,
  ReceivableEvents
} from 'constants/notification.constant';

export interface OrderUpdateMessage {
  type: ReceivableEvents;
  payload: {
    orderId: string;
    portfolioId: string;
  };
}

export interface SubscribeOrderUpdateMessage {
  type: EmittableEvents;
  payload: {
    portfolio: string;
  };
}

export type MessageReceivable = OrderUpdateMessage;
export type MessageEmittable = SubscribeOrderUpdateMessage;
