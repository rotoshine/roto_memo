import { Document, Schema, Connection } from 'mongoose';
import { ILabel } from '../types/Label';

export interface ILabelModel extends ILabel, Document {}

export default function (db:Connection) {
  const LabelSchema = new Schema({
    name: {
      type: String
    },
    memoCount: {
      type: Number,
      default: 0
    },    
    isDisplay: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });

  db.model<ILabelModel>('Label', LabelSchema);
};