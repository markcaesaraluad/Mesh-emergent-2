import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserEntity]), JwtModule.register({
    secret: process.env.JWT_SECRET || 'meshconnect_super_secret_jwt_key_2024',
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
  })],
  providers: [
    AuthService,
    JwtStrategy,
  {
    provide: 'USER_SERVICE',
    useClass: UserService
  }],
  exports : [AuthService],
  controllers: [AuthController]
})

export class AuthModule {}
