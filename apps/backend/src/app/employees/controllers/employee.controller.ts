import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterEmployeeDto } from '../dto/register-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

import { EmployeeService } from '../services/employee.service';
import {
  PermissionEnum,
  HttpResponseInterface,
  ExpressQuery,
  UserRequest,
} from '@newmbani/types';
import { RequiredPermissions } from '../../auth/decorators/permissions.decorator';
import { AuthenticationGuard } from '../../auth/guards/authentication.guard';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';

@ApiTags('Employee')
@Controller('employees')
export class EmployeeController {
  /**
   * Creates an instance of EmployeeController.
   * @param {EmployeeService} employeeService
   * @memberof EmployeeController
   */
  constructor(private employeeService: EmployeeService) {}

  /**
   * Register an employee Account
   *
   * @param {RegisterEmployeeDto} employeeDto
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof EmployeeController
   */
  @Post()
  @UseGuards(AuthenticationGuard)
  @RequiredPermissions([
    PermissionEnum.CREATE_EMPLOYEE,
    PermissionEnum.MANAGE_EMPLOYEES,
  ])
  @ApiOperation({ description: 'Register Employee' })
  async create(
    @Body() newEmployeeDto: RegisterEmployeeDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const createdBy: string = user._id.toString();
    // register employee
    const response = await this.employeeService.create({
      newEmployeeDto,
      createdBy,
    });
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get all employees
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof EmployeeController
   */
  @Get()
  @UseGuards(AuthenticationGuard)
  @RequiredPermissions([
    PermissionEnum.VIEW_EMPLOYEES,
    PermissionEnum.MANAGE_EMPLOYEES,
  ])
  async getEmployees(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    // get all employees
    const response = await this.employeeService.findAll(query);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get Employee information by ID
   *
   * @param {string} id
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof EmployeeController
   */
  @Get(':employeeId')
  @UseGuards(AuthenticationGuard)
  @RequiredPermissions([
    PermissionEnum.VIEW_EMPLOYEE,
    PermissionEnum.MANAGE_EMPLOYEES,
  ])
  async getUserById(
    @Param('employeeId') employeeId: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    // Get employee information by id
    const response = await this.employeeService.findOne({ employeeId });
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update Employee Account
   *
   * @param {string} id
   * @param {UpdateEmployeeDto} payload
   * @param res
   * @param {*} req
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof EmployeeController
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  @RequiredPermissions([
    PermissionEnum.UPDATE_EMPLOYEE,
    PermissionEnum.MANAGE_EMPLOYEES,
  ])
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateEmployeeDto,
    @Req() { user }: UserRequest,
    @GenericResponse() res: GenericResponse,
  ): Promise<HttpResponseInterface> {
    const userId: string = user._id;
    const response = await this.employeeService.update(id, payload, userId);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  @RequiredPermissions([
    PermissionEnum.DELETE_EMPLOYEE,
    PermissionEnum.MANAGE_EMPLOYEES,
  ])
  async remove(@Param('id') id: string) {
    const deleted = await this.employeeService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return { message: 'Employee deleted successfully' };
  }
}
