import { type LoginInput } from '@repo/types'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto implements LoginInput {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
