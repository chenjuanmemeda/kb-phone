<template>
    <div class="forget-wrap">
        <header-tit :title="title"></header-tit>
        <div class="isSafe-wrap" v-if="!isSafe">
            <div class="form-control">
                <i class="icon mobile"></i>
                <input type="text" placeholder="请输入手机号码" v-model="mobile" maxlength="11"/>
            </div>
            <div class="form-control">
                <i class="icon captcha"></i>
                <input type="text" placeholder="请输入图形验证码" v-model="captchaCodeValue" maxlength="4" style="width: 4rem"/>
                <img :src="captchaCode" alt="" @click="changecaptchaCode" class="capcode">
            </div>
            <div class="form-control">
                <i class="icon vcode"></i>
                <input type="text" placeholder="请输入短信验证码" v-model="verifyCode" maxlength="6" style="width: 4rem"/>
                <getvCode :query="getvCodeQuery()"/>
            </div>
            <div class="btn-wrap">
                <cube-button class="then" @click="nextStep">下一步</cube-button>
            </div>
        </div>

        <div class="forget-form-wrap" v-if="isSafe">
            <div class="form-control no-icon">
                <label class="lab">新密码 :</label>
                <input type="password" v-model="query.newPwd" placeholder="请输入密码"/>
            </div>
            <div class="form-control no-icon">
                <label class="lab">确认新密码 :</label>
                <input type="password" placeholder="请再次输入新密码" v-model="query.rePwd"/>
            </div>
            <p>输入6-15位数字、字母或组合密码</p>
            <div class="btn-wrap">
                <cube-button class="then" @click="forgetPassword">确定</cube-button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import headerTit from '../header/header';
	import getvCode from '../def/getvCode';
	import {httpAnon, httpUser, api_type, CONFIG} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import JSencrypt from '../../../node_modules/jsencrypt/bin/jsencrypt';
	import {mapMutations} from 'vuex';

	let encrypt = new JSencrypt();

	export default {
		data() {
			return {
				captchaCode: CONFIG.api.captchaCode,
				query: {
					newPwd: '',
					rePwd: '',
				},
				mobile: '',
				captchaCodeValue: '',
				verifyCode: '',
				key: '',
				isSafe: false
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			changecaptchaCode() {
				this.captchaCode = CONFIG.api.captchaCode + `&r=${~~(Math.random() * 999)}`;
			},
			// 安全验证
			nextStep() {
				if (!util.regExp.isMobile(this.mobile)) {
					return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入正确格式的手机号码'});
				}
				let generateKeyQuery = {
					mobile: this.mobile,
					operate: 3,
					verifyCode: this.verifyCode
				};


				this.SET_GLOBALSTATE({state: 'loading'});

				httpAnon.get(api_type.sms('check'), generateKeyQuery)
				.then(data => {
					if (data.code === 200) {
						httpAnon.post(api_type.sms('generateKey'), util.queryString(generateKeyQuery))
						.then(data => {
							if (data.code === 200) {
								this.isSafe = true;
								this.key = data.data.key;
							} else {
								return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
							}
							this.SET_GLOBALSTATE({type: 'done'});
						});
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
				});


			},
			forgetPassword() {
				// if (!util.regExp.isPwd(this.query.newPwd)) {
				if (this.query.newPwd.length < 6) {
					return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入6位数以上的密码！'});
				} else if (this.query.newPwd !== this.query.rePwd) {
					return this.SET_GLOBALSTATE({type: 'warn', txt: '两次输入的密码不一致！'});
				}

				this.SET_GLOBALSTATE({state: 'loading'});

				let RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbwQOJguMK/YjHUofKomXCBrPrLr28GFPTZBXU0FR9ixVzGtZ2l1x+TbP+K3RS6Wcodg5QtKhNwurork4y6W1kCAwEAAQ==';

				encrypt.setPublicKey(RSAKey);

				let encrypted = encrypt.encrypt(this.query.newPwd);

				let forgetPasswordQuery = {
					key: this.key,
					newPwd: window.encodeURIComponent(encrypted)
				};

				httpAnon.post(api_type.user('forgetPwd'), util.queryString(forgetPasswordQuery))
				.then(data => {
					if (data.code === 200) {
						this.$router.push('/sign');
						return this.SET_GLOBALSTATE({type: 'correct', txt: data.msg});
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}

				});
			},
			getvCodeQuery() {
				let getvCode = {
					mobile: this.mobile,
					operate: 3,
					captchaCode: this.captchaCodeValue
				};

				return getvCode;
			}
		},
		computed: {
			title() {
				return !this.isSafe ? '安全验证' : '忘记密码';
			}
		},
		components: {
			headerTit, getvCode
		},
		mounted() {
			this.changecaptchaCode();
		},
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .forget-wrap
        background-color #f9f8f6
        min-height 100vh
        .forget-form-wrap
            .logo
                margin 25px auto 40px
                width 45px
                height 45px
                -webkit-background-size: 100% 100%
                background-size: 100% 100%
                background-image: url(../../assets/img/logo.png)
            p
                font-size 10px
                color #999
                padding 10px 0 30px 29px

    .btn-wrap
        margin 60px auto 0
        width 6rem
        .void-btn
            margin-top 10px
            width 100%
            padding 12px
            border 0
            background-color: transparent
            font-size: 16px
            color: #999
            outline none

    .form-control
        position relative
        width 8.5rem
        margin 0 auto
        border-bottom 1px solid #eee

    &.no-icon
        position relative
        width 8.5rem
        margin 0 auto
        border-bottom 1px solid #eee
        input
            padding 18px 0 18px 5px

    .lab
        font-size: 14px
        line-height 50px

    input
        padding 18px 0 18px 50px
        background-color: #f9f8f6
        outline none
        border 0
        font-size: 14px
        vertical-align: top

    .getvCode
        position absolute
        top 5px
        right 0 !important
        width 110px

    .capcode
        float: right
        margin-top: 3px

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
        &.captcha
            -webkit-background-size: 80%
            background-size: 80%
            background-image: url(../../assets/img/icon-captcha.png)
        &.vcode
            -webkit-background-size: 80%
            background-size: 80%
            background-image: url(../../assets/img/icon-vcode.png)
</style>