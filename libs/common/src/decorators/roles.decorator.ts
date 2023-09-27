import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../enums';

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
