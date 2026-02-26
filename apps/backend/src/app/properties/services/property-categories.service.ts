import {  Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  PaginatedData,
  PropertyCategory,
} from '@newmbani/types';
import {
  CreatePropertyCategoryDto,
  PostNewPropertyCategoryDto,
  PostPropertyCategoryUpdateDto,
  UpdatePropertyCategoryDto,
} from '../dtos/property-category.dto';
import { AggregatePropertyCategories } from '../queries/property-categories.aggregator';
import { CustomHttpResponse, generateSlug } from '../../common';
import { PropertyCategoryModel } from '../schemas/property-category.schema';

@Injectable()
export class PropertyCategoriesService {
  /**
   * The constructor for the property categories service.
   *
   * @param propertyCategories The model for the property categories.
   */
 
  /**
   * Register a new Property Category
   *
   * @param {CreatePropertyCategoryDto} createPropertyCategoryDto
   * @param {string} userId
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof CategoriesService
   */
  async create(
    createPropertyCategoryDto: CreatePropertyCategoryDto,
    userId: string
  ): Promise<HttpResponseInterface> {
    try {
      const payload: PostNewPropertyCategoryDto =
        createPropertyCategoryDto as unknown as PostNewPropertyCategoryDto;
      payload.createdBy = userId;
      payload.slug = generateSlug(payload.name)
      const propertyCategory = await PropertyCategoryModel.create(
        createPropertyCategoryDto
      );
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `The category ${createPropertyCategoryDto.name} has been created successfully`,
        data: propertyCategory,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error creating the category ${createPropertyCategoryDto.name}`,
        data: error,
      });
    }
  }

  /**
   * Finds all property categories in the database. If the payload is provided then
   * it filters the property categories by the account type and/or the holder id.
   *
   * @param {ExpressQuery} [query] - The payload that contains the filter criteria.
   * @return {Promise<HttpResponseInterface>} - The response of the operation.
   * @memberof CategoriesService
   */
  async findAll(query?: ExpressQuery): Promise<HttpResponseInterface> {
    try {
      const limitQ = query.limit;
      const totalDocuments = await PropertyCategoryModel
        .find()
        .countDocuments()
        .exec();
      const limit = +limitQ === -1 ? totalDocuments : +query.limit || 10;
      const keyword = query && query.keyword ? query.keyword : '';
      const page = query && query.page ? +query.page : 1;
      const skip = limit * (page - 1);
      const slim: boolean = query.slim
        ? (query.slim as unknown as boolean) || false
        : false;
      const sort: any =
        query && query.sort ? { ...(query.sort as any) } : { name: 1 };

      const search: Array<any> =
        query &&
        (await AggregatePropertyCategories({
          keyword: keyword as string,
          skip,
          sort,
          limit,
          slim,
        }));

      // get all the property categories
      const categories: PropertyCategory[] = await PropertyCategoryModel
        .aggregate(search)
        .exec();

      const counts = await PropertyCategoryModel
        .aggregate([...search.slice(0, -2), { $count: 'count' }])
        .exec();

      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedData = {
        page,
        limit,
        total,
        data: categories,
        pages,
      };
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Property categories loaded from database successfully!',
        data: response,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an issue loading property categories from database',
        data: error,
      });
    }
  }

  async findOne(id: string) {
    try {
      const propertyCategory = await PropertyCategoryModel.findById(id);
      if (propertyCategory) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.CREATED,
          message: `The property Category with id ${id} found`,
          data: propertyCategory,
        });
      } else {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `The property Category with id ${id} not found`,
          data: null,
        });
      }
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error getting the property Category with the id ${id}`,
        data: error,
      });
    }
  }

  /**
   * Update PropertyCategory
   *
   * @param {string} id
   * @param {UpdatePropertyCategoryDto} updatePropertyCategoryDto
   * @param {string} userId
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof categoriesService
   */
  async update(
    id: string,
    updatePropertyCategoryDto: UpdatePropertyCategoryDto,
    userId: string
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };
      const payload: PostPropertyCategoryUpdateDto =
        updatePropertyCategoryDto as unknown as PostPropertyCategoryUpdateDto;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();
      // update the Property Category
      const propertyCategory = await PropertyCategoryModel.findOneAndUpdate(
        filter,
        payload,
        {
          returnOriginal: false,
        }
      );
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `Property Category updated successfully!`,
        data: propertyCategory,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: error.message,
        data: error,
      });
    }
  }

  remove(id: string) {
    return `This action removes a #${id} property category`;
  }
}
