<template>
    <keep-alive include="userCenter">
        <router-view/>
    </keep-alive>
</template>

<script type="text/ecmascript-6">
	import {httpUser, api_type} from "../../assets/js/api";
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';

	export default {
		methods: {},
		created() {
			if (!util.getToken) {
				this.SET_GLOBALSTATE({type: 'error', txt: '登录状态已失效，请重新登录！'});
			}
		},
	};
</script>

<style type="text/stylus" lang="stylus" scoped>

</style>