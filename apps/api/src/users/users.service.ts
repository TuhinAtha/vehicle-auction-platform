import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity.js'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async findOnByEmail(email: string) {
    const user = await this.users.findOneBy({ email })
    if (!user) throw new NotFoundException(`User with ${email} email not found`)
    return user
  }
}
