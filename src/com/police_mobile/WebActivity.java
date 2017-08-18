package com.police_mobile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import cn.jpush.android.api.JPushInterface;





import com.police_mobile.R;
import com.police_mobile.util.AndroidHenryUtl;
import com.police_mobile.util.AttenceService;
import com.police_mobile.util.BaseService;
import com.police_mobile.util.Config;
import com.police_mobile.util.ConfirmDialog;
import com.police_mobile.util.FileUpload;
import com.police_mobile.util.JsOperation;
import com.police_mobile.util.ServiceForAccount;
import com.police_mobile.util.BaseService.UpdateInfo;
import com.police_mobile.util.Session;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.provider.MediaStore;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.WindowManager;
import android.webkit.DownloadListener;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

@TargetApi(Build.VERSION_CODES.HONEYCOMB)
public class WebActivity extends Activity {

	private WebView webView = null;
	private JsOperation client=null;
	private TextView titleView = null;
	private static WebActivity act=null;
	private final String IMAGE_TYPE = "image/*";
	private final int IMAGE_CODE = 0;   //这里的IMAGE_CODE是自己任意定义的
	private final int CHOOSE_INFO=1;  //回调人员选择

	private int result;
	private String actionName=null;
	String picturePath;
	String picPath;
	String filename;
	private ProgressDialog pBar;
	public static String packageName = null;
	private int progress = 0;
	private final static int DOWN_UPDATE = 11;
	private ImageButton btn_setting;
	private TextView    btn_loginout;
	
	
	private long exitTime = 0;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		act=this;
		setContentView(R.layout.web);
		webView = (WebView) findViewById(R.id.toutput);
		client=new JsOperation(this,webView);
		init();
		String url = getIntent().getStringExtra("url");
		if(url==null)
		url = "file:///android_asset/html/messageList.html";
		open(url);
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		JPushInterface.onResume(this);
		if(webView!=null) webView.loadUrl("javascript:MyResume();");
	}

	@Override
	protected void onPause() {
		super.onPause();
		JPushInterface.onPause(this);

	}
	
	private void open(String url){
		int index=0;
		if((index=url.indexOf('?'))>0){
			client.setParm(url.substring(index));
			webView.loadUrl(url.substring(0,index));
		}else{
			webView.loadUrl(url);
		}
	}
	
	public static void refresh(){
		try{
			act.webView.reload();
		}catch(Exception e){
			
		}
	}

	private void init() {
		initWebView();
		btn_setting = (ImageButton)findViewById(R.id.home);
		btn_loginout = (TextView)findViewById(R.id.back);
		titleView = (TextView)findViewById(R.id.title);
		btn_setting.setOnClickListener(cl);
		btn_loginout.setOnClickListener(cl);
	}

	private OnClickListener cl = new OnClickListener() {
		@Override
		public void onClick(View v) {
			if (v.getId() == R.id.back) {
				confirm("确认","确定要退出吗？");

			} else if(v.getId()==R.id.home){
				//先提示再退出
				client.open("updateCode.html", 1);
			}
		}
	};

	private void initWebView() {
		WebSettings webSettings = webView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		webSettings.setSaveFormData(false);
		webSettings.setSavePassword(false);
		webSettings.setSupportZoom(false);
		webSettings.setAppCacheEnabled(true);
		webView.addJavascriptInterface(client, "client");
		/* 获取标题 */
		webView.setWebChromeClient(new WebChromeClient() {
			
			@Override
			public void onReceivedTitle(WebView view, String title) {
				super.onReceivedTitle(view, title);
				titleView.setText(title);
			}
			@Override
			public void onProgressChanged(WebView view, int newProgress) {
				// TODO Auto-generated method stub
				super.onProgressChanged(view, newProgress);
				if(newProgress==100){
					webView.loadUrl("javascript:addNativeOK()");
				}
			}
			
		});
		
		
		
		/** 设置在同一webview加载 */
		webView.setWebViewClient(new WebViewClient() {
			public boolean shouldOverrideUrlLoading(WebView view, String url) { // 重写此方法表明点击网页里面的链接还是在当前的webview里跳转，不跳到浏览器那边
 
		         if(url.indexOf(".jpg")!=-1 || url.indexOf(".jpeg")!=-1 || url.indexOf(".png")!=-1 || url.indexOf(".bmp")!=-1 || url.indexOf(".gif")!=-1)
		         {
		              Uri uri = Uri.parse(url); //url为你要链接的地址  
		    		  
		              Intent intent =new Intent(Intent.ACTION_VIEW, uri);  
		              intent.setDataAndType(uri, "image/*");
		              startActivity(intent);   
		         }
		         else  view.loadUrl(url);
 
				return true;
			}

		});
		/** 取消选择文字功能 */
		webView.setOnLongClickListener(new WebView.OnLongClickListener() {
			@Override
			public boolean onLongClick(View v) {
				return true;
			}
		});
		webView.setDownloadListener(new DownloadListener(){
			@Override
			public void onDownloadStart(String url, String userAgent, String contentDisposition,
					String mimetype, long contentLength) {
				Uri uri = Uri.parse(url);  
				Intent intent = new Intent(Intent.ACTION_VIEW, uri);  
				startActivity(intent);
			}
		});
		
	}

	
