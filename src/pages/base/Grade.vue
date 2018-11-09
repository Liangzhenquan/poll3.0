<template>
	<div class="user">
		<!-- 输入框 -->
	<!-- 	<div class="search">
			<el-form>
					<el-input v-model="keywords" placeholder="请输入关键字" size="small" clearable>	
					  <el-button slot="append" icon="el-icon-search" @click='findUserByUsername'></el-button>
					</el-input>
		    </el-form>
		</div> -->
		<!-- 按钮区 -->
	   <div class="btns">
	   	   <el-button size="small" @click='toAddGrade'>添加</el-button>
	   	   <el-button size="small" type="danger" @click='batchDeleteGrade'>批量删除</el-button>
	   </div>

	   <!-- 表格区 -->
	    <el-table
	    :data="Grade"
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
	      prop="descriptionin"
	      label="简介"
	      width="680"
	      align='center'
	      >
	    </el-table-column>
	    <el-table-column
	      align='center'
	      label="操作">
	      <template slot-scope="{row}">
		       <el-button type="primary" icon="el-icon-edit" circle size='small' @click='toUpdateGrade(row)'></el-button>
		       <el-button type="danger" icon="el-icon-delete" circle size='small' @click='deleteGrade(row.id)'></el-button>
		  </template>
	    </el-table-column>
	  </el-table>
	  <!-- 模态框开始 -->
	     <el-dialog
		  :title="gDialog.title"
		  :visible.sync="gDialog.visible"
		  width="30%" @open='open()'>
		  {{gDialog.form}}
		  <!-- 模态框表单开始 -->
          <el-form :model="gDialog.form" ref="gDialog.form" :rules='rules'>
          	   <el-form-item label="年级名称"  label-width="6em" prop='name'  size='small' >
	        	  <el-input  v-model="gDialog.form.name" autocomplete="off"></el-input>
	           </el-form-item>    
	           <el-form-item label='年级介绍' label-width="6em">
	           	   <el-input
					  type="textarea"
					  :rows="3"
					  placeholder="请输入内容"
					  v-model="gDialog.form.descriptionin">
					</el-input>
	           </el-form-item>
          </el-form>
          <!-- 模态框表单结束 -->
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="gDialog.visible = false">取 消</el-button>
		    <el-button type="primary" @click="saveOrUpdate('gDialog.form')">确定</el-button>
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
               Grade:[],
               params:{},
               gDialog:{                //模态框信息
               	   title:'',
               	   visible:false,
               	   form:{
               	   	 name:'',
               	   	 descriptionin:undefined
               	   }
               },
               form:{},    //用于点击修改按钮时，保存一行信息
               multipleSelection: [],    //保存表格选择项
               rules:{
               	  name:[{ required: true, message: '年级不能为空',trigger:'blur'
               	}]
               }
       	   }
       },
       mounted(){
          this.findAll();
       },
       methods:{
       	  //模态框打开时清除表单验证
       	  open(){
       	  	if(this.$refs['gDialog.form']){
				 this.$refs['gDialog.form'].clearValidate();
		    }
       	  },
       	  //查询所有年级
          findAll(){
             axios.get("/grade/findAll")
             .then(({data:result})=>{
                 this.Grade=result.data;
             })
             .catch()
          },
          // 弹出添加模态框
          toAddGrade(){
              this.gDialog.title='添加年级',
              this.gDialog.visible=true,
              this.gDialog.form={}
          },

          //添加或更新
          saveOrUpdate(formName){
               
               this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	this.params=this.gDialog.form;
		             axios.post('/grade/saveOrUpdate',this.params)
		             .then((result)=>{
                         	this.gDialog.visible=false;   //关闭模态框
            		    	if(result.status==200){
	            		    	this.$message({
									showClose: true,
									message: '添加成功',
									type: 'success'
						        });
	                            // 传递栏目id刷新页面
	            		    this.findAll();
	            		    }else{
	            		    	this.$message({
									showClose: true,
									message: '数据错误',
									type: 'error'
					        	});
	            		    }
		             })
		             .catch(()=>{

		             })
		          } else {
		            return false;
		          }
		        });	
          },
          //删除单行
          deleteGrade(id){
              this.$confirm('此操作将永久删除该年级, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        axios.get('/grade/deleteById',{
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
	                  this.findAll();
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
          //批量删除
          batchDeleteGrade(){
             let ids=this.multipleSelection.map((item)=>{
             	return item.id;
             });
             if(ids!=''){
		        axios.get('/grade/batchDelete',{ids})
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

          //通过修改按钮打开模态框
          toUpdateGrade(row){
             this.gDialog.title='修改年级信息';
             this.gDialog.visible=true
             Object.assign(this.form,row);
             this.gDialog.form=this.form;
          },
          //当表格多选项改变时触发，保存每一行信息
          handleSelectionChange(val){
              this.multipleSelection=val;
          }
       }
	}
</script>
<style>
/*	.search{
		width: 25%;
		display: inline-block;
		margin-bottom: .5em;
	}*/
	.btns{
		float: right;
		margin-bottom: .5em;
	}
</style>