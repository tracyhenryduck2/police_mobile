package com.police_mobile.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;










import com.police_mobile.R;

import android.content.Context;
import android.graphics.Color;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;



public class MessageListViewAdapter extends BaseAdapter {

	private static final String TAG = "CommentListViewAdapter";
	private LayoutInflater inflater;
	private Context context;
	private ArrayList<MessageBean> messagelist;
	private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	public MessageListViewAdapter(Context context) {
		this.context = context;
		this.messagelist = new ArrayList<MessageBean>();
		inflater = LayoutInflater.from(context);
	}

	@Override
	public int getCount() {

		return messagelist.size();
	}
	
    public void setData(List<MessageBean> data) {


    	messagelist.clear();
        if (data != null) {
            for (MessageBean appEntry : data) {
            	messagelist.add(appEntry);
            }
        }
        notifyDataSetChanged();
    }

	@Override
	public MessageBean getItem(int arg0) {

		return messagelist.get(arg0);
	}

	@Override
	public long getItemId(int arg0) {

		return arg0;
	}

	public class ViewHolder {

		private TextView mTextView_time;
		private TextView mTextView_content_receive;
		private TextView mTextView_content_send;

	}

	@Override
	public View getView(int arg0, View convertView, ViewGroup arg2) {

        View view;
		ViewHolder viewHolder;
		if (convertView == null || convertView.getTag() == null) {
			
			
			view = LayoutInflater.from(context).inflate(R.layout.chat_item, null);
			viewHolder = new ViewHolder();
			viewHolder.mTextView_time = (TextView)view.findViewById(R.id.time);
			viewHolder.mTextView_content_receive = (TextView)view.findViewById(R.id.content_receive);
			viewHolder.mTextView_content_send = (TextView)view.findViewById(R.id.content_send);
			view.setTag(viewHolder);
			
		} else {
            view = convertView;
            viewHolder = (ViewHolder) view.getTag();
		}
		MessageBean  message = getItem(arg0);
		Log.i("ceshi","message.getTime()"+message.getTime());
		viewHolder.mTextView_time.setText(sdf.format(new Date(message.getTime()*1000)));

		if(message.getType()==0)
		{
			viewHolder.mTextView_content_send.setVisibility(View.GONE);
			viewHolder.mTextView_content_receive.setVisibility(View.VISIBLE);
			viewHolder.mTextView_content_receive.setText(message.getContent());

		}
		else
		{
			viewHolder.mTextView_content_send.setVisibility(View.VISIBLE);
			viewHolder.mTextView_content_receive.setVisibility(View.GONE);
			viewHolder.mTextView_content_send.setText(message.getContent());

		}
		return view;

	}
}
