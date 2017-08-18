package com.police_mobile.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.util.Log;

import com.google.gson.Gson;

public class Session {

	public static User user;
	public static Branch branch;
	public static int curIndex;
	public static List<Branch> branchList;
	public static ItemGroup itemGroup;
	public static List<ItemGroup> itemGroupList;

	public static String getUserJson() {
		if (user != null) {
			Gson gson = new Gson();
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("user", user);
			return gson.toJson(map);
		}
		return "";
	}
	
	public static String getItemList(int groupId){
		if(itemGroup!=null){
			Gson gson = new Gson();
			List<Item> list=itemGroup.list[groupId];
			Log.e("dd","groupId="+groupId+"size="+list.size());
			return gson.toJson(list);
		}
		return "";
	}

	public static class User {
		private int id;
		private String code;
		private String name;
		private String position;
		private String phone;
		private String depname;
      


		public String getDepname() {
			return depname;
		}


		public void setDepname(String depname) {
			this.depname = depname;
		}


		public String getPhone() {
			return phone;
		}


		public void setPhone(String phone) {
			this.phone = phone;
		}


		public String getPosition() {
			return position;
		}


		public void setPosition(String position) {
			this.position = position;
		}


		public String getCode() {
			return code;
		}
         
		
		public void setCode(String code) {
			this.code = code;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}



		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}
	}

	public static class Branch {
		private int deptId;
		private String deptName;
		private int roleId;
		private String roleName;
		private int unitId;
		private String unitName;
		private String roleLevel;
		private int ancestorId;

		public int getDeptId() {
			return deptId;
		}

		public void setDeptId(int deptId) {
			this.deptId = deptId;
		}

		public String getDeptName() {
			return deptName;
		}

		public void setDeptName(String deptName) {
			this.deptName = deptName;
		}

		public int getRoleId() {
			return roleId;
		}

		public void setRoleId(int roleId) {
			this.roleId = roleId;
		}

		public String getRoleName() {
			return roleName;
		}

		public void setRoleName(String roleName) {
			this.roleName = roleName;
		}

		public int getUnitId() {
			return unitId;
		}

		public void setUnitId(int unitId) {
			this.unitId = unitId;
		}

		public String getUnitName() {
			return unitName;
		}

		public void setUnitName(String unitName) {
			this.unitName = unitName;
		}

		public String getRoleLevel() {
			return roleLevel;
		}

		public void setRoleLevel(String roleLevel) {
			this.roleLevel = roleLevel;
		}

		public int getAncestorId() {
			return ancestorId;
		}

		public void setAncestorId(int ancestorId) {
			this.ancestorId = ancestorId;
		}
		
	}

	public static class Item{
		public int id;
		public int type;
		public String name;
		public String img;
		public int groupId;
		public String uri;
		public int sortId;
		public int parentId;
		public int getId() {
			return id;
		}
		public void setId(int id) {
			this.id = id;
		}
		public int getType() {
			return type;
		}
		public void setType(int type) {
			this.type = type;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getImg() {
			return img;
		}
		public void setImg(String img) {
			this.img = img;
		}
		public int getGroupId() {
			return groupId;
		}
		public void setGroupId(int groupId) {
			this.groupId = groupId;
		}
		public String getUri() {
			return uri;
		}
		public void setUri(String uri) {
			this.uri = uri;
		}
		public int getSortId() {
			return sortId;
		}
		public void setSortId(int sortId) {
			this.sortId = sortId;
		}
		public int getParentId() {
			return parentId;
		}
		public void setParentId(int parentId) {
			this.parentId = parentId;
		}
	}
	
	public static class ItemGroup{
		@SuppressWarnings("unchecked")
		private List<Item>[] list=new List[5];
		public List<Item>[] getList(){
			return list;
		}
		
		public ItemGroup(){
			for(int i=0;i<list.length;i++){
				list[i]=new ArrayList<Item>();
			}
		}
	}

}
