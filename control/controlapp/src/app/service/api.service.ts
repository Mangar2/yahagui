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
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { IPayload } from '../device/interfaces'
import { IPredefinedMenu } from '../menu/menu'

/**
 * Result structure of a publish command
 */
interface PublishResult {    
    result: string;
}

/**
 * Data structure to transport information about devices
 */
interface DeviceInfo {
    topics: string[];
    payload: IPayload;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    pending = {}
    constructor(private http: HttpClient) { 
        console.log("api created") 
    }

    /**
     * Gets device infos from the server
     * @param topic topic string to identify the device, leave empty to get all devices
     * @param history true, if history data will be added
     * @param reason true, if reason information will be added
     * @param levelAmount amount of data level to retrieve
     */
    getDevices(topic: string, history: boolean, reason: boolean = true, levelAmount: number = 1): Observable<HttpResponse<DeviceInfo>> {
        // The app uses '|' instead of '/' to get around angular routing, the interface needs '/'
        topic = topic.split('|').join('/')
        const data = {
            topic,
            history: history ? "true" : "false",
            reason: reason ? "true" : "false",
            levelAmount
        }
        const observable: Observable<HttpResponse<DeviceInfo>>  = 
            this.http.post<DeviceInfo>("angular/api/sensor.php", data, { observe: 'response' });
        return observable
    }

    /**
     * Reads a menu configuration from the server
     */
    getMenueConfiguration(): Observable<IPredefinedMenu> {
        const location = "assets/configuration/menu.json"
        const observable: Observable<IPredefinedMenu> = this.http.get<IPredefinedMenu>(location);
        return observable
    }

    /**
     * publish data to the sensor interface
     * @param topic topic to look for
     * @param value value to set
     */
    publish (topic: string, value: string ): Observable<HttpResponse<PublishResult>> {
        // The app uses '|' instead of '/' to get around angular routing, the interface needs '/'
        topic = topic.split('|').join('/')
        const data = {
            topic: topic + '/set',
            value: value,
            timestamp: (new Date()).toISOString()
        }
        return this.http.post<PublishResult>("angular/api/publish.php", data, { observe: 'response' });
    }

}
