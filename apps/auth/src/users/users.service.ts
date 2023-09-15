import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { hash, compare } from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { NOTIFICATIONS_SERVICE, NotifyEmailDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);

    const createdUser = await this.usersRepository.create({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    });

    const emailNotificationDto: NotifyEmailDto = {
      email: createdUser.email,
      subject: 'Welcome to Cabr!',
      text: `Thank you for registering with Cabr.`,
    };

    this.notificationsService.emit('notify_email', emailNotificationDto);

    return createdUser;
  }

  async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }
    throw new UnauthorizedException('User with this email already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }
}
