export function PrepareEmployeeAggregation(data: {
  keyword: string;
  limit: number;
  sort: any;
  skip: number;
}) {
  const query: Array<any> = [
    {
      $match: {
        isBackOfficeUser: true,
        name: {
          $regex: data.keyword,
          $options: 'i',
        },
      },
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
