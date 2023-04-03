import { Tag } from '../entities/tag.entity';

export type WhereQueryObject = {
  title?: string;
  availability?: boolean;
  tags?: Tag[];
};
