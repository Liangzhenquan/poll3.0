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
				<el-form :model='uDialog.form' ref='uDialog.form' :rules='rules' size='small'>
					<el-form-item label='教师姓名' label-width="6em" prop='name'> 
						<el-input v-model='uDialog.form.name'></el-input>  	 
					</el-form-item>
					<el-form-item label='性别' label-width="4em" prop='gender'> 
						<el-radio v-model="uDialog.form.gender" label="男">男</el-radio>
						<el-radio v-model="uDialog.form.gender" label="女">女</el-radio> 	 
					</el-form-item>
					<el-form-item label='出生日期' label-width="6em" prop='birth'>
						<el-date-picker
						v-model="uDialog.form.birth"
						type="date"
						placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label='入职时间' label-width="6em" prop='hiredate'>
					<el-date-picker
					v-model="uDialog.form.hiredate"
					type="date"
					placeholder="选择日期">
				</el-date-picker>
				</el-form-item>
				<el-form-item label='职称' label-width="6em" prop='type' size='small'>
					<el-select v-model='uDialog.form.type'>
						<el-option :key='value' v-for='value in type' :value='value' :label='value' ></el-option>
					</el-select>
				</el-form-item>
				</el-form>
				<!-- 模态框表单结束 -->
				<span slot="footer" class="dialog-footer">
				    <el-button @click="uDialog.visible = false">取 消</el-button>
				    <el-button type="primary" @click="saveOrUpdateUser('uDialog.form')">确定</el-button>
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
                	name:[{ required: true, message: '姓名不能为空',trigger:'blur'
                }],
                gender:[{ required: true, message: '请选择性别',trigger:'blur'
            }],
            birth:[{ required: true, message: '请选择出生日期',trigger:'blur'
        }],
        hiredate:[{ required: true, message: '请选择入职时间',trigger:'blur'
    }],
    type:[{ required: true, message: '请选择职称',trigger:'blur'
}]
},
                type:['讲师','副教授','教授','副院长','院长']        //用户默认职称
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
         		if(this.$refs['uDialog.form']){
         			this.$refs['uDialog.form'].clearValidate();
         		}
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
             	this.uDialog.visible=true,
             	this.uDialog.form={}

             },
             //弹出修改模态框
             toUpdateUser(row){
             	this.uDialog.title='修改',
             	this.uDialog.visible=true,
                 //将单行信息复制，解决模态框表单数据改变表格跟着改变的问题
                 Object.assign(this.uDialog.form,row);
             },
             saveOrUpdateUser(form){
             	//表单验证通过则提交
             	this.$refs[form].validate((valid) => {
             		if (valid) {
             			axios.get('/user/saveOrUpdate')
             			.then(({dat:result})=>{
             				console.log(result.data);
             			})
             		}else{
             			return false;
             		}
             	});
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