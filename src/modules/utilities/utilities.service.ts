import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilitiesService {
  paginate(page: number, size: number) {
    if (!page || page <= 0) {
      page = 1;
    }
    if (!size || size <= 0) {
      size = 20;
    }
    const skip = (page - 1) * size;
    return { limit: size, skip };
  }
}
