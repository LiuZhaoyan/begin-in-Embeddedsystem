const mqtt = require('mqtt');
const http = require('http');
const fs = require('fs');

var json={"params":{"led":0},"version":"1.0","method":"thing.event.property.post"};
var payload = JSON.stringify(json);
var topic = "/sys/k29cyOF3OLv/app_dev/thing/event/property/post";
//连接mqtt broker
const options = {
    connectTimeout: 4000,
    clientId: "k29cyOF3OLv.app_dev|securemode=3,signmethod=hmacsha256,timestamp=1737279374546|", // 替换为你的客户端ID
    username: "app_dev&k29cyOF3OLv", // 替换为你的用户名（如果需要）
    password: "5e03ad0ad0a5d894c8bae58a03f78ecd3bbf23f582a77e1bf5e5f8effcf52328" // 替换为你的密码（如果需要）
};

let client = mqtt.connect("ws://iot-06z00ifkxzae1ef.mqtt.iothub.aliyuncs.com:443", options);

client.on("connect",(e) => {
    console.log("Connected to Mqtt Broker",e);
    sendMessage(topic,payload,{qos:0});
});

client.on("error",(err) =>{
    console.error("MQTT client error: ",err);
});

client.on("close", () => {
    console.log("Disconnected from MQTT");
});;

function sendMessage(topic,payload,options = {}) {
    if(!client.connected){
        console.log("MQTT client is not connected");
        return;
    }
    else {
        client.publish(topic,payload,options,(err) => {
            if(!err){
                console.log("Message published to topic ${topic}",topic);
                console.log(payload);
            }
            else {
                console.error("Error publishing message: ",err);
            }
        });
    }
}

// setTimeout(() => {
//     client.end();
//   }, 20000);

 