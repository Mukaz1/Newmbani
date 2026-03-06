import { DatabaseModelEnums } from '@newmbani/types';
import { PipelineStage } from 'mongoose';

interface PropertyImageCategoryAggregationPayload {
  keyword: string;
  skip: number;
  limit: number;
  sort: object;
  propertyImageCategoryId?: string;
}

export async function AggregatePropertyImageCategories(
  data: PropertyImageCategoryAggregationPayload
): Promise<PipelineStage[]> {
  const keyword: string = data.keyword || '';
  const { propertyImageCategoryId } = data;
  const query = [
    {
      $addFields: {
        propertyImageCategoryId: {
          $toString: '$_id',
        },
      },
    },
    propertyImageCategoryId
      ? {
          $match: {
            propertyImageCategoryId,
          },
        }
      : {},
    {
      $lookup: {
        from: DatabaseModelEnums.PROPERTY_IMAGE,
        localField: 'propertyImageCategoryId',
        foreignField: 'propertyImageCategoryId',
        as: 'propertyImages',
      },
    },
    {
      $project: {
        propertyImageCategoryId: 0,
      },
    },
    {
      $match: {
        name: {
          $regex: keyword,
          $options: 'i',
        },
      },
    },
  ];
  return query.filter(
    (value) => Object.keys(value).length !== 0
  ) as PipelineStage[];
}
