function GetUSMarket() {
  var Today = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd hh:mm:ss");
  var EndTime = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd ");//搜尋內容結束時間
  var StartTime = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm");//搜尋內容起始時間
  var currentDate = Utilities.formatDate(new Date(), "GMT", "EEEE");//星期幾 ref:https://qa.1r1g.com/sf/ask/3379752771/
  // Logger.log("currentDate:"+currentDate);
  var URL = "https://tw.stock.yahoo.com/us-market/";
  
     getStockData(URL);
  
  
  function getStockData(URL){
    var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = activeSpreadsheet.getSheetByName("us-market");
    var source = UrlFetchApp.fetch(URL);
    var html = source.getContentText('UTF-8');
    var americaRate = sheet.getRange(1,7).getValues();
    Logger.log("美金匯率:"+americaRate);
    //DOM解析HTML
    const $ = Cheerio.load(html,{ decodeEntities: false });
    //Logger.log("html:"+$.length+"\n"+$.html());
    
    var divv = $('span' );//空白採用"&nbsp;"代替 ()需要在前面加上雙斜線\\. "M(0) P(0) List(n)" 
    //Logger.log("divv:\n"+divv.html());
    var msg ='';
    var isGetData = false;
    var max =6;
    var count = max;
    var itemIndex = -1;
    var img = '0';
    var indexMax = 16;
    var indexMin= 14;
    var index=indexMax;
    var row = 1;
    var start = 30;
    var pluse = "+";
    var rowStart = start;
    for (let i = start; i < divv.length; i++) {
        var divData = divv.eq(i); 
        if(divData.length>0){
           
            var daata = divData.text()+"";
            if(daata.includes("谷歌")||
                daata.includes("頻果")
            ){
                isGetData = true;
                  msg+="\n";
                  if(itemIndex!=-1)
                    msg+="\n";
                  itemIndex = i;
            }
            if(isGetData && count>0){
              count--;
              var pluse2 = "+";
              if(i==(itemIndex+2)){
                var data = divData+"";
                if(data.includes("trend-down")){
                   pluse2 = "-";
                   img = '6';
                  //Logger.log("["+i+"]span:down");
                }else if(data.includes("trend-up")){
                   pluse2 = "+";
                   img = '5';
                  //Logger.log("["+i+"]span:up");
                }
                msg+=" "+"\n指數："+daata+"  \t 漲跌:"+pluse2;
              }else{
                msg+=daata+" \t";//"["+i+"]"+
              }
            }else{
              count = max;
              isGetData = false;
            }
          
            if((i-rowStart)%index==0){
              itemIndex = i;
              
              row++;
              Logger.log(" \n\n ");
              Logger.log("i:"+i+",rowStart:"+rowStart+", index:"+index+"]divData:"+divData);
              Logger.log("["+(i-rowStart)%index+"]divData:"+divData);
              rowStart =i;
            }
            Logger.log("["+row+"]Name:"+daata+" \n\n");
            //  Logger.log("["+i+"]divData:"+divData+". index:"+index);
            //   Logger.log("["+(i-start)%index+"]divData:"+divData);
             if((i-rowStart)%index==0){
                //Logger.log("["+row+"]Name:"+daata);
                sheet.getRange(row, 1).setValue(daata);
              }
              if((i-rowStart)%index==1){
                //Logger.log("["+row+"]NO.:"+daata);
                 sheet.getRange(row, 2).setValue(daata);
              }
              
              

               if((i-rowStart)%index==2){
                  var data = divData+"";
                  if(data.includes("trend-down")){
                    pluse = "-";
                  }else if(data.includes("trend-up")){
                    pluse = "+";
                  }
                }

              if((i-rowStart)%index==2){
                // Logger.log("["+row+"]value:"+daata);
                var value = daata;
                var usaValue = value*americaRate;
                 sheet.getRange(row, 3).setValue(daata);
                 sheet.getRange(row, 7).setValue(usaValue);
                  if(pluse =="+"){
                    sheet.getRange(row,3).setBackgroundRGB(255,0,0);
                    sheet.getRange(row,7).setBackgroundRGB(255,0,0);
                  }else if(pluse =="-"){
                      sheet.getRange(row, 3).setBackgroundRGB(0,255,0);
                      sheet.getRange(row, 7).setBackgroundRGB(0,255,0);
                  }
                 
              }
              if((i-rowStart)%index==3){
                //Logger.log("["+row+"]offset:"+pluse+daata);
                  if(daata=="0.00" || daata=='-'){
                    pluse='';
                    index=indexMin;
                  }else{
                    index=indexMax;
                  }
                  sheet.getRange(row, 4).setValue(pluse+daata);
                  if(pluse =="+"){
                    sheet.getRange(row, 4).setBackgroundRGB(255,0,0);
                  }else if(pluse =="-"){
                      sheet.getRange(row, 4).setBackgroundRGB(0,255,0);
                  }
                  
              }
              
               if((i-rowStart)%index==5){
                //Logger.log("["+row+"]rate:"+pluse+daata+" \n");
                 sheet.getRange(row, 5).setValue(pluse+daata);
                 if(pluse =="+"){
                    sheet.getRange(row,5).setBackgroundRGB(255,0,0);
                  }else if(pluse =="-"){
                      sheet.getRange(row, 5).setBackgroundRGB(0,255,0);
                  }else{
                     sheet.getRange(row+':'+row).setBackgroundRGB(255,255,255);
                  }
              }

              if((i-rowStart)%index==(index-2)){
                //Logger.log("["+row+"]time:"+daata+" \n");
                 sheet.getRange(row, 6).setValue(daata);
                 //   Logger.log(" \n");
              }
        }
    }
    Logger.log("msg:"+msg);
    if(StartTime==EndTime+"08:06"){//06
      if(currentDate!="Sunday" && currentDate!="Saturday")
    pushMessage(CHANNEL_ACCESS_TOKEN,LineUserID,"美國預託證券(American Depositary Receipt,ADR):\n"+msg+"\n\nURL:"+URL+'\n\n台灣時間:\n'+Today+" \n\n[廣告時間_Android]\nhttps://play.google.com/store/apps/details?id=lyon.stock.floatview.kotlin");  
    }
  }
}

