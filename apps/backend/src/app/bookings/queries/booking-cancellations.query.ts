import { BookingCancellationQueryPayload } from '../utils/getBookingCancellationParams';
import { DatabaseModelEnums } from '@newmbani/types';

export const BookingCancellationAggregation = (data: {
  payload: BookingCancellationQueryPayload;
  cancellationId?: string;
}): Array<any> => {
  const { payload, cancellationId } = data;
  const { keyword, limit, sort, skip, bookingId } = payload;

  const queryArray = [
    cancellationId
      ? {
          $addFields: {
            cancellationId: { $toString: '$_id' },
          },
        }
      : {},
    cancellationId
      ? {
          $match: {
            cancellationId,
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
    keyword
      ? {
          $match: {
            reason: { $regex: keyword, $options: 'i' },
          },
        }
      : {},
    {
      $addFields: {
        bookingId: {
          $toObjectId: '$bookingId',
        },
        customerId: {
          $toObjectId: '$customerId',
        },
      },
    },
    {
      $lookup: {
        from: DatabaseModelEnums.BOOKING,
        localField: 'bookingId',
        foreignField: '_id',
        as: 'booking',
      },
    },
    {
      $unwind: {
        path: '$booking',
        preserveNullAndEmptyArrays: true,
      },
    },
    // Lookup customer
    {
      $lookup: {
        from: DatabaseModelEnums.CUSTOMER,
        localField: 'customerId',
        foreignField: '_id',
        as: 'customer',
      },
    },
    {
      $unwind: {
        path: '$customer',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
          $project: {
            cancellationId: 0,
          },
        },
    { $sort: sort },
    { $skip: skip },
    limit > 0
      ? {
          $limit: limit,
        }
      : {},
  ];

  return queryArray.filter((value) => Object.keys(value).length !== 0);
};
