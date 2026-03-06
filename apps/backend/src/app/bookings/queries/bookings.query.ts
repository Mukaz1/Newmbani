import { lookup } from "dns";
import { BookingQueryPayload } from "../utils/getBookingsParams";

export const BookingAggregation = (data: {
    payload: BookingQueryPayload;
    bookingId?: string;
  }): Array<any> => {
    const { payload, bookingId } = data;
    const { keyword, limit,  sort, skip } = payload;
    const queryArray = [
      bookingId
        ? {
            $addFields: {
              bookingId: {
                $toString: '$_id',
              },
            },
          }
        : {},
      bookingId
        ? {
            $match: {
              bookingId,
            },
          }
        : {},
      
      {
        $addFields: {
          customerId: {
            $toObjectId: '$customerId',
          },
          propertyId: {
            $toObjectId: '$propertyId',
          },
        },
      },

      {
        $project: {
          bookingId: 0,
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
  