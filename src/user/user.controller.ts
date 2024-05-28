import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import { UpdateUserRequestBody } from 'src/model/user.model';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getDataUser(@Auth() user: User) {
    const result = await this.userService.getDataUserService(user);
    return result;
  }

  @Get('/:username')
  @HttpCode(HttpStatus.OK)
  async geUserByUsername(@Param('username') username: string) {
    const result =
      await this.userService.getDataUserByUsernameService(username);
    return result;
  }

  @Put()
  @HttpCode(HttpStatus.CREATED)
  async updateUser(@Body() request: UpdateUserRequestBody, @Auth() user: User) {
    const result = await this.userService.updateUserService(request, user);
    return {
      status: result,
    };
  }
}
