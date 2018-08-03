<template>
    <div class="passwordOperation-wrap">
        <header-tit :title="title"></header-tit>
        <div class="captchaCode-wrap" v-if="!captchaCodeState">
            <div class="form-control border-bottom-1px">
                <i class="icon mobile"></i>
                <input type="text" v-model="getvCodeQuery.mobile" maxlength="11" placeholder="请输手机号"/>
            </div>
            <div class="form-control border-bottom-1px">
                <i class="icon captcha"></i>
                <input type="text" v-model="getvCodeQuery.captchaCode" placeholder="请输入图形验证码" maxlength="4"/>
                <img class="captchaCode" :src="captchaCode" alt="" @click="changecaptchaCode">
            </div>
            <div class="form-control border-bottom-1px">
                <i class="icon vcode"></i>
                <input type="text" v-model="verifyCode" placeholder="请输入短信验证码" maxlength="6"/>
                <getvCode :query="getvCodeQuery"/>
            </div>
        </div>

        <!--<div class="form-wrap" v-if="operationType === 'forgetPassword' && captchaCodeState">-->
        <!--<div class="form-control border-bottom-1px">-->
        <!--<input type="password" placeholder="请输入新密码"/>-->
        <!--</div>-->
        <!--<div class="form-control">-->
        <!--<input type="password" placeholder="请再次输入新密码"/>-->
        <!--</div>-->
        <!--<p class="tips">输入6-15位数字、字母或组合密码</p>-->
        <!--</div>-->

        <div class="form-wrap" v-if="operationType === 'changePassword' && captchaCodeState">
            <div class="form-control border-bottom-1px">
                <label class="lab">原密码 :</label>
                <input type="text" placeholder="请输入原密码" v-model="changePasswordQuery.pwd"/>
            </div>
            <div class="form-control border-bottom-1px">
                <label class="lab">新密码 :</label>
                <input type="password" placeholder="请输入新密码" v-model="changePasswordQuery.newPwd"/>
            </div>
            <div class="form-control border-bottom-1px">
                <label class="lab">确认新密码 :</label>
                <input type="password" placeholder="请再次输入新密码" v-model="password2"/>
            </div>
            <p class="tips">输入6-15位数字、字母或组合密码</p>
        </div>
        <div class="btn-wrap" v-if="!captchaCodeState">
            <cube-button @click="nextStep">下一步</cube-button>
        </div>
        <div class="btn-wrap" v-if="captchaCodeState">
            <cube-button @click="changePassword">确定</cube-button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import getvCode from '../def/getvCode';
	import util from '../../assets/js/util';
	import {CONFIG, httpUser, httpAnon, api_type} from '../../assets/js/api';
	import JSencrypt from '../../../node_modules/jsencrypt/bin/jsencrypt';
	import {mapMutations} from 'vuex';

	let encrypt = new JSencrypt();
	let RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbwQOJguMK/YjHUofKomXCBrPrLr28GFPTZBXU0FR9ixVzGtZ2l1x+TbP+K3RS6Wcodg5QtKhNwurork4y6W1kCAwEAAQ==';

	export default {
		data() {
			return {
				operationType: this.$route.params.id,
				captchaCode: CONFIG.api.captchaCode,
				captchaCodeState: false,
				changePasswordQuery: {
					pwd: '',
					newPwd: ''
				},
				key: '' || this.$route.query.key,
				verifyCode: '',
				getvCodeQuery: {
					mobile: util.ck.get('_KBMB'),
					operate: 4
				},
				password2: ''
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			nextStep() {
				if (!this.getvCodeQuery.captchaCode) return this.SET_GLOBALSTATE({type: 'error', txt: '图形验证码不能为空'});
				if (!this.verifyCode) return this.SET_GLOBALSTATE({type: 'error', txt: '短信验证码不能为空'});

				let keyQuery = {
					mobile: this.getvCodeQuery.mobile,
					operate: 4,
					verifyCode: this.verifyCode
				};

				httpAnon.get(api_type.sms('check'), keyQuery)
				.then(data => {
					if (data.code === 200) {
						httpAnon.post(api_type.sms('generateKey'), util.queryString(keyQuery))
						.then(data => {
							if (data.code === 200) {
								this.key = data.data.key;
								this.$router.push({query: {'key': data.data}});
								this.captchaCodeState = true;
							} else {
								return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
							}
						});
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));

			},
			changecaptchaCode() {
				this.captchaCode = CONFIG.api.captchaCode + `&r=${~~(Math.random() * 999)}`;
			},
			changePassword() {

				if (!this.changePasswordQuery.pwd) {
					return this.SET_GLOBALSTATE({type: 'error', txt: '请输入原密码'});
				}

				if (!this.password2 || !this.changePasswordQuery.newPwd) {
					return this.SET_GLOBALSTATE({type: 'error', txt: '请输入新密码及确认新密码'});
				}

				if (this.password2 !== this.changePasswordQuery.newPwd) {
					return this.SET_GLOBALSTATE({type: 'error', txt: '两次密码输入不一致，请重新输入'});
				}

				this.SET_GLOBALSTATE({type: 'loading'});

				let query = {
					pwd: this.changePasswordQuery.pwd,
					newPwd: this.changePasswordQuery.newPwd,
					key: this.key
				};


				encrypt.setPublicKey(RSAKey);

				let oldPassword = encrypt.encrypt(query.pwd);
				let encrypted = encrypt.encrypt(query.newPwd);

				query.pwd = window.encodeURIComponent(oldPassword);
				query.newPwd = window.encodeURIComponent(encrypted);

				httpUser.post(api_type.user('editPwd4Logined'), util.queryString(query))
				.then(data => {
					if (data.code === 200) {
						return this.SET_GLOBALSTATE({type: 'correct', txt: data.msg});
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			}
		},
		components: {
			getvCode
		},
		mounted() {
			this.changecaptchaCode();
		},
		computed: {
			title() {
				return !this.captchaCodeState ? '安全验证'
					: this.$route.params.id === 'changePassword'
						? '修改密码' : '忘记密码';
			}
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .passwordOperation-wrap
        background-color: #f9f8f6
        min-height: 100vh
        .form-wrap
            padding 0 20px
            .form-control
                display flex
                line-height 55px
                position relative
                .lab
                    flex 0 0 90px
                    font-size: 14px
                input
                    flex 1
                    padding 18px 0
                    background-color: #f9f8f6
                    outline none
                    font-size: 14px

    .captchaCode-wrap
        padding 0 20px
        .form-control
            position relative
            display flex
            line-height 55px
            .lab
                flex 0 0 80px
                font-size: 14px
                display inline-block
                color #333
                line-height 50px
            input
                flex 1
                padding 18px 50px
                background-color: #f9f8f6
                outline none
                font-size: 14px
            .getvCode
                position absolute
                top 8px
                right 0
                padding 10px 15px
                width 3rem
            .captchaCode
                position absolute
                right 0
                top 3px
                width 3rem
                font-size: 14px
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

    .btn-wrap
        margin 60px auto 0
        width 6rem

    .tips
        font-size: 12px
        padding-top 10px
        color: #aaa

</style>