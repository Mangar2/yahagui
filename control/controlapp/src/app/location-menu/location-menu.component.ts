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

import { DeviceTree } from '../device/devicetree'
import { Menu, IPredefinedMenu } from '../menu/menu'
import { ApiService } from '../service/api.service';


@Component({
    selector: 'app-location-menu',
    templateUrl: './location-menu.component.html',
    styleUrls: ['./location-menu.component.css']
})
export class LocationMenuComponent implements OnInit {
    menu
    activeTopic: string = ''
    predefinedMenue: IPredefinedMenu

    constructor(private route: ActivatedRoute, private apiService: ApiService,  private deviceTree: DeviceTree) { 
    }

    /**
     * Creates the menu for the current topic
     * @param topic base topic for the menu
     */
    createMenu(topic: string, predefinedMenu: IPredefinedMenu) {
        this.menu = new Menu(topic, this.deviceTree, predefinedMenu)
    }
    
    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.activeTopic = params.get('topicFilter');
            if (!this.activeTopic) {
                this.activeTopic = ""
            }
            if (this.predefinedMenue !== undefined) {
                this.createMenu(this.activeTopic, this.predefinedMenue)
            } else {
                this.apiService.getMenueConfiguration().subscribe(predefinedMenu => {
                    this.predefinedMenue = predefinedMenu
                    this.createMenu(this.activeTopic, predefinedMenu)
                })
            }
        })
    }

}