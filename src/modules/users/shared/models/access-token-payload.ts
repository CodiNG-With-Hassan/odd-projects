import { User } from '../entities/user.entity';

export interface IAccessTokenPayload {
  [profile: string]: User;
}
