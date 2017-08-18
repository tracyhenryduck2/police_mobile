package com.police_mobile.util;

import java.io.File;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;
import android.content.Context;
import android.os.Environment;
import android.util.Log;

public class BaseService {
    //public final static String ROOTPath = "111.1.3.197:88";
	//public final static String ROOTPath = "police.ztoas.com:88";
	public final static String ROOTPath = "192.168.1.103:8080";
	public final static String ServerPath = ROOTPath+"/police";
//	public final static String ServerPath = "192.168.1.110:8080/police";
//	public final static String ServerPath = "192.168.1.28";
//	public final static String ServerPath = "192.168.1.156:8080";
//	public final static String ServerPath = "26.ztoas.com:88";
	public final static String ApkVerUrl = "http://" + ROOTPath
			+ "/app/police_mobile.ver";
	public final static String ApkUrl = "http://" + ROOTPath
	+ "/app/police_mobile.apk";
	public final static String OAPath = "http://" + ServerPath + "/app";
	public final static String MessagePath = "http://" + ServerPath
			+ "/app/Indexapp!listclock.action";
	public final static String Reply = "http://" + ServerPath
			+ "/app/Indexapp!replay.action";
	private static String imagePath=null;
	public static HashMap<String,String> account_map=new HashMap<String, String>();
	private static  ServiceForAccount account=null;
	public static class UpdateInfo {
		public int code;
		public String name;

		public int getCode() {
			return code;
		}

		public void setCode(int code) {
			this.code = code;
		}
	};

	public static UpdateInfo getUpdateInfo() {
		UpdateInfo info = new UpdateInfo();
		try {
			String result = NetworkTool.getContent(ApkVerUrl);
			JSONObject objMap = new JSONObject(result);
			info.code = objMap.getInt("code");
			info.name = objMap.getString("name");
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return info;
	}

	public static int login(String user, String pwd,Context context,ServiceForAccount account) {
		try {
			String result = NetworkTool
					.getContent("http://"+ServerPath + "/app/Indexapp!index.action?username=" + user
							+ "&password=" + pwd);
			Log.i("ceshi", "result"+result);
			JSONObject objMap = new JSONObject(result);
			String status = objMap.getString("errcode");
			if (status.equals("106")) {
				JSONObject j_user=objMap.getJSONObject("user");
				Session.User sUser=new Session.User();
				sUser.setId(j_user.getInt("id"));
				sUser.setCode(j_user.getString("code"));
				sUser.setName(j_user.getString("name"));
				sUser.setPosition(j_user.getString("position"));
				sUser.setPhone(j_user.getString("phone"));
				sUser.setDepname(j_user.getString("dep_name"));
				Session.user=sUser;
							
				//set push
				String tag=""+Session.user.getId();
				account.saveKeyValue(ServiceForAccount.KEY_PUSH_KEY, tag);
				BaseService.setJPushTag(tag, context);
				return 1;
			}
			else return 0;
		
		} catch (Exception e) {
			e.printStackTrace();
		}
		return -1;
	}
	
	public static String getImagePath(Context context) {
		if (imagePath == null) {
			if (Environment.getExternalStorageState().equals(
					Environment.MEDIA_MOUNTED)) {
				// 判断sd卡是否存在
				File sdDir = Environment.getExternalStorageDirectory();// 获取跟目录
				File file = new File(sdDir.getAbsolutePath() + "/oa");
				if (file.isDirectory()) {
					imagePath = file.getAbsolutePath();
				} else {
					if (file.mkdirs()) {
						imagePath = file.getAbsolutePath();
					} else {
						imagePath = context.getFilesDir()
								.getAbsolutePath();
					}
				}
			} else {
				imagePath = context.getFilesDir().getAbsolutePath();
			}
		}
		return imagePath;
	}
	
	public static void setJPushTag(String tag, Context context) {
		Set<String> tagSet = new LinkedHashSet<String>();
		tagSet.add(tag);
		// 调用JPush API设置Tag
		JPushInterface.setTags(context, tagSet, new TagAliasCallback() {
			@Override
			public void gotResult(int code, String arg1, Set<String> arg2) {
				System.out.println("set Tag Result=" + code);
			}

		});
	}

	public static Map<String,Object> uploadPic(String picturePath,String actionName) {
		FileUpload up = new FileUpload();
		try {
				return up.sends(BaseService.OAPath+"/"+actionName+"!uploadImg.action",
						picturePath);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static void saveGlobalInfo(String key,String value,Context context){
		account = new ServiceForAccount(context);
		account.saveKeyValue(key, value);
	}
	
	public static String readGlobalInfo(String key,Context context){
		account = new ServiceForAccount(context);
		return account.getValueByKey(key);
	}
	
	public static void saveNotGlobalInfo(String key,String value)
	{
		BaseService.account_map.put(key, value);
	}
	public static String readNotGlobalInfo(String key){
		return BaseService.account_map.get(key);
	}
	
	
    public static ArrayList<MessageBean> getMessageInfo(int id){
    	try {
    		String url = MessagePath+"?noteid="+id;
			String result =NetworkTool.getContent(url);
            Log.i("ceshi",result);
			JSONArray ar = new JSONArray(result);
			ArrayList<MessageBean> beanlist = new ArrayList<MessageBean>();
			for(int i=0;i<ar.length();i++)
			{
	            MessageBean bean  = new MessageBean();
	            bean.setType(1);
	            bean.setContent(ar.getJSONObject(i).getString("msg"));
	            bean.setTime(ar.getJSONObject(i).getLong("log_time"));
	            beanlist.add(bean);
			}

			return beanlist;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
    	
    }
    
    
    public static long submitReply(int id,String name,String phone,String content){
    	
    	try {
            String s_note2 = Base64.encode(content.getBytes());
            String s_note=URLEncoder.encode(s_note2, "UTF_8");
            String name2=URLEncoder.encode(name, "UTF_8");
    		String url = Reply+"?noteid="+id+"&name="+name2+"&notephone="+phone+"&msg="+s_note;
			String result =NetworkTool.getContent(url);
            Log.i("ceshi",result);
			JSONObject obj = new JSONObject(result);
            int result2 = obj.getInt("result");
            if(result2==1){
            	
    			return obj.getLong("submit_time");
            }
            else
            {
            	return 0;
            }


		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return -1;
		}
    	
    }
}
