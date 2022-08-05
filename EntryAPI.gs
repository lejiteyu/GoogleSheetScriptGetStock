function startTest(){
  var uri =
      "https://script.google.com/macros/s/AKfycbwtXwHrAwsNcZaWr1R33gk54cIuow6ZIuveqb71MhhVqEyBGHicB-MkDJl3pgAC8M4O_A/exec";
  // var formData = {
  //     'apiClass': 'identificationDevice',
  //     'modelName': 'c'//'Chromecast'
  // };
  var formData = {
      'apiClass': 'Aes128Record',
      'modelName': 'Chromecast',//'Chromecast'
      'cpu':'Nan',
      'memory':'62%',
      'netspeed':'3.32Mb',
      'memberId':'1461917',
      'videoName':'ＴＶＢＳ新聞台',
      'videoUrl':'http:aka13p.akamaized.test/live/fe.....',
      'issdrm':'true'
  };
  var options = {
      'method': 'post',
      'payload': formData
  };
  var response = UrlFetchApp.fetch(uri, options);
  Logger.log(response.getContentText());
  //{"status":200,"code":"0000","message":"成功","data":{"dataArray":[{"DeviceName":"Google Chromecast TV","modelName":"Chromecast","needRecord":true}],"size":1}}
}


function doPost(e) {
  let TAG = 'EntryAPI.gs';
  try{
      var param =  e.parameter;    
      var apiClass = param.apiClass;
      if(apiClass == 'undefined' || apiClass ==''){
          platform = '';
        var json = JSON.stringify({ 
        status: 500,
        code: "9001",
        message: "Error,不知道api 類型",
        data: result});
        //Logger.log("getData json:"+JSON.parse(result));
        return ContentService
        .createTextOutput(json)
            .setMimeType(ContentService.MimeType.JSON);
      }else{
        if(apiClass=="identificationDevice"){
            var modelName = param.modelName;
            console.log("modelName:"+modelName);
            var data = IdentificationDeviceAPI(modelName);
            var size = data.size;
            var result = data;
            if(size>0){
              var json = JSON.stringify({ 
                  status: 200,
                  code: "0000",
                  message: "成功",
                  data: result});
                  //Logger.log("getData json:"+JSON.parse(result));
              return ContentService
                  .createTextOutput(json)
                      .setMimeType(ContentService.MimeType.JSON);
            }else{
              var json = JSON.stringify({ 
                    status: 500,
                    code: "9000",
                    message: "找不到資料",
                    data: result});
                    //Logger.log("getData json:"+JSON.parse(result));
              return ContentService
                    .createTextOutput(json)
                        .setMimeType(ContentService.MimeType.JSON);
            }
        }else if(apiClass=="Aes128Record"){
            var modelName = param.modelName;// 模組號碼
            var cpu = param.cpu;
            var memory = param.memory;
            var totalMemory = param.totalMemory;
            var netspeed = param.netspeed;//10秒平均網路速度
            var memberId = param.memberId;
            var videoName = param.videoName;
            var videoUrl = param.videoUrl;
            var issdrm = param.issdrm;
            var board = param.board; // 主機版名稱
            var brand = param.brand;// 品牌名稱
            var cpu_abi = param.cpu_abi;  // CPU + ABI
            var device = param.device;// 設備名稱
            var display = param.display;//// 版本號碼
            var manufacturer = param.manufacturer;// 製造商
            var product =  param.product // 產品名稱
            var drmType = param.drmType // DRM 格式

            var DeviceName = param.DeviceName;
            var Msg = '';
            var Code = '0000';
            var Status = 200;
            var result = new Object;
            console.log("modelName:"+modelName);
            if(cpu==''||cpu=='undefined'){
                Status = 500; 
                Msg= 'cpu 資料缺失';
                Code = '9000';
            }else if(memory==''||memory=='undefined'){
                Status = 500; 
                Msg= 'memory 資料缺失';
                Code = '9000';
            }else if(netspeed==''||netspeed=='undefined'){
                Status = 500; 
                Msg= '網路速度netspeed 資料缺失';
                Code = '9000';
            }else if(memberId==''||memberId=='undefined'){
                Status = 500; 
                Msg= '會員資料memberId 資料缺失';
                Code = '9000';
            }else if(videoName==''||videoName=='undefined'){
                Status = 500; 
                Msg= '影片名稱videoName 資料缺失';
                Code = '9000';
            }else if(videoUrl==''||videoUrl=='undefined'){
                Status = 500; 
                Msg= '影片路徑videoUrl 資料缺失';
                Code = '9000';
            }else if(totalMemory==''||totalMemory=='undefined'){
                Status = 500; 
                Msg= '裝置總 Memory 資料缺失';
                Code = '9000';
            }else if(issdrm==''||issdrm=='undefined'){
                Status = 500; 
                Msg= 'issdrm 資料缺失';
                Code = '9000';
            }else{
              Code = '0000';
              Status = 200;
              Msg = "成功";
              result = Aes128RecordAPI(modelName,cpu,memory,netspeed,memberId,videoName,videoUrl,issdrm, totalMemory,
                board,brand,cpu_abi,device,display,manufacturer,product,drmType
              );
            }


             var json = JSON.stringify({ 
                    status: Status,
                    code: Code,
                    message: Msg,
                    data: result});
                    //Logger.log("getData json:"+JSON.parse(result));
              return ContentService
                    .createTextOutput(json)
                        .setMimeType(ContentService.MimeType.JSON);
        }
      }
      
    }catch(e){
      //logMyErrors(e); 
      // console.log(e);
      var json = JSON.stringify({ 
                    status: 500,
                    code: "9000",
                    message: TAG+" Exception:"+e,
                    data: result});
                    //Logger.log("getData json:"+JSON.parse(result));
                    return ContentService
                    .createTextOutput(json)
                        .setMimeType(ContentService.MimeType.JSON);
    }
}

