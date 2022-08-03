function getStockTypes() {
  let SpreadSheet =  SpreadsheetApp.getActiveSpreadsheet();
  let Sheet = SpreadSheet.getSheetByName('stock_class');
  var Today = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd hh:mm:ss");
  var EndTime = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd ");//搜尋內容結束時間
  var StartTime = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH");//搜尋內容起始時間
  var row=2;
   Logger.log("StartTime:"+StartTime+" / EndTime:"+EndTime+" 01");
   if(StartTime==EndTime+"01"){
      //上市
      var url ="https://tw.stock.yahoo.com/h/kimosel.php?tse=1&cat=%A5b%BE%C9%C5%E9&form=menu&form_id=stock_id&form_name=stock_name&domain=0";
      getTypes(url,"tse=1");
      //上櫃
      url ="https://tw.stock.yahoo.com/h/kimosel.php?tse=2&cat=%C2d%A5b%BE%C9&form=menu&form_id=stock_id&form_name=stock_name&domain=0";
      getTypes(url,"tse=2");
   }

   function getTypes(URL,type){
        var source = UrlFetchApp.fetch(URL);
        var html = source.getContentText('big5');
      
        //DOM解析HTML
        const $ = Cheerio.load(html,{ decodeEntities: false });
       //Logger.log("html:"+$.length+"\n"+$.html());
       var tables = $('table' );///空白採用"&nbsp;"代替 ()需要在前面加上雙斜線\\. "M(0) P(0) List(n)" 
      //  for(var i=0;i<tables.length;i++){
      //       Logger.log("["+i+"]tables:\n"+tables.eq(i).html());
      //  }
       var aa = tables.eq(3).find('a');
       for(var i=0;i<aa.length;i++){
            var typeName = aa.eq(i).text();
            if(typeName=="上櫃" || typeName=='上市'){
              continue;
            }
            Logger.log("["+i+"]aa:\n"+typeName);
            Sheet.getRange(row,1).setValue(type);
            Sheet.getRange(row,2).setValue(typeName);
            row++;
       }
   }
}

