import { Exclude, Expose } from 'class-transformer';

export class CategoryDto {
  @Expose()
  _id: string;

  @Expose()
  name: string;

  @Exclude()
  userId: string;

  @Expose()
  createdAt:Date
  @Expose()
  updatedAt:Date
}
