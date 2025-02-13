# begin-in-Embeddedsystem
FOCUS冬令营嵌软项目
## task 1

1. 下载Arduino
2. file -> preferences -> Addictional boards manager中复制如下URL `http://arduino.esp8266.com/stable/package_esp8266com_index.json
   https://dl.espressif.com/dl/package_esp32_index.json`
3. Boards Manager中下载 `esp32 by Espressif System`
4. 配置 `AI Thinker ESP32-CAM` 和端口

烧录 **sketch_helloworld** 即可打印 `hello world`



## task2.0

### 串口协议(USART): 

PC与外设交互时需要共同遵守的规定.

使用单片机串口发送接收数据时要经过:

1. 串口时钟使能GPIO时钟使能
2. 串口复位
3. GPIO端口模式设置
4. 串口参数初始化
5. 开启中断 并且初始化NVIC
6. 使能串口
7. 编写中断处理函数

### 使用Arduino

**Arduino 中将串口初始化和使用进行了封装:** Arduino语言类似于C/C++,但更加简洁易懂   

**打印"hello world"**

```c
void setup(){//只执行一次
    Serial.begin(9600);
    while(Serial.read()>=0){}
}
void loop(){//一直循环
    Serial.print("hello world!");
    delay(100);
}
```

#### 相关串口函数

##### Serial.begin() 

**说明** : 开启串口,通产用于Setup()中

**语法** : Serial.begin(speed,config);  

**参数**

speed: 波特率，一般取值300, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600,115200

config: 设置数据位、校验位和停止位。例如Serial.begin(speed,Serial_8N1);  Serial_8N1中：8表示8个数据位，N表示没有校验，1表示有1个停止位。

**返回** : None



*串口缓存区应该是指电脑向外设输入时输入数据的暂存区*

##### Serial.flush()

**说明**

1.0版本之前为清空串口缓存，现在该函数作用为等待输出数据传送完毕。如果要清空串口缓存的话，可以使用：while(Serial.read() >= 0)来代替。

**语法** : Serial.flush ()

**参数** : None

**返回** : None



##### Serial.print()

**说明** : 串口输出数据函数，写入字符串数据到串口。

**语法**

Serial.print(val)

Serial.print(val,format)

**参数**

val: 打印的值，任意数据类型

format: 输出的数据格式，包括整数类型和浮点型数据的小数点位数。



##### Serial.printIn()

比**print()**多一个换行符 **\n**



##### Serial.write()

**说明** : 串口输出数据函数。写二进制数据到串口。

**语法**

Serial.write(val) 
Serial.write(str) 
Serial.write(buf, len)

**参数**

val: 字节 
str: 一串字节 
buf: 字节数组 
len: buf的长度

**返回** : 字节长度


##### Serial.available()

**说明**

判断串口缓冲器的状态函数，用以判断数据是否送达串口。注意使用时通常用delay(100)以保证串口字符接收完毕，即保证Serial.available()返回的是缓冲区准确的可读字节数。

**语法** : Serial.available();

**参数** : None

**返回** : 返回缓冲区可读字节数目


##### Serial.read()

**说明** : 读取串口数据，一次读一个字符，读完后删除已读数据。

**语法** : Serial.read();

**参数** : None

**返回** : 返回串口缓存中第一个可读字节，当没有可读数据时返回-1，整数类型。



## task2.1

**连接WiFi示例 WiFi.ino**

```c
#include<WiFi.h>

const char* ssid="iPPT";
const char* password="ffGTL3FSfK";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  WiFi.begin(ssid,password);
  while(WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Well Connected!");

}

void loop() {
  // put your main code here, to run repeatedly:
  delay(10000);
}
```



### Arduino中的WiFi库

`#include<WiFi.h>`

#### WiFi.begin()

**说明** : 获取WiFi,初始化WiFi信息

**参数** : 

ssid: WiFi 名字

pass: WPA 密码

**返回值** 

WL_CONNECTED -- success

WL_IDLE_STATUS -- fail but still powered



## task 2.2

### 阿里云服务器物联网平台

**使用MQTT协议**

数据通过阿里云在mcu和云端传输的大致思路:

数据源 --> 解析器 --> 数据目的

数据源由设备发出

解析器中的解析脚本解析数据, 数据为 `.json` 形式 

数据目的为数据目的设备

### MQTT协议

一种基于**发布/订阅**模型的消息传输协议

