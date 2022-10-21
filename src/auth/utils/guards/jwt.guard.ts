import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// since there are more public routes, jwt guard is not implemented globlally
// and we might have to use it in multiple routes so i thoght
// creating our own class might be better..... 

@Injectable()
export class JwtGuard extends AuthGuard('jwt'){
      
}

