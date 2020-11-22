import { pictures } from '../pictures/pictures'

export const devices: any = [
    {
        name: 'Main status',
        topic: '$SYS/presence',
        actions: ['awake', 'absent', 'sleeping'],
        properties: ['favorit', 'control'],
        pictures: pictures.house
    },
    {
        name: 'Computer Volker power',
        topic: 'first/study/zwave/switch/master',
        properties: ['favorit', 'control'],
        actions: ['on', 'off'],
        pictures: pictures.powerSwitch
    },
    { 
        name: 'Backup computer',
        topic: 'ground/wardrobe/i2c/switch/backup',
        actions: ['on', 'hibernate', 'off'],
        properties: ['favorit', 'control'],
        pictures: pictures.backup
    },
    { 
        name: 'Charge',
        topic: 'ground/wardrobe/i2c/switch/charge',
        properties: ['control'],        
        actions: ['on', 'off'],
        pictures: pictures.charge
    },    
    { 
        name: 'Monitor',
        topic: 'ground/wardrobe/i2c/switch/monitor',
        properties: ['favorit', 'control'],
        actions: ['on', 'off'],
        pictures: pictures.monitor
    },    
    { 
        name: 'Floor heating',
        topic: 'ground/wardrobe/fs20/switch/floor heating',
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.floorHeating
    },    
    { 
        name: 'Network switch',
        topic: 'ground/wardrobe/i2c/switch/network switch',
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.networkSwitch
    },    
    { 
        name: 'Security camera',
        topic: 'ground/livingroom/zwave/switch/camera',
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.securityCamera
    },    
    { 
        name: 'Electric iron',
        topic: 'first/dressingroom/zwave/switch/electric iron',
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.electricIron
    },
    {
        name: "Battery charging",
        topic: "ground/livingroom/zwave/switch/charge",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.charge
    },
    {
        name: "Ceiling floodlight",
        topic: "ground/livingroom/zwave/switch/floodlight",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.light
    },
    {
        name: "Roller shutter south-east",
        topic: "ground/livingroom/zwave/shutter/southeast",
        actions: ['on', 'off', 'stop'],
        properties: ['control'],
        pictures: pictures.roller
    },
    {
        name: "Roller shutter south-west",
        topic: "ground/livingroom/zwave/shutter/southwest",
        actions: ['on', 'off', 'stop'],
        properties: ['control'],
        pictures: pictures.roller
    },
    {
        name: "Master switch multimedia",
        topic: "ground/livingroom/zwave/switch/tvmaster",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.multimedia
    },
    {
        name: "Multimedia amplifier",
        topic: "ground/livingroom/fs20/switch/amplifier",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.amplifier
    },
    {
        name: "Apple TV",
        topic: "ground/livingroom/fs20/switch/appletv",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.computer
    },
    {
        name: "Dishwasher",
        topic: "ground/kitchen/zwave/switch/dishwasher",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.dishwasher
    },
    {
        topic: "cellar/boilerroom/zwave/switch/washing machine",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.washingMachine
    },
    {
        name: "Refrigerator",
        topic: "ground/kitchen/zwave/switch/fridge",
        properties: ['control', 'protect'],
        actions: ['on', 'off'],
        pictures: pictures.refrigerator
    },
    {
        name: "Ventilation system",
        topic: "ground/wardrobe/zwave/switch/ventilation",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.ventilationSystem
    },
    {
        name: "Smarthome Power",
        topic: "ground/wardrobe/zwave/switch/smarthome",
        properties: ['control', 'protect'],
        actions: ['on', 'off'],
        pictures: pictures.powerSwitch
    },
    {
        name: "Smarthome server",
        topic: "ground/wardrobe/i2c/switch/server",
        actions: ['on', 'shutdown', 'off'],
        properties: ['control', 'protect'],
        pictures: pictures.smarthomeServer
    },
    {
        name: "Internet router (fritz box)",
        topic: "ground/wardrobe/i2c/switch/internet",
        properties: ['control', 'protect'],
        actions: ['on', 'off'],
        pictures: pictures.internet
    },
    {
        name: "Socket at parkingplace",
        topic: "outdoor/garden/main/switch/socket parkingplace",
        properties: ['control', 'notify'],
        actions: ['on', 'off'],
        pictures: pictures.socket
    },   
    {
        name: "Socket at stonefield",
        topic: "outdoor/garden/main/switch/socket stonefield",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.socket
    },   
    {
        name: "Pump in cistern",
        topic: "outdoor/garden/main/switch/pump",
        properties: ['control', 'notify'],
        actions: ['on', 'off'],
        pictures: pictures.water
    },            
    {
        name: "Light at stairs",
        topic: "outdoor/garden/main/switch/light stairs",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.lightStairs
    },           
    {
        name: "Lights on stonefield",
        topic: "outdoor/garden/fs20/switch/light stonefield",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.lightStonefield
    },
    {
        name: "Lights on pathway",
        topic: "outdoor/garden/fs20/switch/light pathway",
        actions: ['on', 'off'],
        properties: ['control'],
        pictures: pictures.lightPathway
    },
    {
        name: "Laser printer",
        topic: "first/study/zwave/switch/laserprinter",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.printer
    },
    {
        name: "Regina's computer",
        topic: "first/study/zwave/switch/pcregina",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.computerTower
    },
    {
        name: "Volker's computer",
        topic: "first/study/zwave/switch/pcvolker",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.computerTower
    },
    {
        name: "Camera boilerroom",
        topic: "cellar/boilerroom/switches/switch/camera",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.securityCamera
    },
    {
        name: "Roller shutter [2]",
        topic: "%/%/%/roller shutter/roller shutter key",
        actions: ['up', 'down'],
        properties: ['control'],
        pictures: pictures.roller
    },
    {
        name: "light [2]",
        topic: "%/%/main/light/light on time",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.light

    },
    {
        name: "light [2] [3]",
        topic: "cellar/hobbycellar/%/light/light on time",
        properties: ['control'],
        actions: ['on', 'off'],
        pictures: pictures.light
    },
    {
        name: "temperature [2]",
        topic: "%/%/%/temperature and humidity sensor/temperature in celsius",
        properties: ['measured'],
        pictures: pictures.temperature
    },
    {
        name: "temperature",
        topic: "%/%/%/%/temperature",
        properties: ['measured'],
        pictures: pictures.temperature
    },
    {
        name: "internal temperature",
        topic: "%/%/%/%/internal temperature in celsius",
        properties: ['measured'],
        pictures: pictures.temperature
    },
    {
        name: "humidity [2]",
        topic: "%/%/%/temperature and humidity sensor/humidity in percent",
        properties: ['measured'],
        pictures: pictures.humidity
    },
    {
        name: "humidity",
        topic: "%/%/%/%/humidity",
        properties: ['measured'],
        pictures: pictures.humidity
    },
    {
        name: "outside temperature",
        topic: "outdoor/garden/main/weather/temperature",
        properties: ['measured', 'favorit'],
        pictures: pictures.temperature
    },
    {
        topic: "%/%/%/%/pressure",
        properties: ['measured'],
        pictures: pictures.pressure
    },
    {
        name: "pressure",
        topic: "outdoor/garden/main/weather/pressure",
        properties: ['measured'],
        pictures: pictures.pressure
    },
    {
        name: "outside humidity",
        topic: "outdoor/garden/main/weather/humidity",
        properties: ['measured'],
        pictures: pictures.humidity
    },
    {
        name: "power consumption",
        topic: "solar/consumption",
        properties: ['measured', 'favorit'],
        pictures: pictures.consumption
    },
    {
        name: "power feed in",
        topic: "solar/feedin",
        properties: ['measured'],
        pictures: pictures.feedin
    },
    {
        name: "average power feed in",
        topic: "solar/average feedin",
        properties: ['measured'],
        pictures: pictures.feedin
    },
    {
        name: "solar power yield",
        topic: "solar/solar yield",
        properties: ['measured', 'favorit'],
        pictures: pictures.solaryield
    },
    {
        name: "window [2] [3]",
        topic: "%/%/%/window/detection state",
        properties: ['security'],
        pictures: pictures.window
    },
    /*,    
    { 
        ...deviceOnOff,
        name: '',
        topic: '',
    }
    */
]