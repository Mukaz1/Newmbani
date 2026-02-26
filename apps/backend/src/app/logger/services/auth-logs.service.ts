import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import {
  AuthLog,
  DatabaseModelEnums,
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  PaginatedData,
  SystemEventsEnum,
  User,
} from '@newmbani/types';
import { CreateAuthLogDto, PostAuthLogDto } from '../dto/auth-log.dto';
import { CustomHttpResponse } from '../../common';
import { RequestLogHelper } from '../../common/utils/req-log.util';

@Injectable()
export class AuthLogsService {
  constructor(
    @Inject(DatabaseModelEnums.AUTH_LOG)
    private logs: Model<AuthLog>,
    @Inject(DatabaseModelEnums.USER)
    private user: Model<User>,
  ) {
    //
  }

  /**
   * Create a new auth log
   * @param authLog the auth log data
   * @returns {Promise<void>}
   */
  @OnEvent(SystemEventsEnum.AddAuthLog, { async: true })
  async create(authLog: CreateAuthLogDto) {
    const { loginSuccess, email, originalReq } = authLog;
    let { userId } = authLog;
    const { ip, userAgent } = RequestLogHelper(originalReq);
    // get the user id from the email
    if (!userId) {
      userId =
        ((await this.user.findOne({ email }).exec()) as User)._id.toString() ||
        undefined;
    }
    // save the log
    const newLog: PostAuthLogDto = {
      ip,
      loginSuccess,
      userId,
      email,
      userAgent,
    };

    await this.logs.create(newLog);
  }

  async getAllAuthLogs(query?: ExpressQuery): Promise<HttpResponseInterface> {
    try {
      const email: string | undefined = query?.email
        ? (query.email as string)
        : undefined;

      const limitQ = query.limit;
      const totalDocuments = email
        ? await this.logs.find({ email }).countDocuments().exec()
        : await this.logs.find().countDocuments().exec();

      const limit = +limitQ === -1 ? totalDocuments : +query.limit || 20;
      const keyword = query && query.keyword ? query.keyword : '';
      const page = query && query.page ? +query.page : 1;
      const skip = limit * (page - 1);

      const sort: any =
        query && query.sort ? { ...(query.sort as any) } : { createdAt: -1 };

      const aggregation: Array<any> = [
        email
          ? {
              $match: {
                email: email,
              },
            }
          : {},
        {
          $match: {
            $or: [
              {
                ip: {
                  $regex: keyword,
                  $options: 'i',
                },
              },
            ],
          },
        },
        {
          $sort: sort,
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ];
      const search = aggregation.filter(
        (value) => Object.keys(value).length !== 0,
      );
      // Count all documents
      const counts = await this.logs
        .aggregate([...search.slice(0, -2), { $count: 'count' }])
        .exec();

      // get all the auth logs
      const logs: AuthLog[] = await this.logs.aggregate(search).exec();

      const total = counts.length > 0 ? counts[0].count : 0;

      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedData = {
        page,
        limit,
        total,
        data: logs,
        pages,
      };
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Auth Logs loaded from database successfully!',
        data: response,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an issue loading Auth Logs from database',
        data: error,
      });
    }
  }
}
