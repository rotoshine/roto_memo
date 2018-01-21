import { ILabel } from './Label';
import { ObjectId } from 'bson';

export interface IMemo {
  title?: string,
  content?: string,
  isDisplay: boolean,
  labels?: Array<string|ILabel>,
  createdAt: Date,
  updatedAt: Date
}