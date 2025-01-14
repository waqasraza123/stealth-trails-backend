"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_util_1 = require("./auth.util");
const supabase_service_1 = require("../supabase/supabase.service");
let AuthService = class AuthService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.supabase = this.supabaseService.getClient();
    }
    async checkEmailAvailability(email) {
        const { data, error } = await this.supabase
            .from('User')
            .select('id')
            .eq('email', email)
            .maybeSingle();
        if (error) {
            throw new common_1.InternalServerErrorException(`Error checking email: ${error.message}`);
        }
        return data;
    }
    async getUserFromDatabaseById(userId) {
        const { data, error } = await this.supabase
            .from('User')
            .select('*')
            .eq('supabaseUserId', userId)
            .maybeSingle();
        if (error) {
            throw new common_1.InternalServerErrorException(`Error retrieving user by ID: ${error.message}`);
        }
        return data;
    }
    async registerUserInSupabaseAuth(email, password) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            throw new common_1.BadRequestException(error.message);
        }
        return data;
    }
    async saveUserToDatabase(firstName, lastName, email, userId, ethereumAccountAddress) {
        const { error } = await this.supabase
            .from('User')
            .insert([
            {
                firstName,
                lastName,
                email,
                supabaseUserId: userId,
                ethereumAddress: ethereumAccountAddress
            },
        ]);
        if (error) {
            throw new common_1.InternalServerErrorException(`Error saving user to database: ${error.message}`);
        }
    }
    async validateToken(token) {
        const { data, error } = await this.supabase.auth.getUser(token);
        if (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        return data.user;
    }
    async signUp(firstName, lastName, email, password) {
        const existingUser = await this.checkEmailAvailability(email);
        if (existingUser) {
            throw new common_1.ConflictException('Email is already in use');
        }
        const userData = await this.registerUserInSupabaseAuth(email, password);
        if (!userData?.user) {
            throw new common_1.InternalServerErrorException('Failed to create user in Supabase Auth');
        }
        const { address, privateKey } = (0, auth_util_1.generateEthereumAddress)();
        await this.saveUserToDatabase(firstName, lastName, email, userData.user.id, address);
        return {
            status: 'success',
            message: 'Please save the private key, you wont be able to get it from anywhere ever again. We will not store it. If you lose it, you will lose access to your account.',
            data: {
                user: {
                    id: userData.user.id,
                    email: userData.user.email,
                    created_at: userData.user.created_at,
                    firstName,
                    lastName,
                    address,
                    privateKey
                },
            },
        };
    }
    async login(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const user = await this.getUserFromDatabaseById(data.user.id);
        return {
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    supabaseUserId: data.user.id,
                    email: data.user.email,
                    ethereumAddress: user.ethereumAddress,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                token: data.session?.access_token,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AuthService);
