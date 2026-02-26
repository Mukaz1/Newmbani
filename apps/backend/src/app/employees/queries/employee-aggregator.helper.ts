/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmployeeQueryData } from "../utils/getEmployeeQueryParams";

export function EmployeeAggregation(data: EmployeeQueryData) {
  // Build the match conditions
  const matchConditions: any = {
    name: {
      $regex: data.keyword,
      $options: 'i',
    },
  };


  const query: Array<any> = [
    {
      $match: matchConditions,
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'roleId',
        foreignField: '_id',
        as: 'role',
      },
    },
    {
      $unwind: {
        path: '$role',
        preserveNullAndEmptyArrays: true,
      },
    },
    // Remove password field unless explicitly requested
    ...(data.includePassword ? [] : [
      {
        $project: {
          password: 0,
        },
      },
    ]),
    {
      $sort: data.sort,
    },
    {
      $skip: data.skip,
    },
    data.limit > 0
      ? {
          $limit: data.limit,
        }
      : {},
  ];

  return query.filter((value) => Object.keys(value).length !== 0);
}