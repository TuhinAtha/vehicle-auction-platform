import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtPayload, UserRole } from '@repo/types'
import { ROLE_KEY } from './decorators.js'

// Runs after JwtAuthGuard, so req.user is set for every non-public route.
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<UserRole | undefined>(
      ROLE_KEY,
      [ctx.getHandler(), ctx.getClass()],
    )
    if (!requiredRole) return true

    const { user } = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>()
    if (user?.role !== requiredRole) {
      throw new ForbiddenException('Insufficient role')
    }
    return true
  }
}
