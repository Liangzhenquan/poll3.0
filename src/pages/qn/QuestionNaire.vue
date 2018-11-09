<template>
	<div class="user">
		<!-- 搜索区开始 -->
		<div class="search">
			  <el-input  placeholder="请输入关键字" size='small' clearable>
				  <el-button slot="append" icon="el-icon-search" circle></el-button>
			</el-input>	

		</div>
		<!-- 搜索区结束 -->
		<!-- 按钮组开始 -->
		<div class="btns">
			<el-button size="small" @click='toAddNaire'>添加</el-button>
	   	    <el-button size="small" type="danger" @click='batchDeleteNaire'>批量删除</el-button>
		</div>
		<!-- 按钮组结束 -->
		<!-- 表格开始 -->
		 <el-table
	    :data="naire"
	    border
	    style="width: 100%" @selection-change="handleSelectionChange">
	     <el-table-column
	      type="selection"
	      width="55" align='center'>
	    </el-table-column >
	    <el-table-column
	      prop="name"
	      label="问卷名称"
	      width="380"
	      align='center'>
	    </el-table-column>
	    <el-table-column
	      prop="description"
	      label="问卷详情"
	      width="380"
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
	</div>
</template>
<script>
    import getAxios from '@/http/getAxios'
	//post提交数据，数据中有数组，并且数组中嵌套对象
	let axios = getAxios('array');
	export default {
       data(){
       	  return {
             naire:[],       //保存表格信息
             multipleSelection: []    //保存表格选择项

       	  }
       },
       mounted(){
           this.findAll();
       },
       methods:{
       	    // 查询所有问卷
           findAll(){
              axios.get('/questionnaire/findAllQuestionnaire')
              .then(({data:result})=>{
                   this.naire=result.data;
              })
           },
           // 坦克添加模态框
           toAddNaire(){

           },
           // 批量删除
           batchDeleteNaire(){

           },
           //多选框选中时触发
           handleSelectionChange(){

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