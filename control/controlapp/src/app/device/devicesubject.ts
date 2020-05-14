/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */


import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IDevice } from './interfaces';
import { DeviceInfo } from './deviceinfo'


/**
  * rxjs subject providing the ability to subscribe on changes of a device
  */
 @Injectable({
    providedIn: 'root',
})
export class DeviceSubject extends Subject<DeviceInfo> {
    device: DeviceInfo = new DeviceInfo()

    /**
     * Updates a device, changing some of its attributes. The subjects supports subscribing for these changes
     * @param node node having device attributes
     */
    update(node: IDevice) {
        this.device.update(node)
        this.next(this.device)
    }

}


