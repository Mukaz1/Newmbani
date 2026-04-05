interface PropertySubCategoryAggregationPayload {
  keyword: string;
  skip: number;
  limit: number;
  sort: object;
  categoryId?: string;
}

export async function AggregatePropertySubCategories(
  data: PropertySubCategoryAggregationPayload
) {
  const keyword: string = data.keyword || '';

  const query = [
    data.categoryId
      ? {
          $match: {
            categoryId: data.categoryId,
          },
        }
      : {},
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
