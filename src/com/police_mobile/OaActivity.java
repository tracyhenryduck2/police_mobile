package com.police_mobile;

import com.police_mobile.R;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

@SuppressLint("SetJavaScriptEnabled")
public class OaActivity extends Activity {
	 private TextView result;
     private EditText editText;
     private WebView webView;
     private String[] url = {"file:///android_asset/project/projectList.html"};
     private String[] chooseStr={"测试"};
     private Handler tHandler = new Handler();
             
 @Override
 public void onCreate(Bundle savedInstanceState) {
     super.onCreate(savedInstanceState);
     setContentView(R.layout.main);
     webView=(WebView)findViewById(R.id.toutput);
     final Button submit=(Button)findViewById(R.id.submit);
     editText=(EditText)findViewById(R.id.tinput);
     result=(TextView)findViewById(R.id.result);
     final Spinner l_select=(Spinner)findViewById(R.id.l_select);

     ArrayAdapter<String> adapter=new ArrayAdapter<String>(this, 
                     android.R.layout.simple_spinner_item,chooseStr);
     adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item); 
     l_select.setPrompt("请选择翻译的方式");
     l_select.setOnItemSelectedListener(new OnItemSelectedListener() {

					@Override
					public void onItemSelected(AdapterView<?> arg0, View arg1,
							int arg2, long arg3) {
						if(((TextView)arg1).getText()==chooseStr[0])
                            webView.loadUrl(url[0]);
					}

					@Override
					public void onNothingSelected(AdapterView<?> arg0) {
						 webView.loadUrl(url[0]);
						
					}
             });
     l_select.setAdapter(adapter);
     
     WebSettings webSettings = webView.getSettings();
     webSettings.setJavaScriptEnabled(true);
     webSettings.setSaveFormData(false);
     webSettings.setSavePassword(false);
     webSettings.setSupportZoom(false);
     
     webView.setWebViewClient(new WebViewClient() {
 		public boolean shouldOverrideUrlLoading(WebView view, String url)
         { //  重写此方法表明点击网页里面的链接还是在当前的webview里跳转，不跳到浏览器那边
                 view.loadUrl(url);
                 return true;
         }

 });
     
     submit.setOnClickListener(new OnClickListener() {                        
                     @Override
                     public void onClick(View v) {
                             result.setVisibility(TextView.VISIBLE);
                             webView.setVisibility(WebView.VISIBLE);
                             tHandler.post(new Runnable(){
                             public void run(){
                               if (editText.getText().toString() != ""){
                                       webView.loadUrl("javascript:translate('"+ 
                                                       editText.getText().toString() + "')");
                               }
                             }
                         });
                     }
             });
 }
}