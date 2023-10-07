export class GetDto {
  url: string;
  config?: getConfigDto;
}

class getConfigDto {
  headers?: any;

  params?: any;

  data?: any;
}
