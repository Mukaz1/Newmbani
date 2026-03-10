import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  DatabaseModelEnums,
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  PaginatedData,
  PropertiesSubCategory,
} from '@newmbani/types';
import {
  CreatePropertiesSubCategoryDto,
  PostNewPropertiesSubCategoryDto,
  PostPropertiesSubCategoryUpdateDto,
  UpdatePropertiesSubCategoryDto,
} from '../dtos/property-sub-category.dto';
import { CustomHttpResponse, generateSlug } from '../../common';
import { AggregatePropertiesubcategories } from '../queries/property-subcategories.aggregator';

@Injectable()
export class PropertiesubcategoriesService {
  /**
   * Creates an instance of PropertiesubcategoriesService.
   * @param propertiesubcategories The mongoose model for property subcategories.
   */
  constructor(
    @Inject(DatabaseModelEnums.PROPERTY_SUB_CATEGORY)
    private propertiesubcategories: Model<PropertiesSubCategory>
  ) {}

  /**
   * Register a new Property Category
   *
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof PropertiesubcategoriesService
   * @param data
   */
  async create(data: {
    createPropertiesSubCategoryDto: CreatePropertiesSubCategoryDto;
    userId: string;
  }): Promise<HttpResponseInterface> {
    const { createPropertiesSubCategoryDto, userId } = data;
    try {
      const payload: PostNewPropertiesSubCategoryDto = {
        ...createPropertiesSubCategoryDto,
        slug: generateSlug(createPropertiesSubCategoryDto.name),
        createdBy: userId,
      };

      const propertyCategory = await this.propertiesubcategories.create(
        payload
      );
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.CREATED,
        message: `The subcategory ${createPropertiesSubCategoryDto.name} has been created successfully`,
        data: propertyCategory,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error creating the subcategory ${createPropertiesSubCategoryDto.name}`,
        data: error,
      });
    }
  }

  /**
   * Finds all property categories in the database. If the payload is provided then
   * it filters the property categories by the account type and/or the holder id.
   *
   * @return {Promise<HttpResponseInterface>} - The response of the operation.
   * @memberof PropertiesubcategoriesService
   * @param query
   */
  async findAll(query?: ExpressQuery): Promise<HttpResponseInterface> {
    try {
      const limitQ = query.limit;
      const totalDocuments = await this.propertiesubcategories
        .find()
        .countDocuments()
        .exec();
      const limit = +limitQ === -1 ? totalDocuments : +query.limit || 10;
      const keyword = query && query.keyword ? query.keyword : '';
      const page = query && query.page ? +query.page : 1;
      const skip = limit * (page - 1);
      // get the category
      const categoryId: string | undefined =
        query && query.categoryId
          ? (query.categoryId as string).includes('undefined')
            ? undefined
            : (query.categoryId as string)
          : undefined;
      const sort: any =
        query && query.sort ? { ...(query.sort as any) } : { name: 1 };

      const search: Array<any> =
        query &&
        (await AggregatePropertiesubcategories({
          keyword: keyword as string,
          skip,
          sort,
          limit,
          categoryId,
        }));

      // get all the property subCategories
      const subCategories: PropertiesSubCategory[] =
        await this.propertiesubcategories.aggregate(search).exec();

      const counts = await this.propertiesubcategories
        .aggregate([...search.slice(0, -2), { $count: 'count' }])
        .exec();

      const total = counts.length > 0 ? counts[0].count : 0;
      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedData = {
        page,
        limit,
        total,
        data: subCategories,
        pages,
      };
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Property subcategories loaded from database successfully!',
        data: response,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message:
          'There was an issue loading property subcategories from database',
        data: error,
      });
    }
  }

  async findOne(id: string) {
    try {
      const propertyCategory = await this.propertiesubcategories.findById(id);
      if (propertyCategory) {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.CREATED,
          message: `The property Category with id ${id} found`,
          data: propertyCategory,
        });
      } else {
        return new CustomHttpResponse({
          statusCode: HttpStatusCodeEnum.NOT_FOUND,
          message: `The property subcategory with id ${id} not found`,
          data: null,
        });
      }
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: `There was an error getting the property subcategory with the id ${id}`,
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
   * @memberof PropertiesubcategoriesService
   */

  async update(
    id: string,
    updatePropertyCategoryDto: UpdatePropertiesSubCategoryDto,
    userId: string
  ): Promise<HttpResponseInterface> {
    try {
      const filter = { _id: id };
      const payload: PostPropertiesSubCategoryUpdateDto =
        updatePropertyCategoryDto as unknown as PostPropertiesSubCategoryUpdateDto;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();
      // update the Property Category
      const propertyCategory =
        await this.propertiesubcategories.findOneAndUpdate(filter, payload, {
          returnOriginal: false,
        });
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
