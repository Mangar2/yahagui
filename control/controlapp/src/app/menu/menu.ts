/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */

import { DeviceTree } from '../device/devicetree'

 /**
  * Create an entry of a menu
  * @param name display name of the menu entry
  * @param link link to the element
  */
 class MenuEntry {
     _name: string
     _link: string
     constructor(name, link) {
        this._name = name
        this._link = link
     }

     get name () { return this._name }
     get link () { return this._link }
 }

 /**
  * Entry of a predefined menu description
  */
 interface IPredefinedEntry {
     name: string
     link: string
 }

 /**
  * Structure of a predefined menu
  */
 interface IPredefinedMenu {

 }

 /**
  * Creates a menu. A menu is a list (array) of menu entries with display name and link
  * @param baseTopic topic (root-link) to create the menu
  * @param deviceTree tree of available devices
  * @param predefinedMenu predefined menue structure
  */
 export class Menu {
    menu: MenuEntry[] = []
    constructor(baseTopic: string, deviceTree: DeviceTree, predefinedMenu: Object) {
        let topicChunks: string[] = baseTopic.split('|')
        topicChunks = this.reduceTopicUntilPopulatedNodeFound(topicChunks, deviceTree)
    }

    /**
     * Adds an entry to the menu
     * @param name display name of the menu entry
     * @param topicChunks elements of the topic the menu entry links to
     */
    private addEntry(name, topicChunks) {
        const link = topicChunks.join('|')
        this.menu.push(new MenuEntry(name, link))
    }

    /**
     * Adds a link to the parent directory, if this is not the root directory
     * @param topicChunks menu topic separated in chunks
     */
    private addBackLink(topicChunks: string[]) {
        const back = [...topicChunks]
        if (back[0] !== '' && back.length >= 1) {
            back.pop()
            const name = '<'
            this.addEntry( name, back )
        }
    }

    /**
     * Adds a link to the current page
     * @param topicChunks menu topic separated in chunks
     */
    private addCurrentLink(topicChunks: string[]) {
        const current = [...topicChunks]
        if (current[0] !== '' && current.length > 0) {
            const name = current[current.length - 1]
            this.addEntry(name, current)
        }
    }

    /**
     * Reduces a link by removing the later secions until the device tree finds a matching node
     * @param topicChunks menu topic separated in chunks
     * @param deviceTree tree of available devices
     * @returns reduces list of topic chunks
     */
    private reduceTopicUntilPopulatedNodeFound(topicChunks: string[], deviceTree: DeviceTree): string[] {
        const current: string[] = [...topicChunks]
        let reducedTopic: string = current.join('|')
        while (!deviceTree.getNodeByTopic(reducedTopic) && reducedTopic !== "") {
            current.pop()
            reducedTopic = current.join('|')
        }
        return current
    }

    /**
     * Gets a menu taken form the storage tree
     * @param topicChunks menu topic separated in chunks
     * @param deviceTree tree of available devices
     * @returns list of menu topics
     */
    private createMenuFromDeviceTree(topicChunks: string[], deviceTree: DeviceTree): string[] {
        const topic = topicChunks.join('|')
        const menu = deviceTree.getTopicMenu(topic)
        return menu
    }

    /**
     * Creates the menu for the current topic
     * @param topicChunks menu topic separated in chunks
     */
    createMenu(topicChunks: string[]) {
        this.baseTopic = topicChunks.join['|']
        let menuTemplate = predefinedMenu[this.baseTopic]
        if (menuTemplate === undefined) {
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
}