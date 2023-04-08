import { User } from 'src/users/entities/user.entity';

export class RequestWithUser {
  user: User;
  params?: any;
}
