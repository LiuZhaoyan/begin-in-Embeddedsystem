const mqtt = require('mqtt');
const http = require('http');
const fs = require('fs');

var json={"params":{"led":0},"version":"1.0","method":"thing.event.property.post"};
var payload = JSON.stringify(json);
var inTopic = "/sys/k29cyOF3OLv/app_dev/thing/service/property/set";
var outTopic = "/sys/k29cyOF3OLv/app_dev/thing/event/property/post";
//连接mqtt broker
const options = {
    connectTimeout: 4000,
    clientId: "k29cyOF3OLv.app_dev|securemode=3,signmethod=hmacsha256,timestamp=1737283388987|", // 替换为你的客户端ID
    username: "app_dev&k29cyOF3OLv", // 替换为你的用户名（如果需要）
    password: "91b41fd31f04a07787995ab78d3899f7131e6821ac4590b05c0dfb09bc6a2e23" // 替换为你的密码（如果需要）
};

let client = mqtt.connect("ws://iot-06z00ifkxzae1ef.mqtt.iothub.aliyuncs.com:443", options);

client.on("connect",(e) => {
    console.log("Connected to Mqtt Broker",e);
    client.subscribe(inTopic,{qos:0},(err) => {
        console.error("Subscribing error: ",err);
    });
    // sendMessage(outTopic,payload,{qos:0});
});
//监听出现错误事件
client.on("error",(err) =>{
    console.error("MQTT client error: ",err);
});
//监听连接关闭事件
client.on("close", () => {
    console.log("Disconnected from MQTT");
});;
//监听接收信息事件
client.on("message",(topic,message) => {
    console.log('接收到来自topic:${topic}的消息:${message.toString()}');
});

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
