import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    
    ) {}

  async register(data: RegisterDto) {
    return this.userService.register({
      ...data,
      password: await bcrypt.hash(data.password, 10),
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User){
    const payload = { username: user.name, sub: user.id };
    
    return {
        access_token: this.jwtService.sign(payload),
        user
    }
  }
}
