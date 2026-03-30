import { APIBaseAPIUrl } from "../../common/base-api-url";


export const employeesEndpoints = {
  CREATE_EMPLOYEE: `${APIBaseAPIUrl}/employees`,
  GET_EMPLOYEES: `${APIBaseAPIUrl}/employees`,
  GET_EMPLOYEE: (id: string) => `${APIBaseAPIUrl}/employees/${id}`,
  UPDATE_EMPLOYEE: (id: string) => `${APIBaseAPIUrl}/employees/${id}`,
  DELETE_EMPLOYEE: (id: string) => `${APIBaseAPIUrl}/employees/${id}`,
  GET_EMPLOYEE_BY_ID:(id: string) => `${APIBaseAPIUrl}/employees/${id}`,
};
