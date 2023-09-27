import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '@app/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;

    if (!jwt) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          if (roles) {
            for (const role of roles) {
              if (!res.roles?.includes(role)) {
                throw new UnauthorizedException();
              }
            }
          }
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
