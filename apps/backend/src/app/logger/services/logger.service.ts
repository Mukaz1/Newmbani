import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import {
  DatabaseModelEnums,
  ExpressQuery,
  HttpResponseInterface,
  HttpStatusCodeEnum,
  Log,
  PaginatedData,
  SystemEventsEnum,
  User,
} from '@newmbani/types';
import { CreateLogDto, PostLogDto } from '../dto/log.dto';
import { CustomHttpResponse } from '../../common';
import { RequestLogHelper } from '../../common/utils/req-log.util';

@Injectable()
export class LoggerService extends Logger implements Logger {
  /**
   * Constructor
   * @param logs - The AuthLog model.
   * @param user - The User model.
   */
  constructor(
    @Inject(DatabaseModelEnums.LOG)
    private logs: Model<Log>,
    @Inject(DatabaseModelEnums.USER)
    private user: Model<User>,
  ) {
    super();
  }

  /**
   * Create a new  log
   * @param log the  log data
   * @returns {Promise<void>}
   */
  @OnEvent(SystemEventsEnum.CreateLogEntry, { async: true })
  async create(log: CreateLogDto) {
    const { email, originalReq, userId, method, url } = log;
    const { ip, userAgent } = RequestLogHelper(originalReq);

    // save the log
    const newLog: PostLogDto = {
      method,
      ip,
      userId,
      email,
      userAgent,
      url,
    };

    await this.logs.create(newLog);
  }

  /**
   * Get all logs
   * @param query - The query parameters.
   * @returns {Promise<HttpResponseInterface>} - The response.
   */
  async getAllLogs(query?: ExpressQuery): Promise<HttpResponseInterface> {
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
      const logs: Log[] = await this.logs.aggregate(search).exec();

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
        message: 'Logs loaded from database successfully!',
        data: response,
      });
    } catch (error) {
      return new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message: 'There was an issue loading Logs from database',
        data: error,
      });
    }
  }

  override debug(context: string, message: string) {
    if (process.env['NODE_ENV'] !== 'production') {
      super.debug(`[DEBUG] ${message}`, context);
    }
  }

  override log(context: string, message: string) {
    super.log(`[INFO] ${message}`, context);
  }

  override error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context);
  }

  override warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context);
  }

  override verbose(context: string, message: string) {
    if (process.env['NODE_ENV'] !== 'production') {
      super.verbose(`[VERBOSE] ${message}`, context);
    }
  }
}
