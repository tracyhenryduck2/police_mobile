package com.police_mobile.util;



import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;




import com.police_mobile.R;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.Adapter;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.AdapterViewAnimator;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.TextView;

public class CustomDialog extends Dialog {

	public CustomDialog(Context context) {
		super(context);
		// TODO Auto-generated constructor stub
	}

	public CustomDialog(Context context, int theme) {
		super(context, theme);
		// TODO Auto-generated constructor stub
	}

	public CustomDialog(Context context, boolean cancelable,
			OnCancelListener cancelListener) {
		super(context, cancelable, cancelListener);
		// TODO Auto-generated constructor stub
	}

	public static class Builder {
		private Context context;
		private String title;
		private String Nicknamemessage;
		private String Agemessage;
		private int Sex;
		private String positiveButtonText;
		private String negativeButtonText;
		private View contentView;
		private SimpleAdapter adapter;
		private ArrayList<Map<String,Object>> data = new ArrayList<Map<String,Object>>();
		private DialogInterface.OnClickListener positiveButtonClickListener;
		private DialogInterface.OnClickListener negativeButtonClickListener;
		private DialogInterface.OnClickListener takephoneClickListener;
		private DialogInterface.OnClickListener getImageClickListener;
		private View layout;
		private final int NICKNAME = 1;
		private final int SEX      = 2;
		private final int AGE      = 3;
		private final int PHOTO    = 4;
		private final int AVATAR   = 5;

		public Builder(Context context) {
			this.context = context;
		}

		public Builder setNickMessage(String message) {
			this.Nicknamemessage = message;
			return this;
		}

		public String getNickMessage(){
			String ds = ((EditText) layout.findViewById(R.id.editnickname)).getText().toString();
			return ds;
		}
		
		public Builder setAgeMessage(String message) {
			this.Agemessage = message;
			return this;
		}
		

		public String getAgeMessage(){
			String ds = ((EditText) layout.findViewById(R.id.editage)).getText().toString();
			return ds;
		}

		public Builder setSex(int Sex){
			this.Sex = Sex;
			if(Sex==1)
			{
		        HashMap<String, Object> map = new HashMap<String, Object>();  
		        map.put("touxiang",R.drawable.sex_06); 
		        map.put("img",R.drawable.gouzi);
		        data.add(map);
		        HashMap<String, Object> map2 = new HashMap<String, Object>();  
		        map2.put("touxiang",R.drawable.sex_03); 
		        map2.put("img",null);
		        data.add(map2); 
		

			}
			else
			{
		        HashMap<String, Object> map = new HashMap<String, Object>();  
		        map.put("touxiang",R.drawable.sex_06); 
		        map.put("img",null);
		        data.add(map);
		        HashMap<String, Object> map2 = new HashMap<String, Object>();  
		        map2.put("touxiang",R.drawable.sex_03); 
		        map2.put("img",R.drawable.gouzi);
		        data.add(map2); 
			}
		    adapter = new SimpleAdapter(context,data, R.layout.sex_item, new String[]{"touxiang","img"}, new int[] {R.id.check_img,R.id.qua});
			return this;
		}
		
		public int getSex(){
			return this.Sex;
		}

		/**
		 * Set the Dialog title from resource
		 * 
		 * @param title
		 * @return
		 */
		public Builder setTitle(int title) {
			this.title = (String) context.getText(title);
			return this;
		}

		/**
		 * Set the Dialog title from String
		 * 
		 * @param title
		 * @return
		 */

		public Builder setTitle(String title) {
			this.title = title;
			return this;
		}

		public Builder setContentView(View v) {
			this.contentView = v;
			return this;
		}

		/**
		 * Set the positive button resource and it's listener
		 * 
		 * @param positiveButtonText
		 * @return
		 */
		public Builder setPositiveButton(int positiveButtonText,
				DialogInterface.OnClickListener listener) {
			this.positiveButtonText = (String) context
					.getText(positiveButtonText);
			this.positiveButtonClickListener = listener;
			return this;
		}

		public Builder setPositiveButton(String positiveButtonText,
				DialogInterface.OnClickListener listener) {
			this.positiveButtonText = positiveButtonText;
			this.positiveButtonClickListener = listener;
			return this;
		}

		public Builder setNegativeButton(int negativeButtonText,
				DialogInterface.OnClickListener listener) {
			this.negativeButtonText = (String) context
					.getText(negativeButtonText);
			this.negativeButtonClickListener = listener;
			return this;
		}

		public Builder setNegativeButton(String negativeButtonText,
				DialogInterface.OnClickListener listener) {
			this.negativeButtonText = negativeButtonText;
			this.negativeButtonClickListener = listener;
			return this;
		}
		public Builder setTakePhoto(DialogInterface.OnClickListener listener) {
			this.takephoneClickListener = listener;
			return this;
		}
		
		public Builder setGetImage(DialogInterface.OnClickListener listener) {
			this.getImageClickListener = listener;
			return this;
		}


