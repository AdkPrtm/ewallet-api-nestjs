import {
  HttpException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new HttpException('Unauthorized', 401);

    try {
      const payload = this.jwtService.verify(token);

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });
      if (!user) throw new HttpException('Unauthorized', 401);

      req.user = user;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers['authorization'];
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
