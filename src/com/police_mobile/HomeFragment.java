package com.police_mobile;

import com.police_mobile.R;
import com.police_mobile.util.JsOperation;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

@SuppressLint("ValidFragment")
public class HomeFragment extends Fragment {

	private View view = null;
	private WebView webView = null;
	private String url = null;
	private JsOperation client=null;
	
	public HomeFragment() {
		super();
		// TODO Auto-generated constructor stub
	}

	public HomeFragment(String url) {
		this.url = url;
	}
	
	public void refresh(){
	
		if(webView!=null){
			webView.reload();
		}
	}
	
	public void onResume(){
		super.onResume();
		myResume();
	}
	
	public void myResume(){
		if(webView!=null){
			webView.loadUrl("javascript:MyResume();");
		}
	}
	

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		view = inflater.inflate(R.layout.home_frag, null);
		webView = (WebView) view.findViewById(R.id.toutput);
		client=new JsOperation(this.getActivity(),webView);
		init();
		int index=0;
		if((index=url.indexOf('?'))>0){
			client.setParm(url.substring(index));
			webView.loadUrl(url.substring(0,index));
		}else{
			webView.loadUrl(url);
		}
		return view;
	}
	
	private void init() {
		WebSettings webSettings = webView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		webSettings.setSaveFormData(false);
		webSettings.setSavePassword(false);
		webSettings.setSupportZoom(false);
		
		webView.setWebChromeClient(new WebChromeClient() {
			
			@Override
			public void onReceivedTitle(WebView view, String title) {
				super.onReceivedTitle(view, title);
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
		
		webView.setWebViewClient(new WebViewClient() {
			public boolean shouldOverrideUrlLoading(WebView view, String url) { // 重写此方法表明点击网页里面的链接还是在当前的webview里跳转，不跳到浏览器那边
				view.loadUrl(url);
				return true;
			}
		});
		webView.addJavascriptInterface(client, "client");
		/** 取消选择文字功能 */
		webView.setOnLongClickListener(new WebView.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                return true;
            }
        });
	}

}
