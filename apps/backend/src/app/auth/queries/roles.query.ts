import { DatabaseModelEnums } from '@newmbani/types';
import { PipelineStage } from 'mongoose';
import { RoleQueryData } from '../utils/getRoleQueryParams.util';

export function AggregateRole(data: RoleQueryData): PipelineStage[] {
  const { keyword, limit, skip, sort, roleId } = data;
  const querryArray = [
    {
      $addFields: {
        roleId: {
          $toString: '$_id',
        },
      },
    },
    roleId
      ? {
          $match: {
            roleId,
          },
        }
      : {},
    {
      $lookup: {
        from: DatabaseModelEnums.USER,
        localField: 'roleId',
        foreignField: 'roleId',
        as: 'users',
      },
    },
    {
      $sort: sort,
    },
    {
      $skip: roleId ? 0 : skip,
    },
    {
      $limit: roleId ? 1 : limit,
    },
  ];
  return querryArray.filter(
    (value) => Object.keys(value).length !== 0,
  ) as PipelineStage[];
}
