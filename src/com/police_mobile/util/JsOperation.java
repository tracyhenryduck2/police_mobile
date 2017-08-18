package com.police_mobile.util;

import java.text.SimpleDateFormat;
import java.util.List;

import com.police_mobile.ChatActivity;
import com.police_mobile.InitActivity;
import com.police_mobile.LoginActivity;
import com.police_mobile.R;
import com.police_mobile.WebActivity;
import com.police_mobile.WebviewActivity;
import com.police_mobile.util.Session.Item;

import cn.jpush.android.api.JPushInterface;





import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class JsOperation {
	private Context context = null;
	private WebView webView = null;
	private String parm = null;
	private ProgressDialog progressDialog = null;
	private Dialog loadingDialog = null;
	private String ds =null;


	public JsOperation(Context context, WebView webView) {
		this.context = context;
		this.webView = webView;
	}

	public void setParm(String parm) {
		this.parm = parm;
	}

	public String getParm() {
		return parm;
	}

	public void showMsg(String str) {
		Toast.makeText(context, str, Toast.LENGTH_SHORT).show();
	}

	/**
	 * 
	 * @param type
	 *            ;Show,Dismiss,Success,Error
	 * @param msg
	 *            :提示信息
	 * @param method
	 *            :回调函数
	 */
	public void progress(String type, String text,final String method) {
		if ("Show".equals(type)) {
	        LayoutInflater inflater = LayoutInflater.from(context);  
	        View v = inflater.inflate(R.layout.loading_dialog, null);// 得到加载view  
	        LinearLayout layout = (LinearLayout) v.findViewById(R.id.dialog_view);// 加载布局  
	        // main.xml中的ImageView  
	        ImageView spaceshipImage = (ImageView) v.findViewById(R.id.img);  
	        TextView tipTextView = (TextView) v.findViewById(R.id.tipTextView);// 提示文字  
	        // 加载动画  
	        Animation hyperspaceJumpAnimation = AnimationUtils.loadAnimation(  
	                context, R.anim.loading_animation);  
	        // 使用ImageView显示动画  
	        spaceshipImage.startAnimation(hyperspaceJumpAnimation);  
	        tipTextView.setText(text);// 设置加载信息  
	        tipTextView.setTextColor(context.getResources().getColor(R.color.title_bg));
	        loadingDialog = new Dialog(context, R.style.loading_dialog);// 创建自定义样式dialog  
	  
	        loadingDialog.setCancelable(true);// 不可以用“返回键”取消  
	        loadingDialog.setContentView(layout, new LinearLayout.LayoutParams(  
	                LinearLayout.LayoutParams.WRAP_CONTENT,  
	                LinearLayout.LayoutParams.FILL_PARENT));// 设置布局  
	        
	        loadingDialog.show();
		} else {
			if (loadingDialog != null && loadingDialog.isShowing()) {
				loadingDialog.dismiss();
			}
			if (!"Dismiss".equals(type)) {
				int resId = R.drawable.success;
				if ("Error".equals(type)) {
					resId = R.drawable.error;
				}
						
				LayoutInflater inflater = ((Activity)context).getLayoutInflater();
				   View layout = inflater.inflate(R.layout.loading_dialog,
				     (ViewGroup) ((Activity)context).findViewById(R.id.dialog_view));
				   ImageView image = (ImageView) layout
				     .findViewById(R.id.img);
				   image.setImageResource(resId);
				   TextView title = (TextView) layout.findViewById(R.id.tipTextView);
				   title.setText(text);
				   title.setTextColor(context.getResources().getColor(R.color.title_bg));
				   Toast toast = new Toast(context.getApplicationContext());
				   toast.setGravity(Gravity.CENTER, 0, 0);
				   toast.setDuration(Toast.LENGTH_LONG);
				   toast.setView(layout);
				   toast.show();
								
			}
		}
		if (webView != null && method != null && method.length() > 0) {
			
	           webView.post(new Runnable() {
    	             @Override
    	             public void run() {
    	            	 webView.loadUrl("javascript:" + method);
    	             }
    	         });
			
		}
	}

	public void confirm(String title, String text, final String method) {
		Dialog dialog = new AlertDialog.Builder(context)
				.setTitle(title)
				.setMessage(text)
				// 设置内容
				.setPositiveButton("确定",// 设置确定按钮
						new DialogInterface.OnClickListener() {
							@Override
							public void onClick(DialogInterface dialog,
									int which) {
								if (webView != null) {
									webView.loadUrl("javascript:" + method);
								}
							}
						})
				.setNegativeButton("取消", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int whichButton) {
						// 点击"取消"按钮之后退出程序
					}
				}).create();// 创建
		// 显示对话框
		dialog.setCanceledOnTouchOutside(false);
		dialog.show();
	}

	public String getIpPort() {
		String result = BaseService.ServerPath;
		return result;
	}

	public String getUserJson() {
		String result = Session.getUserJson();
//		showMsg(result);
		return result;
	}

	public String getItemList(int groupId) {
		String result = Session.getItemList(groupId);
		System.out.println(result);
		return result;
	}

	public void goId(int groupId, int id) {
		// showMsg("groupId="+groupId+",id="+id);
		Item item = null;
		try {
			List<Item> itemList = Session.itemGroup.getList()[groupId];
			for (Item i : itemList) {
				if (i.getId() == id) {
					item = i;
					break;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (item != null) {
			go(item.type, item.uri);
		} else {
			showMsg("此权限您尚未开通，请联系管理员!");
		}
	}

	public void go(int type, String uri) {
		String url = null;
		if (uri == null || uri.length() == 0) {
			type = 2;
			uri = "test.html";
		}
		Class<?> c = WebActivity.class;
		if (type == 1||type==3) {
			url = uri;
		} else if (type == 2) {
			url = "file:///android_asset/html/" + uri;
		} else {
		}
		
		//类型3表示要从浏览器中打开该页面
		if(type==3)
		{
			Uri uri1 = Uri.parse(url);  
			Intent intent = new Intent(Intent.ACTION_VIEW, uri1);  
	        intent.setData(uri1);
	        startActivity(intent);  
		}
		else
		{
			Intent intent = new Intent();
			intent.setClass(context, c);
			intent.putExtra("url", url);
			startActivity(intent);
		}


	}


	public void open(String url, int blank) {
		url = "file:///android_asset/html/" + url;
		if (blank == 0) {
			if (context instanceof WebviewActivity) {
				openUrl(url);
			}
		} else {
			Intent intent = new Intent(context, WebviewActivity.class);
			intent.putExtra("url", url);
			startActivity(intent);
		}
	}
	
	public void openChat(int id,String name,String content,long time,String phone){
		Intent intent = new Intent(context, ChatActivity.class);
		intent.putExtra("id", id);
		intent.putExtra("name", name);
		intent.putExtra("content", content);
		intent.putExtra("phone", phone);
		intent.putExtra("time", time);
		startActivity(intent);
	}
	

	private void openUrl(String url) {
		int index = 0;
		if ((index = url.indexOf('?')) > 0) {
			setParm(url.substring(index));
			webView.loadUrl(url.substring(0, index));
		} else {
			webView.loadUrl(url);
		}
	}

	public void logout() {
		if (context instanceof Activity) {
			Intent intent = new Intent();
			intent.setClass(context, LoginActivity.class);
			startActivity(intent);
			((Activity)context).finish();
			((Activity)context).overridePendingTransition(R.anim.right_in, R.anim.left_out);
		}
	}

	public void call(String uri) {
		Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse(uri));
		startActivity(intent);
	}
	
	   public void sendSMS(String phoneNumber){
           Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse(phoneNumber));                
           startActivity(intent);
   }
	
	public void goBack() {
		if (context instanceof WebActivity) {
			((WebActivity) context).goBack();
		}
		if (context instanceof WebviewActivity) {
			((WebviewActivity) context).goBack();
		}
	}

	
	private void startActivity(Intent intent) {
		if (context instanceof Activity) {
			Activity a = (Activity) context;
			a.startActivity(intent);
			a.overridePendingTransition(R.anim.right_in, R.anim.left_out);
		} else {
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			context.startActivity(intent);
		}
	}

	public String getPushStatus() {
		ServiceForAccount account = new ServiceForAccount(context);
		return account.getValueByKey(ServiceForAccount.KEY_PUSH);
	}

	public void setPushStatus(String status) {
		ServiceForAccount account = new ServiceForAccount(context);
		account.saveKeyValue(ServiceForAccount.KEY_PUSH, status);
		if ("0".equals(status)) {
			JPushInterface.stopPush(context);
		} else {
			JPushInterface.resumePush(context);
		}
	}

	public String getVerName() {
		return Config.getVerName(context, InitActivity.packageName);
	}
	public void showPhotoSheet(String actionName){
		if(context instanceof WebActivity){
			((WebActivity)context).showPhotoSheet(actionName);
		}
	}
	
	public void chooseInfo(String url){
		if(context instanceof WebActivity){
			((WebActivity)context).chooseInfo(url);
		}
	}
	
	public void refreshInfo(String info_json){
		if(context instanceof WebActivity){
			((WebActivity)context).refreshInfo(info_json);
		}
	}

	
	public void saveGlobalInfo(String key,String value){
	      BaseService.saveGlobalInfo(key,value,context);		
		}
	
	public String readGlobalInfo(String key){
		return BaseService.readGlobalInfo(key,context);
	}
		
  public void saveNotGlobalInfo(String key,String value){
	  BaseService.saveNotGlobalInfo(key,value);
		}
		
		public String readNotGlobalInfo(String key){
			return BaseService.readNotGlobalInfo(key);
		}
	
	/**
	 * 
	 * @param type
	 * 打开dialog接口，
	 * dialog类型:1.nickname;
	 *           2.sex;
	 *           3.age;
	 */
	
	public void showDialog(final int type,String title,String message,final String method){
		final CustomDialog.Builder builder = new CustomDialog.Builder(this.context);
		builder.setTitle(title);
		switch(type)
		{
		case 1:
			builder.setNickMessage(message);
			break;
		case 2:
			builder.setSex(Integer.parseInt(message));
			break;
		case 3:
			builder.setAgeMessage(message);
			break;
		case 4:
			builder.setTakePhoto(new DialogInterface.OnClickListener() {
				
				@Override
				public void onClick(DialogInterface dialog, int arg1) {
					// TODO Auto-generated method stub
		     		if (context instanceof WebActivity) {
		     			dialog.dismiss();
		    		}
				}
			}).setGetImage(new DialogInterface.OnClickListener() {
				
				@Override
				public void onClick(DialogInterface dialog, int arg1) {
					// TODO Auto-generated method stub
		     		if (context instanceof WebActivity) {
		     			dialog.dismiss();
		    		}
				}
			});
			break;
		case 5:
			break;
		}	
		
		if(type!=4)
		builder.setPositiveButton("确定", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				
				if(type==1&&(builder.getNickMessage()==null || builder.getNickMessage().equals("")))
				{
					showMsg("请输入内容");
				} else if(type==3&&(builder.getAgeMessage()==null ||builder.getAgeMessage().equals("")))
				{
					showMsg("请输入内容");
				}else if(type==3&&!builder.getAgeMessage().matches("[0-9]+"))
				{
					showMsg("年龄必须为数字");
				}
				else{
					dialog.dismiss();
					if (webView != null && method != null && method.length() > 0) {

						switch(type)
						{
						case 1:
							ds = builder.getNickMessage();
							break;
						case 2:
							ds = String.valueOf(builder.getSex());
							break;
						case 3:
							ds = builder.getAgeMessage();
							break;
						}
	           	           webView.post(new Runnable() {
	          	             @Override
	          	             public void run() {
	          	   			webView.loadUrl("javascript:" + method+"("+1+",'"+ds+"')");
	          	             }
	          	         });
			
					}
				} 
		
			}
		});
		
		if(type!=4)
		builder.setNegativeButton("取消",
				new android.content.DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int which) {
						dialog.dismiss();
					}
				});

		builder.create(type).show();
	}

}
