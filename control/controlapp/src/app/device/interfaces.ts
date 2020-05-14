/**
 * @license
 * This software is licensed under the GNU LESSER GENERAL PUBLIC LICENSE Version 3. It is furnished
 * "as is", without any support, and with no warranty, express or implied, as to its usefulness for
 * any purpose.
 *
 * @author Volker Böhm
 * @copyright Copyright (c) 2020 Volker Böhm
 */

export interface IReason {
    timestamp: string;
    message: string;
}

export interface IMessage {
    topic?: string;
    value: string | number;
    reason?: IReason[];
}

export interface IHistory {
    time?: string;
    value?: string;
    reason?: IReason[]
}

export interface IDevice {
    name?: string
    time?: string
    topic?: string
    value?: string
    reason?: IReason[]
    history?: IHistory[]
    actions?: string[]
    properties?: string[]
    pictures?: any
}
 
/**
 * Node of the device tree
 */
export interface IStorageNode extends IDevice {
     childs: { [key:string]: IStorageNode }
     debug?: boolean
}


/**
 * Payload read from server
 */
export interface IPayload {
    childs: { [key:string]: IDevice }
}