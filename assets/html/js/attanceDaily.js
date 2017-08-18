function initial(){
      
      var Datelst = [31,28,31,30,31,30,31,31,30,31,30,31];
          
      var showyear = new Date().getFullYear();//获取当前系统日期;
      var showmonth  = (new Date().getMonth())+1;//获取当前系统日期;

      $("#year").html(showyear);
      $("#month").html(showmonth);

      var details = {late_leaveEarly:null,not_aboard:null,total_casual_leave:null,total_other_leave:null};
 
 /*初始化定义二维数组显示日期内容*/
      
      var dailys = new Array();   //先声明一维
      for(var k=0;k<6;k++){        //一维长度为i,i为变量，可以根据实际情况改变

       var dailys2=new Array();    //声明二维，每一个一维数组里面的一个元素都是一个数组；

      for(var j=0;j<7;j++){      //一维数组里面每个元素数组可以包含的数量p，p也是一个变量；

      var dsa = {date:null,status:null,monthflag:null};
      dailys2.push(dsa);

       }

      dailys.push(dailys2);
      }

  
      var buffDateListShow = new Array();
      var buffMonthflagListShow = new Array();
      var buffStateListShow = new Array();
      //var url = "oa.zhetian.net";
   
      var url = getPath();
      //var url = "192.168.1.26";  
      //var user={id:1};
      var user=getUser();
      buffStateListShow.length = 0; //清空数组
      creatMask();
      $.ajax({
         type:"post",
         url:"http://"+url+"/oa/App/AppAttenceLog!getAttenceLog.action",
         data:"selectMonth="+showyear+"-"+showmonth+"&userId="+user.id,
         success:function(data){
             var list = eval("("+data+")");
                   for(var p in list.userList[0])
                    {
                       var manzu_of_d = new RegExp(/^(d)[0-9]{1,2}$/g); //每次过滤都需new 否则会丢失某些元素

                      if(manzu_of_d.test(p)===true&&Number(p.substr(1))>0) 
                      { 
                       /*数据过滤，若为0则显示√，若不为零显示整数或者保留一位小数*/   
                       if( list.userList[0][p] == 0)
                       {
                            buffStateListShow[Number(p.substr(1))-1] = "√";
                       }
                       else
                      {
                          buffStateListShow[Number(p.substr(1))-1] = toDecimal(list.userList[0][p]); 
                      }
                       }
                    } 
                   details.late_leaveEarly = (list.userList[0]["late_early"]==null? "":list.userList[0]["late_early"]) ;
                   details.not_aboard = (list.userList[0]["away"]==null? "":list.userList[0]["away"]) ;
                   details.total_casual_leave =(list.userList[0]["leave_time"]==null? "":list.userList[0]["leave_time"]);
                   details.total_other_leave = (list.userList[0]["marry"]==null? "":list.userList[0]["marry"]);
          

                   $("#lateorearly .neir").eq(0).html(details.late_leaveEarly+"次");
                   $("#notattance .neir").eq(0).html(details.not_aboard+"次");
                   $("#absent .neir").eq(0).html(details.total_casual_leave+"小时");
                   $("#other .neir").eq(0).html(details.total_other_leave+"天");

                  show(showyear,showmonth);
                  var html ="";
                   for(var i=0; i<6;i++)
                   {   
                       html+='<tr>';
                       for(var j=0;j<7;j++)
                       { 
                         
                        if(dailys[i][j].monthflag) html+='<td class="thisMonth" onclick="opendetail('+dailys[i][j].date+',true,'+'\''+dailys[i][j].status+'\''+','+showyear+','+showmonth+')">';
                        else                       html+='<td onclick="opendetail('+dailys[i][j].date+',false,'+'\''+dailys[i][j].status+'\''+','+showyear+','+showmonth+')">';

                         html+=dailys[i][j].date;
                         html+='<span style="display:block;height:50%;margin: 0px auto;text-decoration:underline;width: 28px;">';
                         html+=(dailys[i][j].status==null||dailys[i][j].status==undefined)?"":dailys[i][j].status;
                         html+='</span></td>';
                       }
                       html+='</tr>';
                     
                   }
                   $("#showdate").html(html);
                   removeMask();
         }

      });


/************************************************************/





      function clickLastMonth(){
          buffStateListShow.length = 0; //清空数组
          if(showmonth>1)  showmonth-=1; 
          else 
          {
              if(showyear>2005)
              {
                showyear -=1; 
                showmonth=12;  
              } 
          }
              $("#year").html(showyear);
             $("#month").html(showmonth);
       $.ajax({
         type:"post",
         url:"http://"+url+"/oa/App/AppAttenceLog!getAttenceLog.action",
         data:"selectMonth="+showyear+"-"+showmonth+"&userId="+user.id,
         success:function(data){
             var list = eval("("+data+")");
             console.log(list);
                   for(var p in list.userList[0])
                    {
                       var manzu_of_d = new RegExp(/^(d)[0-9]{1,2}$/g); //每次过滤都需new 否则会丢失某些元素

                      if(manzu_of_d.test(p)===true&&Number(p.substr(1))>0) 
                      { 
                       /*数据过滤，若为0则显示√，若不为零显示整数或者保留一位小数*/   
                       if( list.userList[0][p] == 0)
                       {
                            buffStateListShow[Number(p.substr(1))-1] = "√";
                       }
                       else
                      {
                          buffStateListShow[Number(p.substr(1))-1] = toDecimal(list.userList[0][p]); 
                      }
                       }
                    } 
                  details.late_leaveEarly = (list.userList[0]["late_early"]==null? "":list.userList[0]["late_early"]) ;
                   details.not_aboard = (list.userList[0]["away"]==null? "":list.userList[0]["away"]) ;
                   details.total_casual_leave =(list.userList[0]["leave_time"]==null? "":list.userList[0]["leave_time"]);
                   details.total_other_leave = (list.userList[0]["marry"]==null? "":list.userList[0]["marry"]);
          

                   $("#lateorearly .neir").eq(0).html(details.late_leaveEarly+"次");
                   $("#notattance .neir").eq(0).html(details.not_aboard+"次");
                   $("#absent .neir").eq(0).html(details.total_casual_leave+"小时");
                   $("#other .neir").eq(0).html(details.total_other_leave+"天");

                  show(showyear,showmonth);
                  var html ="";
                   for(var i=0; i<6;i++)
                   {   
                       html+='<tr>';
                       for(var j=0;j<7;j++)
                       { 
                         
                        if(dailys[i][j].monthflag) html+='<td class="thisMonth" onclick="opendetail('+dailys[i][j].date+',true,'+'\''+dailys[i][j].status+'\''+','+showyear+','+showmonth+')">';
                        else                       html+='<td onclick="opendetail('+dailys[i][j].date+',false,'+'\''+dailys[i][j].status+'\''+','+showyear+','+showmonth+')">';

                         html+=dailys[i][j].date;
                         html+='<span style="display:block;height:50%;margin: 0px auto;text-decoration:underline;width: 28px;">';
                         html+=(dailys[i][j].status==null||dailys[i][j].status==undefined)?"":dailys[i][j].status;
                         html+='</span></td>';
                       }
                       html+='</tr>';
                     
                   }
                   $("#showdate").html(html);
         }

      });  

  
      }


        function clickNextMonth(){
          buffStateListShow.length = 0; //清空数组
          if(showmonth<12)  showmonth+=1; 
          else {
                  showyear +=1; 
                  showmonth=1;  
               }

          $("#year").html(showyear);
          $("#month").html(showmonth);    

       $.ajax({
         type:"post",
         url:"http://"+url+"/oa/App/AppAttenceLog!getAttenceLog.action",
         data:"selectMonth="+showyear+"-"+showmonth+"&userId="+user.id,
         success:function(data){
             var list = eval("("+data+")");
              console.log(list);
                   for(var p in list.userList[0])
                    {
                       var manzu_of_d = new RegExp(/^(d)[0-9]{1,2}$/g); //每次过滤都需new 否则会丢失某些元素

                      if(manzu_of_d.test(p)===true&&Number(p.substr(1))>0) 
                      { 
                       /*数据过滤，若为0则显示√，若不为零显示整数或者保留一位小数*/   
                       if( list.userList[0][p] == 0)
                       {
                            buffStateListShow[Number(p.substr(1))-1] = "√";
                       }
                       else
                      {
                          buffStateListShow[Number(p.substr(1))-1] = toDecimal(list.userList[0][p]); 
                      }
                       }
                    } 
                  details.late_leaveEarly = (list.userList[0]["late_early"]==null? "":list.userList[0]["late_early"]) ;
                   details.not_aboard = (list.userList[0]["away"]==null? "":list.userList[0]["away"]) ;
                   details.total_casual_leave =(list.userList[0]["leave_time"]==null? "":list.userList[0]["leave_time"]);
                   details.total_other_leave = (list.userList[0]["marry"]==null? "":list.userList[0]["marry"]);
          

                   $("#lateorearly .neir").eq(0).html(details.late_leaveEarly+"次");
                   $("#notattance .neir").eq(0).html(details.not_aboard+"次");
                   $("#absent .neir").eq(0).html(details.total_casual_leave+"小时");
                   $("#other .neir").eq(0).html(details.total_other_leave+"天");

                  show(showyear,showmonth);
                  var html ="";
                   for(var i=0; i<6;i++)
                   {   
                       html+='<tr>';
                       for(var j=0;j<7;j++)
                       { 
                         
                        if(dailys[i][j].monthflag) html+='<td class="thisMonth" onclick="opendetail('+dailys[i][j].date+',true,'+'\''+dailys[i][j].status+'\''+','+showyear+','+showmonth+')">';
                        else                       html+='<td onclick="opendetail('+dailys[i][j].date+',false,'+'\''+dailys[i][j].status+'\''+','+showyear+','+showmonth+')">';

                         html+=dailys[i][j].date;
                         html+='<span style="display:block;height:50%;margin: 0px auto;text-decoration:underline;width: 28px;">';
                         html+=(dailys[i][j].status==null||dailys[i][j].status==undefined)?"":dailys[i][j].status;
                         html+='</span></td>';
                       }
                       html+='</tr>';
                     
                   }
                   $("#showdate").html(html);
         }

      });


      }


/************************************************************/      
      /*
        ***
        **显示当月日期，包括前面以及后面衔接的月份的天数显示
        ***
       */
      function show(showyear,showmonth){
            var front_day = null;//显示前一个月的天数
            var after_day = null;//显示后一个月的天数
            var total_day = 0;
            var front_month = (parseInt(showmonth)-1); //前一个月的月份
         if(parseInt(showyear)>2005)//从2005年1月开始计数
           {
              
            var remainder = ((parseInt((parseInt(showyear)-1)/4)-501)%7+(parseInt(showyear)-2006)%7)%7;
             
             total_day = 0;
            for(var j=0;j<(parseInt(showmonth)-1);j++)
            {
             if(j==1&&showyear%4==0) total_day+=(Datelst[j]+1);
             else                           total_day+=Datelst[j];   //闰年二月份多加一天
            }
            
            front_day=((total_day+remainder)%7 == 0?7:(total_day+remainder)%7); 
            after_day=42-Datelst[parseInt(showmonth)-1]-front_day;
           }
          else //若为2005年则计算天数得出前面的余数，即为上个月的显示天数
          {
            total_day = 0;
            for(var i=0;i<(parseInt(showmonth)-1);i++)
            {
             if(i==1&&showyear%4==0) total_day+=(Datelst[i]+1);
             else                           total_day+=Datelst[i];
            }
              front_day=((total_day+6)%7 == 0?7:(total_day+6)%7);
              after_day=42-Datelst[parseInt(showmonth)-1]-front_day;
          }
            
            //得到前一个月和后一个月要显示的天数，设置显示MODEL层数组

           buffDateListShow.length = 0;
           buffMonthflagListShow.length = 0;
            for(j=0;j<front_day;j++)
            {
             buffStateListShow.unshift(null); 
             buffMonthflagListShow.push(false); 
             if(parseInt(showmonth)>=2) 
             buffDateListShow.push(((showyear%4==0 && front_month==2)?Datelst[front_month-1]+1:Datelst[front_month-1])-front_day+j+1);
             else buffDateListShow.push(Datelst[11]-front_day+j+1); 
             }
             //var monthshuBuff = ((attanceAll.showyear%4 == 0 && attanceAll.showmonth==2)?attanceAll.Datelst[parseInt(attanceAll.showmonth)-1]+1:attanceAll.Datelst[parseInt(attanceAll.showmonth)-1]);
            for(j=0;j<((showyear%4 == 0 && showmonth==2)?Datelst[parseInt(showmonth)-1]+1:Datelst[parseInt(showmonth)-1]);j++)
            {
              buffDateListShow.push(j+1);
              buffMonthflagListShow.push(true); 
            }
            for(j=0;j<after_day;j++)
            {
              buffDateListShow.push(j+1);
              buffMonthflagListShow.push(false); 
            }
          
         //将此日期排列的一维数组分隔成六个星期的二维数组
         for(i=0;i<6;i++)
         {
           for(j=0;j<7;j++)
           {
            dailys[i][j].date = buffDateListShow.slice(7*i,7*(i+1))[j];
            dailys[i][j].monthflag =  buffMonthflagListShow.slice(7*i,7*(i+1))[j];
            dailys[i][j].status = buffStateListShow.slice(7*i,7*(i+1))[j];
           }
         }
         
         console.log(dailys);
         //console.log(buffStateListShow);
      }
   
$("#lastmonth").click(clickLastMonth);
$("#nextmonth").click(clickNextMonth);

 $("#lateorearly").click(function(){
     openabnorl(0,showyear,showmonth);
 });
$("#notattance").click(function(){
    openabnorl(1,showyear,showmonth);
});
$("#absent").click(function(){
    openabnorl(2,showyear,showmonth);
});
$("#other").click(function(){
    openabnorl(3,showyear,showmonth);
});


};


function openabnorl (deal,year,month){
    var url = "abnormal_list.html?deal="+deal+"&selectMonth="+year+"-"+month;
    if(isAndroid())  client.open(url,1);
    else             client.open("open",[url,"1"],
                           function(success){
                           },
                           function(error) {
                           alert("Error: \r\n"+error);
                           });


}

function opendetail(day,monthflag,status,year,month){

  if( monthflag == false || status == 'null' || status == 'undefined')
 {
   return;
 }
 else
{
  var url = "attenceDailyDetail.html?day="+day+"&selectMonth="+year+"-"+month;
  if(isAndroid())  client.open(url,1);

  else  client.open("open",[url,"1"],
                           function(success){
                           },
                           function(error) {
                           alert("Error: \r\n"+error);
                           });
}
    
}

