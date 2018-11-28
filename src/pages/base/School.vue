<template>
	<div class="school">
	<!-- 校园信息开始 -->
	 <el-table
	      :data="school"
	      style="width: 100%" border>
	      <el-table-column
	        prop="name"
	        label='校园名称'
	        width="180">
	      </el-table-column>
	      <el-table-column
	        prop="description"
	        label='校园介绍'
	      >
	      </el-table-column>
	      <el-table-column
	         prop="address"
	        label='校园地址'
	        width="180">
	      </el-table-column>
	      <el-table-column
	         prop="telephone"
	        label='校园电话'
	        width="180">
	      </el-table-column>
	      <el-table-column
	         prop="copyright"
	        label='版权信息'
	        width="180">
	      </el-table-column>
     </el-table>
	<!-- 校园信息结束 -->

	</div>
</template>
<script>
    import getAxios from "@/http/getAxios"
    let axios=getAxios();
	export default {
        data(){
        	return {
               school:[],
               id:1
        	}
        },
        mounted(){
           this.findSchool();
        },
        methods:{
        	findSchool(){
	        	axios.get('/school/findById',{
	        		params:{
	        			id:this.id
	        		}
	        	})
	        	.then(({data:result})=>{
	        		console.log(result.data);
                   this.school.push(result.data);
                   console.log(this.school);

	        	})
	        	.catch(()=>{

	        	})
	        }
        }
	}
</script>
<style>
	
</style>