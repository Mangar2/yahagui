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


@Component({
    selector: 'app-location-menu',
    templateUrl: './location-menu.component.html',
    styleUrls: ['./location-menu.component.css']
})
export class LocationMenuComponent implements OnInit {
    menu = []
    baseTopic: string = ''
    activeTopic: string = ''

    constructor(private route: ActivatedRoute, private deviceTree: DeviceTree) { 
    }

    /**
     * Adds a link to the parent directory, if this is not the root directory
     */
    private addBackLinkToMenu() {
        const back = this.baseTopic.split('|')
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
        const current = this.baseTopic.split('|')
        if (current[0] !== '' && current.length > 0) {
            const link = current.join('|')
            const name = current[current.length - 1]
            this.menu.push({ name, link })
        }
    }

    /**
     * Reduces a link by removing the later secions until the device tree finds a matching node
     * @param topic current topic
     * @returns topic 
     */
    private reduceTopicUntilPopulatedNodeFound(topic: string): string {
        const topicChunks = topic.split('|')
        let reducedTopic = topic
        while (!this.deviceTree.getNodeByTopic(reducedTopic) && reducedTopic !== "") {
            topicChunks.pop()
            reducedTopic = topicChunks.join('|')
        }
        return reducedTopic
    }

    /**
     * Gets a menu taken form the storage tree
     */
    private createMenuFromDeviceTree(topic: string): string[] {
        const menu = this.deviceTree.getTopicMenu(topic)
        return menu
    }

    /**
     * Creates the menu for the current topic
     * @param topic base topic for the menu
     */
    createMenu(topic: string) {
        this.baseTopic = topic
        let menuTemplate = predefinedMenu[this.baseTopic]
        if (menuTemplate === undefined) {
            this.baseTopic = this.reduceTopicUntilPopulatedNodeFound(this.baseTopic)
            menuTemplate = this.createMenuFromDeviceTree(this.baseTopic)
        }
        this.menu = []
        this.addBackLinkToMenu()
        this.addCurrentLinkToMenu()
        for (let menuEntry of menuTemplate) {
            const name = menuEntry.name
            const codedLink = this.baseTopic === '' ? '' : this.baseTopic + '|'
            const link = menuEntry.link !== undefined ? codedLink + menuEntry.link.split('/').join('|') : codedLink + name
            this.menu.push({ name, link })
        }
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