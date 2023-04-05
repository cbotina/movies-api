import { FindOperator } from 'typeorm';
import { Tag } from '../entities/tag.entity';

export type WhereQueryObject = {
  title?: FindOperator<string>;
  availability?: boolean;
  tags?: Tag[];
};
