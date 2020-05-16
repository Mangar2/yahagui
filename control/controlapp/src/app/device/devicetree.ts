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
import { IPayload, IStorageNode, IDevice } from './interfaces'

const actions = ['set', 'blink', 'temporary', 'get']

/**
 * Device storage
 */
@Injectable({
    providedIn: 'root',
})
export class DeviceTree {

    tree : IStorageNode = { childs: {} }

    /**
     * Checks, if the storage is empty
     */
    public isEmpty() {
        return this.tree === undefined || Object.keys(this.tree.childs).length === 0
    }

    /**
     * Searches for a topic in a topic tree and return all matching nodes
     * @param topicChunks topic chunk-array to find the right node, supports '%' wildchard
     * @param node current node in the StorageNode tree
     * @returns array of matching nodes (may be empty)
     */
    private getAllMatchingNodesRec(topic: string, topicChunks: string[], node: IStorageNode): IStorageNode[] {
        let result = []
        const topicChunk = topicChunks[0]
        const childChunks = [...topicChunks]
        const hasChilds = node !== undefined && Object.keys(node.childs).length !== 0
        if (topicChunk !== '#') {
            childChunks.shift()
        } 

        if (node === undefined) {
            result = []
        } else if (topicChunk === undefined) {
            node.topic = topic
            result = [node]
        } else if (!hasChilds && topicChunk === '#') {
            node.topic = topic
            result = [node]
        } else if (topicChunk === '%' || topicChunk === '#') {
            for (const childChunk in node.childs) {
                const childNode = node.childs[childChunk]
                const childTopic = topic === '' ? childChunk : topic + '/' + childChunk
                const childResult = this.getAllMatchingNodesRec(childTopic, childChunks, childNode)
                result = [...result, ...childResult]
            }
        } else if (typeof(topicChunk) === 'string') {
            const childNode = node.childs[topicChunk]
            const childTopic = topic === '' ? topicChunk : topic + '/' + topicChunk
            const childResult = this.getAllMatchingNodesRec(childTopic, childChunks, childNode)
            result = [...result, ...childResult]
        }
        return result
    }

    /**
     * Searches for a topic in a topic tree and return all matching nodes
     * @param topic topic string to find the right node, supports '%' and '#' wildchard
     * @returns nodes matching the topic or undefined if not found
     */
    public getAllMatchingNodes(topic: string): IStorageNode[] {
        const topicChunks = topic.split('/')
        if (topicChunks[0] === '') {
            topicChunks.shift()
        }
        const result =  this.getAllMatchingNodesRec('', topicChunks, this.tree)
        return result
    }

    /**
     * Gets a node by topic
     * @param topic node topic
     * @returns node found 
     */
    public getNodeByTopic(topic: string): IStorageNode {
        const topicChunks = topic.split('|')
        let node = this.tree
        for (const topicChunk of topicChunks) {
            node = node.childs[topicChunk]
            if (node === undefined) {
                break
            }
        }
        return node
    }

    /**
     * Gets a list of topic chunks of the childs
     * @param topic topic to select the child
     * @returns a list of topic chunks of the childs
     */
    public getTopicMenu(topic: string): string[]
    {
        const node = this.getNodeByTopic(topic)
        const result = []
        if (node !== undefined) {
            const childs = node.childs
            for (const child in childs) {
                if (!actions.includes(child) && !child.startsWith('unknown')) {
                    result.push({ name: child })
                }
            }
        }

        return result
    }

