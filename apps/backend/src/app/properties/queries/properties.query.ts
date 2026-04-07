import { DatabaseModelEnums, PropertyApprovalStatus } from '@newmbani/types';

export interface PropertyAggregationPayload {
  keyword: string;
  skip: number;
  page: number;
  limit: number;
  sort: object;
  slug?: string;
  propertyId?: string;
  categoryId?: string;
  subcategoryId?: string;
  approvalStatus?: PropertyApprovalStatus;
  landlordId?: string;
  rating?: number;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
}

export async function AggregateProperties(payload: PropertyAggregationPayload) {
  const {
    keyword,
    skip,
    limit,
    sort,
    categoryId,
    subcategoryId,
    landlordId,
    propertyId,
    rating,
    approvalStatus,
    slug,
    minPrice,
    maxPrice,
    isAvailable,
  } = payload;

  const query: Record<string, any>[] = [
    {
      $addFields: {
        propertyId: { $toString: '$_id' },
      },
    },
    slug ? { $match: { slug } } : {},
    propertyId ? { $match: { propertyId } } : {},
    landlordId ? { $match: { landlordId } } : {},
    categoryId ? { $match: { categoryId } } : {},
    subcategoryId ? { $match: { subcategoryId } } : {},
    approvalStatus ? { $match: { approvalStatus } } : {},
    minPrice ? { $match: { rentPrice: { $gte: +minPrice || 0 } } } : {},
    maxPrice ? { $match: { rentPrice: { $lte: +maxPrice || 0 } } } : {},
    rating ? { $match: { rating: { $gte: rating } } } : {},
    isAvailable ? { $match: { isAvailable } } : {},

    {
      $addFields: {
        categoryId: { $toObjectId: '$categoryId' },
        subcategoryId: { $toObjectId: '$subcategoryId' },
        landlordId: { $toObjectId: '$landlordId' },
        countryId: { $toObjectId: '$address.countryId' },
        propertyId: { $toString: '$_id' },
      },
    },

    // lookups
    {
      $lookup: {
        from: DatabaseModelEnums.PROPERTY_CATEGORY,
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: DatabaseModelEnums.PROPERTY_SUB_CATEGORY,
        localField: 'subcategoryId',
        foreignField: '_id',
        as: 'subcategory',
      },
    },
    { $unwind: { path: '$subcategory', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: DatabaseModelEnums.PROPERTY_IMAGE,
        localField: 'propertyId',
        foreignField: 'propertyId',
        as: 'images',
        pipeline: [
          {
            $addFields: {
              propertyImageCategoryId: {
                $toObjectId: '$propertyImageCategoryId',
              },
            },
          },
          {
            $lookup: {
              from: DatabaseModelEnums.PROPERTY_IMAGE_CATEGORY,
              localField: 'propertyImageCategoryId',
              foreignField: '_id',
              as: 'propertyImageCategory',
            },
          },
          {
            $unwind: {
              path: '$propertyImageCategory',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
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

    {
      $lookup: {
        from: DatabaseModelEnums.COUNTRY,
        localField: 'countryId',
        foreignField: '_id',
        as: 'country',
      },
    },
    { $unwind: { path: '$country', preserveNullAndEmptyArrays: false } },

    {
      $lookup: {
        from: DatabaseModelEnums.BOOKING,
        localField: 'propertyId',
        foreignField: 'propertyId',
        as: 'bookings',
      },
    },

    // keyword search
    {
      $match: {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { slug: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { 'category.name': { $regex: keyword, $options: 'i' } },
        ],
      },
    },
    {
      $project: {
        propertyId: 0,
      },
    },
    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
  ];

  // clean out empty objects
  return query.filter((value) => Object.keys(value).length !== 0);
}