		public CustomDialog create(int type) {
			LayoutInflater inflater = (LayoutInflater) context
					.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
			// instantiate the dialog with the custom Theme
			final CustomDialog dialog = new CustomDialog(context,R.style.Dialog);
			layout = inflater.inflate(R.layout.dialog_normal_layout, null);
			dialog.addContentView(layout, new LayoutParams(
					LayoutParams.FILL_PARENT, LayoutParams.WRAP_CONTENT));
			// set the dialog title
			switch(type)
			{
			case NICKNAME:
				((EditText) layout.findViewById(R.id.editnickname)).setVisibility(View.VISIBLE);
				break;
			case SEX     :
				((ListView) layout.findViewById(R.id.sexlist)).setVisibility(View.VISIBLE);
				break;
			case AGE     :
				((EditText) layout.findViewById(R.id.editage)).setVisibility(View.VISIBLE);
				break;
			case PHOTO   :
				((LinearLayout) layout.findViewById(R.id.tp)).setVisibility(View.VISIBLE);
				((LinearLayout) layout.findViewById(R.id.anns)).setVisibility(View.GONE);
				break;
			case AVATAR :
				((ImageView) layout.findViewById(R.id.avatar)).setVisibility(View.VISIBLE);
				((LinearLayout) layout.findViewById(R.id.anns)).setVisibility(View.GONE);
				break;
			}
			((TextView) layout.findViewById(R.id.title)).setText(title);
			// set the confirm button
			if (positiveButtonText != null) {
				((Button) layout.findViewById(R.id.positiveButton))
						.setText(positiveButtonText);
				if (positiveButtonClickListener != null) {
					((Button) layout.findViewById(R.id.positiveButton))
							.setOnClickListener(new View.OnClickListener() {
								public void onClick(View v) {
									positiveButtonClickListener.onClick(dialog,
											DialogInterface.BUTTON_POSITIVE);
								}
							});
				}
			} else {
				// if no confirm button just set the visibility to GONE
				layout.findViewById(R.id.positiveButton).setVisibility(
						View.GONE);
			}
			// set the cancel button
			if (negativeButtonText != null) {
				((Button) layout.findViewById(R.id.negativeButton))
						.setText(negativeButtonText);
				if (negativeButtonClickListener != null) {
					((Button) layout.findViewById(R.id.negativeButton))
							.setOnClickListener(new View.OnClickListener() {
								public void onClick(View v) {
									negativeButtonClickListener.onClick(dialog,
											DialogInterface.BUTTON_NEGATIVE);
								}
							});
				}
			} else {
				// if no confirm button just set the visibility to GONE
				layout.findViewById(R.id.negativeButton).setVisibility(
						View.GONE);
			}
			// set the content message
			if (Nicknamemessage != null) {
				((EditText) layout.findViewById(R.id.editnickname)).setText(Nicknamemessage);
				((EditText) layout.findViewById(R.id.editnickname)).setSelection(((EditText) layout.findViewById(R.id.editnickname)).getText().length());
			}else if(Agemessage != null){
				((EditText) layout.findViewById(R.id.editage)).setText(Agemessage);
				((EditText) layout.findViewById(R.id.editage)).setSelection(((EditText) layout.findViewById(R.id.editage)).getText().length());
			} else if (contentView != null) {
				// if no message set
				// add the contentView to the dialog body
				((LinearLayout) layout.findViewById(R.id.content))
						.removeAllViews();
				((LinearLayout) layout.findViewById(R.id.content)).addView(
						contentView, new LayoutParams(
								LayoutParams.FILL_PARENT,
								LayoutParams.FILL_PARENT));
			}
			
			((ListView)layout.findViewById(R.id.sexlist)).setAdapter(adapter);	
			((ListView)layout.findViewById(R.id.sexlist)).setOnItemClickListener(new OnItemClickListener() {

				@Override
				public void onItemClick(AdapterView<?> arg0, View arg1,
						int arg2, long arg3) {
					// TODO Auto-generated method stub
				       for(int i=0;i<data.size();i++)
				       {
				    	   data.get(i).put("img", null);
				       }
				       @SuppressWarnings("unchecked")
					   HashMap<String,Object> map=(HashMap<String,Object>)arg0.getItemAtPosition(arg2); 
				       map.put("img", R.drawable.gouzi);
				       Sex = arg2 + 1;
				       adapter.notifyDataSetChanged(); 
				}
				
			});
			((ListView)layout.findViewById(R.id.sexlist)).setDividerHeight(0);
			((TextView)layout.findViewById(R.id.paizhao)).setOnClickListener(new View.OnClickListener() {
				
				@Override
				public void onClick(View arg0) {
					// TODO Auto-generated method stub
					takephoneClickListener.onClick(dialog, 	DialogInterface.BUTTON_POSITIVE);
				}
			});
			((TextView)layout.findViewById(R.id.bendi)).setOnClickListener(new View.OnClickListener() {
				
				@Override
				public void onClick(View arg0) {
					// TODO Auto-generated method stub
					getImageClickListener.onClick(dialog, 	DialogInterface.BUTTON_NEGATIVE);
				}
			});
			dialog.setContentView(layout);
			return dialog;
		}

	}
	
}
