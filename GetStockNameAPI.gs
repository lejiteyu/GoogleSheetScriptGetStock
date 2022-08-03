function GetStockNameAPITest(){
  var data = GetStockNameAPI('1');
  Logger.log("getData json:"+JSON.stringify(data.valueArray));
}

function startTest(){
  var uri =
      "https://script.google.com/macros/s/AKfycby0XoJpc27rpvqadWJFyxWblkcpKSWTnB1ncZENmRpF7Pj_5NTqTLJDahBYqgzC8vU/exec";
  var formData = {
      'apiClass': 'stockName',
      'types': '1'
  };
  var options = {
      'method': 'post',
      'payload': formData
  };
  var response = UrlFetchApp.fetch(uri, options);
  Logger.log(response.getContentText());
}

//https://script.google.com/macros/s/AKfycbwSKd60rcWLfKQLKcsoqRVvkV6_K7IMTX1EPRvoy3eMVAEBcO5uM3ur9MsOuPQMdKz9/exec
function GetStockNameAPI(types) {
  let TAG = 'GetStockNameAPI.gs';
    let SpreadSheet =  SpreadsheetApp.getActiveSpreadsheet();
    let Sheet = SpreadSheet.getSheetByName('stock_Name_api_1');
    if(types==2){
      Sheet = SpreadSheet.getSheetByName('stock_Name_api_2');
    }
    let sql = '=QUERY(\'stock_Name\'!A2:O,"select * where D like\'%'+types+'%\'")';
    Logger.log('sql = '+sql);
    Sheet.getRange('A1').setValue(sql);
  
    var jsondata = getData(Sheet);
    return jsondata;
    //獲取Sheet資料
    function getData(Sheet){
        var data = new Object;
        var dataArray = [];
        var valueArray = [];
       
        try{
            //freezLock(10*1000);
            var startRow = 1;
            var startColumn = 1;
            var lastColumn = 10;
            var lastRow = Sheet.getLastRow();
            var SheetDate = Sheet.getSheetValues(startRow,startColumn,lastRow,lastColumn);
          
            for(var j in SheetDate){
              try{
                var jsondata = {};
                var tempData = new Object();
                var Type =SheetDate[j][0]; //A
                var No = SheetDate[j][1];//B
                // var dateD = Utilities.formatDate(new Date(SheetDate), "GMT+8", "yyyy-MM-dd");
                // Logger.log('['+j+']dateD:'+dateD);
                var name = SheetDate[j][2];//C
                var tse = SheetDate[j][3];//D
                var mode = SheetDate[j][4];//E
              
                if(Type=='' || Type=='#N/A')
                    break;
                tempData.Type = Type;
                tempData.No = No;
                tempData.name = name;
                tempData.tse = tse;
                tempData.mode = mode;
                jsondata['Type']=Type;
                jsondata['name']=name;
                jsondata['tse']=tse;
                jsondata['mode']=mode;
                valueArray.push(JSON.stringify(jsondata));
                dataArray.push(tempData);//如果沒有要搜尋的資料 就全部回傳
              }catch(e){
                Logger.log("getData error:"+e);
              }
            }
            Logger.log("valueArray :"+JSON.stringify(valueArray));
            Logger.log("dataArray size:"+dataArray.length);
            var num = dataArray.length;
            data.dataArray = dataArray;
            data.size = num;
          }catch(e){
              Logger.log(e);
              var json = JSON.stringify({ 
                    status: 500,
                    code: "9002",
                    message: TAG+" Exception:"+e,
                    data: dataArray});
                    //Logger.log("getData json:"+JSON.parse(result));
              return ContentService
                    .createTextOutput(json)
                        .setMimeType(ContentService.MimeType.JSON);
          }
        return data;
    }
}

