import { DatabaseModelEnums } from '@newmbani/types';
import { CustomerQueryData } from '../utils/getCustomerParams';

export function CustomerAggregation(data: CustomerQueryData) {
  const { keyword, sort, skip, limit, customerId, email, phone, countryId } =
    data;

  const pipeline: any[] = [
    {
      $addFields: {
        customerId: { $toString: '$_id' },
        addressId: { $toObjectId: '$addressId' },
        billingaddressId: { $toObjectId: '$billingAddressId' },
        // countryId: { $toObjectId: '$address.countryId' },
      },
    },

    // Filter by ID, email, phone, etc.
    customerId ? { $match: { customerId } } : {},
    email ? { $match: { email } } : {},
    phone ? { $match: { phone } } : {},
    countryId ? { $match: { countryId } } : {},

    // Lookup country
    {
      $lookup: {
        from: DatabaseModelEnums.COUNTRY,
        localField: 'countryId',
        foreignField: '_id',
        as: 'country',
      },
    },
    {
      $unwind: {
        path: '$country',
        preserveNullAndEmptyArrays: true,
      },
    },

    // Keyword match
    {
      $match: {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } },
          { phone: { $regex: keyword, $options: 'i' } },
        ],
      },
    },

    { $sort: sort },
    { $skip: skip },
    limit > 0 ? { $limit: limit } : {},
  ];

  return pipeline.filter((stage) => Object.keys(stage).length !== 0);
}
