<template>
    <div class="password-wrap">
        <header-tit :title="'账户密码'"></header-tit>
        <div class="menus-list">
            <router-link tag="div" :to="'/passwordOperation/changePassword'" class="form-control border-bottom-1px">
                <label class="lab">修改密码</label>
                <i class="arrow cubeic-arrow"></i>
            </router-link>
            <!--<router-link tag="div" :to="'passwordOperation/forgetPassword'" class="form-control">-->
                <!--<label class="lab">忘记密码</label>-->
                <!--<i class="arrow cubeic-arrow"></i>-->
            <!--</router-link>-->
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
	import headerTit from '../../components/header/header';

	export default {
		data() {
			return {};
		},
		methods: {},
		components: {
			'header-tit': headerTit
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .password-wrap
        background-color: #f9f8f6
        min-height 100vh
        .menus-list
            padding 0 20px
            .form-control
                display flex
                line-height 50px
                .lab
                    flex 1
                    font-size: 14px
                .arrow
                    flex 0 0 15px
                    color: #999
                    font-size: 14px
</style>