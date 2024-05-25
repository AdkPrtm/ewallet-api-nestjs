import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "./prisma.service";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService, private prismaService: PrismaService) { }

    async use(req: any, res: any, next: (error?: Error | any) => void) {
        const token = this.extractTokenFromHeader(req);
        if (!token) throw new HttpException('Unauthorized', 401)

        const payload = this.jwtService.verify(token)
        if (!payload.id) throw new HttpException('Something went wrong', 500)

        const user = await this.prismaService.user.findUnique({ where: { id: payload.id } })
        if (!user) throw new HttpException('Unauthorized', 401)

        req.user = user
        next()
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authorization = request.headers['authorization'];
        const [type, token] = authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}