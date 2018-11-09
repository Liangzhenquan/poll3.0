<template>
	<div class="user">
		<!-- 查询区开始 -->
		<div class="search">
			<el-input v-model="keywords" placeholder="请输入关键字" size='small' clearable>
				  <el-button slot="append" icon="el-icon-search" circle @click='query'></el-button>
			</el-input>
		</div>
		<!-- 查询区结束 -->
		<!-- 按钮组开始 -->
	    <div class="btns">
	    	<el-button size="small" @click='toAddUser'>添加</el-button>
	   	    <el-button size="small" type="danger" @click='batchDeleteUser'>批量删除</el-button>
	    </div>
		<!-- 按钮组结束 -->
		<!-- 表格开始 -->
		<el-table :data="user" border style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column
			type="selection"
			width="55" align='center'>
		    </el-table-column >
		    <el-table-column
		    prop="name"
		    label="教师姓名"
		    width="180"
		    align='center'>
		    </el-table-column>
			<el-table-column
			prop="gender"
			label="性别"
			width="80"
			align='center'
			>
			</el-table-column>
			<el-table-column
			prop="birth"
			label="出生日期"
			width="280"
			align='center'
			>
			</el-table-column>
			<el-table-column
			prop="hiredate"
			label="入职时间"
			width="280"
			align='center'
			>
			</el-table-column>
			<el-table-column
			align='center'
			label="操作">
			<template slot-scope="{row}">
			<el-button type="primary" icon="el-icon-edit" circle size='small' @click='toUpdateUser(row)'></el-button>
			<el-button type="danger" icon="el-icon-delete" circle size='small' @click='deleteUser(row.id)'></el-button>
			</template>
			</el-table-column>
	    </el-table>
		<!-- 表格结束 -->
		<!-- 模态框开始 -->
		   <el-dialog
		  :title="uDialog.title"
		  :visible.sync="uDialog.visible"
		  width="30%" @open='open()'>
		  {{uDialog.form}}
		  <!-- 模态框表单开始 -->
            <el-form :model='uDialog.form' ref='uDialog.form' :rules='rules'>
             	 <el-form-item label='教师姓名' label-width="6em"> 
             	    <el-input v-model='uDialog.form.name'></el-input>  	 
             	 </el-form-item>
             	 <el-form-item label='性别' label-width="4em"> 
             	    <el-radio v-model="uDialog.form.gender" label="男">男</el-radio>
                     <el-radio v-model="uDialog.form.gender" label="女">女</el-radio> 	 
             	 </el-form-item>
             	 <el-form-item label='出生日期' label-width="6em">
             	 	 <el-date-picker
					    v-model="uDialog.form.birth"
					    type="date"
					    placeholder="选择日期">
					 </el-date-picker>
             	 </el-form-item>
             	  <el-form-item label='入职时间' label-width="6em">
             	 	 <el-date-picker
					    v-model="uDialog.form.hiredate"
					    type="date"
					    placeholder="选择日期">
					 </el-date-picker>
             	 </el-form-item>
             </el-form>
          <!-- 模态框表单结束 -->
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="uDialog.visible = false">取 消</el-button>
		    <el-button type="primary" @click="saveOrUpdateCourse('uDialog.form')">确定</el-button>
		  </span>
		</el-dialog>
		<!-- 模态框结束 -->
	</div>
</template>
<script>
    import getAxios from "@/http/getAxios"
    let axios=getAxios();
	export default {
         data(){
         	return {
                keywords:'',
                user:[],
                multipleSelection:[],
                uDialog:{
                	title:'',
                	visible:false,
                	form:{}
                },
                //表单验证规则
                rules:{
               	  name:[{ required: true, message: '课程不能为空',trigger:'blur'
               	}],
               	period:[{ required: true, message: '请选择课程周期',trigger:'blur'
               	}]
               }
         	}
         },
         mounted(){
         	this.findAll();
         },
         watch:{
              keywords:function(){
              	if(this.keywords==''){
              		this.findAll();
              	}
              }
         },
         methods:{
         	// 模态框打开时清除表单验证
         	open(){

         	},
             //查询所有用户
             findAll(){
             	axios.get('/user/findAll')
             	.then(({data:result})=>{
             		this.user=result.data;
             	})
             },
             // 弹出添加模态框
             toAddUser(){
                 this.uDialog.title='添加',
                 this.uDialog.visible=true

             },
             //弹出修改模态框
             toUpdateUser(){

             },
             //删除单个用户
             deleteUser(){

             },
             //批量删除
             batchDeleteUser(){
             	let ids=this.multipleSelection.map((item)=>{
             		return item.id;
             	});
                 if(ids!=''){
                 }else{
                 	this.$message({
						showClose: true,
						message: '请选择要删除的信息',
						type: 'warning'
					});
                 }
             },
             //用户关键字查询
             query(){
                if(this.keywords!=''){
                     axios.get('/user/query',{
                      	params:{
                      		keywords:this.keywords
                      	}
                     })
                     .then(({data:result})=>{
                        this.user=result.data;
                     })
                }else{
                	this.$message({
						showClose: true,
						message: '请选择要删除的信息',
						type: 'warning'
					});
                }
             },
             handleSelectionChange(val){
             	this.multipleSelection=val;
             }
         }
	}
</script>
<style>
	.search{
		width: 25%;
		display: inline-block;
	}
	.btns{
		float: right;
        margin-bottom: .5em;
	}
</style>