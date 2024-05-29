import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  GetQueryParamRequestQuery,
  GetTipsResponseBody,
} from 'src/model/tips.dto';
import { TipsValidation } from 'src/utils/validation/tips.validation';

@Injectable()
export class TipsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
  ) {}

  async getTips(
    request: GetQueryParamRequestQuery,
  ): Promise<GetTipsResponseBody> {
    const requestGetTips = this.validationService.validate(
      TipsValidation.QUERY,
      request,
    );

    if (requestGetTips.page === 0 || requestGetTips.page === undefined)
      requestGetTips.page = 1;
    const skip = (requestGetTips.page - 1) * requestGetTips.limit;

    const tips = await this.prismaService.tip.findMany({
      skip: skip,
      take: requestGetTips.limit,
    });

    const totalCount = await this.prismaService.tip.count();
    const totalPages = Math.ceil(totalCount / requestGetTips.limit);

    return {
      data: tips,
      current_page: requestGetTips.page,
      last_page: totalPages,
    };
  }
}
