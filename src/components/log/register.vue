<template>
    <div class="register-wrap">
        <header-tit :title="'注册'"></header-tit>
        <p class="logo"></p>
        <div class="step-1-wrap" v-if="step === 1">
            <div class="form-control">
                <i class="icon mobile"></i>
                <input type="number" v-model="query.mobile" placeholder="请输入手机号码" :maxlength="11" @input="isElel"/>
            </div>
            <div class="form-control">
                <i class="icon captcha"></i>
                <input type="text" placeholder="请输入图形验证码" v-model="captchaCodeValue" maxlength="4"/>
                <img class="captchaCode" :src="captchaCode" @click="changecaptchaCode"/>
            </div>
            <div class="form-control">
                <i class="icon vcode"></i>
                <input type="text" v-model="query.mobileVerCode" placeholder="请输入短信验证码" maxlength="6"/>
                <getvCode :query="getvCodeQuery()"/>
            </div>

            <div class="btn-wrap">
                <cube-button class="then" @click="nextStep">下一步</cube-button>
                <router-link tag="button" :to="'/sign'" class="void-btn">已有账号</router-link>
            </div>
        </div>

        <div class="step-2-wrap" v-if="step === 2">
            <div class="form-control">
                <i class="icon password"></i>
                <input :type="isHidePassword" autocomplete="new-password" v-model="query.pwd" placeholder="请输入6-15位的密码"
                       maxlength="15"/>
                <i class="hidePassword"
                   @click="changeIsHidePassword"
                   :class="{'cubeic-eye-invisible':isHidePassword === 'password','cubeic-eye-visible':isHidePassword === 'text'}"></i>
            </div>
            <div class="form-control">
                <i class="icon invite"></i>
                <input type="text" autocomplete="new-password" placeholder="请输入邀请码(邀请码可增加VIP时长)" v-model="query.sn"/>
            </div>
            <div class="btn-wrap">
                <cube-button class="then" @click="register">注册</cube-button>
                <button class="void-btn" @click="step = 1">返回上一步</button>
            </div>
        </div>
        <successPage v-model="isSuccess" :path="gotoPath" :hasButton="false">
            <p>注册成功</p>
        </successPage>
    </div>
</template>

