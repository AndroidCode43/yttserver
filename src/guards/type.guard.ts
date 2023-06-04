import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { TYPES_KEY } from "../decorators/type.decorator";

@Injectable()
export class TypeGuard implements CanActivate{

  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const reqType = this.reflector.getAllAndOverride<string>(TYPES_KEY, [
        context.getHandler(),
      context.getClass()
      ]);

      //если типы доступа не прокинуты - запрос доступен всем
      if(!reqType){
        return true;
      }

      //достаём запрос от клиента, выстаскиваем из него токен
      const req = context.switchToHttp().getRequest();
      const auth = req.headers.authorization;
      const bearer = auth.split(' ')[0];
      const token = auth.split(' ')[1];

      //расшифровка jwt токена
      const user = this.jwtService.verify(token);
      req.user = user;

      if(bearer !== 'Bearer' || !token){
        throw new HttpException('Пользователь не авторизован!', HttpStatus.FORBIDDEN);
      }

      return reqType.includes(user.type);
    }catch(e){
      throw new HttpException('Пользователь не авторизован!',HttpStatus.FORBIDDEN);
    }
  }
}