import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register User Entity
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export for AuthService
})
export class UsersModule {}
