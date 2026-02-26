import { DatabaseModelEnums } from '@newmbani/types';
import { TenantQueryData } from '../utils/getTenantParams';

export function TenantAggregation(data: TenantQueryData) {
  const { keyword, sort, skip, limit, tenantId, email, phone, countryId } =
    data;

  const pipeline: any[] = [
    {
      $addFields: {
        tenantId: { $toString: '$_id' },
        addressId: { $toObjectId: '$addressId' },
        billingaddressId: { $toObjectId: '$billingAddressId' },
        // countryId: { $toObjectId: '$address.countryId' },
      },
    },

    // Filter by ID, email, phone, etc.
    tenantId ? { $match: { tenantId } } : {},
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
