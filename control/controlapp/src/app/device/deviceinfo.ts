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
import { IDevice, IReason, IHistory } from './interfaces';


/**
  * An instance of this class represents the information of a single device including device status data
  * and device setting
  */
 @Injectable({
    providedIn: 'root',
})
export class DeviceInfo implements IDevice {
    name: string
    topic: string
    value: string
    reason: IReason[]
    history: IHistory[]
    actions: string[]
    properties: string[]
    pictures: any

    constructor() {
    }

    /**
     * Checks, if the device supports setting values read from an input field
     */
    supportsSetValue(): boolean {
        return this.actions === undefined && !this.properties.includes('measured')
    }

    /**
     * Updates a device, changing some of its attributes
     * @param node node having device attributes
     */
    update(node: IDevice = undefined) {
        if (node !== undefined)  {
            const topicChunks = node.topic !== undefined ? node.topic.split('/') : []
            for (const property of ['time', 'name', 'value', 'reason', 'history', 'actions', 'properties', 'pictures']) {
                this[property] = node[property]
            }
            this.topic = topicChunks.join('|')
            if (this.actions !== undefined && this.actions.includes('on')) {
                const isOn = (this.value === 'on' || this.value === 'true' || Number(this.value) > 0)
                this.value = isOn ? 'on' : 'off'
            } 
            if (this.name !== undefined) {
                for (let i = 1; i <= 5; i++) {
                    this.name = this.name.replace('[' + i + ']', topicChunks[i - 1])
                }
            } else {
                this.name = topicChunks.pop()
            }
            if (!Array.isArray(this.reason)) {
                this.reason = []
            }
            if (!Array.isArray(this.properties)) {
                this.properties = []
            }
        }
    }
}