- **MQTT客户端（Client）:** 接入物联网平台的设备。设备和用户的服务器不直接建立连接，而是通过代理者（Broker）进行通信。
- **MQTT代理者（Broker）:** 阿里云物联网平台。代理者（Broker）是设备和业务服务器消息通信的中介
- **主题（Topic）：** 使用正斜杠（/）作为分隔符构造字符串，例如`/${productKey}/${deviceName}/user/update`，订阅该Topic的所有设备都会收到消息。
- **消息内容（Payload）：** 消息的具体内容

设备将topic和payload一起发送到Broker, Broker用解释器处理后完成topic指定任务

### 使用Arduino连接MQTT

**见esp32-mqtt.ino**

### Arduino中的MqttClient库

`#include <ArduinoMqttClient.h>` *在Arduino库中下载*

**MqttClient 类(class)**

```c++
MqttClient mqttClient(Client) //利用Client对象定义一个实列 mqttClient,使可以完成数据传输
//类定义
class MqttClient : public Client {
public:
  MqttClient(Client* client);
  MqttClient(Client& client);
  virtual ~MqttClient();
```



#### mqttClient.setId()

**说明** : 给设备设置ID

**参数** : id -- const char *

**返回值** : void



#### mqttClient.setUsernamePassword()

**说明** : 给设备设置用户名和密码

**参数** 

username -- const char *

password -- const char *

**返回值** : void



#### mqttClient.connect()

**说明** : 设备连接服务器

**参数**

host -- const char * 目的url 

port -- uint16_t 端口

ip -- IPAddress

**返回值**

0 -- fail

1 -- success

#### mqttClient.beginMessage()

**说明** : 开始向服务器发送数据 

**参数**

outTopic -- const char* 

size

retain

pos

**返回值** : 0/1



#### mqttClient.enMessage()

**说明** : 结束发送数据

**返回值** : 0/1



#### mqttClient.onMessage()

**说明** : 服务器发送信息时设备接收信息的handle, 触发回调函数

**参数** : void(*)(int) -- 函数指针

**返回值** : void



#### mqttClient.subscribe()

**说明** : 启动接收数据

**参数** 

inTopic

pos -- 0 uint8_t

**返回值** : 0/1



### Arduino中的WiFi库

`#include<WiFi.h>`

**WiFiClient类(class)**



### Arduino中的Json库

`#include <ArduinoJson.h>` *在Arduino库中下载*

**DynamicJsonDocument:** 用于动态分配内存的JSON文档类

**实例化文档**

```c++
DynamicJsonDocument doc(1024); // 这里可以指定一个大小（字节），但通常可以省略，使用默认值
DynamicJsonDocument doc;// 或者更简单地（使用默认大小）：
```

**Json数据使用方式**

```c++
String items = json_doc["items"];
```



#### deserializeJson()

**说明** : json字符串转化为json数据

**参数**

json -- json数据

payload -- const char* 



#### serializeJson()

**说明** : json数据转化为字符串

**参数**

json -- json数据

payload -- const char* 



## 使用Node.js构建网页连接MQTT(有问题)

见Web-mqtt

#### 使用Node.js构建项目

1. 官网下载Node.js
2. 项目路径下运行命令行 `npm init -y` 构建项目
3. 编写文件
4. 命令行运行 `code file.js `

#### Node.js连接mqtt

**命令:** `npm install mqtt` 
命令在项目文件夹中会生成 **node_module** 和 **package.json** 文件

`const mqtt = require('mqtt');` 使文件采用CJS标准

代码文件中加入以下代码创建Node.js服务器连接到http://localhost:3000并打开文件 **blink.html**
```javascript
const http = require('http');
const fs = require('fs');
//创建服务器打开html文件
http.createServer((req,res) => {
    var fileName = "." + req.url;
    if(fileName == "./"){
        fileName = "./blink.html";
    }
    else {
        res.writeHead(404);
        res.end('File not found');
    }
    fs.readFile(fileName,(err,data) => {
        if(err) {
            res.writeHead(404);
            res.end('File not found');
        }
        else {
            res.writeHead(200,{'content-type' : 'blink/html'});
            res.end(data.toString());
        }
    });
    
}).listen(3000,() => {
    console.log('Server is running');
});
```
<!--但访问时直接下载了html文件而没有直接运行-->

代码加入接收数据功能 -> 见app_mqtt(new).js
