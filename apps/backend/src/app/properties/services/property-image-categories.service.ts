import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  PaginatedData,
  ExpressQuery,
} from '@newmbani/types';
import { Injectable } from '@nestjs/common';
import {
  CreatePropertyImageCategoryDto,
  PostNewPropertyImageCategoryDto,
  UpdatePropertyImageCategoryDto,
  PostPropertyImageCategoryUpdateDto,
} from '../dtos/property-image-category.dto';
import { CustomHttpResponse } from '../../common';

import { AggregatePropertyImageCategories } from '../queries/property-images-category.aggregator';
import { PropertyImageCategoryModel } from '../schemas/property-image-category.schema';

@Injectable()
export class PropertyImageCategoriesService {
  async create(data: {
    createPropertyImageCategoryDto: CreatePropertyImageCategoryDto;
    userId: string;
  }): Promise<HttpResponseInterface> {
    const { createPropertyImageCategoryDto, userId } = data;
    try {
      const payload: PostNewPropertyImageCategoryDto = {
        ...createPropertyImageCategoryDto,
        createdBy: userId,
      };

      const category = await PropertyImageCategoryModel.create(payload);

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `Property image category ${createPropertyImageCategoryDto.name} created successfully`,
        data: category,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `Error creating property image category ${createPropertyImageCategoryDto.name}`,
        data: error,
      });
    }
  }

  async findAll(query?: ExpressQuery): Promise<HttpResponseInterface> {
    try {
      const limitQ = query?.limit;
      // We'll get all docs if -1 or the passed number (default to 10)
      const limit = +limitQ === -1 ? undefined : +(limitQ || 10);
      const keyword = (query?.keyword as string) || '';
      const page = query?.page ? +query.page : 1;
      const skip = limit ? limit * (page - 1) : 0;

      const propertyImageCategoryId: string | undefined =
        query?.propertyImageCategoryId &&
        !(query.propertyImageCategoryId as string).includes('undefined')
          ? (query.propertyImageCategoryId as string)
          : undefined;

      const sort: any = query?.sort ? { ...(query.sort as any) } : { name: 1 };

      // Aggregation pipeline, with limit/skip only if limit !== undefined
      const pipeline = await AggregatePropertyImageCategories({
        keyword,
        skip,
        limit: limit ?? 0,
        sort,
        propertyImageCategoryId,
      });

      // For counting total (with filters), build a "count" pipeline without skip/limit
      const countPipeline = await AggregatePropertyImageCategories({
        keyword,
        skip: 0,
        limit: 0,
        sort,
        propertyImageCategoryId,
      });
      countPipeline.push({ $count: 'count' });

      const [categories, totalData] = await Promise.all([
        PropertyImageCategoryModel.aggregate(pipeline),
        PropertyImageCategoryModel.aggregate(countPipeline),
      ]);
      const total = totalData?.[0]?.count || 0;
      const pages = limit ? Math.ceil(total / (limit || 1)) : 1;

      const response: PaginatedData = {
        page,
        limit: limit ?? total,
        total,
        data: categories,
        pages,
      };

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Property image categories loaded successfully!',
        data: response,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an issue loading property image categories',
        data: error,
      });
    }
  }

  async findOne(id: string): Promise<HttpResponseInterface> {
    try {
      // Use aggregator to add propertyImages as well on single find
      const pipeline = await AggregatePropertyImageCategories({
        keyword: '',
        skip: 0,
        limit: 1,
        sort: {},
        propertyImageCategoryId: id,
      });
      const categoryArr = await PropertyImageCategoryModel.aggregate(pipeline);
      const category = categoryArr[0];
      if (category) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.OK,
          message: `Property image category with id ${id} found`,
          data: category,
        });
      }
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.NOT_FOUND,
        message: `Property image category with id ${id} not found`,
        data: null,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `Error finding property image category with id ${id}`,
        data: error,
      });
    }
  }

  async update(
    id: string,
    updatePropertyImageCategoryDto: UpdatePropertyImageCategoryDto,
    userId: string
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };
      const payload: PostPropertyImageCategoryUpdateDto =
        updatePropertyImageCategoryDto as unknown as PostPropertyImageCategoryUpdateDto;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      const category = await PropertyImageCategoryModel.findOneAndUpdate(
        filter,
        payload,
        { returnOriginal: false }
      );

      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Property image category updated successfully!`,
        data: category,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: error.message,
        data: error,
      });
    }
  }

  async remove(id: string): Promise<HttpResponseInterface> {
    try {
      await PropertyImageCategoryModel.findByIdAndDelete(id).exec();
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: `Property image category with id ${id} deleted successfully`,
        data: null,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `Error deleting property image category with id ${id}`,
        data: error,
      });
    }
  }
}
