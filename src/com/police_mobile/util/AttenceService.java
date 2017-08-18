package com.police_mobile.util;

import java.net.URLEncoder;

import org.json.JSONObject;

import android.content.Context;
import android.telephony.TelephonyManager;

public class AttenceService {

	public static class Attence{
		public String date;
		public int weekDay;
		public String inTime;
		public String outTime;
		public int id;
		public String getDate(){
			String result=date+"(星期";
			switch(weekDay){
			case 1:
				result+="日";
				break;
			case 2:
				result+="一";
				break;
			case 3:
				result+="二";
				break;
			case 4:
				result+="三";
				break;
			case 5:
				result+="四";
				break;
			case 6:
				result+="五";
				break;
			case 7:
				result+="六";
				break;
			}
			result+=")";
			return result;
		}
	}
	
	public static Attence getAttence(int userId){
		String url=BaseService.OAPath+"/AttenceSign!isSignIn.action?userId="+userId;
		Attence attence=new Attence();
		try {
			String result = NetworkTool
					.getContent(url);
			JSONObject objMap = new JSONObject(result);
			attence.date=objMap.getString("date");
			attence.weekDay=objMap.getInt("weekDay");
			JSONObject map=objMap.getJSONObject("map");
			if(map!=null){
				attence.id=map.getInt("id");
				attence.inTime=map.getString("in_time");
				attence.outTime=map.getString("out_time");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return attence;
	}
	
	public static int signe(String note,String path,String addr,double latitude,double longitude,Context context){
		FileUpload up = new FileUpload();
		try {
			String s_addr = URLEncoder.encode(addr, "UTF_8");

				String s_note=URLEncoder.encode(note, "UTF_8");
				TelephonyManager telephonyManager=(TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
				String imei=telephonyManager.getDeviceId();
				if(path==null||path==""){
					return up.sendNotPic(BaseService.OAPath+"/AttenceOuter!sign.action?address="
				+s_addr+"&lng="+longitude+"&lat="+latitude+"&userId="+Session.user.getId()+"&deptId="+Session.branch.getDeptId()+"&note="+s_note+"&imei="+imei);
				}else{
					return up.send(BaseService.OAPath+"/AttenceOuter!sign.action?address="
							+s_addr+"&lng="+longitude+"&lat="+latitude+"&userId="+Session.user.getId()+"&deptId="+Session.branch.getDeptId()+"&note="+s_note+"&imei="+imei,
					        path);	
				}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0;
	}
}
