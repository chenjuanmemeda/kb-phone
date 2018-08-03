<template>
    <div class="inviteAct-wrap">
        <header-tit :title="'邀请注册活动详情'" style="background-color: #fff;"></header-tit>
		<div class="content">
			<div class="router-wrap">
				<ul class="router-list">
					<li class="item"><router-link to="">去邀请好友</router-link></li>
					<li class="item"><router-link to="">邀请排行榜</router-link></li>
					<li class="item"><router-link to="">我的奖品</router-link></li>
				</ul>
				<p>您已经邀请xx人,目前排在xx位</p>
				<!-- <marquee :listData = "listData"></marquee> -->
				<ul class="router-list">
					<!-- <vue-marquee :duration="600" :interval="2000">
						<li v-for="(i,index) in listData" :content="i":key="index" ></li>
					</vue-marquee> -->
				</ul>
				
			</div>
			<div class="draw-wrap">
				<lucky></lucky>
			</div>

		</div>
    </div>
</template>

<script type="text/ecmascript-6">
	import Lucky from "../common/lucky"
	import {httpAnon, api_type} from "../../assets/js/api";
	import {mapMutations} from 'vuex';
	import marquee from './marquee'
	export default {
		data() {
			return {
				listData:['恭喜用户名获得1','恭喜用户名获得2','恭喜用户名获得3','恭喜用户名获得4',],
				title:''
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			
		},
		mounted() {
		},
		components:{
			Lucky,marquee,
			
		},
		deactivated() {
			this.$destroy();
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>

.inviteAct-wrap
	.content
		.router-wrap
			margin 0 auto 
			width 90%
			border 1px solid red
			.router-list
				display flex
				padding-bottom 10px
				.item
					flex 1
					border 1px solid blue
					margin-left 5px
					padding 5px
					font-size 10px
			p
				text-align center
				font-size 10px
		.draw-wrap
			border 1px solid red

</style>