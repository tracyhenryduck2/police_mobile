package com.police_mobile;

import com.police_mobile.R;
import com.police_mobile.util.Session;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;
import android.widget.RadioGroup.OnCheckedChangeListener;
import android.widget.TextView;

public class HomeActivity extends FragmentActivity{

	private RadioGroup bottomRg;
	private RadioButton radio;
	private TextView titleView;
	private static Fragment[] fragmens=new Fragment[3];
	private Fragment curFragment=null;
	
	@Override  
    protected void onCreate(Bundle savedInstanceState) {  
        super.onCreate(savedInstanceState);  
        setContentView(R.layout.home_group);  
        initView();
        initFrament();  
    }
	
	public static void refresh(){
		try{
			for(int i=0;i<fragmens.length;i++){
				Log.i("v","haha");
			if((HomeFragment)fragmens[i]!=null)	((HomeFragment)fragmens[i]).refresh();			
			}	
		}catch(Exception e){
			
		}
		
	}
	
	public void onResume(){
		super.onResume();
		if(Session.getUserJson().equals("")){
			startAct(LoginActivity.class);
		}
	}
	
	private OnClickListener cl=new OnClickListener(){
		@Override
		public void onClick(View v) {
			goSetting();
		}
	};
	
	private void startAct(Class<?> c) {
		Intent intent = new Intent();
		intent.setClass(this, c);
		startActivity(intent);
		this.finish();
	}
	
	private void goSetting(){
		Intent intent = new Intent();
		intent.setClass(this, WebActivity.class);
		intent.putExtra("url", "file:///android_asset/html/setting.html");
		startActivity(intent);
		overridePendingTransition(R.anim.right_in, R.anim.left_out);
	}
	
	private void startFragment(int id,String title,String uri){
		titleView.setText(title);
		if(fragmens[id]==null){
			fragmens[id]=new HomeFragment(uri);
		}
		switchContent(fragmens[id]);
		if(id==0){
			((HomeFragment)fragmens[0]).myResume();
		}
	}
	
	public void switchContent(Fragment to) {
		FragmentManager fragmentManager = this.getSupportFragmentManager();  
		if(curFragment==null){
			curFragment=to;
			FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();  
			fragmentTransaction.add(R.id.frame_content, curFragment);
			fragmentTransaction.commit(); 
		}else{
	            FragmentTransaction transaction = fragmentManager.beginTransaction().setCustomAnimations(
	            		R.anim.right_in, R.anim.left_out);
	            if (!to.isAdded()) {    // 先判断是否被add过
	                transaction.hide(curFragment).add(R.id.frame_content, to).commit(); // 隐藏当前的fragment，add下一个到Activity中
	            } else {
	                transaction.hide(curFragment).show(to).commit(); // 隐藏当前的fragment，显示下一个
	            }
	            curFragment = to;
		}
    }
	
	private void initFrament(){
		titleView.setText("首页");
		radio=(RadioButton)this.findViewById(R.id.rb0);
		radio.setTextColor(getResources().getColor(R.color.bottom_sel));
		setRadioImage(R.drawable.bottom_0_1);
		startFragment(0,"首页","file:///android_asset/html/index.html");
	}
	
	private void initView(){
		bottomRg = (RadioGroup) findViewById(R.id.bottomRg);
		bottomRg.setOnCheckedChangeListener(brgListener);
		this.findViewById(R.id.home_right).setOnClickListener(cl);
		titleView=(TextView)this.findViewById(R.id.title);
	}
	
	
	private void resetRadioButton(RadioButton button){
		button.setTextColor(getResources().getColor(R.color.title_bg));
		switch(button.getId()){
		case R.id.rb0:
			setRadioImage(R.drawable.bottom_0_st);
			break;
		case R.id.rb1:
			setRadioImage(R.drawable.bottom_1_st);
			break;
		case R.id.rb2:
			setRadioImage(R.drawable.bottom_2_st);
			break;
		}
	}
	
	private void setRadioImage(int id){
		Drawable myImage=getResources().getDrawable(id);
		radio.setCompoundDrawablesWithIntrinsicBounds(null, myImage, null, null);
	}
	
	/**
	 * 底部菜单事件
	 */
	private OnCheckedChangeListener brgListener=new OnCheckedChangeListener(){

		@Override
		public void onCheckedChanged(RadioGroup group, int checkedId) {
			if(radio==null||(radio!=null&&radio.getId()!=checkedId)){
				if(radio!=null){
					resetRadioButton(radio);
				}
				radio=(RadioButton)group.findViewById(checkedId);
				radio.setTextColor(getResources().getColor(R.color.bottom_sel));
				switch(checkedId){
				case R.id.rb0:
					setRadioImage(R.drawable.bottom_0_1);
					startFragment(0,"首页","file:///android_asset/html/index.html");
					break;
				case R.id.rb1:
					setRadioImage(R.drawable.bottom_1_1);
					startFragment(1,"消息","file:///android_asset/html/messageList.html");
					break;
				case R.id.rb2:
					setRadioImage(R.drawable.bottom_2_1);
					startFragment(2,"我的","file:///android_asset/html/setting.html");
					break;
				}
			}
			
		}
	};
	
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK) {
			goBack();
			return true;
		} else {
			return super.onKeyDown(keyCode, event);
		}
	}
	
	private long exitTime = 0;
	
	private void goBack(){
		if(radio.getId()!=R.id.rb0){
			((RadioButton)(this.findViewById(R.id.rb0))).setChecked(true);
		}else{
			if ((System.currentTimeMillis() - exitTime) > 2000) {
				Toast.makeText(getApplicationContext(), "再按一次退出程序",
						Toast.LENGTH_SHORT).show();
				exitTime = System.currentTimeMillis();
			} else {
				this.finish();
			}
		}
	}

}
