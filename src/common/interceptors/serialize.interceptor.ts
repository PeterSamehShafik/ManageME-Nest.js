import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';


export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // console.log('before req handled', context);

    return next.handle().pipe(
      map((data: any) => {
        // console.log('before sent res back', data);
        const response= plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
        if(data?._id){
          response['_id'] = data['_id']
        }

        return response
      }),
    );
  }
}



interface ClassConstructor {
    new (...args: any[]): {};
  }
  