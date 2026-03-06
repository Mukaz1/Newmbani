import { DatabaseModelEnums } from '@newmbani/types';
import { PipelineStage } from 'mongoose';

export interface PropertyImageAggregationPayload {
  keyword: string;
  skip: number;
  limit: number;
  sort: object;
  propertyImageId?: string;
  propertyImageCategoryId?: string;
}

export async function AggregatePropertyImageCategories(
  data: PropertyImageAggregationPayload
): Promise<PipelineStage[]> {
  const {
    propertyImageCategoryId,
    propertyImageId,
    keyword,
    limit,
    sort,
    skip,
  } = data;
  const query = [
    {
      $addFields: {
        propertyImageId: {
          $toString: '$_id',
        },
        propertyImageCategoryId: {
          $toObjectId: '$_id',
        },
      },
    },
    propertyImageId
      ? {
          $match: {
            propertyImageId,
          },
        }
      : {},
    propertyImageCategoryId
      ? {
          $match: {
            propertyImageCategoryId,
          },
        }
      : {},
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
    {
      $project: {
        propertyImageCategoryId: 0,
      },
    },
    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
  ];
  return query.filter(
    (value) => Object.keys(value).length !== 0
  ) as PipelineStage[];
}
