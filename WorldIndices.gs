function WorldIndices() {
  
  var URL = "https://tw.stock.yahoo.com/world-indices";
  getStockData(URL);

  function getStockData(URL){
    var source = UrlFetchApp.fetch(URL);
    var html = source.getContentText('UTF-8');
  
    //DOM解析HTML
    const $ = Cheerio.load(html,{ decodeEntities: false });
    //Logger.log("html:"+$.length+"\n"+$.html());
    
    var divv = $('span' );//空白採用"&nbsp;"代替 ()需要在前面加上雙斜線\\. "M(0) P(0) List(n)"
    Logger.log("divv:\n"+divv.html());
    var msg ='';
    var isGetData = false;
    var max =6;
    var count = max;
    for (let i = 0; i < divv.length; i++) {
        var divData = divv.eq(i);
        if(divData.length>0){
            Logger.log("["+i+"]divData:"+divData);
            var daata = divData.text()+"";
            if(daata.includes("道瓊工業指數")){
                isGetData = true;
            }
            if(isGetData && count>0){
              count--;
              msg+="["+i+"]"+daata+" ";
            }else{
              count = max;
              isGetData = false;
            }
        }
    }
     Logger.log("msg:\n"+msg);
  
  }

}
