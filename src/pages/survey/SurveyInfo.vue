<template>
	<div class="survey">
		<!-- 搜索区开始 -->
		<div class="search">
			  <el-input  placeholder="请输入关键字" size='small' clearable>
				  <el-button slot="append" icon="el-icon-search" circle></el-button>
			</el-input>	

		</div>
		<!-- 搜索区结束 -->
		<!-- 按钮组开始 -->
		<div class="btns">
			<el-button size="small" @click='toAddSurvey'>添加</el-button>
	   	    <el-button size="small" type="danger" @click='batchDeleteSurvey'>批量删除</el-button>
		</div>
		<!-- 按钮组结束 -->
		<!-- 表格开始 -->
		 <el-table
	    :data="survey"
	    border
	    style="width: 100%" @selection-change="handleSelectionChange">
	     <el-table-column
	      type="selection"
	      width="55" align='center'>
	    </el-table-column >
	    <el-table-column
	      prop="clazzVM.grade.name"
	      label="年级"
	      width="120"
	      align='center'>
	    </el-table-column>
	    <el-table-column
	      prop="clazzVM.name"
	      label="班级"
	      width="120"
	      align='center'
	      >
	    </el-table-column>
	     <el-table-column
	      prop="course.name"
	      label="课程"
	      width="180"
	      align='center'
	      >
	    </el-table-column>
	     <el-table-column
	      prop="qnVM.name"
	      label="问卷"
	      width="180"
	      align='center'
	      >
	    </el-table-column>
	     <el-table-column
	      prop="user.name"
	      label="讲师"
	      width="100"
	      align='center'
	      >
	    </el-table-column>
	     <el-table-column
	      prop="surveydate"
	      label="课调时间"
	      width="180"
	      align='center'
	      >
	    </el-table-column>
	    <el-table-column
	      align='center'
	      label="操作">
	      <template slot-scope="{row}">
		       <el-button type="primary" icon="el-icon-edit" circle size='small' @click='toUpdateSurvey(row)'></el-button>
		       <el-button type="danger" icon="el-icon-delete" circle size='small' @click='deleteSurvey(row.id)'></el-button>
		  </template>
	    </el-table-column>
	  </el-table>
		<!-- 表格结束 -->
		<!-- 模态框开始 -->
           <el-dialog
		  :title="sDialog.title"
		  :visible.sync="sDialog.visible"
		  width="30%" @open='open()'>
		  {{sDialog.form}}
		  <!-- 模态框表单开始 -->
             <el-form v-model='sDialog.form'>
             	 <el-form-item label='年级' label-width='6em'>
             	 	<el-select v-model='grade.id' placeholder="选择年级" size='mini'>
             	 		<el-option :key='g.id' v-for='g in grade' :label="g.name" :value='g.id'>
             	 			
             	 		</el-option>
             	 	</el-select>
             	 </el-form-item>
             	 <el-form-item label='班级' label-width="6em" size='small'>
             	 		<el-select  v-model='sDialog.form.clazzId' placeholder="选择班级" size='mini'>
	             	 		<el-option :key='c.id' v-for='c in clazz' :label="c.name" :value='c.id' >
	             	 			
	             	 		</el-option>
             	 	    </el-select>
             	 </el-form-item>
             	 <el-form-item label='课程' label-width="6em" size='small'>
             	 	<el-select v-model='sDialog.form.courseId'  placeholder="选择课程">
             	 		<el-option :key='c.id' v-for='c in course' :label="c.name" :value='c.id' ></el-option>
             	 	</el-select>
             	 </el-form-item>
             	 <el-form-item label='问卷' label-width="6em" size='small'>
             	 	<el-select v-model='sDialog.form.questionnaireId'  placeholder="选择问卷">
             	 		<el-option :key='n.id' v-for='n in naire' :label="n.name" :value='n.id' ></el-option>
             	 	</el-select>
             	 </el-form-item>
             	 <el-form-item label='讲师' label-width="6em" size='small'>
             	 	<el-select v-model='sDialog.form.userId'  placeholder="选择讲师">
             	 		<el-option :key='u.id' v-for='u in user' :label="u.name" :value='u.id' ></el-option>
             	 	</el-select>
             	 </el-form-item>
             	 <el-switch
		          v-model='value'
				  active-text="开启课调"
				  inactive-text="关闭课调">
				</el-switch>
             </el-form>
          <!-- 模态框表单结束 -->
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="sDialog.visible = false">取 消</el-button>
		    <el-button type="primary" @click='saveOrUpdateSurvey' >确定</el-button>
		  </span>
		</el-dialog>
		<!-- 模态框结束 -->
	</div>
</template>
<script>
    import getAxios from '@/http/getAxios'
	//post提交数据，数据中有数组，并且数组中嵌套对象
	let axios = getAxios('array');
	export default {
        data(){
        	return {
               survey:[],
               sDialog:{
               	   title:'',
               	   visible:false,
               	   form:{}
               },
               grade:[],          //保存年级
               clazz:[],         //保存班级
               course:[],        //保存课程
               naire:[],
               user:[],
               value:true,
               multipleSelection: [],    //保存选择项
        	}
        },
        mounted(){
           this.findAllSurvey();
        },
        methods:{
        	open(){

        	},
        	// 查询所有课调
        	findAllSurvey(){
               axios.get('/survey/findAllSurveyVM')
               .then(({data:result})=>{
                    this.survey=result.data;
               })
        	},
			  //查询所有年级
	        findAllGrade(){
	             axios.get("/grade/findAll")
	             .then(({data:result})=>{
	                 this.grade=result.data;
	             })
	             .catch()
	        },
	        // 查询班级所有信息
            findAllClazz(){
               axios.get('/clazz/findAll')
               .then(({data:result})=>{
                   this.clazz=result.data;

               })
            },
            //查询所有课程
            findAllCourse(){
               axios.get('/course/findAllCourse')
               .then(({data:result})=>{
                   this.course=result.data;
               })
               .catch()
            },
              // 查询所有问卷
           findAllNaire(){
              axios.get('/questionnaire/findAllQuestionnaire')
              .then(({data:result})=>{
                   this.naire=result.data;
              })
           },
           //查询所有用户
            findAllUser(){
              axios.get('/user/findAll')
             	.then(({data:result})=>{
             		this.user=result.data;
              })
            },
        	// 弹出添加模态框
        	toAddSurvey(){
                this.sDialog.title='添加',
                this.sDialog.visible=true,
                this.findAllClazz();
                this.findAllGrade();
                this.findAllCourse();
                this.findAllNaire();
                this.findAllUser();
        	},
        	// 弹出修改模态框
        	toUpdateSurvey(row){
                this.sDialog.title='修改',
                this.sDialog.visible=true

        	},
        	saveOrUpdateSurvey(){
                
        	},
        	//删除单行
            deleteSurvey(id){
                 this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        axios.get('/survey/deleteSurveyById',{
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
	                  this.findAllSurvey();
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
            batchDeleteSurvey(){
                   let ids=this.multipleSelection.map((item)=>{
	             	return item.id;
	              });
                  if(ids!=''){
                  	   this.$confirm('此操作将永久删除该年级, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
	                             axios.post('/survey/batchDeleteSurveyById',{ids})
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
		width: 25%;
        display: inline-block;
	}
	.btns{
		float: right;
		margin-bottom: .5em;
	}
</style>