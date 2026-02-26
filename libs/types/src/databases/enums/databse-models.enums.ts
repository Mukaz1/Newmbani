import { AuthorizationDatabaseModelEnums } from "../../auth";
import { CountriesDatabaseModelEnums } from "../../countries";
import { LandlordEnums } from "../../landlords/enums/database-model.enum";
import { PropertyEnums } from "../../properties/enums/database-model.enum";
import { TenantEnums } from "../../tenants/enums/database-models.enum";

export enum DatabaseEnums {
    DATABASE_CONNECTION = 'DATABASE_CONNECTION',
    SEQUENCE = 'sequence'
}

export const DatabaseModelEnums = {
    ...DatabaseEnums,
    ...PropertyEnums,
    ...AuthorizationDatabaseModelEnums,
    ...LandlordEnums,
    ...CountriesDatabaseModelEnums,
    ...TenantEnums,
}