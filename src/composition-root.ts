import "reflect-metadata";
import { Container } from "inversify";
import { AuthService } from "./modules/auth/service/auth.service";
import { SecurityDevicesQueryRepository } from "./modules/securityDevices/repository/securityDevices-query.repository";
import { SecurityDevicesRepository } from "./modules/securityDevices/repository/securityDevices.repository";
import { SecurityDevicesService } from "./modules/securityDevices/service/securityDevices.service";
import { UsersQueryRepository } from "./modules/users/repository/users-query.repository";
import { UsersRepository } from "./modules/users/repository/users.repository";
import { UsersService } from "./modules/users/service/users.service";
import { AuthController } from "./modules/auth/controller/auth.controller";
import { BlogsQueryRepository } from "./modules/blogs/repository/blogs-query.repository";
import { BlogsService } from "./modules/blogs/service/blogs.service";
import { BlogsRepository } from "./modules/blogs/repository/blogs.repository";
import { PostsQueryRepository } from "./modules/posts/repository/posts-query.repository";
import { PostsService } from "./modules/posts/service/posts.service";
import { PostsRepository } from "./modules/posts/repository/posts.repository";
import { CommentsService } from "./modules/comments/service/comments.service";
import { CommentsRepository } from "./modules/comments/repository/comments.repository";
import { CommentsQueryRepository } from "./modules/comments/repository/comments-query.repository";
import { TestingRepository } from "./modules/testing/repository/testing.repository";
import { TestingController } from "./modules/testing/controller/testing.controller";
import { UsersController } from "./modules/users/controller/users.controller";
import { SecurityDevicesController } from "./modules/securityDevices/controller/securityDevices.controller";
import { CommentsController } from "./modules/comments/controller/comments.controller";
import { PostsController } from "./modules/posts/controller/posts.controller";
import { BlogsController } from "./modules/blogs/controller/blogs.controller";

export const container = new Container();

container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersService).to(UsersService);
container.bind(UsersController).to(UsersController);

container.bind(SecurityDevicesQueryRepository).to(SecurityDevicesQueryRepository);
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository);
container.bind(SecurityDevicesService).to(SecurityDevicesService);
container.bind(SecurityDevicesController).to(SecurityDevicesController);

container.bind(AuthService).to(AuthService);
container.bind(AuthController).to(AuthController);

container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsController).to(BlogsController);

container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsService).to(PostsService);
container.bind(PostsController).to(PostsController);

container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsController).to(CommentsController);

container.bind(TestingRepository).to(TestingRepository);
container.bind(TestingController).to(TestingController);
