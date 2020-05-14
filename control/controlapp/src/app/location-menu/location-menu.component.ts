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

import { menu } from './location-menu.structure.js';
import { DeviceTree } from '../device/devicetree'


@Component({
    selector: 'app-location-menu',
    templateUrl: './location-menu.component.html',
    styleUrls: ['./location-menu.component.css']
})
export class LocationMenuComponent implements OnInit {
    device
    menu = []
    baseLink = ''
    topicFilter
    active = ''

    constructor(private route: ActivatedRoute, private deviceStorage: DeviceTree) { 
    }

    /**
     * searches the right menu index
     * @returns index to the right menu
     */
    private getBaseLink(): string {
        let baseLinkArray = this.topicFilter.split('|')
        let menuIndex = ''
        while (menuIndex === '' && baseLinkArray.length !== 0) {
            const baseLink = baseLinkArray.join('/')
            if (menu[baseLink] !== undefined) {
                menuIndex = baseLink
            }
            baseLinkArray.pop()
        }
        return menuIndex
    }

    /**
     * Adds a link to the parent directory, if this is not the root directory
     */
    private addBackLinkToMenu() {
        const back = this.baseLink.split('/')
        if (back[0] !== '' && back.length >= 1) {
            back.pop()
            const name = '<'
            const link = back.join('|')
            this.menu.push({ name, link })
        }
    }

    /**
     * Adds a link to the current page
     */
    private addCurrentLinkToMenu() {
        const current = this.baseLink.split('/')
        if (current[0] !== '' && current.length > 0) {
            const link = current.join('|')
            const name = current[current.length - 1]
            this.menu.push({ name, link })
        }
    }

    /**
     * Gets a menu taken form the storage tree
     */
    private getMenuFromStorage() {
        let menu = this.deviceStorage.getTopicMenu(this.baseLink)
        const topicChunks = this.topicFilter.split('|')
        while (menu.length === 0 && topicChunks.length > 0) {
            topicChunks.pop()
            this.baseLink = topicChunks.join('/')
            menu = this.deviceStorage.getTopicMenu(this.baseLink)
        }
        return menu
    }

    /**
     * Creates the menu for the current link
     */
    createMenu() {
        this.baseLink = this.getBaseLink()
        this.baseLink = this.topicFilter.split('|').join('/')
        const menuTemplate = menu[this.baseLink] ? menu[this.baseLink] : this.getMenuFromStorage()
        this.menu = []
        this.addBackLinkToMenu()
        this.addCurrentLinkToMenu()
        for (let menuEntry of menuTemplate) {
            const name = menuEntry.name
            const codedLink = this.baseLink === '' ? '' : this.baseLink.split('/').join('|') + '|'
            const link = menuEntry.link !== undefined ? codedLink + menuEntry.link.split('/').join('|') : codedLink + name
            this.menu.push({ name, link })
        }
    }
    
    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.topicFilter = params.get('topicFilter');
            this.active = this.topicFilter ? this.topicFilter : ''
            if (this.topicFilter === null) {
                this.topicFilter = ''
            }
            this.createMenu()
        })
    }

}