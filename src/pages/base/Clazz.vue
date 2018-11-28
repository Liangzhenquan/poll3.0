<template>
<div class="class">
	<!-- 搜索区开始 -->
	<div class="search">
		<el-select v-model='grade.id' placeholder='所有年级' size="small">
			<el-option v-for='g in grade' :key='g.id' :label='g.name' :value='g.id'></el-option>
		</el-select>
	</div>
	<!-- 搜索区结束 -->
	<!-- 按钮组开始 -->
	<div class="btns">
		<el-button size="small" @click='toAddClazz'>添加</el-button>
		<el-button size="small" type="danger" @click='batchDeleteClazz'>批量删除</el-button>
	</div>
	<!-- 按钮组结束 -->
	<!-- 表格开始 -->
	<el-table
	:data="clazz"
	border
	style="width: 100%" @selection-change="handleSelectionChange">
	<el-table-column
	type="selection"
	width="55" align='center'>
    </el-table-column >
	<el-table-column
	prop="name"
	label="名称"
	width="280"
	align='center'>
	</el-table-column>
	<el-table-column
	prop="description"
	label="简介"
	width="380"
	align='center'
	>
	</el-table-column>
	<el-table-column
	prop="charge.name"
	label="班主任"
	width="280"
	align='center'
	>
	</el-table-column>
	<el-table-column
	align='center'
	label="操作">
	<template slot-scope="{row}">
	<el-button type="primary" icon="el-icon-edit" circle size='small' @click='toUpdateClazz(row)'></el-button>
	<el-button type="danger" icon="el-icon-delete" circle size='small' @click='deleteClazz(row.id)'></el-button>
	</template>
	</el-table-column>
	</el-table>
	<!-- 表格结束 -->
	<!-- 模态框开始 -->
	<el-dialog
	:title="cDialog.title"
	:visible.sync="cDialog.visible"
	width="30%" @open='open()'>
	{{cDialog.form}}
	<!-- 模态框表单开始 -->
	<el-form :model='cDialog.form' ref='cDialog.form' :rules="rules">
	<el-form-item label='所属年级' label-width='6em' prop='gradeId'>
		<el-select v-model='cDialog.form.gradeId' placeholder="选择年级" size='mini'>
			<el-option :key='g.id' v-for='g in grade' :label='g.name' :value='g.id'>

			</el-option>
		</el-select>
	</el-form-item>
	<el-form-item label="班级名称" label-width="6em" prop='name' size='small'>       
		<el-input v-model="cDialog.form.name" autocomplete="off" ></el-input>
	</el-form-item>
	<el-form-item label='班主任' label-width="6em" size='small' prop='chargeId'>
		<el-select v-model='cDialog.form.chargeId'>
			<el-option :key='u.id' v-for='u in user' :value='u.id' :label='u.name' ></el-option>
		</el-select>
	</el-form-item>
	<el-form-item label='班级介绍' label-width="6em" size='small'>
		<el-input
		type="textarea"
		:rows="2"
		placeholder="请输入内容"
		v-model="cDialog.form.description">
	</el-input>
	</el-form-item>
	</el-form>
	<!-- 模态框表单结束 -->
	<span slot="footer" class="dialog-footer">
	<el-button @click="cDialog.visible = false">取 消</el-button>
	<el-button type="primary" @click="saveOrUpdateClazz('cDialog.form')">确定</el-button>
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
			clazz:[],
          grade:[],  //保存年级信息
          cDialog:{
          	title:'',
          	visible:false,
          	form:{}
          },
          multipleSelection: [],    //保存表格选择项
    	  user:[],   //保存班主任信息
    	  rules:{
    	  	name:[{ required: true, message: '班级不能为空',trigger:'blur'
    	  }],
    	  chargeId:[{ required: true, message: '请选择班主任',trigger:'blur'
    	}],
    	gradeId:[{ required: true, message: '请选择年级',trigger:'change'
    }]
}
}
},
mounted(){
this.findAllVM();
},
methods:{
open(){
    		//清除表单验证结果
    		if(this.$refs['cDialog.form']){
    			this.$refs['cDialog.form'].clearValidate();
    		}

    	},
    	// 查询所有信息
    	findAllVM(){
    		axios.get('/clazz/findAllVM')
    		.then(({data:result})=>{
    			this.clazz=result.data;
    		})
    	},
        // 查询所有年级信息
        findAllGrade(){
        	axios.get("/grade/findAll")
        	.then(({data:result})=>{
        		this.grade=result.data;
        	})
        	.catch()
        },
        // 查询所有用户
        findAllUser(){
        	axios.get('/user/findAll')
        	.then(({data:result})=>{
        		this.user=result.data;
        	})
        },

        //弹出添加模态框
        toAddClazz(){
        	this.cDialog.title='添加班级',
        	this.cDialog.visible=true,
        	this.cDialog.form={},
        	this.findAllGrade();
        	this.findAllUser();
        },
        // 保存或修改班级信息
        saveOrUpdateClazz(form){
        	console.log(form);
        	this.$refs[form].validate((valid) => {
        		if (valid) {
        			axios.post('/clazz/saveOrUpdateClazz',this.cDialog.form)
        			.then((result)=>{
        				this.cDialog.visible=false;
        				this.findAllVM();
        			})
        		}else{
        			return false;
        		}	
        	});
        	
        },
        //通过行按钮修改班级信息
        toUpdateClazz(row){
        	this.cDialog.title='修改班级',
        	this.cDialog.visible=true,
        	Object.assign(this.cDialog.form,row);
        	this.findAllGrade();
        	this.findAllUser();
            // this.cDialog.form=row
        },

        //删除单行班级
        deleteClazz(id){
        	this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
        		confirmButtonText: '确定',
        		cancelButtonText: '取消',
        		type: 'warning'
        	}).then(() => {
        		axios.get('/clazz/deleteClazzById',{
        			params:{
        				id
        			}
        		})
        		.then((result)=>{
        			this.$message({
        				showClose: true,
        				message: '删除成功',
        				type: 'success'
        			});
        			this.findAllVM();
        		})
        		.catch((error)=>{
        			this.$message({
        				showClose: true,
        				message: '网络异常',
        				type: 'error'
        			});
        		})

        	})
        },
        // 批量删除班级
        batchDeleteClazz(){
        	let ids=this.multipleSelection.map((item)=>{
        		return item.id;
        	});
        	if(ids!=''){
        		this.$confirm('此操作将永久删除该年级, 是否继续?', '提示', {
        			confirmButtonText: '确定',
        			cancelButtonText: '取消',
        			type: 'warning'
        		}).then(() => {
        			axios.post('/clazz/batchDeleteClazz',{ids})
        			.then((result)=>{
        				this.findAllVM();
        				this.$message({
        					showClose: true,
        					message: '删除成功',
        					type: 'success'
        				});

        			})
        			.catch(()=>{

        			})
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
	display: inline-block;
}
.btns{
	float: right;
	margin-bottom: .5em;
}
</style>