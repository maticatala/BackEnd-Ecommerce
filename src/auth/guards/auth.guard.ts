import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ){}

  async canActivate(context: ExecutionContext): Promise < boolean > {
    
    //Información referente a la solicitud como por ejemplo la URL de donde viene
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('There is no bearer token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_SEED }
      );

      const user = await this.authService.findUserById(payload.id);
    
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    //Si viene la palabra Bearer devuelve el token, sino devuelve undefined
    //El token viaja a través de los headers en un apartado especial llamado Authorization y es un Bearer token
    return type === 'Bearer' ? token : undefined;
  }

}
