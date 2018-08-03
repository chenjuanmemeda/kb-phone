<template>
    <div class="userCenter-wrap">
        <header-tit :title="'个人中心'"></header-tit>
        <div class="userDetail-wrap">
            <router-link tag="div" :to="'/userInfo'" class="avatar">
                <img :src="userInfo.userImageUrl" alt="" width="60" height="60" @error="imgErr">
                <i class="pen"></i>
            </router-link>
            <div class="info-wrap">
                <p class="user-name">{{userInfo.userName || ''}}</p>
                <p class="time-out">{{overDue}}</p>
            </div>
            <router-link tag="button" :to="'/vip'" class="recharge">续费</router-link>
        </div>
        <ul class="menus-list">
            <router-link tag="li" v-for="(menu,$index) of menus" :class="menu.cls" :to="menu.path" :key="$index">
                <i class="icon" :class="menu.icon"></i>
                <span class="text">{{menu.text}}</span>
                <i class="arrow cubeic-arrow"></i>
            </router-link>
        </ul>
        <div class="btn-wrap">
            <cube-button @click="logout">退出登录</cube-button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import {httpUser, api_type} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';

	let defaultAvatar = require('../../assets/img/logo.png');

	export default {
		name: "",
		data() {
			return {

				menus: [
					{text: '钱包', icon: 'wallet', path: '/wallet', cls: 'menu border-bottom-1px'},
					{text: 'VIP会员', icon: 'vip', path: '/vip', cls: 'menu border-bottom-1px'},
					{text: '糖果商城', icon: 'candyShop', path: '/candyShop', cls: 'menu border-bottom-1px'},
					{text: '邀请注册', icon: 'invite', path: '/invite', cls: 'menu border-bottom-1px'},
					// {text: '个人资料', path: '/userInfo', cls: 'menu  border-bottom-1px'},
					{text: '账户密码', icon: 'lock', path: '/passwordOperation/changePassword', cls: 'menu'},
				],
			};
		},
		methods: {
			...mapMutations(['SET_USERINFO']),

			loadUrl(url) {
				let iFrame = null;
				iFrame = document.createElement("iframe");
				iFrame.setAttribute("src", url);
				iFrame.setAttribute("style", "display:none;");
				iFrame.setAttribute("height", "0px");
				iFrame.setAttribute("width", "0px");
				iFrame.setAttribute("frameborder", "0");
				document.body.appendChild(iFrame);
				// 发起请求后这个iFrame就没用了，所以把它从dom上移除掉
				iFrame.parentNode.removeChild(iFrame);
				iFrame = null;
			},

			imgErr(err) {
				if (err) this.userInfo.userImageUrl = defaultAvatar;
			},
			callByNative() {

			},
			logout() {

				if (window.KuaiBiAnd) {
					window.KuaiBiAnd.disconnectServer();
				}

				this.callByNative();
				httpUser.post(api_type.user('logout'))
				.then(data => {

					util.ck.remove(['_KBTK', '_KBMB']);
					this.$router.push({path: '/sign', query: {type: 'gotoIndex'}});
				});
			},
			getDetail() {
				httpUser.get(api_type.user('getDetail')).then((data) => {
					if (data.code === 200) {
						this.SET_USERINFO(data.data);
						let now = new Date().getTime();
						let overdue = new Date(data.data.rechargeTime.replace(/-/g, '/')).getTime();
						let result = (overdue - now) / (1000 * 60 * 60 * 24) >> 0;
						// console.log('time:', result);
						// if (result <= 0) {
						// 	// this.isOverDueMethods();
						// }
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
				});
			}
		},
		mounted() {

			this.userInfo.userImageUrl = this.userInfo.userImageUrl || defaultAvatar;
			// this.userInfo.userImageUrl = 'http://pic.cjdltest.com/pics/10104600953535897232360.png';
			this.getDetail();
		},
		computed: {
			tk() {
				return util.getToken();
			},
			userInfo() {
				return this.$store.state.userInfo;
			},
			overDue() {
				if (!this.tk) return;

				let now = new Date().getTime();
				let overdue = new Date(this.userInfo.rechargeTime.replace(/-/g, '/')).getTime();
				let result = (overdue - now) / (1000 * 60 * 60 * 24) >> 0;
				return (result > 0) ? `VIP将于${result}天后到期` : '您的VIP已到期';
			},
		},
		deactivated() {
			this.$destroy();
		}
	};
</script>

<style type="text/stylus" lang="stylus">
    .userDetail-wrap
        display flex
        padding 15px 23px 25px
        font-size: 14px
        background-color: $color-bgc
        margin-bottom 11px
        align-items center
        .avatar
            position relative
            flex 0 0 60px
            width 60px
            height 60px
            margin-right: 15px
            img
                border-radius 999px
            .pen
                position absolute
                right -3px
                bottom: 0
                display block
                background-image: url(../../assets/img/pen.png)
                width 18px
                height 18px
                -webkit-background-size: 100%
                background-size: 100%
        .info-wrap
            flex 1
            .user-name
                margin-bottom: 8px
            .time-out
                font-size: 12px
        .recharge
            background-color: #8cc152
            color: #fff
            border-radius 999px
            border: 0
            width 60px
            padding 5px 0

    .menus-list
        background-color: $color-bgc
        padding 0 23px
        font-size: 0
        margin-bottom: 45px
        .menu
            display flex
            line-height 45px
            font-size: 14px
            align-items center
            .icon
                flex 0 0 20px
                height 20px
                margin-right: 10px
                display inline-block
                background-repeat: no-repeat
                -webkit-background-size: 100% 100%
                background-size: 100% 100%
                &.wallet
                    background-image: url(../../assets/img/userCenter/cash-icon.png)
                &.vip
                    background-image: url(../../assets/img/userCenter/vip-icon.png)
                &.candyShop
                    background-image: url(../../assets/img/userCenter/shop-icon.png)
                &.invite
                    background-image: url(../../assets/img/userCenter/invitation-icon.png)
                &.lock
                    flex 0 0 15px
                    margin-left 3px
                    margin-right 12px
                    background-image: url(../../assets/img/userCenter/lock.png)
            .text
                flex: 1
                font-size: 14px
            .arrow
                flex 0 0 15px
                color: #999

    .btn-wrap
        margin 0 auto 30px
        width: 6rem
        text-align: center


</style>