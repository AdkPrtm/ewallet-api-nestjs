import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';
import { SupabaseService } from 'src/common/supabase.service';
import { ValidationService } from 'src/common/validation.service';
import {
  GetUserByUsernameBodyResponse,
  GetUserResponseBodyResponse,
  UpdateUserRequestBody,
} from 'src/model/user.model';
import { UserValidation } from '../utils/validation/user.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
    private readonly supabaseService: SupabaseService,
  ) { }

  async getDataUserService(user: User): Promise<GetUserResponseBodyResponse> {
    if (!user.id) throw new HttpException('Something went wrong', 400);

    const wallet = await this.prismaService.wallet.findUnique({
      where: { userId: user.id.toString() },
    });
    if (!wallet) throw new HttpException('Data not found', 400);

    const result = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      username: user.username,
      verified: user.verified,
      profile_picture: user.profilePicture,
      balance: wallet.balance,
      card_number: wallet.cardNumber,
    };

    return result;
  }

  async getDataUserByUsernameService(
    username: string,
    userId: string
  ): Promise<GetUserByUsernameBodyResponse[]> {
    const dataReq = { username };
    const requestGetUsername = this.validationService.validate(
      UserValidation.GETDATAUSERBYUSERNAME,
      dataReq,
    );

    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        verified: true,
        profilePicture: true,
      },
      where: {
        username: {
          contains: requestGetUsername.username,
        },
        NOT: {
          id: userId,
        },
      },
    });
    if (!users) throw new HttpException('User not found', 400);

    const data: GetUserByUsernameBodyResponse[] = users.map((user) => {
      return {
        id: user.firstName,
        first_name: user.firstName,
        last_name: user.firstName,
        username: user.username,
        verified: user.verified,
        profile_picture: user.profilePicture,
      }
    })

    return data;
  }

  async updateUserService(
    request: UpdateUserRequestBody,
    userData: User,
  ): Promise<boolean> {
    const requestUpdateUser = this.validationService.validate(
      UserValidation.UPDATEUSER,
      request,
    );

    if (requestUpdateUser.password)
      requestUpdateUser.password = await bcrypt.hash(
        requestUpdateUser.password,
        10,
      );
    if (requestUpdateUser.profile_picture) {
      const splitData: string[] = userData.profilePicture.split('/');
      const fileName: string = splitData.at(splitData.length - 1);

      requestUpdateUser.profile_picture =
        await this.supabaseService.uploadImageService(
          requestUpdateUser.profile_picture,
          'UpdateImage',
          fileName,
        );
    }

    const data = {
      firstName: requestUpdateUser.first_name,
      lastName: requestUpdateUser.last_name,
      username: requestUpdateUser.username,
      email: requestUpdateUser.email,
      password: requestUpdateUser.password,
      profilePicture: requestUpdateUser.profile_picture,
    };
    const user = await this.prismaService.user.update({
      where: { id: userData.id },
      data: data,
    });

    if (!user) throw new HttpException('User not found', 400);

    return true;
  }
}