//	/** 
//     * 这个函数是用来处理 当进行goBack的时候 使用前一个页面的缓存 避免每次都从新载入 
//     * @param webSettings webView的settings 
//     */  
//    protected void setPageCacheCapacity(WebSettings webSettings) {  
//        try {  
//            Class<?> c = Class.forName("android.webkit.WebSettingsClassic");  
//  
//            Method tt = c.getMethod("setPageCacheCapacity", new Class[] { int.class });  
//  
//            tt.invoke(webSettings, 5);  
//  
//        } catch (ClassNotFoundException e) {  
//            System.out.println("No such class: " + e);  
//        } catch (NoSuchMethodException e) {  
//            // TODO Auto-generated catch block  
//            e.printStackTrace();  
//        } catch (IllegalArgumentException e) {  
//            // TODO Auto-generated catch block  
//            e.printStackTrace();  
//        } catch (IllegalAccessException e) {  
//            // TODO Auto-generated catch block  
//            e.printStackTrace();  
//        } catch (InvocationTargetException e) {  
//            // TODO Auto-generated catch block  
//            e.printStackTrace();  
//        }  
//    }
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK) {
			goBack();
			return true;
		} else {
			return super.onKeyDown(keyCode, event);
		}
	}

	
	public void loginout(){
		Session.user = null;
		startAct(LoginActivity.class);
	}
	
	public void goBack() {
		//先判断本页面后退
		if("1".equals(client.getParm())){
			webView.loadUrl("javascript:goBack();");
		}else{
			if (webView.canGoBack()) {
				webView.goBack(); // 后退
				//webView.reload();
			} else {
				if ((System.currentTimeMillis() - exitTime) > 2000) {
					Toast.makeText(getApplicationContext(), "再按一次退出警民通",
							Toast.LENGTH_SHORT).show();
					exitTime = System.currentTimeMillis();
				} else {
					this.finish();
				}
				//overridePendingTransition(R.anim.right_in, R.anim.left_out);
			}
		}
	}
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (resultCode != RESULT_OK) {        //此处的 RESULT_OK 是系统自定义得一个常量
	        return;
	    }
	    //此处的用于判断接收的Activity是不是你想要的那个
	    if (requestCode == IMAGE_CODE) {
	    	   Uri selectedImage = data.getData();
//	    	   String[] filePathColumns={MediaStore.Images.Media.DATA};
//	    	   Cursor c = this.getContentResolver().query(selectedImage, filePathColumns, null,null, null);
//	    	   c.moveToFirst();
//	    	   int columnIndex = c.getColumnIndex(filePathColumns[0]);
//	    	   picturePath= c.getString(columnIndex);
//	    	   c.close();
	    	   
	    	   picturePath = FileUpload.getPath(this, selectedImage);
	    	   	    	   
	    	   uploadImg();
	    }
	    
	    if(requestCode==CHOOSE_INFO)
	    {
	        Bundle buddle = data.getExtras();   
	        String info = buddle.getString("info");   
	        webView.loadUrl("javascript:refreshInfo('"+info+"')");
	    }
	}

	private void uploadImg() {
		new Thread(){
			public void run(){
				System.out.println("小亨上传:"+picturePath);
				Map<String,Object> map = new HashMap<String, Object>();
				if((map=BaseService.uploadPic(picturePath,actionName))!=null)
				{
					result=(Integer)map.get("result");
					picPath=map.get("filePath").toString();
					filename = map.get("filename").toString();
				}
				handler.sendMessage(handler.obtainMessage(0));
			}
		}.start();
	}
	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			OnResult();
			OnRefresh();
		}
	};
	private void OnRefresh(){
		webView.loadUrl("javascript:RefreshImage('"+ 
                picPath +"','"+filename+ "')");
	}
	private void OnResult(){
		if(result==0){
			showMsg("提交失败，请稍后重试...");
		}else if(result==1){
			showMsg("提交成功");
		}else{
			showMsg("重新提交成功");
		}
	}
	public void showMsg(String str) {
		Toast.makeText(this,str, Toast.LENGTH_SHORT).show();
	}
	
	public void showPhotoSheet(String actName) {
		actionName = actName;
		Intent intent=new Intent(Intent.ACTION_GET_CONTENT);
		intent.addCategory(Intent.CATEGORY_OPENABLE); 
	    intent.setType(IMAGE_TYPE);
        //Intent intent = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);  
	    startActivityForResult(intent, IMAGE_CODE);
	}
    
	public void chooseInfo(String url){
		Intent intent = new Intent();
		intent.setClass(this, WebActivity.class);
		intent.putExtra("url", "file:///android_asset/html/"+url);
		startActivityForResult(intent, CHOOSE_INFO);
	}
	
   public void refreshInfo(String info_json){
       Intent intent = new Intent(this, WebActivity.class);   
       intent.putExtra("info", info_json);
       setResult(RESULT_OK, intent);  
       this.finish(); 
   }
   

	



	private void startAct(Class<?> c) {
		Intent intent = new Intent();
		intent.setClass(WebActivity.this, c);
		startActivity(intent);
		this.finish();
		overridePendingTransition(R.anim.right_in, R.anim.left_out);
	}
	
	public void confirm(String title, String text) {
		ConfirmDialog dialog = new ConfirmDialog.Builder(this)
				.setTitle(title)
				.setContent(text)
				// 设置内容
				.setPositiveButton("确定",// 设置确定按钮
						new DialogInterface.OnClickListener() {
							@Override
							public void onClick(DialogInterface dialog,
									int which) {
								  dialog.dismiss();
									loginout();
							}
						})
				.setNegativeButton("取消", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int whichButton) {
						// 点击"取消"按钮之后退出程序
						dialog.dismiss();
					}
				}).create();// 创建
		// 显示对话框
		dialog.setCanceledOnTouchOutside(false);
		dialog.show();
	}

	
}
