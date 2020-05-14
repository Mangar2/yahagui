/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */

import { IDevice } from './interfaces';
import { DeviceInfo } from './deviceinfo'

/**
 * This class provides a flat list of devices 
 */
export class DeviceList {
    _devices: DeviceInfo[] = []

    constructor() {
    }

    get devices () { return this._devices }

    /**
     * Gets a device providing the index
     * @param index of the device
     */
    public getDeviceByIndex(index: number): DeviceInfo | undefined {
        return this._devices[index]
    }

    /**
     * Searches the devices for a topic
     * @param topic unique identifier of the device
     */
    public getDeviceByTopic (topic: string): DeviceInfo | undefined {
        let result
        for(const device of this._devices) {
            if (device.topic === topic) {
                result = device
                break
            }
        }
        return result
    }


    /**
     * Updates the device
     * @param topic unique identifier of the device
     * @param data data read from server
     */
    public updateDevice(topic: string, node: IDevice) {
        const device = this.getDeviceByTopic(topic)
        device.update(node)
    }

    /**
     * Replace the device info
     * @param topic unique identifier of the device
     * @param node device information retrieved from server
     */
    replaceDevice (topic: string, node: IDevice) {
        let device = this.getDeviceByTopic(topic)
        if (device === undefined) {
            device = new DeviceInfo()
            this._devices.push(device)
        }
        device.update(node)
    }

}

