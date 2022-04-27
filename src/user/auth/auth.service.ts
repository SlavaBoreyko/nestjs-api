import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserType } from "@prisma/client";

interface SignupParams {
    name: string;
    email: string;
    password: string;
    phone: string;
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}
    async signup({ name, phone, email, password }: SignupParams) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email
            },
        });

        if(userExists) {
            throw new ConflictException();
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prismaService.user.create({
            data: {
                name,
                phone,
                email,
                password: hashedPassword,
                user_type: UserType.BUYER,
            }
        })

        const token = await jwt.sign({
            name,
            id: user.id
        }, process.env.JSON_TOKEN_KEY, {
            expiresIn: 36000
        })

        return token;
    }
}
