import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { PostDto } from '../../domain/dto/post.dto';
import { GetDto } from '../../domain/dto/get.dto';
import { RetryDto } from '../../domain/dto/retry.dto';
import { setAsyncTimeout } from '../../../../shared/utils/set-timeout';
import { EAxiosCustomErrors } from '../../domain/enum/axios-custom-errors';

@Injectable()
export class AxiosCustomService {
  constructor(private readonly httpService: HttpService) {}

  async post(postDto: PostDto): Promise<AxiosResponse> {
    const { url, data, config } = postDto;
    return firstValueFrom(this.httpService.post(url, data, config));
  }

  async get(getDto: GetDto): Promise<AxiosResponse> {
    const { url, config } = getDto;
    return firstValueFrom(this.httpService.get(url, config));
  }

  async put(postDto: PostDto): Promise<AxiosResponse> {
    const { url, data, config } = postDto;
    return firstValueFrom(this.httpService.put(url, data, config));
  }

  async postWithRetries(
    postDto: PostDto,
    retryDto: RetryDto,
  ): Promise<AxiosResponse> {
    const { url, data, config } = postDto;
    const { maxRetries, statusCodeRetry, retryCount, delayRetryInMs } =
      retryDto;

    const result = await firstValueFrom(
      this.httpService.post(url, data, config),
    ).catch(async (error) => {
      if (
        statusCodeRetry.includes(error.response.status) &&
        retryCount < maxRetries
      ) {
        await setAsyncTimeout(delayRetryInMs);
        return await this.postWithRetries(postDto, {
          ...retryDto,
          retryCount: retryCount + 1,
        });
      } else {
        throw new InternalServerErrorException(
          `${EAxiosCustomErrors.RETRIES_EXCEEDED} - Error: ${error.response.data.message}`,
        );
      }
    });
    return result;
  }
}
