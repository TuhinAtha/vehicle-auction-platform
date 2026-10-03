import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../users/users.service.js'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from '@repo/shared'
import * as bcrypt from 'bcrypt'

const PASSWORD_HASH =
  '$2b$10$clZG.hzNNtqCOzFfDFcUR.w5F1W.bGffE6JYfCsqlL.LAvwQmGv6O'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}
  async login(email: string, password: string) {
    const user = await this.users.findOnByEmail(email).catch((err) => {
      if (err instanceof NotFoundException) return null
      throw err
    })

    const passwordValid = await bcrypt.compare(password, PASSWORD_HASH)
    if (!user || !passwordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload: JwtPayload = {
      sub: user.email,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    return {
      accessToken: await this.jwt.signAsync(payload),
      user: { email: user.email, name: user.name, role: user.role },
    }
  }
}
