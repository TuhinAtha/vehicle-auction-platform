import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { isPgError, PgErrorCode } from '../common/utils/pg.util.js'
import { CreateUserDto } from './dto/create-user.dto.js'
import { UpdateUserDto } from './dto/update-user.dto.js'
import { User } from './entities/user.entity.js'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.save(this.users.create(createUserDto))
  }

  findAll() {
    return this.users.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: string) {
    const user = await this.users.findOneBy({ id })
    if (!user) throw new NotFoundException(`User ${id} not found`)
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)
    return this.save(this.users.merge(user, updateUserDto))
  }

  async remove(id: string) {
    try {
      const { affected } = await this.users.delete({ id })
      if (!affected) throw new NotFoundException(`User ${id} not found`)
    } catch (error) {
      if (isPgError(error, PgErrorCode.ForeignKeyViolation)) {
        throw new ConflictException(`User ${id} has bids and cannot be deleted`)
      }
      throw error
    }
  }

  private async save(user: User) {
    try {
      return await this.users.save(user)
    } catch (error) {
      if (isPgError(error, PgErrorCode.UniqueViolation)) {
        throw new ConflictException(
          `A user with email ${user.email} already exists`,
        )
      }
      throw error
    }
  }
}
