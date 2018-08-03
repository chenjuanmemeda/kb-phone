<template>
    <div class="sign-wrap">
        <header-tit :title="'登录'"></header-tit>
        <p class="logo"></p>
        <div class="form-control">
            <i class="icon mobile"></i>
            <input type="text" v-model="query.loginName" placeholder="手机号/用户名" maxlength="15"/>
        </div>
        <div class="form-control">
            <i class="icon password"></i>
            <input :type="isHidePassword" v-model="query.password" placeholder="请输入6-15位密码"/>
            <i class="hidePassword"
               @click="changeIsHidePassword"
               :class="{'cubeic-eye-invisible':isHidePassword === 'password','cubeic-eye-visible':isHidePassword === 'text'}"></i>
        </div>
        <router-link tag="a" class="gotoForgetPassword" :to="'/forgetPassword'">忘记密码</router-link>
        <div class="btn-wrap">
            <cube-button @click="sign">登录</cube-button>
            <router-link tag="button" class="goto-register" :to="'/register'">注册</router-link>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import {httpAnon, httpUser, api_type} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';
	import JSencrypt from '../../../node_modules/jsencrypt/bin/jsencrypt';
	import headerTit from '../../components/header/header';

	let encrypt = new JSencrypt();

	export default {
		name: '',
		data() {
			return {
				isHidePassword: 'password',
				query: {
					loginName: '',
					password: '',
				},

			};
		},
		methods: {
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
			changeIsHidePassword() {
				if (this.isHidePassword === 'password') {
					this.isHidePassword = 'text';
				} else {
					this.isHidePassword = 'password';
				}
			},
			...mapMutations(['SET_GLOBALSTATE', 'SET_TK']),
			sign() {

				if (util.Browser.isIOS) this.loadUrl('callByNative://');

				let RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJDo2w9G390N+LXTIcFvASarq+dKX8NtpBxP01pKwcgQN3KYVy3xAF0bAERfB/uBoB6pllWx1OT5o1T4p7jN1GcCAwEAAQ==';

				let loginQuery = {
					loginName: this.query.loginName
				};

				if (util.ck.get('CLIENTTYPE')) {
					loginQuery.clientType = util.ck.get('CLIENTTYPE');
				}

				encrypt.setPublicKey(RSAKey);

				let encrypted = encrypt.encrypt(this.query.password);

				loginQuery.pwd = window.encodeURIComponent(encrypted);

				this.SET_GLOBALSTATE({type: 'loading'});

				httpAnon.post(api_type.user('login'), util.queryString(loginQuery))
				.then(data => {
					if (data.code === 200) {
						this.SET_TK(data.data.token);

						util.ck.set('_KBTK', data.data.token);

						if (util.regExp.isMobile(loginQuery.loginName)) {
							util.ck.set('_KBMB', loginQuery.loginName);
						}

						if (util.Browser.isAndroid && window.KuaiBiAnd) {
							window.KuaiBiAnd.connectServer(data.data.token);
						}

						this.$router.push('/index');
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}

					this.SET_GLOBALSTATE({type: 'done'});

				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			}
		},
		components: {
			'header-tit': headerTit
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .sign-wrap
        background-color: #f9f8f6
        min-height 100vh
        .logo
            margin 25px auto 40px
            width 45px
            height 45px
            -webkit-background-size: 100% 100%
            background-size: 100% 100%
            background-image: url(../../assets/img/logo.png)
        .form-control
            position relative
            width 8.5rem
            margin 0 auto 8px
            border-bottom 1px solid #eee
            .icon
                display block
                position absolute
                left 3px
                top 8px
                width 35px
                height 35px
                -webkit-background-size: 100%
                background-size: 100%
                &.mobile
                    background-image: url(../../assets/img/icon-phone.png)
                &.password
                    background-image: url(../../assets/img/icon-lock.png)
            input
                width calc(100% - 55px)
                padding 18px 10px 18px 45px
                background-color: #f9f8f6
                outline none
                border 0
                font-size: 14px
            .hidePassword
                position absolute
                top 13px
                right 15px
                color: #aaa

        .gotoForgetPassword
            display block
            width 8rem
            margin 10px auto 0
            color: red
            text-align right
            font-size: 14px

    .btn-wrap
        margin 60px auto 0
        width 6rem
        .goto-register
            margin-top 10px
            width 100%
            padding 12px
            border 0
            background-color: transparent
            font-size: 14px
            color: #999
            outline none


</style>