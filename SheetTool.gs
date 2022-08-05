

//產生新的Excel試算表單 在根目錄
function createNewSpreadsheet(title){
  let TAG = "SheetTool";
  Logger.log(TAG+'title = %s', title);
    var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var ss=SpreadsheetApp.create(title);
    Logger.log(TAG+' createNewSpreadsheet ss='+ss.getUrl() +" ss.id="+ss.getId());   
    return ss;
}


function createNewSheetTest(){
  let TAG = "SheetTool";
  var sheetName = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd_HH:mm:ss");
  const timestamp = new Date().getTime();
  createNewSheet('',timestamp+"");
  deleteSheet('',timestamp);
}

//產生新的sheet
function createNewSheet(sheetsId,tagName){
  let TAG = "SheetTool";
    try{
      Logger.log(TAG+"\""+sheetsId+"\" createNewSheet tagName:"+tagName);
      var activeSpreadsheet;
      if(sheetsId==''|| sheetsId=="undefined")
        activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      else
        activeSpreadsheet = SpreadsheetApp.openById(sheetsId);
      
      var yourNewSheet;

      //檢查是否有其他人使用一樣表單名稱
      try{
        yourNewSheet = activeSpreadsheet.getSheetByName(tagName);
      }catch(e){
        Logger.log(TAG+"createNewSheet:"+e);
      }
      
      //如果Cache 沒有儲存過，則代表該表單無人使用，可以新建表單
      if(yourNewSheet==null){
        //插入新表單
        yourNewSheet = activeSpreadsheet.insertSheet(tagName);
        
      }
      return yourNewSheet;
    }catch(e){
      Logger.log(TAG+"createNewSheet:"+e);
    }
}

//移除sheet
function deleteSheet(sheetsId,tagName){
  let TAG = "SheetTool";
  try{
      var activeSpreadsheet;
      if(sheetsId==''|| sheetsId=="undefined")
        activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      else
        activeSpreadsheet = SpreadsheetApp.openById(sheetsId);
      var yourNewSheet = activeSpreadsheet.getSheetByName(tagName);
      activeSpreadsheet.deleteSheet(yourNewSheet);
      Logger.log(TAG+'delete sheet = '+tagName);
  }catch(e){
    Logger.log(TAG+" deleteSheet:"+e);
  }
}

