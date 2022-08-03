function GetStockNames() {
  var startTime = new Date().getTime();
  let SpreadSheet =  SpreadsheetApp.getActiveSpreadsheet();
  let Sheet = SpreadSheet.getSheetByName('stock_class');
  let NameSheet = SpreadSheet.getSheetByName('stock_Name');
  var data = getData(Sheet);
  var dataArray =  data.dataArray;
  var row=1;
   var Today = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd hh:mm:ss");
  var EndTime = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd ");//搜尋內容結束時間
  var StartTime = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH");//搜尋內容起始時間
  var row=2;
  Logger.log("StartTime:"+StartTime+" / EndTime:"+EndTime+" 02");
   if(StartTime==EndTime+"02" ){
      for(var i in dataArray){
        var type = dataArray[i].type;
        var name = dataArray[i].Name;
        var url ="https://tw.stock.yahoo.com/h/kimosel.php?"+type+"&cat="+name+"&form=menu&form_id=stock_id&form_name=stock_name&domain=0";
        Logger.log("["+i+"]url:"+url);
        Logger.log("\n\n");
        getHtml(url, type, name);
      }
   }

 
  // getHtml('https://tw.stock.yahoo.com/h/kimosel.php?tse=2&cat=櫃認售&form=menu&form_id=stock_id&form_name=stock_name&domain=0',"tse=2");
  //   Logger.log("\n\n");
  // getHtml('https://tw.stock.yahoo.com/h/kimosel.php?tse=1&cat=食品&form=menu&form_id=stock_id&form_name=stock_name&domain=0',"tse=1");

  function getHtml(URL,type,Classs){
      var source = UrlFetchApp.fetch(URL);
      var html = source.getContentText('big5');
      var start=5;
      if(URL.includes("tse=1"))
        start=5;
      else{
        start=5;
      }
      //DOM解析HTML
      const $ = Cheerio.load(html,{ decodeEntities: false });
      //Logger.log("html:"+$.length+"\n"+$.html());
      var tables = $('table' );//空白採用"&nbsp;"代替 ()需要在前面加上雙斜線\\. "M(0) P(0) List(n)" 
      var i=5;
      // for (; i < tables.length; i++) {
        var table = tables.eq(i); 
        if(table.length>0){
            //Logger.log("["+i+"]table:"+table);
            var aa = table.find('.none');
            for(var j=0;j<aa.length;j++){
                row++;
                var value = aa.eq(j).text();
                var values = value.split(" ");
                //Logger.log("["+j+"]aa: NO.:"+values[0]+" / name:"+values[1]+" ,type:"+type);
                NameSheet.getRange(row,1).setValue(Classs);
                NameSheet.getRange(row,2).setValue(values[0]);
                NameSheet.getRange(row,3).setValue(values[1]);
                NameSheet.getRange(row,4).setValue(type);
                var mode = 2;
                if(URL.includes("tse=1"))
                  mode=2;//上市
                else
                  mode=4;//上櫃
                NameSheet.getRange(row,5).setValue(mode);
            }
              
        }
      //}
  }

  function getData(Sheet){
        var data = new Object;
        var dataArray = [];
        try{
            //freezLock(10*1000);
            var startRow = 2;
            var startColumn = 1;
            var lastColumn = 10;
            var lastRow = Sheet.getLastRow();
            var SheetDate = Sheet.getSheetValues(startRow,startColumn,lastRow,lastColumn);
          
            for(var j in SheetDate){
              try{
                var tempData = new Object();
                var type =SheetDate[j][0]; //A
                var Name = SheetDate[j][1];//B
                if(Name=='' || Name=='#N/A')
                    break;
                Logger.log("["+j+"]Name:"+Name);
                if((j>31 && j<37 )||(j>65) )
                  continue;
                tempData.type = type;
                tempData.Name = Name;
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

