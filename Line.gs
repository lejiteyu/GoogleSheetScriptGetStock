//Line channel token Ref:https://lychee.tw/lychee-blog/159-how-to-get-line-push-token.html
// Ref:https://www.oxxostudio.tw/articles/201804/line-bot-apps-script.html
//Ref: 群組推播：https://www.letswrite.tw/line-bot-gas-monitor/
// Line API :https://developers.line.biz/en/docs/messaging-api/sending-messages/#methods-of-sending-message


//主動傳送　Line　Bot　訊息給使用者
var CHANNEL_ACCESS_TOKEN = '1uJTnL5fQKDotINl43254yH7juyyXIk7zgQXDmWkPYvRF+bS0vXwDTgCnA7yywPzemxmwFO910ltYRpu/fIHtOzF6LLxrjyJdZgRSFuXugd63yh7VqkO9kTd84V2PoGg9JEItAob+RM/3s2ON5yITQdB04t89/1O/w1cDnyilFU=';//Line channel access token
var LineUserID =  'C997a905469dc0a9c0af1d4440dfecb9e';//Line User Id U85cc5bf8961c84385b879e5dc21f9919    iOS :U6c6a36eafcf0de36bd9a69ddeca5f2cb
//群組ID :C997a905469dc0a9c0af1d4440dfecb9e                           U85cc5bf8961c84385b879e5dc21f9919

function LinePushDebug(){
  pushMessage2(CHANNEL_ACCESS_TOKEN,LineUserID,'Just Test Line廣播測試',"5");
}
function　pushMessage2(ACCESS_TOKEN,USER_ID,message,img)　{
　  let url = "https://api.line.me/v2/bot/message/push";//https://api.line.me/v2/bot/message/push. ;  https://api.line.me/v2/bot/message/multicast
    let headers = {
    "Content-Type": "application/json;charaset=UTF-8",
    "Authorization": "Bearer "+ACCESS_TOKEN
    };

    
    
    //  try{
    //         let SpreadSheet =  SpreadsheetApp.getActiveSpreadsheet();
    //         let Sheet = SpreadSheet.getSheetByName('LineUserID');
    //         var startRow = 2;
    //         var startColumn = 1;
    //         var lastColumn = 10;
    //         var lastRow = Sheet.getLastRow();
    //         Logger.log(" lastRow:"+lastRow);
    //         if(lastRow==0){
    //           lastRow=1;
    //         }
    //         USER_ID ="["
    //         var SheetDate = Sheet.getSheetValues(startRow,startColumn,lastRow,lastColumn);
    //         var isExist = false;
    //         for(var j in SheetDate){
    //             var userName =SheetDate[j][0]; //A
    //             var userId = SheetDate[j][1];//B

    //             if(j>2){
    //               break;
    //             }else{
    //                if(j>0)
    //                 USER_ID +=",";
    //               USER_ID +="\""+userId+"\""
    //             }
                
    //         }
          
    //        USER_ID+="]";
    //   }catch(e){
    //           Logger.log(e);
             
    //   }
    Logger.log("USER_ID:"+USER_ID);
     let data = {
      "to": USER_ID,
      "messages": [
        {
          "type": "text",
          "text": message
        },
        {
          "type":"sticker",
          "packageId":"1",
          "stickerId":img
		    }
      ]
    };

    let options = {
      "method": "post",
      "headers": headers,
      "payload": JSON.stringify(data)
    };
    UrlFetchApp.fetch(url, options);
}


function　pushMessage(ACCESS_TOKEN,USER_ID,message)　{
　  let url = "https://api.line.me/v2/bot/message/push";//https://api.line.me/v2/bot/message/push . ;  https://api.line.me/v2/bot/message/multicast
    let headers = {
    "Content-Type": "application/json;charaset=UTF-8",
    "Authorization": "Bearer "+ACCESS_TOKEN
    };
    Logger.log("USER_ID:"+USER_ID);
    let data = {
      "to": USER_ID,
      "messages": [
        {
          "type": "text",
          "text": message
        }
      ]
    };

    let options = {
      "method": "post",
      "headers": headers,
      "payload": JSON.stringify(data)
    };
    UrlFetchApp.fetch(url, options);
}

function getLineMsg(e){
  //使用try catch包起來 避免當api使用時 e==null 產生錯誤
  var userMessage ='';
  var replyToken ='';
  var userId ='';
  try{
    //Logger.log('e:'+e);
    var msg = JSON.parse(e.postData.contents);
    Logger.log('msg:'+msg);
    var events = msg.events[0];
    if (events) {
      // 取出 replayToken 和發送的訊息文字
        replyToken =  events.replyToken;
        userMessage = events.message.text;
        userId = events.source && events.source.userId;
    }
    if(userMessage == 'undefined'){
      userMessage = 'undefined';
    }
     Logger.log('userMessage:'+userMessage+" replyToken:"+replyToken);
  }catch(error){
    //logMyErrors(e); 
     Logger.log('getLineMsg:'+error);
  }
   var msg = new Object();
   msg.userMessage = userMessage;
   msg.replyToken = replyToken;
   msg.userId = userId;
  return msg;
}

//// 回覆訊息 Line reply一次問話只能回覆一次訊息....
function reLine(replyToken, userId ,reMessage){
  try{
    var option = {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN
      },
      'method': 'post',
      'payload': JSON.stringify(
        {
            'replyToken': replyToken,
            'messages': [{
              'type': 'text',
              'text': reMessage,//+' ( google2 )',
            }],
        }
      )
    };
        
    UrlFetchApp.fetch(
      'https://api.line.me/v2/bot/message/reply',
      option
    );
  }catch(e){
     console.log("reLine error:"+e);
  }  
}

function getUserName(e){
  var data = new Object;
  try{
       var msg = JSON.parse(e.postData.contents);
      var replyToken = msg.events[0].replyToken; // 回覆的 token
      var userMessage = msg.events[0].message.text; // 抓取使用者傳的訊息內容
      var user_id = msg.events[0].source.userId; // 抓取使用者的 ID，等等用來查詢使用者的名稱
      var event_type = msg.events[0].source.type; // 分辨是個人聊天室還是群組，等等會用到
      var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/"+user_id, {
            "method": "GET",
            "headers": {
              "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN,
              "Content-Type": "application/json"
            },
          });

      var namedata = JSON.parse(response); // 解析 json
      var user_name = namedata.displayName; // 抓取 json 裡的 displayName
      data.userId = user_id+"";
      data.name = user_name +"";
      data.replyToken = replyToken+"";
      data.userMessage = userMessage+"";
      data.event_type = event_type+"";

      
  }catch(e){
     console.log("reLine error:"+e);
     data.name = "reLine error:"+e;
  }  
 
  return data;
}


function getGroupId(e){
  var message = JSON.parse(e.postData.contents);
  var targetID = message.events[0].source.groupId;
  var replayToken = message.events[0].replyToken;
   try{
    var user_id = message.events[0].source.userId; // 抓取使用者的 ID，等等用來查詢使用者的名稱
   }catch(e){
     console.log("reLine error:"+e);
  }  
  var msg = "群組ID:"+targetID+", user_id:"+user_id;
  return msg;
}