    /**
     * Searches recursively in the tree for nodes with the right properties
     * @param topic current topic
     * @param node node to start with
     * @param properties list of properties to select nodes (OR syntax). If empty, all nodes are selected
     * @param isRoot true, if the current node is the initial node of the search
     * @returns nodes matching the topic
     */
    private filterNodesRec(topic: string, node: IStorageNode, properties: string[], isRoot: boolean = false): IStorageNode[] {
        
        let intersect = properties === undefined || properties.length === 0 
        if (node.properties !== undefined && properties !== undefined) {
            const intersectArray = properties.filter(value => node.properties.includes(value))
            intersect = intersectArray.length > 0
        }
        const lastChunk = topic.split('/').pop()
        // 
        // 'set' commands are not relevant, they are included in status reports
        const isSetTopic = lastChunk === 'set'
        const propertyIncludesSet = Array.isArray(properties) && properties.includes('set')
        const excludeSetTopic = (isSetTopic && !propertyIncludesSet)
        const hasValue = node.value !== undefined
        // all root nodes must be included
        const includeNode = (isRoot || (intersect && !excludeSetTopic)) && hasValue

        node.topic = topic
        let result = includeNode ? [node] : []
        
        for (const childChunk in node.childs) {
            const childNode = node.childs[childChunk]
            const childTopic = topic === "" ? childChunk : topic + '/' + childChunk
            const childResult = this.filterNodesRec(childTopic, childNode, properties)
            result = [...result, ...childResult]
        }
        return result
    }

    /**
     * Searches for a topic in a topic tree and return all matching nodes
     * @param topic topic string to find the right node, supports '%' and '#' wildchard
     * @param properties list of properties to select nodes (OR syntax). If empty, all nodes are selected
     * @returns nodes matching the topic or undefined if not found
     */
    public filterNodes(baseTopic: string, properties: string[]) {
        const startNode = this.getAllMatchingNodes(baseTopic)[0]
        let result = []
        if (startNode !== undefined) {
            result = this.filterNodesRec(baseTopic, startNode, properties, true)
        }
        return result
    }

    /**
     * Adds a node to the tree, if it does not exists
     * @param topic topic of the node
     */
    private addSingleNodeIfNotExists(topic: string): IStorageNode {
       let node: IStorageNode = this.tree
       const topicChunks: string[] = topic.split('/')
       if (topicChunks[0] === '') {
           topicChunks.shift()
       }
       for (const topicChunk of topicChunks) {
           if (node.childs[topicChunk] === undefined) {
               node.childs[topicChunk] = { childs: {} }
           } 
           node = node.childs[topicChunk]
       }
       return node
    }

    /**
     * Updates a node-tree node
     * @param node node in tree to update
     * @param device new values
     */
    private updateSingleNode(node: IStorageNode, device: IDevice) {
        for (const property of ['name', 'value', 'reason', 'history', 'actions', 'properties', 'pictures']) {
            if (device[property] !== undefined) {
                node[property] = device[property]
            }
        }
        // Force a standard for formatting "on" and "off" for better control later
        if (node.actions !== undefined && node.actions.includes('on')) {
            const isOn = (node.value === 'on' || node.value === 'true' || Number(node.value) > 0)
            node.value = isOn ? 'on' : 'off'
        } 
        // Put at least time infos to the reason of history entries
        if (Array.isArray(node.history)) {
            for (const entry of node.history) {
                if (entry.reason === undefined) {
                    const timestamp = (new Date(entry.time)).toISOString()
                    const message = 'updated'
                    entry.reason = [{ timestamp, message }]
                }
            }
        }
    }
    
    /**
     * Updates one or more nodes identified by a device.topic
     * @param device new values for update including the "topic" to identify the nodes
     * The topic supports the wildchard '%' matching any topic chunk and '#' matching the rest
     */
    public updateManyNodes(device: IDevice) {
        const topic = device.topic.split('|').join('/')
        if (device.topic !== undefined) {
            const nodes = this.getAllMatchingNodes(topic) 
            for (let node of nodes) {
                this.updateSingleNode(node, device)
            }
        }
    }

    /**
     * Replaces (updates or inserts) a node in the tree
     * @param device device containing update information
     */
    private replaceSingleNode(device: IDevice) {
        const topic = device.topic.split('|').join('/')
        if (device.topic !== undefined) {
            let node = this.addSingleNodeIfNotExists(topic)
            this.updateSingleNode(node, device)
        }
    }
    
    /**
     * Replaces many nodes by data read from server
     * @param payload data read from server
     */
    public replaceManyNodes(payload: IPayload) {
        if (payload) {
            for (let topic in payload) {
                if (typeof(topic) === 'string' && topic !== '') {
                    let info = payload[topic]
                    this.replaceSingleNode(info);
                }
            }
        }
    }
}

