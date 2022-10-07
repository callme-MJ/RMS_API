import { AuthGuard } from '@nestjs/passport';
import { Injectable,  } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('users'){}
export class CordinAuthGuard extends AuthGuard('coordinator'){}