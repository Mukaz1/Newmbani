import { LandlordQueryPayload } from "../utils/getLandlordParams";

export const LandlordAggregation = (data: {
    payload: LandlordQueryPayload;
    landlordId?: string;
  }): Array<any> => {
    const { payload, landlordId } = data;
    const { keyword, limit, verified, sort, skip } = payload;
    const queryArray = [
      landlordId
        ? {
            $addFields: {
              landlordId: {
                $toString: '$_id',
              },
            },
          }
        : {},
      landlordId
        ? {
            $match: {
              landlordId,
            },
          }
        : {},
      verified
        ? {
            $match: {
              landlordId,
            },
          }
        : {},
      {
        $addFields: {
          cId: {
            $toObjectId: '$countryId',
          },
        },
      },
  

      {
        $project: {
          landlordId: 0,
          cId: 0,
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
  
    return queryArray.filter((value) => Object.keys(value).length !== 0);
  };
  