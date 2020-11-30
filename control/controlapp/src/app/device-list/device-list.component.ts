/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */


import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { devices } from '../configuration/devices';
import { timer, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from '../service/api.service';

import { DeviceList } from '../device/devicelist'
import { DeviceTree } from '../device/devicetree'
import { DeviceInfo } from '../device/deviceinfo'
import { IDevice, IPayload } from '../device/interfaces'

@Component({
    selector: 'app-device-list',
    templateUrl: './device-list.component.html',
    styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent {
    title = 'yaha Smart Home'
    deviceList = new DeviceList()
    topicFilter: string
    subscription: Subscription = new Subscription()
    _pendingRequest: boolean = false
        
    constructor(private route: ActivatedRoute, private deviceApi: ApiService,  private deviceStorage: DeviceTree) {

    }

    /**
     * Regularly polls for update for all devices
     * @param delayBetweenPollsInMilliseconds timespan between polls in milliseconds
     */
    _pollForAllDevicesWithoutHistory(delayBetweenPollsInMilliseconds: number) {
        const pollForUpdate = timer(0, delayBetweenPollsInMilliseconds)
        this.subscription.add(pollForUpdate.subscribe(() => {
            if (!this._pendingRequest) {
                this.subscription.add(this.readTree())
            }
        }))
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.topicFilter = params.get('topicFilter');
            if (this.topicFilter === null) {
                this.topicFilter = ''
            }
            this.topicFilter = this.topicFilter.split('|').join('/')
            if (!this.deviceStorage.isEmpty()) {
                this.updateDevices()
            }
        });
        this._pollForAllDevicesWithoutHistory(2*1000)
    }

    /**
     * Gets an array of devices currently shown on the page
     * @returns array of devices
     */
    _getVisibleDevices() : IPayload {
        const nodes : IPayload = []
        for (const device of this.deviceList.devices) {
            const { _topic, value } = device
            nodes.push({ topic: _topic, value })
        }
        return nodes
    }

    /**
     * Handles a click on a device
     * @param device device object clicked
     */
    onClick (device: DeviceInfo): void {
        if (device.actions === undefined && device.actions.length <= 2) {
            return
        }
        const value = device.value === device.actions[0] ? device.actions[1] : device.actions[0]
        this.subscription.add(this.deviceApi.publish(device.topic, value).subscribe(resp => {
            const pollForUpdate = timer(500, 500).pipe(take(4))
            this.subscription.add(pollForUpdate.subscribe(() => {
                if (!this._pendingRequest) {
                    this.subscription.add(this.updateDeviceFromApi(device.topic, false, false))
                }
            }))
        }))
    }

     /**
     * Read data from the server based on a topic
     * @param deviceTopic topic to fetch data for
     * @param reason true, if reason information will be added
     * @param history true, to add the history
     */
    updateDeviceFromApi(deviceTopic: string, history: boolean, reason: boolean): Subscription {
        const topic = deviceTopic.split('|').join('/')
        const httpRequestObservable = this.deviceApi.getDevices(topic, [], history, reason, 1)
        this._pendingRequest = true
        return httpRequestObservable.subscribe(resp => {
                const payload = resp.body.payload
                this.deviceStorage.replaceManyNodes(payload)
                const nodes = this.deviceStorage.getAllMatchingNodes(topic)
                if (nodes[0] !== undefined) {
                    this.deviceList.updateDevice(deviceTopic, nodes[0])   
                }
                this._pendingRequest = false
            })
    }

    /**
     * Selects the properties to filter shown devices
     */
    selectFilterProperties(): string[] {
        let result: string[]
        const topicFilter = this.topicFilter.split('|').join('/')
        const topicFilterLength = topicFilter === '' ? 0 : topicFilter.split('/').length
        switch (topicFilterLength) {
            case 0: result = ['favorit']; break;
            case 1: result = ['favorit', 'security', 'level1']; break;
            case 2: result = ['favorit', 'control', 'security', 'level2']; break;
            case 3: result = ['favorit', 'level1', 'level2', 'control', 'security', 'measured']; break;
            default: result = undefined
        }
        return result
    }

    /**
     * Update the devices by applying a filter
     */
    updateDevices() {
        const filterProperties = this.selectFilterProperties()
        const nodes = this.deviceStorage.filterNodes(this.topicFilter, filterProperties)
        const devices = new DeviceList()
        for (const node of nodes) {
            devices.replaceDevice(node.topic, node)
        }
        this.deviceList = devices
    }

    /**
     * reads a full tree of all device information from a rest API and populates the UI from the result
     * @param fullReload true, if the full tree should be aquired
     * @returns the subscription element for the http request reading the device tree
     */
    readTree (fullReload: boolean = false): Subscription {
        this._pendingRequest = true
        const nodes = fullReload ? [] : this._getVisibleDevices()
        const topicFilter = this.topicFilter.split('|').join('/')
        const httpRequestObservable = this.deviceApi.getDevices(topicFilter, nodes, false, false, 7)
        return httpRequestObservable.subscribe(resp => {
            const payload = resp.body.payload
            this.deviceStorage.replaceManyNodes(payload)
            for (const device of devices) {
                this.deviceStorage.updateManyNodes(device)
            }
            this.updateDevices()
            this._pendingRequest = false
        })
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }

}
