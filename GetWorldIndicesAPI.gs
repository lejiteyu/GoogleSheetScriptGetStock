function apiTest(){
  GetWorldIndicesAPI('台積電');
}




function GetWorldIndicesAPI(userMessage) {
    var startTime = new Date().getTime();
    let SpreadSheet =  SpreadsheetApp.getActiveSpreadsheet();
    let Sheet = SpreadSheet.getSheetByName('lineBot');
    let sql = '=QUERY(\'WorldIndices\'!A2:O,"select * where A like \'%'+userMessage+'%\' or B like\'%'+userMessage+'%\' ")';
    Logger.log('sql = '+sql);
    Sheet.getRange('A1').setValue(sql);
    var data = getData(Sheet);
    var msg= getMsg(data);
   
    if(msg.length<=0){
      let sql = '=QUERY(\'ADR\'!A2:O,"select * where A like \'%'+userMessage+'%\' or B like\'%'+userMessage+'%\' ")';
      Logger.log('sql = '+sql);
      Sheet.getRange('A1').setValue(sql);
      var data = getData(Sheet);
      msg= getMsg(data);
    }

     if(msg.length<=0){
      let sql = '=QUERY(\'us-market\'!A2:O,"select * where A like \'%'+userMessage+'%\' or B like\'%'+userMessage+'%\' ")';
      Logger.log('sql = '+sql);
      Sheet.getRange('A1').setValue(sql);
      var data = getData(Sheet);
      msg= getMsg(data);
    }
    Logger.log('msg = \n'+msg);
    return msg;

    function getMsg(data){
      var dataArray = data.dataArray;
      //Logger.log('dataArray value = '+dataArray);
      var num = data.num;
      var endTime = new Date().getTime();
      var time = endTime - startTime;
      var reAns = '總共找到 '+'共'+num+"筆資料,花費時間:"+time;
      var msg ='';
      if(num>0){
        for(var i in dataArray){
            var data = dataArray[i];
            msg += " Name:"+data.Name+"\n"+
                    " NO.:"+data.No+"\n"+
                    " 買賣:"+data.value+"\n"+
                    " 差異.:"+data.offset+"\n"+
                    " 比例:"+data.rate+"\n"+
                    " 更新時間:"+data.date+"\n\n";
                    var number = (data.No+"").replace("^","%5E");
           
            msg+="https://tw.stock.yahoo.com/quote/"+number+"\n\n";//https://tw.stock.yahoo.com/quote/
        }
      }
      return msg;
    }

    //獲取Sheet資料
    function getData(Sheet){
        var data = new Object;
        var dataArray = [];
        try{
            //freezLock(10*1000);
            var startRow = 1;
            var startColumn = 1;
            var lastColumn = 10;
            var lastRow = Sheet.getLastRow();
            var SheetDate = Sheet.getSheetValues(startRow,startColumn,lastRow,lastColumn);
          
            for(var j in SheetDate){
              try{
                var tempData = new Object();
                var Name =SheetDate[j][0]; //A
                var No = SheetDate[j][1];//B
                var dateD = Utilities.formatDate(new Date(SheetDate), "GMT+8", "yyyy-MM-dd");
                Logger.log('['+j+']dateD:'+dateD);
                var value = SheetDate[j][2];//C
                var offset = SheetDate[j][3];//D
                var rate = SheetDate[j][4];//E
                var date = SheetDate[j][5];//F
                if(Name=='' || Name=='#N/A')
                    break;
                tempData.Name = Name;
                tempData.No = No;
                tempData.value = value;
                tempData.offset = offset;
                tempData.rate = rate;
                tempData.date = date;
                dataArray.push(tempData);//如果沒有要搜尋的資料 就全部回傳
              }catch(e){
                Logger.log("getData error:"+e);
              }
            }
            Logger.log("dataArray size:"+dataArray.length);
            var num = dataArray.length;
            data.dataArray = dataArray;
            data.num = num;
        }catch(e){
            Logger.log(e);
        }
        return data;
    }

  }

  

