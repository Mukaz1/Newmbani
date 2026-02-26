export function SharedUserQuery(payload: {
  userId: string | undefined;
  includePassword: boolean;
}): Array<any> {
  const { includePassword, userId } = payload;
  const baseProject: any = {
    _roleId: 0,
    _employeeId: 0,
  };
  if (!includePassword) {
    baseProject.password = 0;
  }

  return [
    {
      $addFields: {
        userId: {
          $toObjectId: '$_id',
        },
        _roleId: {
          $toObjectId: '$roleId',
        },
        _employeeId: {
          $toObjectId: '$employeeId',
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
      {
        $match: {
          userId:{
            $regex: '$createdBy'
          },
        },
      },
    {
      $lookup: {
        from: 'roles',
        localField: '_roleId',
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
    {
      $lookup: {
        from: 'employees',
        localField: '_employeeId',
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
      $project: baseProject,
    },
  ].filter((value) => Object.keys(value).length !== 0);
}
