/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatabaseModelEnums } from '@newmbani/types';
import { UserQueryData } from '../utils/getUsersQueryParams';

export function UserAggregation(data: UserQueryData) {
  const {
    phone,
    email,
    userId,
    sort,
    limit,
    skip,
    keyword,
    roleId,
    includePassword,
  } = data;
  const query: Array<any> = [
    {
      $addFields: {
        userId: {
          $toString: '$_id',
        },
        employeeId: {
          $toObjectId: '$employeeId',
        },
        tenantId: {
          $toObjectId: '$tenantId',
        },
        defaultAddressId: {
          $toObjectId: '$defaultAddressId',
        },
      },
    },
    userId
      ? {
          $match: {
            userId,
          },
        }
      : {},
    roleId
      ? {
          $match: {
            roleId,
          },
        }
      : {},
    email
      ? {
          $match: {
            email,
          },
        }
      : {},
    phone
      ? {
          $match: {
            phone,
          },
        }
      : {},
    {
      $lookup: {
        from: DatabaseModelEnums.EMPLOYEE,
        localField: 'employeeId',
        foreignField: '_id',
        as: 'employee',
      },
    },
    {
      $unwind: {
        path: '$employee',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: DatabaseModelEnums.TENANT,
        localField: 'tenantId',
        foreignField: '_id',
        as: 'tenant',
      },
    },
    {
      $unwind: {
        path: '$tenant',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: DatabaseModelEnums.ADDRESS,
        localField: 'defaultAddressId',
        foreignField: '_id',
        as: 'defaultAddress',
      },
    },
    {
      $unwind: {
        path: '$defaultAddress',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        $or: [
          {
            phone: {
              $regex: keyword,
              $options: 'i',
            },
          },
          {
            email: {
              $regex: keyword,
              $options: 'i',
            },
          },
          {
            name: {
              $regex: keyword,
              $options: 'i',
            },
          },
        ],
      },
    },
    {
      $addFields: {
        rlId: {
          $toObjectId: '$roleId',
        },
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'rlId',
        foreignField: '_id',
        as: 'role',
      },
    },
    {
      $unwind: '$role',
    },
    includePassword
      ? {}
      : {
          $project: {
            password: 0,
          },
        },
    {
      $project: {
        rlId: 0,
      },
    },
    {
      $addFields: {
        employeeId: {
          $toString: '$employeeId',
        },
        tenantId: {
          $toString: '$tenantId',
        },
      },
    },
    {
      $sort: sort,
    },
    {
      $skip: userId || email || phone ? 0 : skip,
    },
    {
      $limit: userId || email || phone ? 1 : limit,
    },
  ];

  return query.filter((value) => Object.keys(value).length !== 0);
}
