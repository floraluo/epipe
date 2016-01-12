angular.module('starter.filter' , [])
.filter("chineseWeek",function(){
	return function (enWeek, type) {
		var zhWeek1 = "", zhWeek2 = "";
		switch (enWeek) {
			case "Mon":
			case "Monday":
				zhWeek1 = "周一";
				zhWeek2 = "星期一"
				break;
			case "Tue":
			case "Tuesday":
				zhWeek1 = "周二";
				zhWeek2 = "星期二"
				break;
			case "Wed":
			case "Wednesday":
				zhWeek1 = "周三";
				zhWeek2 = "星期三"
				break;
			case "Thu":
			case "Thursday":
				zhWeek1 = "周四";
				zhWeek2 = "星期四"
				break;
			case "Fri":
			case "Friday":
				zhWeek1 = "周五";
				zhWeek2 = "星期五"
				break;
			case "Sat":
			case "Saturday":
				zhWeek1 = "周六";
				zhWeek2 = "星期六"
				break;
			case "Sun":
			case "Sunday":
				zhWeek1 = "周日";
				zhWeek2 = "星期天"
				break;
		}
		if(type){
			return zhWeek1;			
		}else {
			return zhWeek2;
		}
	}
})
