import { USER_ROLES, type CreateUserInput, type UserRole } from '@repo/shared'
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto implements CreateUserInput {
  @IsEmail()
  email: string

  @IsIn(USER_ROLES)
  role: UserRole

  @IsString()
  @IsNotEmpty()
  name: string
}
