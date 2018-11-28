<template>
	<div class="course">

		<!-- 按钮区开始 -->
		<div class="btns">
			<el-button size="small" @click='toAddCourse'>添加</el-button>
			<el-button size="small" type="danger" @click='batchDeleteCourse'>批量删除</el-button>
		</div>
		<!-- 按钮区结束 -->
		<!-- 表格开始 -->
		<el-table
		:data="course"
		border
		style="width: 100%" @selection-change="handleSelectionChange">
		<el-table-column
		type="selection"
		width="55" align='center'>
		</el-table-column >
		<el-table-column
			prop="name"
			label="课程名称"
			width="280"
			align='center'>
		</el-table-column>
		<el-table-column
		prop="period"
		label="课程周期"
		width="380"
		align='center'
		>
		</el-table-column>
		<el-table-column
		prop="description"
		label="课程简介"
		width="280"
		align='center'
		>
		</el-table-column>
		<el-table-column
		align='center'
		label="操作">
		<template slot-scope="{row}">
			<el-button type="primary" icon="el-icon-edit" circle size='small' @click='toUpdateCourse(row)'></el-button>
			<el-button type="danger" icon="el-icon-delete" circle size='small' @click='deleteCourse(row.id)'></el-button>
		</template>
		</el-table-column>
		</el-table>
		<!-- 表格结束 -->
		<!-- 模态框开始 -->
		<el-dialog
		:title="cDialog.title"
		:visible.sync="cDialog.visible"
		width="30%" @open='open()'>
	
		<!-- 模态框表单开始 -->
		<el-form :model='cDialog.form' ref='cDialog.form' :rules='rules'>
			<el-form-item label='课程名称' label-width="6em" size='small' prop='name'>
				<el-input autocomplete="off"  v-model='cDialog.form.name' ></el-input>
			</el-form-item>
			<el-form-item label='课程周期' label-width="6em" prop='period' size='small'>
				<el-select v-model='cDialog.form.period'>
					<el-option :key='value' v-for='value in period' :value='value' :label='value' ></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label='课程介绍' label-width="6em">
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
			<el-button type="primary" @click="saveOrUpdateCourse('cDialog.form')">确定</el-button>
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
				course:[],
				multipleSelection:[],
				cDialog:{
					title:'添加课程',
					visible:false,
               	  form:{}                //
               	},
               // coursePeriod:[],     
              	period:[5,10,15,25,30,35],  //保存课程周期
                rules:{
               	name:[{ required: true, message: '课程不能为空',trigger:'blur'
                }],
                period:[{ required: true, message: '请选择课程周期',trigger:'blur'
           }]
       }
   }
},
mounted(){
	this.findAllCourse();
},
methods:{
        	//清除表单验证结果
        	open(){
        		if(this.$refs['cDialog.form']){
        			this.$refs['cDialog.form'].clearValidate();
        		}
        	},
        	//查询所有课程
        	findAllCourse(){
        		axios.get('/course/findAllCourse')
        		.then(({data:result})=>{
        			this.course=result.data;
        		})
        		.catch()
        	},
            //过滤重复课程周期
            // checkPeriod(){
            //    let period=this.course.map((item)=>{
            //         return item.period;
            //    });
            //    const set =new Set(period);
            //    this.coursePeriod=[...set];
            // },

            //弹出添加模态框
            toAddCourse(){
            	this.cDialog.title='添加课程',
            	this.cDialog.visible=true,
            	//给模态框表单空对象以清空表单
            	this.cDialog.form={}
            	// this.checkPeriod();
            },
            toUpdateCourse(row){
            	this.cDialog.title='修改课程',
            	this.cDialog.visible=true,
                //先清空表单再赋值，解决添加模态框表单验证结果遗留给修改模态框表单验证的问题
                this.cDialog.form={},
                Object.assign(this.cDialog.form,row)
                delete this.cDialog.form.period   //清除period防止模态框下拉框无法选择选项 使用默认period
            	// this.checkPeriod();


            },
            // 保存课程
            saveOrUpdateCourse(form){
            	this.$refs[form].validate((valid) => {
            		if (valid) {
            			axios.post('/course/saveOrUpdate',this.cDialog.form)
            			.then(()=>{
            				this.cDialog.visible=false,
            				this.findAllCourse();
            			})
            		}else{
            			return false;
            		}
            	});
            },
            deleteCourse(id){
            	this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
            		confirmButtonText: '确定',
            		cancelButtonText: '取消',
            		type: 'warning'
            	}).then(() => {
            		axios.get('/course/deleteById',{
            			params:{
            				id
            			}
            		})
            		.then((result)=>{
            			this.findAllCourse();
            			this.$message({
            				showClose: true,
            				message: '删除成功',
            				type: 'success'
            			});
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
            // 批量删除
            batchDeleteCourse(){
            	let ids=this.multipleSelection.map((item)=>{
            		return item.id;
            	});
            	if(ids!=''){
            		axios.post('/course/batchDelete',{ids})
            		.then((result)=>{
            			console.log(result);
            		})
            		.catch(()=>{

            		})
            	}else{
            		this.$message({
            			showClose: true,
            			message: '请选择要删除的信息',
            			type: 'warning'
            		});
            	}
            },
            //监控多选框
            handleSelectionChange(val){
            	this.multipleSelection=val;
            }
        }
    }
</script>
<style>
	.btns{
		float: right;
		margin: .5em;
	}
</style>