
function textDoPost(){
  var jsondata = {};
  var event = {};
  var events = [];
  var emojis = [];
  var emoji = {};
  var e ={};
  var source = {};
  var message ={};
  var mention = {};
  var mentionees = [];
  var mentione = {  };
  e["destination"] = "xxxxxxxxxx";
  
  event["replyToken"]= CHANNEL_ACCESS_TOKEN;
  event["type"]= "message";
  event["mode"]= "active";
  event["timestamp"]= "1462629479859";
 
    source["type"]="user";
    source["userId"]=LineUserID;
  event["source"]= source;
  
    message["id"]="325708";
    message["type"]="text";
    message["text"]="@example Hello, world! (love)";
  
   
      emoji["index"]=23;
      emoji["length"]=6;
      emoji["productId"]="5ac1bfd5040ab15980c9b435";
      emoji["emojiId"]="001";
      emojis.push(emoji);
    message["emojis"]=emojis;
 
      mentione["index"]=0;
      mentione["length"]=8;
      mentione["userId"]="U850014438e...";
      mentionees.push(mentione);
      mention["mentionees"]=mentionees;

    message["mention"]=mention;
  event["message"]= message;
  events.push(event);
  e["events"] = events;
  var contents={};
  contents['contents']=e;
  Logger.log("getData json:"+JSON.stringify(e));

  doPost(contents);
}


function doPost(e) {
  let TAG = 'GetAPIorLine.gs';
  var msg = getLineMsg(e);
  userMessage = msg.userMessage;
  replyToken = msg.replyToken;
  userId = msg.userId;
  Logger.log("replyToken:"+replyToken+" ,userMessage:"+userMessage);
  //獲取Line訊息.  https://script.google.com/macros/s/AKfycbyD67TYKmq3uv_FN_XYC-wwbVwUw-LdEqZPWxKLRuLwwN-x10kvt0olvQDsMFs6xrvT/exec
  if(userMessage!='' && userMessage!='undefined'){
      var msg = GetWorldIndicesAPI(userMessage);
      var data = getUserName(e);
      addUserDataToGoogleSheet(data);
      if(false){
        var groudId = getGroupId(e);
        msg= "name:"+data.name +"\n userId:"+data.userId+"\n groudId:"+groudId+"\n \n"+msg;
      }

      if(userMessage == 'Hi' || userMessage == 'hi' ){
        if( data.name!='' && data.name!='undefined'){
            var msgg = data.name+" 你好!!"+"\n";
            reLine(replyToken, userId, msgg);
        }
      }else if(msg.length>0){ //回覆訊息
        reLine(replyToken, userId, msg);
      }
       var json = JSON.stringify({ 
        status: 500,
        code: "9001",
        message: "Error,Line類型:\n"+"replyToken:"+replyToken+" ,userMessage:"+userMessage,
        data: result});
        //Logger.log("getData json:"+JSON.parse(result));
        return ContentService
        .createTextOutput(json)
            .setMimeType(ContentService.MimeType.JSON);
  }
  else{
     //stock name api訊息
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
        if(apiClass=="stockName"){
            var types = param.types;
            console.log("types:"+types);
            var data = GetStockNameAPI(types);
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
  
}

function addUserDataToGoogleSheetText(){
     var data = new Object;
     data.name = "test";
     data.userId = "userId";
     addUserDataToGoogleSheet(data);
  }
  function addUserDataToGoogleSheet(data){
      var TAG = "addUserDataToGoogleSheet";
      let SpreadSheet =  SpreadsheetApp.getActiveSpreadsheet();
      let Sheet = SpreadSheet.getSheetByName('LineUserID');

      try{
            var startRow = 1;
            var startColumn = 1;
            var lastColumn = 10;
            var lastRow = Sheet.getLastRow();
            Logger.log(TAG+" lastRow:"+lastRow);
            if(lastRow==0){
              lastRow=1;
            }
            
            var userName = data.name;
            var userId = data.userId;
            var SheetDate = Sheet.getSheetValues(startRow,startColumn,lastRow,lastColumn);
            var isExist = false;
            for(var j in SheetDate){
                var userName2 =SheetDate[j][0]; //A
                var userId2 = SheetDate[j][1];//B

                if(userId2 == userId)
                isExist = true;
            }
            if(!isExist){
              Sheet.getRange(lastRow+1,1).setValue(userName);
              Sheet.getRange(lastRow+1,2).setValue(userId);
            }
             
            
      }catch(e){
              Logger.log(e);
             
      }
    
        
  }

