package com.police_mobile;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

import com.police_mobile.util.BaseService;
import com.police_mobile.util.MessageBean;
import com.police_mobile.util.MessageListViewAdapter;
import com.police_mobile.util.Session;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.LinearLayout.LayoutParams;
import android.widget.Toast;

public class ChatActivity extends Activity implements OnClickListener{
    private ArrayList<MessageBean> messagelist= new ArrayList<MessageBean>();
    private ListView listview;
    private MessageListViewAdapter adapter;
	private RelativeLayout loadingView;
	private RelativeLayout topRelay;
	private RelativeLayout root;
	private View nonet;
	private ImageButton btn_back;
	private Button btn_submit;
	private TextView title;
	private String receive_name;
	private String receive_content;
	private String receive_phone;
	private EditText edit_reply;
	private Dialog loadingDialog = null;
	private Long time;
	private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
	ArrayList<MessageBean> list2 = new ArrayList<MessageBean>();
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		setContentView(R.layout.chat);
		initView();
		Loaddata();
		initnoNetView();
		addLoading();
	}

	public void initdata(){
		messagelist.clear();
		for(int i=0;i<3;i++){
			MessageBean ms = new MessageBean();
			if(i%2==0)
			ms.setType(0);
			else
				ms.setType(1);
			ms.setTime(1455846622l);
			ms.setContent("测试测试");
			messagelist.add(ms);
		}
		adapter.setData(messagelist);
	}
	
	public void initView(){
		getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
		receive_name = getIntent().getStringExtra("name");
		receive_content = getIntent().getStringExtra("content");
		receive_phone = getIntent().getStringExtra("phone");
		time = getIntent().getLongExtra("time", -1l);
		
		listview = (ListView)findViewById(R.id.duihua);
		title    = (TextView)findViewById(R.id.title);
		if(receive_name!=null) title.setText(receive_name);
		topRelay = (RelativeLayout)findViewById(R.id.top);
		root     = (RelativeLayout)findViewById(R.id.root); 
		btn_back = (ImageButton)findViewById(R.id.back);
		btn_submit = (Button)findViewById(R.id.submit);
		btn_submit.setOnClickListener(this);
		btn_back.setOnClickListener(this);
		edit_reply = (EditText)findViewById(R.id.edit);
		adapter =new MessageListViewAdapter(this);
		listview.setAdapter(adapter);
	}
	
    private void addLoading(){
		loadingView = (RelativeLayout)LayoutInflater.from(this).inflate(R.layout.activity_view_demo, null);
		root.addView(loadingView);
		RelativeLayout.LayoutParams layout = new RelativeLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.MATCH_PARENT);

		int w = View.MeasureSpec.makeMeasureSpec(0,
                View.MeasureSpec.UNSPECIFIED);
        int h = View.MeasureSpec.makeMeasureSpec(0,
                View.MeasureSpec.UNSPECIFIED);
        topRelay.measure(w, h);
        int height = topRelay.getMeasuredHeight();
		layout.topMargin = height;
		loadingView.setLayoutParams(layout);
    }
	
    private void initnoNetView(){
      	 nonet = LayoutInflater.from(this).inflate(R.layout.nonet, null, true);
      	 nonet.setVisibility(View.INVISIBLE);
      	RelativeLayout.LayoutParams layout = new RelativeLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.MATCH_PARENT);
   	 int w = View.MeasureSpec.makeMeasureSpec(0,
                   View.MeasureSpec.UNSPECIFIED);
        int h = View.MeasureSpec.makeMeasureSpec(0,
                   View.MeasureSpec.UNSPECIFIED);
        topRelay.measure(w, h);
        int height = topRelay.getMeasuredHeight();
        layout.topMargin = height;
   	 nonet.setLayoutParams(layout);
   	 root.addView(nonet);
      }
    
    private void updateNonetShow(){
    	nonet.setVisibility(View.VISIBLE);
    	if(loadingView!=null) root.removeView(loadingView);
    	listview.setVisibility(View.INVISIBLE);
    	((Button)nonet.findViewById(R.id.shuaxin)).setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View arg0) {
				// TODO Auto-generated method stub
				nonet.setVisibility(View.INVISIBLE);
				addLoading();
				Loaddata();
			}
		});
    }
    
    private Handler handler = new Handler() {
		@SuppressWarnings("unchecked")
		@Override
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case 0:
				updateInfo((ArrayList<MessageBean>)msg.obj);
				break;
			case 1:
				updateNonetShow();
				break;
			case 2:
				dismissLoadingDialog();
				Toast.makeText(ChatActivity.this, "网络连接错误", Toast.LENGTH_SHORT).show();
				break;
			case 3:
				dismissLoadingDialog();
				Toast.makeText(ChatActivity.this, "回复失败", Toast.LENGTH_SHORT).show();
				break;
			case 4:
				dismissLoadingDialog();
				showSuccess();
				updateReply(Long.parseLong(msg.obj+""),edit_reply.getText().toString());
				break;
			}
		}
	};
	
	private void updateInfo(ArrayList<MessageBean> list){
		BaseService.saveNotGlobalInfo("read", String.valueOf(getIntent().getIntExtra("id", -1)));
		
		if(loadingView!=null) root.removeView(loadingView);
		list2.clear();
		MessageBean b = new MessageBean();
		b.setType(0);
		b.setContent(receive_content);
		b.setTime(time);
		list2.add(b);
		
		for(int i=0;i<list.size();i++)
		{
			MessageBean b2 = new MessageBean();
			b2.setType(1);
			b2.setContent(list.get(i).getContent());
			b2.setTime(list.get(i).getTime());
			list2.add(b2);
		}
		listview.setVisibility(View.VISIBLE);
		adapter.setData(list2);
	}
	
	
	private void updateReply(long time,String content){
		BaseService.saveNotGlobalInfo("submit_time", String.valueOf(time));
		BaseService.saveNotGlobalInfo("content", content);
		if(loadingView!=null) root.removeView(loadingView);
		MessageBean b = new MessageBean();
		b.setType(1);
		b.setContent(content);
		b.setTime(time);
		list2.add(b);
		adapter.setData(list2);
	}

	@Override
	public void onClick(View arg0) {
		// TODO Auto-generated method stub
		if(arg0.getId()==R.id.back){
			finish();
		}
		else if(arg0.getId()==R.id.submit){
			if(edit_reply.getText().toString().trim().equals(""))
			{
				Toast.makeText(ChatActivity.this, "请输入回复内容", Toast.LENGTH_SHORT).show();
			}
			else
			{
				submitReply(edit_reply.getText().toString().trim());
			}
		}
	}
	
    private void Loaddata(){
    	final int id = getIntent().getIntExtra("id", -1);
    	new Thread(){

			@Override
			public void run() {
				// TODO Auto-generated method stub
				ArrayList<MessageBean> bean = BaseService.getMessageInfo(id);
			 	if(bean!=null)
			 	{
			 		handler.sendMessage(handler.obtainMessage(0,bean));
			 	}
			 	else
			 	{
					handler.sendMessage(handler.obtainMessage(1));
			 	}
			 		
			}
    	
    	}.start();
    }
    
    private void submitReply(final String content){
    	showLoadingDialog();
    	new Thread(){

			@Override
			public void run() {
				// TODO Auto-generated method stub
				long submit = BaseService.submitReply(getIntent().getIntExtra("id", -1), Session.user.getName(), receive_phone, content);
			 	if(submit==0)
			 	{
			 		handler.sendMessage(handler.obtainMessage(2));
			 	}
			 	else if(submit==-1)
			 	{
					handler.sendMessage(handler.obtainMessage(3));
			 	}
			 	else
			 	{
			 		handler.sendMessage(handler.obtainMessage(4,submit));
			 	}
			 		
			}
    	
    	}.start();
    }
    
    
    private void showLoadingDialog(){
        LayoutInflater inflater = LayoutInflater.from(this); 
        View v = inflater.inflate(R.layout.loading_dialog, null);// 得到加载view  
        LinearLayout layout = (LinearLayout) v.findViewById(R.id.dialog_view);// 加载布局  
        // main.xml中的ImageView  
        ImageView spaceshipImage = (ImageView) v.findViewById(R.id.img);  
        TextView tipTextView = (TextView) v.findViewById(R.id.tipTextView);// 提示文字  
        // 加载动画  
        Animation hyperspaceJumpAnimation = AnimationUtils.loadAnimation(  
                this, R.anim.loading_animation);  
        // 使用ImageView显示动画  
        spaceshipImage.startAnimation(hyperspaceJumpAnimation);  
        tipTextView.setText("发送中");// 设置加载信息  
        tipTextView.setTextColor(getResources().getColor(R.color.title_bg));
        loadingDialog = new Dialog(this, R.style.loading_dialog);// 创建自定义样式dialog  
  
        loadingDialog.setCancelable(true);// 不可以用“返回键”取消  
        loadingDialog.setContentView(layout, new LinearLayout.LayoutParams(  
                LinearLayout.LayoutParams.WRAP_CONTENT,  
                LinearLayout.LayoutParams.FILL_PARENT));// 设置布局  
        
        loadingDialog.show();
    }
    
    private void dismissLoadingDialog(){
		if (loadingDialog != null && loadingDialog.isShowing()) {
			loadingDialog.dismiss();
		}



    }
    private void showSuccess(){
		int resId = R.drawable.success;
		
		LayoutInflater inflater = ((Activity)this).getLayoutInflater();
		   View layout = inflater.inflate(R.layout.loading_dialog,
		     (ViewGroup) ((Activity)this).findViewById(R.id.dialog_view));
		   ImageView image = (ImageView) layout
		     .findViewById(R.id.img);
		   image.setImageResource(resId);
		   TextView title = (TextView) layout.findViewById(R.id.tipTextView);
		   title.setText("回复成功");
		   title.setTextColor(getResources().getColor(R.color.title_bg));
		   Toast toast = new Toast(getApplicationContext());
		   toast.setGravity(Gravity.CENTER, 0, 0);
		   toast.setDuration(Toast.LENGTH_SHORT);
		   toast.setView(layout);
		   toast.show();
    }
    
}
