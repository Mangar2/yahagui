/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */

import { Component, OnInit } from '@angular/core';
import { DeviceSubject } from '../device/devicesubject';

@Component({
    selector: 'app-device-history',
    templateUrl: './device-history.component.html',
    styleUrls: ['./device-history.component.css']
})

export class DeviceHistoryComponent implements OnInit {
    deviceTopic: string

    /**
     * Creates a device history component showing history information
     * @param device NEEDED and used in device-history.component.html
     */
    constructor(public deviceSubject: DeviceSubject) {

    }
  
    ngOnInit() {
    }

}
