function getStockData(URL){
    var source = UrlFetchApp.fetch(URL);
  var html = source.getContentText('UTF-8');
 
  //DOM解析HTML
  const $ = Cheerio.load(html,{ decodeEntities: false });
  //Logger.log("html:\n"+$.html());

 // 解析並抓取最外層的電影清單表格(div class=release_list) 並只取得release_info_text內電影資訊
//  var releaseList = $(".release_list li .release_info_text"); 
  var span = $('span');
  for (let i = 0; i < span.length&& i<20; i++) {
        var spanData = span.eq(i); // 擷取單一電影資訊
        if(spanData.length>0){
            Logger.log("["+i+"]span:"+spanData);
            var data = spanData+"";
            if(data.includes("trend-down")){
               Logger.log("["+i+"]span:down");
            }else if(data.includes("trend-up")){
               Logger.log("["+i+"]span:up");
            }
        }
       
  }

  //判斷正負值
  var upOrDown = "-";
  //Logger.log("find trend=up:"+span.find(".Fz(32px) Fw(b) Lh(1) Mend(16px) D(f) Ai(c) C($c-trend-down)").text());
  spanData = span.eq(14);
  var data = spanData+"";
  if(data.includes("trend-down")){
    upOrDown = "-";
  }else if(data.includes("trend-up")){
      upOrDown = "+";
  }

  //寫入資料
   sheet.getRange(1, 1).setValue(span.eq(12).text()+".tw");
   sheet.getRange(2, 1).setValue(upOrDown+" "+span.eq(14).text().trim());
    sheet.getRange(3, 1).setValue(span.eq(18).text());
  var table, tr, td;
  //表格資訊
  // table = $('table table').eq(0); 
  // tr = table.find('tr');
  // td = tr.eq(0).find('td');   
  // sheet.getRange(1, 1).setValue(td.eq(0).text().trim());
  // sheet.getRange(1, 3).setValue(td.eq(1).text().trim());
 
  //表格內容
  table = $('table table').eq(1);
  tr = table.find('tr');
   Logger.log("tr size:"+tr.length);
  for(var i = 0 ; i < tr.length ; ++i)
  {
    td = tr.eq(i).find('td');
    Logger.log("td size:"+td.length);
    for(var j = 0 ; j < td.length ; ++j)
    {
      sheet.getRange(i + 2, j + 1).setValue(td.eq(j).text().trim());
      Logger.log("td text:"+td.eq(j).text().trim());
    }
  }
  }
  
}


