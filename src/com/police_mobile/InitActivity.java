package com.police_mobile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import cn.jpush.android.api.JPushInterface;

import com.police_mobile.R;
import com.police_mobile.util.BaseService;
import com.police_mobile.util.Config;
import com.police_mobile.util.ServiceForAccount;
import com.police_mobile.util.BaseService.UpdateInfo;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;

public class InitActivity extends Activity {

	private ProgressDialog pBar;
	private ServiceForAccount account = null;
	public static String packageName = null;
	private int progress = 0;
	private final static int DOWN_UPDATE = 11;
	private int loginStatus = 0;

	@Override
	protected void onResume() {
		super.onResume();
		JPushInterface.onResume(this);
	}

	@Override
	protected void onPause() {
		super.onPause();
		JPushInterface.onPause(this);
	}

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.init);
		packageName = this.getClass().getPackage().getName();
		init();
	}

	private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			switch (msg.what) {
			case 1:
				loginResult();
				break;
			case 3:
				doNewVersionUpdate((UpdateInfo) msg.obj);
				break;
			case DOWN_UPDATE:
				pBar.setProgress(progress);
				break;
			}
		}
	};

	private void loginResult() {
		if (loginStatus == 1) {
			startAct(HomeActivity.class);
		} else {
			startAct(LoginActivity.class);
		}
	}

	private void login() {
		String save_pass = account
				.getValueByKey(ServiceForAccount.KEY_CheckPass);
		if ("1".equals(save_pass)) {
			String user = account.getValueByKey(ServiceForAccount.KEY_USERNAME);
			String pwd = account.getValueByKey(ServiceForAccount.KEY_PASSWORD);
			loginStatus = BaseService.login(user, pwd, this, account);
		}
	}

	private void init() {
		account = new ServiceForAccount(this);
		new Thread() {
			public void run() {
				if (checkUpdate()) {
					login();
					handler.sendMessage(handler.obtainMessage(1));
				}
			}
		}.start();
	}

	private boolean checkUpdate() {
		UpdateInfo info = BaseService.getUpdateInfo();
		if(info==null) return true;
		if (Config.getVerCode(this, packageName) < info.code) {
			handler.sendMessage(handler.obtainMessage(3, info));
			return false;
		} else {
			return true;
		}
	}

	private void doNewVersionUpdate(UpdateInfo info) {

		int verCode = Config.getVerCode(this, packageName);
		String verName = Config.getVerName(this, packageName);
		StringBuffer sb = new StringBuffer();
		sb.append("当前版本:");
		sb.append(verName);
		sb.append(" Code:");
		sb.append(verCode);
		sb.append(", 发现新版本:");
		sb.append(info.name);
		sb.append(" Code:");
		sb.append(info.code);
		sb.append(", 是否更新?");
		Dialog dialog = new AlertDialog.Builder(InitActivity.this)
				.setTitle("软件更新")
				.setMessage(sb.toString())
				// 设置内容
				.setPositiveButton("更新",// 设置确定按钮
						new DialogInterface.OnClickListener() {

							@Override
							public void onClick(DialogInterface dialog,
									int which) {
								pBar = new ProgressDialog(InitActivity.this);
								pBar.setCanceledOnTouchOutside(false);
								pBar.setTitle("正在下载");
								pBar.setMessage("请稍候...");
								pBar.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
								downFile(BaseService.ApkUrl);
							}
						})
				.setNegativeButton("暂不更新", new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int whichButton) {
						// 点击"取消"按钮之后退出程序
						//finish();
						loginResult();
					}
				}).create();// 创建
		// 显示对话框
		dialog.setCanceledOnTouchOutside(false);
		dialog.show();
	}

	private void downFile(final String url) {
		pBar.show();
		new Thread() {
			public void run() {
				HttpClient client = new DefaultHttpClient();
				HttpGet get = new HttpGet(url);
				HttpResponse response;
				try {
					response = client.execute(get);
					HttpEntity entity = response.getEntity();
					long length = entity.getContentLength();
					InputStream is = entity.getContent();
					FileOutputStream fileOutputStream = null;
					if (is != null) {
						System.out
								.println("Environment.getExternalStorageDirectory()==="
										+ Environment
												.getExternalStorageDirectory());
						File file = new File(
								Environment.getExternalStorageDirectory(),
								Config.UPDATE_APKNAME);
						fileOutputStream = new FileOutputStream(file);

						byte[] buf = new byte[1024];
						int ch = -1;
						int count = 0;
						while ((ch = is.read(buf)) != -1) {
							fileOutputStream.write(buf, 0, ch);
							count += ch;
							if (length > 0) {
								progress = (int) (((float) count / length) * 100);
								handler.sendEmptyMessage(DOWN_UPDATE);
							}
						}

					}
					fileOutputStream.flush();
					if (fileOutputStream != null) {
						fileOutputStream.close();
					}
					down();
				} catch (ClientProtocolException e) {
					e.printStackTrace();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

		}.start();

	}

	private void down() {
		handler.post(new Runnable() {
			public void run() {
				pBar.cancel();
				update();
			}
		});

	}

	private void update() {
		Intent intent = new Intent(Intent.ACTION_VIEW);
		intent.setDataAndType(Uri.fromFile(new File(Environment
				.getExternalStorageDirectory(), Config.UPDATE_APKNAME)),
				"application/vnd.android.package-archive");
		startActivity(intent);
	}

	private void startAct(Class<?> c) {
		Intent intent = new Intent();
		intent.setClass(InitActivity.this, c);
		startActivity(intent);
		this.finish();
		overridePendingTransition(R.anim.right_in, R.anim.left_out);
	}
}
