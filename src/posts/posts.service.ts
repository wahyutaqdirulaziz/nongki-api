import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { PostInterface } from 'src/interface/post.interface';

@Injectable()
export class PostsService {
  constructor(@Inject(RedisService) private readonly redisService: RedisService,private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto,id: number) {
    return await this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId :id
      },
    });
  }

  async findAll() {
    return await this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {


    const postdata = await this.redisService.getPost(String(id));
    if (postdata) {
        console.log('Cache hit!: Product found in Redis');
        return { data: postdata };
    }else{
      const product: PostInterface = await this.prisma.post.findUnique({
        where: { id },
      });;
      // Cache the data in Redis
      await this.redisService.savePost(`${product.id}`, product);
      console.log('Cache miss!: Product not found in Redis');
      return product;
    }

   
   
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.post.delete({
      where: { id },
    });
  }
}
