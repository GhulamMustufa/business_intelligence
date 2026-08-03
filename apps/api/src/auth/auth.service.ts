import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(email: string, password?: string, firstName?: string, lastName?: string) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    // Default org for MVP
    let org = await this.prisma.organization.findFirst();
    if (!org) {
      org = await this.prisma.organization.create({
        data: { name: 'Default Organization' },
      });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        organizationId: org.id,
      },
    });

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
  }

  async signIn(email: string, password?: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.password || !password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
  }
}
