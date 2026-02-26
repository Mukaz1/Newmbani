import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseModelEnums, Role, RolesEnum } from '@newmbani/types';

@Injectable()
export class RolesService {
  constructor(
    @Inject(DatabaseModelEnums.ROLE)
    private roles: Model<Role>
  ) {
    //
  }

  /**
   * Finds the role for landlords
   *
   * @returns the role object for landlords if found, undefined otherwise
   */
  async getLandlordRole(): Promise<Role | undefined> {
    try {
      return await this.roles.findOne({ name: RolesEnum.LandlordRole }).exec();
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Finds the role for tenants
   *
   * @returns the role object for tenants if found, undefined otherwise
   */
  async getTenantRole(): Promise<Role | undefined> {
    try {
      return await this.roles.findOne({ name: RolesEnum.TenantRole }).exec();
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Finds the role for employee
   *
   * @returns the role object for employees if found, undefined otherwise
   */
  async getEmployeeRole(): Promise<Role | undefined> {
    try {
      return await this.roles.findOne({ name: RolesEnum.Employee }).exec();
    } catch (error) {
      return undefined;
    }
  }
}
