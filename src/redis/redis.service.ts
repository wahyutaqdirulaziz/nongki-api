import { Inject, Injectable } from '@nestjs/common';

import { RedisPrefixEnum } from 'src/constants/redis-prefix-enum';
import { RedisRepository } from './redis.repository';
import { PostInterface } from 'src/interface/post.interface';
import { UserInterface } from 'src/interface/user.interface';

const oneDayInSeconds = 60 * 60 * 24;
const tenMinutesInSeconds = 60 * 10;

@Injectable()
export class RedisService {
    constructor(@Inject(RedisRepository) private readonly redisRepository: RedisRepository) {}

    async savePost(postId: string, postData: PostInterface): Promise<void> {
        // Expiry is set to 1 day
        await this.redisRepository.setWithExpiry(
            RedisPrefixEnum.POST,
            postId,
            JSON.stringify(postData),
            oneDayInSeconds,
        );
    }

    async getPost(postId: string): Promise<PostInterface | null> {
        const post = await this.redisRepository.get(RedisPrefixEnum.POST, postId);
        return JSON.parse(post);
    }



    async saveUser(email: string, userData: UserInterface): Promise<void> {
        // Expiry is set to 1 day
        await this.redisRepository.setWithExpiry(
            RedisPrefixEnum.USER,
            email,
            JSON.stringify(userData),
            oneDayInSeconds,
        );
    }

    async getUser(email: string): Promise<UserInterface | null> {
        const user = await this.redisRepository.get(RedisPrefixEnum.USER, email);
        return JSON.parse(user);
    }

    async removeUser(email: string): Promise<any | null> {
        return await this.redisRepository.delete(RedisPrefixEnum.USER, email);
    }
    async saveResetToken(userId: string, token: string): Promise<void> {
        // Expiry is set to 10 minutes
        await this.redisRepository.setWithExpiry(
            RedisPrefixEnum.RESET_TOKEN,
            token,
            userId,
            tenMinutesInSeconds,
        );
    }

    async getResetToken(token: string): Promise<string | null> {
        return await this.redisRepository.get(RedisPrefixEnum.RESET_TOKEN, token);
    }
}