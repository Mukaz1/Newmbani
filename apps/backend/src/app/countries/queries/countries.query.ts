export interface CountryAggregationPayload {
  keyword: string;
  skip: number;
  page: number;
  limit: number;
  sort: object;
  countryId?: string;
  supported?: boolean;
  supportingCustomer?: boolean;
  supportingLandlord?: boolean;
}

export async function CountriesQuery(data: CountryAggregationPayload) {
  const {
    countryId,
    skip,
    limit,
    keyword,
    sort,
    supported,
    supportingCustomer,
    supportingLandlord,
  } = data;

  const query = [
    {
      $addFields: {
        countryId: {
          $toString: '$_id',
        },
      },
    },
    countryId
      ? {
          $match: {
            countryId,
          },
        }
      : {},
    supported
      ? {
          $match: {
            supported,
          },
        }
      : {},
    supportingLandlord
      ? {
          $match: {
            'supporting.landlord': supportingLandlord,
          },
        }
      : {},
    supportingCustomer
      ? {
          $match: {
            'supporting.customer': supportingCustomer,
          },
        }
      : {},
    keyword
      ? {
          $match: {
            name: {
              $regex: keyword,
              $options: 'i',
            },
          },
        }
      : {},
    {
      $project: {
        countryId: 0,
      },
    },
    {
      $sort: sort,
    },
    {
      $skip: skip,
    },
    limit > 0
      ? {
          $limit: limit,
        }
      : {},
  ];

  return query.filter((value) => Object.keys(value).length !== 0);
}
