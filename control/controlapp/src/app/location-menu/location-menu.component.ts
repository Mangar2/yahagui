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
import { ActivatedRoute } from '@angular/router';

import { menu as predefinedMenu } from './location-menu.structure.js';
import { DeviceTree } from '../device/devicetree'
import { Menu } from '../menu/menu'


@Component({
    selector: 'app-location-menu',
    templateUrl: './location-menu.component.html',
    styleUrls: ['./location-menu.component.css']
})
export class LocationMenuComponent implements OnInit {
    menu
    activeTopic: string = ''

    constructor(private route: ActivatedRoute, private deviceTree: DeviceTree) { 
    }

    /**
     * Creates the menu for the current topic
     * @param topic base topic for the menu
     */
    createMenu(topic: string) {
        this.menu = new Menu(topic, this.deviceTree, predefinedMenu)
    }
    
    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.activeTopic = params.get('topicFilter');
            if (!this.activeTopic) {
                this.activeTopic = ""
            }
            this.createMenu(this.activeTopic)
        })
    }

}