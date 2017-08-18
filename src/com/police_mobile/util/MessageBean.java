package com.police_mobile.util;

import android.os.Parcel;
import android.os.Parcelable;


import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Jorstin on 2015/3/18.
 */
public class MessageBean implements Parcelable {

    public static final Parcelable.Creator<MessageBean> CREATOR = new Parcelable.Creator<MessageBean>() {
        public MessageBean createFromParcel(Parcel in) {
            return new MessageBean(in);
        }

        public MessageBean[] newArray(int size) {
            return new MessageBean[size];
        }
    };
    public MessageBean() {

    }

    /**消息类型*/
    private int type;
    /**消息*/
    private String content;
    /**时间*/
    private Long time;


    public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getTime() {
		return time;
	}

	public void setTime(Long time) {
		this.time = time;
	}

	private MessageBean(Parcel in) {
        this.type = in.readInt();
        this.content=in.readString();
    }

    @Override
    public String toString() {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("type" , type);
            jsonObject.put("content" , content);
            return jsonObject.toString();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return "Message{" +
                "type='" + type + '\'' +
                ", content='" + content + '\'' +
                '}';
    }

    public MessageBean from(String input) {
        JSONObject object = null;
        try {
            object = new JSONObject(input);
            if(object.has("type")) {
            	this.type = object.getInt("type");
            }
            if(object.has("cotent")) {
            	this.content = object.getString("content");
            }
            if(object.has("time")) {
            	this.time = object.getLong("time");
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return this;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(this.type);
        dest.writeString(this.content);
        
    }
}
