/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */


import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timer, Subscription } from 'rxjs';

import { DeviceSubject } from '../device/devicesubject';
import { DeviceInfo } from '../device/deviceinfo';
import { DeviceTree } from '../device/devicetree'

import { ApiService } from '../service/api.service';
import { devices } from '../configuration/devices';

const REFRESH_RATE_IN_MILLISECONDS = 2 * 1000

@Component({
    selector: 'app-device-details',
    templateUrl: './device-details.component.html',
    styleUrls: ['./device-details.component.css']
})
export class DeviceDetailsComponent implements OnInit {
    _deviceTopic: string = ''
    _device: DeviceInfo
    _subscriptionCollect: Subscription = new Subscription()
    supportsSetValue: boolean
    _pendingRequest: boolean = false
    detailForm = new FormGroup({
        value: new FormControl('')
    })

    /**
     * Data structure describing the currently shown device
     * @property {Object}
     */
    get device (): DeviceInfo { return this._device }
    set device (device) { this._device = device }

    /**
     * 
     * @param route Route to the current page
     * @param deviceApi Service to publish or fetch data from the service
     * @param deviceStorage Storage for devices
     * @param deviceSubject Registration class to register all devices interested in device data
     */
    constructor(private route: ActivatedRoute, private deviceApi: ApiService, private deviceStorage: DeviceTree, public deviceSubject: DeviceSubject) { 
    }

    /**
     * Actualizes the device information 
     * @param payload data received from api
     */
    updateDevice() {
        const nodes = this.deviceStorage.getAllMatchingNodes(this._deviceTopic)
        const node = nodes[0]
        if (node !== undefined) {
            this.deviceSubject.update(node)
            this.supportsSetValue = this.deviceSubject.device.supportsSetValue()
        }
    }

    /**
     * Read data from the server based on a topic
     * @param addHistory true, to add the history
     * @param addReason true, if reason information will be added
     * @returns The subscription element for the http call.
     */
    updateStorageFromApi(addHistory: boolean, addReason: boolean) : Subscription {
        this._pendingRequest = true
        const nodes = []
        if (this.device) {
            const { _topic, value, reason } = this.device
            nodes.push({ topic: _topic, value, reason })
        }
        return this.deviceApi.getDevices(this._deviceTopic, nodes, addHistory, addReason).
            subscribe(resp => {
                const payload = resp.body.payload
                this.deviceStorage.replaceManyNodes(payload)
                for (const configuration of devices) {
                    this.deviceStorage.updateManyNodes(configuration)
                }
                this.updateDevice()
                this._pendingRequest = false
            })
    }

    /**
     * Publishes a new value to a device on button click
     * @param value new value to publish
     */
    onClick (value): void {
        this.deviceApi.publish(this.deviceSubject.device.topic, value).subscribe(resp => {
        })
    }

    /**
     * Called when updating a manually changed value
     */
    onUpdate(): void {
        const valueControl = this.detailForm.get('value')
        if (valueControl.touched) {
            this.deviceApi.publish(this.deviceSubject.device.topic, valueControl.value).subscribe(resp => {
            })
        }
    }

    /**
     * Continuously polls for update from the server
     * @param updateTimeInMilliseconds time between two updates
     */
    _pollDeviceDetailDataFromServer(updateTimeInMilliseconds: number): void {
        const pollForUpdate = timer(0, updateTimeInMilliseconds)
        this._subscriptionCollect.add(pollForUpdate.subscribe(() => {
            if (!this._pendingRequest) {
                this._subscriptionCollect.add(this.updateStorageFromApi(true, true))
            }
        }))
    }

    /**
     * Subscribe to the device subject to receive device data changes
     */
    _subscribeToReceiveDeviceDataChanges(): void {
        this._subscriptionCollect.add(this.deviceSubject.subscribe((device) => {
            this.device = device
        }))
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this._deviceTopic = params.get('topicFilter')
            if (this._deviceTopic) {
                this._deviceTopic = this._deviceTopic.split('|').join('/')
            }
            this.updateDevice()
        });
        this._subscribeToReceiveDeviceDataChanges()
        this._pollDeviceDetailDataFromServer(REFRESH_RATE_IN_MILLISECONDS)
    }

    /**
     * Unsubscribe from all observables
     */
    ngOnDestroy() {
        this._subscriptionCollect.unsubscribe()
    }

}