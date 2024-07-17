import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ default: true })
  isPrivate: boolean;

  @Prop({ required: true, enum: ['text', 'list'] })
  taskType: 'text' | 'list';

  @Prop()
  body?: string;

  @Prop([{ body: { type: String, required: true } }])
  items?: { body: string }[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
