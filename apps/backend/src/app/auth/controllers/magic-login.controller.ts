import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { MagicLoginDto } from '../dto/auth/magic-login.dto';
import { MagicLoginGuard } from '../guards/magic-login.guard';
import { MagicLoginStrategy } from '../strategies/magic-login.strategy';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  User,
} from '@newmbani/types';
import { GenericResponse } from '../../common/decorators/generic-response.decorator';
import { CustomHttpResponse } from '../../common';

@ApiTags('Authentication')
@Controller('auth/magic-login')
export class MagicLoginController {
  /**
   * Creates an instance of MagicLoginController.
   * @param {AuthService} authService
   * @param {MagicLoginStrategy} strategy
   * @memberof MagicLoginController
   */
  constructor(
    private readonly authService: AuthService,
    private readonly strategy: MagicLoginStrategy,
  ) {}

  /**
   * Request for a Magic Login Link
   *
   * @param {*} req
   * @param {*} res
   * @param _res
   * @param {MagicLoginDto} body
   * @return {*}  {Promise<HttpResponseInterface>}
   * @memberof MagicLoginController
   */
  @Post()
  async magicLogin(
    @Req() req: any,
    @Res() res: any,
    @GenericResponse() _res: GenericResponse,
    @Body(new ValidationPipe()) body: MagicLoginDto,
  ): Promise<HttpResponseInterface> {
    const user: User = await this.authService.verifyUser(body.destination);
    let finalRes: HttpResponseInterface;
    if (!user.magicLogin) {
      finalRes = new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.BAD_REQUEST,
        message:
          'Magic login disabled for this email address. Contact the admin to enable it or check your app security settings-wrapper',
        data: null,
      });
    } else {
      this.strategy.send(req, res);
      finalRes = new CustomHttpResponse({
        statusCode: HttpStatusCodeEnum.OK,
        message: 'Email has been sent with login link',
        data: null,
      });
    }

    // set status code
    _res.setStatus(finalRes.statusCode);

    // return response
    return finalRes;
  }

  /**
   * Validate the Magic Login Link and sign a JWT Token for the user
   *
   * @param {*} req
   * @return {*}
   * @memberof MagicLoginController
   */
  @Get('callback')
  @UseGuards(MagicLoginGuard)
  async callback(@Req() req: any): Promise<HttpResponseInterface> {
    return await this.authService.authenticate({
      req: req.user,
      originalReq: req,
    });
  }
}
