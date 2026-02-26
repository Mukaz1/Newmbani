
interface PropertyCategoryAggregationPayload {
  keyword: string;
  skip: number;
  limit: number;
  sort: object;
  slim: boolean;
}

export async function AggregatePropertyCategories(
  data: PropertyCategoryAggregationPayload
) {
  const keyword: string = data.keyword || '';

  const query = [
    {
      $addFields: {
        id: {
          $toString: '$_id',
        },
      },
    },

    {
      $match: {
        $or: [
          {
            name: {
              $regex: keyword,
              $options: 'i',
            },
          },
          {
            description: {
              $regex: keyword,
              $options: 'i',
            },
          },
        ],
      },
    },
    {
      $project: {
        id: 0,
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
