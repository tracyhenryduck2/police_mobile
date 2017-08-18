package com.police_mobile;

import com.police_mobile.R;
import com.police_mobile.util.BaseService;
import com.police_mobile.util.LableTextWatcher;
import com.police_mobile.util.ServiceForAccount;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

public class LoginActivity extends Activity {

	/** Called when the activity is first created. */
	private EditText usernameEdit=null;
	private EditText passwordEdit=null;
	private ImageView savePasswordImage=null;
	private ServiceForAccount account=null;
	private String save_pass=null;
	private int loginStatus;
	private String user;
	private String pwd;
	private ProgressDialog progressDialog = null;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);
        this.initView();
        this.initData();
    }
    
    private void initView(){
    	usernameEdit=(EditText)this.findViewById(R.id.username_edit);
    	passwordEdit=(EditText)this.findViewById(R.id.password_edit);
    	savePasswordImage=(ImageView)this.findViewById(R.id.save_password);
        this.findViewById(R.id.go_ok).setOnClickListener(l);
        this.findViewById(R.id.save_password_button).setOnClickListener(l);
        usernameEdit.addTextChangedListener(new LableTextWatcher(findViewById(R.id.username_lable)));
        passwordEdit.addTextChangedListener(new LableTextWatcher(findViewById(R.id.password_lable)));
    }
    
    private void initData(){
    	account = new ServiceForAccount(this);
    	user = account.getValueByKey(ServiceForAccount.KEY_USERNAME);
		save_pass=account.getValueByKey(ServiceForAccount.KEY_CheckPass);
		usernameEdit.setText(user);
		if("1".equals(save_pass)){
			pwd = account.getValueByKey(ServiceForAccount.KEY_PASSWORD);
			passwordEdit.setText(pwd);
			savePasswordImage.setImageResource(R.drawable.save_pass_1);
		}
    }
    
    private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			progressDialog.dismiss();
			switch (msg.what) {
			case 0:
				loginResult();
				break;
			}
		}
	};
	
	private void startAct(Class<?> c) {
		Intent intent = new Intent();
		intent.setClass(LoginActivity.this, c);
		startActivity(intent);
		this.finish();
		overridePendingTransition(R.anim.right_in, R.anim.left_out);
	}
	
	private void loginResult() {
		if(loginStatus==1){
			startAct(HomeActivity.class);
		}else{
			String msg="网络异常请稍后重试...";
			if(loginStatus==0){
				msg="用户名或密码填写不完整...";
			}else if(loginStatus==2){
				msg="用户名密码错误或用户已离职...";
			}
			ShowMsg(msg);
		}
	}

	private void ShowMsg(String msg) {
		Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
	}
    
    private void loginClick(){
    	progressDialog = ProgressDialog.show(LoginActivity.this, null,
				"系统登录中，请稍等...", true, true);
    	new Thread() {
			public void run() {
				login();
			}
		}.start();
    }
    
    private void login(){
    	String user=usernameEdit.getText().toString();
    	String pwd=passwordEdit.getText().toString();
    	account.saveKeyValue(ServiceForAccount.KEY_USERNAME, user);
    	if("1".equals(save_pass)){
    		System.out.println("save_pass="+save_pass);
    		account.saveKeyValue(ServiceForAccount.KEY_CheckPass,save_pass);
    		account.saveKeyValue(ServiceForAccount.KEY_PASSWORD,pwd);
    	}else{
    		account.saveKeyValue(ServiceForAccount.KEY_CheckPass,"");
    		account.saveKeyValue(ServiceForAccount.KEY_PASSWORD,"");
    	}
    	loginStatus=BaseService.login(user, pwd,this,account);
		handler.sendMessage(handler.obtainMessage(0));
    }
    
    private void savePasswordClick(){
    	if("1".equals(save_pass)){
    		save_pass=null;
    		savePasswordImage.setImageResource(R.drawable.save_pass_0);
    	}else{
    		save_pass="1";
    		savePasswordImage.setImageResource(R.drawable.save_pass_1);
    	}
    }
    
    private OnClickListener l=new OnClickListener(){

		@Override
		public void onClick(View v) {
			switch(v.getId()){
			case R.id.go_ok:
				loginClick();
				break;
			case R.id.save_password_button:
				savePasswordClick();
				break;
			}
		}
    };
    
}
