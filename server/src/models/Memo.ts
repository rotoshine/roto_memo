import { Document, Schema, Connection } from 'mongoose';
import { IMemo } from '../types/Memo';

export interface IMemoModel extends IMemo, Document {}

export default function (db:Connection) {
  const MemoSchema = new Schema({
    title: {
      type: String
    },
    content: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    labels: [{
      ref: 'Label',
      type: Schema.Types.ObjectId
    }],
    isDisplay: {
      type: Boolean,
      required: true,
      default: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });

  db.model<IMemoModel>('Memo', MemoSchema);
};