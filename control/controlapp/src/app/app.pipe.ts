import { Pipe, PipeTransform } from '@angular/core';

import { IDevice } from './device/interfaces'

@Pipe({
  name: 'location'
})
export class LocationPipe implements PipeTransform {

  transform(devices: IDevice[], filter: string): any {
        console.log(devices)
        return devices.filter(device => {
            const result = device.topic.startsWith(filter)
            return result
        });
  }

}