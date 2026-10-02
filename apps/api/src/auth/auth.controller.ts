import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import type { AuthUser, JwtPayload } from '@repo/types'
import { AuthService } from './auth.service.js'
import { CurrentUser, Public } from './decorators.js'
import { LoginDto } from './dto/login.dto.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.auth.login(body.email, body.password)
  }

  @Get('profile')
  profile(@CurrentUser() user: JwtPayload): AuthUser {
    return { email: user.email, name: user.name, role: user.role }
  }
}
