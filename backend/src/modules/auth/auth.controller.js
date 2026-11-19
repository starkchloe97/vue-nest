import {
  Bind,
  Body,
  BadRequestException,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin } from '../admins/admin.model.js';
import { AuthGuard } from './auth.guard.js';

const loginSchema = z.object({
  email: z.string().trim().email().max(190),
  password: z.string().min(1).max(200),
});

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});

@Controller('api/v1/auth')
export class AuthController {
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Bind(Body(), Res({ passthrough: true }))
  async login(body, response) {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Invalid login payload.',
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be configured with at least 32 characters.');
    }

    const email = parsed.data.email.toLowerCase();
    const admin = await Admin.findOne({ where: { email } });
    const valid = admin && await bcrypt.compare(parsed.data.password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password.');

    const token = jwt.sign(
      { sub: String(admin.id), email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '8h' },
    );
    response.cookie('admin_token', token, { ...cookieOptions(), maxAge: 8 * 60 * 60 * 1000 });
    return { admin: { id: admin.id, name: admin.name, email: admin.email } };
  }

  @Post('logout')
  @Bind(Res({ passthrough: true }))
  logout(response) {
    response.clearCookie('admin_token', cookieOptions());
    return { message: 'Logged out.' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @Bind(Req())
  async me(request) {
    const admin = await Admin.findByPk(request.admin.sub, {
      attributes: ['id', 'name', 'email'],
    });
    if (!admin) throw new UnauthorizedException('Admin account no longer exists.');
    return { admin };
  }
}
