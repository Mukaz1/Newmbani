import { DatabaseModelEnums } from '@newmbani/types';
import { BookingQueryPayload } from '../utils/getBookingsParams';

export const BookingAggregation = (data: {
  payload: BookingQueryPayload;
  bookingId?: string;
}): Array<any> => {
  const { payload, bookingId } = data;
  const { keyword, limit, sort, skip, customerId, landlordId, propertyId } =
    payload;
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
    customerId
      ? {
          $match: {
            customerId,
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
    propertyId
      ? {
          $match: {
            propertyId,
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
      $lookup: {
        from: DatabaseModelEnums.PROPERTY,
        localField: 'propertyId',
        foreignField: '_id',
        as: 'property',
        pipeline: [
          {
            $addFields: {
              propertyId: {
                $toString: '$_id',
              },
              landlordId: { $toObjectId: '$landlordId' },
            },
          },
          {
            $lookup: {
              from: DatabaseModelEnums.PROPERTY_IMAGE,
              localField: 'propertyId',
              foreignField: 'propertyId',
              as: 'images',
            },
          },
          {
            $lookup: {
              from: DatabaseModelEnums.LANDLORD,
              localField: 'landlordId',
              foreignField: '_id',
              as: 'landlord',
            },
          },
          { $unwind: { path: '$landlord', preserveNullAndEmptyArrays: false } },
        ],
      },
    },

    {
      $unwind: {
        path: '$property',
        preserveNullAndEmptyArrays: true,
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
