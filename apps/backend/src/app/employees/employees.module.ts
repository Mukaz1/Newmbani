import { Global, Module } from '@nestjs/common';
import { EmployeeController } from './controllers/employee.controller';
import { employeeProviders } from './provider';
import { AuthModule } from '../auth/auth.module';
import { EmployeeService } from './services/employee.service';

const providers = [...employeeProviders, EmployeeService];

@Global()
@Module({
  controllers: [EmployeeController],
  imports: [AuthModule],
  providers: [...providers],
  exports: [...providers],
})
export class EmployeesModule {
  //
}
