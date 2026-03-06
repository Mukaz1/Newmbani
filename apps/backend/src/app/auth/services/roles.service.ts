import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseModelEnums, Role, RolesEnum } from '@newmbani/types';

@Injectable()
export class RolesService {
  constructor(
    @Inject(DatabaseModelEnums.ROLE)
    private roles: Model<Role>,
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
   * Finds the role for customers
   *
   * @returns the role object for customers if found, undefined otherwise
   */
  async getCustomerRole(): Promise<Role | undefined> {
    try {
      return await this.roles.findOne({ name: RolesEnum.CustomerRole }).exec();
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
