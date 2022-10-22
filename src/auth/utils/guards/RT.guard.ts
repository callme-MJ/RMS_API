import { AuthGuard } from '@nestjs/passport';
import { Injectable,  } from '@nestjs/common';

@Injectable()
export class RTGuard extends AuthGuard('jwt-refresh'){}