<script type="text/ecmascript-6">
	import headerTit from '../header/header';
	import getvCode from '../def/getvCode';
	import {httpAnon, httpUser, api_type, CONFIG} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import JSencrypt from '../../../node_modules/jsencrypt/bin/jsencrypt';
	import {mapMutations} from 'vuex';
	import successPage from '../../components/common/successPage';

	let encrypt = new JSencrypt();
	let RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJDo2w9G390N+LXTIcFvASarq+dKX8NtpBxP01pKwcgQN3KYVy3xAF0bAERfB/uBoB6pllWx1OT5o1T4p7jN1GcCAwEAAQ==';

	export default {
		data() {
			return {
				isSuccess: false,
				captchaCode: CONFIG.api.captchaCode, //图形验证码
				step: 1,
				isHidePassword: 'password',
				getvCodeText: '获取验证码',
				query: {
					mobile: '',
					pwd: '',
					mobileVerCode: '',
					sn: ''
				},
				captchaCodeValue: '',
				timeout: 60,
				vCodeInterval: null,
				gotoPath: '/sign',
				mobileReg: /^[0-9]*$/
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			changeIsHidePassword() {
				if (this.isHidePassword === 'password') {
					this.isHidePassword = 'text';
				} else {
					this.isHidePassword = 'password';
				}
			},
			changecaptchaCode() {
				this.captchaCode = CONFIG.api.captchaCode + `&r=${~~(Math.random() * 999)}`;
			},

			nextStep() {

	
				if (!util.regExp.isMobile(this.query.mobile)) {
					return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入正确格式的手机号！'});
				}

				if (this.$_.isEmpty(this.captchaCodeValue)) {
					return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入正确的图形验证码！'});
				}

				if (this.query.mobileVerCode.length < 4) {
					return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入正确的短信验证码！'});
				}

				var checkQuery = {
					mobile: this.query.mobile,
					operate: '1',
					verifyCode: this.query.mobileVerCode
				};
				httpAnon.get(api_type.sms('check'), checkQuery)
				.then(data => {

					if (data.code === 200) {
						httpAnon.get(api_type.user('checkMobile4Reg'), {mobile: this.query.mobile})
						.then(data => {
							if (data.code === 200) {
								if (data.data === 1) {
									return this.SET_GLOBALSTATE({type: 'error', txt: '手机号已被注册！'});
								}
								this.step = 2;
							} else {
								return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
							}
							return this.SET_GLOBALSTATE({type: 'done'});
						});

					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}


				});
			},
			/**
			 * 提交注册
			 * @returns {*}
			 */
			register() {

				let loginQuery = {
					loginName: this.query.mobile
				};

				if (util.ck.get('CLIENTTYPE')) {
					loginQuery.clientType = util.ck.get('CLIENTTYPE');
					this.query.clientType = util.ck.get('CLIENTTYPE');
				}

				this.SET_GLOBALSTATE({state: 'loading'});

				if (this.$_.isEmpty(this.query.pwd) || this.query.pwd.length < 6 || this.query.pwd.length > 15) {
					return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入6-15位的密码！'});
				}

				if (this.$route.params.sn) this.query.sn = this.$route.params.sn;
				if (this.$route.query.sn) this.query.sn = this.$route.query.sn;

				httpAnon.post(api_type.user('add'), util.queryString(this.query))
				.then(data => {
					if (data.code === 200) {

						encrypt.setPublicKey(RSAKey);

						let encrypted = encrypt.encrypt(this.query.pwd);

						loginQuery.pwd = window.encodeURIComponent(encrypted);

						httpAnon.post(api_type.user('login'), util.queryString(loginQuery))
						.then(data => {
							if (data.code === 200) {
								util.ck.set('_KBTK', data.data.token);
								util.ck.set('_KBMB', data.data.mobile);
								this.gotoPath = '/';

								setTimeout(() => {
									this.$router.push({path: '/', params: {reload: 'getDetail'}});
								}, 1000);

								return this.SET_GLOBALSTATE({type: 'correct', txt: '注册成功！'});
							}
						});

					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					return this.SET_GLOBALSTATE({type: 'done'});
				});
			},
			getvCodeQuery() {
				let getvCode = {
					mobile: this.query.mobile,
					operate: 1,
					captchaCode: this.captchaCodeValue
				};

				return getvCode;
			},
			isElel() {
				if (this.query.mobile.length > 11) {
					this.query.mobile = this.query.mobile.slice(0, 11);
				}
			}
		},
		mounted() {
			this.changecaptchaCode();
		},
		components: {
			'header-tit': headerTit,
			getvCode, successPage
		},
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .register-wrap
        background-color #f9f8f6
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
                background-repeat: no-repeat
                background-position: center center
                &.mobile
                    background-image: url(../../assets/img/icon-phone.png)
                &.password
                    background-image: url(../../assets/img/icon-lock.png)
                &.captcha
                    -webkit-background-size: 80%
                    background-size: 80%
                    background-image: url(../../assets/img/icon-captcha.png)
                &.vcode
                    -webkit-background-size: 80%
                    background-size: 80%
                    background-image: url(../../assets/img/icon-vcode.png)
                &.invite
                    -webkit-background-size: 80%
                    background-size: 80%
                    background-image: url(../../assets/img/icon-invite.png)
            input
                width calc(100% - 55px)
                padding 18px 10px 18px 45px
                background-color: #f9f8f6
                outline none
                border 0
                font-size: 14px
            .captchaCode
                position absolute
                right 0
                top 0
                width 3rem
                font-size: 14px
            .getvCode
                position absolute
                top 2px
                right 0
                width 3rem
            .hidePassword
                position absolute
                top 13px
                right 15px
                color: #aaa

    .btn-wrap
        margin 60px auto 0
        width 6rem
        .void-btn
            margin-top 10px
            width 100%
            padding 12px
            border 0
            background-color: transparent
            font-size: 14px
            color: #999
            outline none

</style>