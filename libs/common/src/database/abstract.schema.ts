import { Prop, Schema } from '@nestjs/mongoose';
import { Types, ObjectId } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Prop({
    type: Types.ObjectId,
  })
  _id: ObjectId;
}
