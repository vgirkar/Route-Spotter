const { DateTime } = require("luxon");
const { v4: uuidv4 } = require('uuid');
const categories = ['Hiking','Football Stadiums'];
const connections = [
    {
        id:'1',
        name:'Rocky Mountains',
        topic:'Hiking',
        details:'The Rocky Mountains, also known as the Rockies, are a major mountain range and the largest mountain system in North America. The Rocky Mountains stretch 3,000 mi (4,800 km)[1] in straight-line distance from the northernmost part of western Canada, to New Mexico in southwestern United States. Depending on differing definitions between Canada and the United States, its northern terminus is located either in northern British Columbias Terminal Range south of the Liard River and east of the Trench, or in the northeastern foothills of the Brooks Range/British Mountains that face the Beaufort Sea coasts between the Canning River and the Firth River across the Alaska-Yukon border.[2] Its southernmost point is near the Albuquerque area adjacent to the Rio Grande Basin and north of the Sandia–Manzano Mountain Range. Being the easternmost portion of the North American Cordillera, the Rockies are distinct from the tectonically younger Cascade Range and Sierra Nevada, which both lie farther to its west.',
        hostname:'Vinit',
        location: 'Charlotte International Airport',
        date:'2021-10-08',
        startTime:'05:15',
        endTime:'06:15',
        image:'https://thumbs.dreamstime.com/z/beautiful-lake-mountains-background-29145177.jpg',
        createdAt:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id:'2',
        name:'Yosemite National Park',
        topic:'Hiking',
        details:'Yosemite Valley is a glacial valley in Yosemite National Park in the western Sierra Nevada mountains of Central California. The valley is about 7.5 mi (12.1 km) long and 3,000–3,500 ft (910–1,070 m) deep, surrounded by high granite summits such as Half Dome and El Capitan, and densely forested with pines. The valley is drained by the Merced River, and a multitude of streams and waterfalls flow into it, including Tenaya, Illilouette, Yosemite and Bridalveil Creeks. Yosemite Falls is the highest waterfall in North America and is a big attraction especially in the spring, when the water flow is at its peak. The valley is renowned for its natural environment and is regarded as the centerpiece of Yosemite National Park.',
        hostname:'Shimpli',
        location: 'Denver International Airport',
        date:'2021-10-08',
        startTime:'2021-10-27',
        endTime:'2021-11-01',
        image:'https://thumbs.dreamstime.com/z/yosimite-national-park-california-waterfall-61105809.jpg',
        createdAt:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id:'3',
        name:'Zion National Park',
        topic:'Hiking',
        details:'Zion National Park is a southwest Utah nature preserve distinguished by Zion Canyon’s steep red cliffs. Zion Canyon Scenic Drive cuts through its main section, leading to forest trails along the Virgin River. The river flows to the Emerald Pools, which have waterfalls and a hanging garden. Also along the river, partly through deep chasms, is Zion Narrows wading hike.',
        hostname:'Pujan',
        location: 'Charlotte International Airport',
        date:'2021-10-08',
        startTime:'2021-11-27',
        endTime:'2021-12-01',
        image:'https://thumbs.dreamstime.com/z/zion-national-park-sign-east-entrance-utah-32623148.jpg',
        createdAt:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id:'4',
        name:'Grand Canyon Nation Park',
        topic:'Hiking',
        details:'Grand Canyon National Park, in Arizona, is home to much of the immense Grand Canyon, with its layered bands of red rock revealing millions of years of geological history. Viewpoints include Mather Point, Yavapai Observation Station and architect Mary Colter’s Lookout Studio and her Desert View Watchtower. Lipan Point, with wide views of the canyon and Colorado River, is a popular, especially at sunrise and sunset. ',
        hostname:'Rushil',
        location: 'Charlotte International Airport.',
        date:'2021-10-08',
        startTime:'2021-12-27',
        endTime:'2022-01-01',
        image:'https://thumbs.dreamstime.com/z/grand-canyon-national-park-entrance-sign-arizona-usa-monument-beautiful-sunny-day-blue-sky-summer-146343476.jpg',
        createdAt:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id:'5',
        name:'Old Trafford',
        topic:'Football Stadiums',
        details:'Old Trafford is a football stadium in Old Trafford, Greater Manchester, England, and the home of Manchester United. With a capacity of 74,140 seats, it is the largest club football stadium in the United Kingdom, and the eleventh-largest in Europe.',
        hostname:'Sneh',
        location: 'Charlotte International Airport',
        date:'2021-10-08',
        startTime:'2022-01-27',
        endTime:'2022-02-01',
        image:'https://thumbs.dreamstime.com/z/old-trafford-stadium-panorama-old-trafford-stadium-panorama-170121033.jpg',
        createdAt:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id:'6',
        name:'Stamford Bridge',
        topic:'Football Stadiums',
        details:'Ut mattis lacus in nulla elementum, non semper mauris bibendum. In hac habitasse platea dictumst. Quisque ornare justo eget rhoncus feugiat.',
        hostname:'Swapn',
        location: 'Charlotte International Airport', 
        date:'2021-10-08',
        startTime:'2022-02-27',
        endTime:'2022-03-01',
        image:'https://thumbs.dreamstime.com/z/chelsea-fc-stamford-bridge-stadium-football-club-london-united-kingdom-capacity-making-eighth-largest-ground-56376614.jpg',
        createdAt:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    }
];

exports.categories = () => categories;

exports.find = () => connections;

exports.findById = id => connections.find(connection => connection.id === id);

exports.save = function (connection) {
    connection.id = uuidv4();
    connection.createdAt=DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
    if(categories.indexOf(connection.topic) === -1){
        categories.push(connection.topic);
    }
    connections.push(connection);
};

exports.updateById = function (id, newConnection) {
    let connection = this.findById(id);
    if(connection){
        if(categories.indexOf(newConnection.topic) === -1){
            categories.push(newConnection.topic);
        }
        connection.name = newConnection.name;
        connection.topic = newConnection.topic;
        connection.details = newConnection.details;
        connection.hostname = newConnection.hostname;
        connection.location = newConnection.location;
        connection.date = newConnection.date;
        connection.startTime = newConnection.startTime;
        connection.endTime = newConnection.endTime;
        connection.image = newConnection.image;

        categories.forEach(category => { 
            if(!connections.some(connection => connection.topic === category)){
                let categoryIndex = categories.indexOf(category);
                if(categoryIndex !== -1){
                    categories.splice(categoryIndex, 1);
                }
            }
        }); 
        

        return true;
    }else {
        return false;
    }
};

exports.deleteById = function (id) {
    let index = connections.findIndex(connection => connection.id === id);
    if(index !== -1){
        let deletedConnection = connections.splice(index,1);
        if(!connections.some(connection => connection.topic === deletedConnection[0].topic)){
            let categoryIndex = categories.indexOf(deletedConnection[0].topic);
            if(categoryIndex !== -1){
                categories.splice(categoryIndex, 1);
            }
        }
        return true;
    }else {
        return false;
    }
};  