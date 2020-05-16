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
 export class MenuEntry {
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
    submenuList: { [key:string]: IPredefinedEntry[] }
 }

 /**
  * Creates a menu. A menu is a list (array) of menu entries with display name and link
  * @param baseTopic topic (root-link) to create the menu
  * @param deviceTree tree of available devices
  * @param predefinedMenu predefined menue structure
  */
 export class Menu {
    menu: MenuEntry[] = []
    topicChunks: string[]
    constructor(baseTopic: string, deviceTree: DeviceTree, predefinedMenu: IPredefinedMenu) {
        this.topicChunks = baseTopic.split('|')
        while (this.topicChunks[0] === '') {
            this.topicChunks.shift()
        }
        this.topicChunks = this.reduceTopicUntilPopulatedNodeFound(deviceTree)
        this.createMenu(deviceTree, predefinedMenu)
    }

    /**
     * List of menu entries
     * @typedef
     */
    get menueEntries ():MenuEntry[] { return this.menu }

    /**
     * link to the base
     */
    get baseTopic (): string { return this.topicChunks.join('|')}

    /**
     * Adds an entry to the menu
     * @param name display name of the menu entry
     * @param entryChunks elements of the topic the menu entry links to
     */
    private addEntry(name, entryChunks) {
        const link = entryChunks.join('|')
        this.menu.push(new MenuEntry(name, link))
    }

    /**
     * Adds a link to the parent directory, if this is not the root directory
     */
    private addBackLink() {
        const back = [...this.topicChunks]
        if (back[0] !== '' && back.length >= 1) {
            back.pop()
            const name = '<'
            this.addEntry( name, back )
        }
    }

    /**
     * Adds a link to the current page
     */
    private addCurrentLink() {
        const current = [...this.topicChunks]
        if (current[0] !== '' && current.length > 0) {
            const name = current[current.length - 1]
            this.addEntry(name, current)
        }
    }

    /**
     * Reduces a link by removing the later secions until the device tree finds a matching node
     * @param deviceTree tree of available devices
     * @returns reduces list of topic chunks
     */
    private reduceTopicUntilPopulatedNodeFound(deviceTree: DeviceTree): string[] {
        const current: string[] = [...this.topicChunks]
        let reducedTopic: string = current.join('|')
        while (!deviceTree.getNodeByTopic(reducedTopic) && reducedTopic !== "") {
            current.pop()
            reducedTopic = current.join('|')
        }
        return current
    }

    /**
     * Gets a menu taken form the storage tree
     * @param deviceTree tree of available devices
     */
    private addMenuEntriesFromDeviceTree(deviceTree: DeviceTree) {
        const currentTopic: string = this.topicChunks.join('|')
        const menu = deviceTree.getTopicMenu(currentTopic)
        for (const entry of menu) {
            const name = entry.name
            this.addEntry(name, [...this.topicChunks, name])
        }
    }

    /**
     * Adds menu entries from a predefined menue template
     * @param menuTemplate template to use for the menu
     */
    private addMenuEntriesFromMenuTemplate(menuTemplate:IPredefinedEntry[]) {
        for (const menuEntry of menuTemplate) {
            const { name, link } = menuEntry
            if (link !== undefined) {
                const linkChunks: string[] = link.split('/')
                this.addEntry(name, [...this.topicChunks, ...linkChunks])
            } else {
                this.addEntry(name, [...this.topicChunks, name])
            }
        }
    }

    /**
     * Creates the menu for the current topic
     * @param deviceTree tree of available devices
     * @param predefinedMenu predefined menue structure
     */
    private createMenu(deviceTree: DeviceTree, predefinedMenu: IPredefinedMenu) {
        const baseTopic: string = this.topicChunks.join('/')
        this.addBackLink()
        this.addCurrentLink()

        let menuTemplate:IPredefinedEntry[] = predefinedMenu[baseTopic]
        if (menuTemplate === undefined) {
            this.addMenuEntriesFromDeviceTree(deviceTree)
        } else {
            this.addMenuEntriesFromMenuTemplate(menuTemplate)
        }
    }

}