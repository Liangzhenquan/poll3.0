<template>
	<div class="question-content">
	    <!-- 搜索框开始 -->
		<div class="search">
		   <el-input  placeholder="请输入关键字" size='small' clearable>
				  <el-button slot="append" icon="el-icon-search" circle></el-button>
			</el-input>	
		</div>
		<!-- 搜索框结束 -->
		<!-- 按钮区开始 -->
		<div class="btns">
			<el-button size="small" @click='toAddQuestion'>添加</el-button>
	   	    <el-button size="small" type="danger" @click='batchDeleteQuestion'>批量删除</el-button>
		</div>
		<!-- 按钮区结束 -->
		<!-- 问题区开始 -->
		<ul class="question-list">
			<li class="question" v-for='q in questions'>
				<div class="question-title">
				    <el-tag type='warning' size='mini'>{{q.questionType}}</el-tag>
					<el-checkbox @change='change(q.id)'>{{q.name}}</el-checkbox>
				</div>
				<div class="question-options">
					<ol v-if='q.questionType!="简答题"'>
						<li v-for='o in q.options'>
							<span>{{o.label}}</span>
							<span>{{o.name}}</span>
						</li>
					</ol>
					<el-input v-else
					  type="textarea"
					  :rows="3"
					  placeholder="请输入内容">
					</el-input>
				</div>
				<div class="question-btns">
					<el-button type="primary" icon="el-icon-edit" circle size='mini' @click='toUpdateQuestion(q)'></el-button>
		      		 <el-button type="danger" icon="el-icon-delete" circle size='mini' @click='deleteQuestion(q.id)'></el-button>
				</div>
			</li>
		</ul>
		<!-- 问题区结束 -->
		<!-- 模态框开始 -->
		  <el-dialog
		  :title="qDialog.title"
		  :visible.sync="qDialog.visible"
		  width="80%" @open='open()'>
          <!-- 模态框表单开始 -->
          <el-form :model='qDialog.form'>
            <!-- {{qDialog.form}} -->
          	 <el-form-item label='题目名称' label-width='100px' placeholder="请输入内容"  >
          	 	<el-input size='small' v-model='qDialog.form.name'>           	 		
          	 	</el-input>
          	 </el-form-item>
          	 <el-form-item label="题目类型" label-width="100px">
          	 	<el-select v-model='qDialog.form.questionType' size='small'>
          	 		<el-option label='单选题' value='单选题'></el-option>
		     		<el-option label='多选题' value='多选题'></el-option>
					<el-option label='简答题' value='简答题'></el-option>
          	 	</el-select>
          	 </el-form-item>
          	 <el-form-item v-if='qDialog.form.questionType!="简答题"' label='题目选项' label-width='100px'>
          	 	  <el-table :data='qDialog.form.options' size='mini' border>
          	 	      <!-- 编号开始 -->
          	 	  	  <el-table-column label='编号' width='60' align='center' type='index'>
          	 	  	  	  <!-- <template slot-scope='{$index,row}'>
          	 	  	  	  	  {{$index+1}}
          	 	  	  	  </template> -->
          	 	  	  </el-table-column>

          	 	  	  <!-- label开始 -->
          	 	  	  <el-table-column label='label' prop='label' width='60' align='center'>
          	 	  	  	   
          	 	  	  </el-table-column>

          	 	  	  <!-- 选项开始 -->
          	 	  	  <el-table-column label='选项' align='center' >
          	 	  	  	  <template slot-scope='scope'>
          	 	  	  	  	   <el-input v-model='scope.row.name'></el-input>
          	 	  	  	  </template>
          	 	  	  </el-table-column>

          	 	  	  <!-- 分值开始 -->
          	 	  	  <el-table-column label='分值' width='60' align='center'>
          	 	  	  	   <template slot-scope='scope'>
          	 	  	  	   	   <el-input v-model='scope.row.score'></el-input>
          	 	  	  	   </template>
          	 	  	  </el-table-column>

          	 	  	  <!-- 操作开始 -->
          	 	  	  <el-table-column label='操作' width='100' align='center'>
          	 	  	  	  <template slot-scope="scope">
						       <el-button type="danger" icon="el-icon-delete" circle size='small' @click='deleteR(scope.$index)'></el-button>
						  </template>
          	 	  	  </el-table-column>
          	 	  </el-table>
          	 	  <div style='text-align:right'>
          	 	  	  <el-button :disabled='qDialog.form.options.length>=5' size='mini' @click='addOption'><i class="fa fa-plus"></i></el-button>
          	 	  </div>
          	 </el-form-item>
          </el-form>
          <!-- 模态框表单结束 -->
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="qDialog.visible = false">取 消</el-button>
		    <el-button type="primary" @click='saveOrUpdateQuestion'>确定</el-button>
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
             questions:[],
             qDialog:{
             	title:'',
             	visible:false,
             	form:{
             		options:[]
             	}
             },
             params:[], //保存修改模态框时信息
             multipleSelection: []    //保存表格选择项
         }
        },
        mounted(){
           this.finAllQuestions();
        },
        methods:{
        	//模态框打开时
        	open(){

        	},
           // 查询所有问题
           finAllQuestions(){
           	axios.get('/question/findAllQuestionVM')
           	.then(({data:result})=>{
                this.questions=result.data;
           	})
           },
           //模态框内表格添加信息
           addOption(){
              let option={};
              let label='';
              let score=0;
              switch(this.qDialog.form.options.length){
              	 case 0:
						label='A'; score = 5;
						break;
					case 1:
						label='B'; score = 4;
						break;
					case 2:
						label='C'; score = 3;
						break;
					case 3:
						label='D'; score = 2;
						break;
					case 4:
						label='E'; score = 1;
						break;
              }
              option.label=label;
              option.score=score;
              this.qDialog.form.options.push(option);
           },
           //保存数据
           saveOrUpdateQuestion(){
               console.log(this.qDialog.form);
               axios.post('/question/saveOrUpdateQuestion',this.qDialog.form)
               .then(({data:result})=>{
                   if(result.status==200){
                   	    this.$message({
								showClose: true,
								message: '保存成功',
								type: 'success'
						});
						this.finAllQuestions();
						this.qDialog.visible=false
                   }else{
                   	    this.$message({
								showClose: true,
								message: '保存失败',
								type: 'error'
						});
                   }

               })
           },
           //模态框表格内信息删除
           deleteR(id){
               this.qDialog.form.options.splice(id,1);
           },

           //删除单个问题
           deleteQuestion(id){
              console.log(id);
               this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        axios.get('/question/deleteQuestionById',{
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
	                  this.finAllQuestions();
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
           //批量删除问题
           batchDeleteQuestion(){
              if(this.multipleSelection.length!=0){
                  this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        let ids=this.multipleSelection;
		        axios.post('/question/batchDeleteQuestion',{ids})
	             .then((result)=>{
	                  this.finAllQuestions();
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
              }else{
              	this.$message({
						showClose: true,
						message: '请选择要删除的题目',
						type: 'warning'
					});
              }
           },
           //弹出添加模态框
           toAddQuestion(){
           	   this.qDialog.title='添加',
           	   this.qDialog.visible=true
           },
           //弹出修改模态框
           toUpdateQuestion(q){
                this.qDialog.title='修改问题',
                this.qDialog.visible=true,
                this.params=JSON.parse(JSON.stringify(q));
                this.qDialog.form=this.params;
                console.log(this.qDialog.form);
           },
           //获取复选框
           change(id){

           	  this.multipleSelection.push(id);
           	  console.log(this.multipleSelection);
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
	.question{
		padding: 1em 0;
		border-bottom: 1px solid #333;
		position: relative;
	}
	.question >.question-options{
		padding-left: 7em;
		width: 50%;
	}
	.question >.question-btns{
		position: absolute;
		top:1em;
		right:2em;
	}
</style>