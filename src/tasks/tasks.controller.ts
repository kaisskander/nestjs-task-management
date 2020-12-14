import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe, UseGuards, Logger
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatusValidationPipe } from "./pipes/task-status-validation.pipe";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status.enum";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../auth/user.entity";
import { GetUser } from "../auth/get-user.decorator";


@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {

  private logger = new Logger("TasksController");

  constructor(private tasksService: TasksService) {
  }


  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User"${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get("/:id")
  getTaskById(
    @GetUser() user: User,
    @Param("id", ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }


  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @GetUser() user: User,
    @Body() createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.verbose(`user "${user.username}" creating a new task.Data: ${JSON.stringify(createTaskDto)}`);
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete("/:id")
  deleteTask(
    @GetUser() user: User,
    @Param("id", ParseIntPipe) id: number): Promise<void> {
    this.logger.verbose(`user "${user.username}" Deleting task with id:${id} `);
    return this.tasksService.deleteTask(id, user);
  }

  @Patch("/:id/status")
  updateTaskStatus(@Param("id", ParseIntPipe)id: number,
                   @Body("status", TaskStatusValidationPipe) status: TaskStatus,
                   @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
