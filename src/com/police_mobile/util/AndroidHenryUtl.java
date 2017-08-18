package com.police_mobile.util;

import java.lang.reflect.Field;

import android.content.Context;
import android.view.Display;
import android.view.WindowManager;

public class AndroidHenryUtl {
	
	
	    //获取屏幕的宽度 
	public static int getScreenWidth(Context context) { 
	 WindowManager manager = (WindowManager) context 
	         .getSystemService(Context.WINDOW_SERVICE); 
	 Display display = manager.getDefaultDisplay(); 
	 return display.getWidth(); 
	} 
	
	
	//获取屏幕的高度 
	public static int getScreenHeight(Context context) { 
	 WindowManager manager = (WindowManager) context 
	         .getSystemService(Context.WINDOW_SERVICE); 
	 Display display = manager.getDefaultDisplay(); 
	 return display.getHeight(); 
	}
	
	
	public static int getStatusBarHeight(Context context){
        Class<?> c = null;
        Object obj = null;
        Field field = null;
        int x = 0, statusBarHeight = 0;
        try {
            c = Class.forName("com.android.internal.R$dimen");
            obj = c.newInstance();
            field = c.getField("status_bar_height");
            x = Integer.parseInt(field.get(obj).toString());
            statusBarHeight = context.getResources().getDimensionPixelSize(x);
        } catch (Exception e1) {
            e1.printStackTrace();
        } 
        return statusBarHeight;
    }
}
