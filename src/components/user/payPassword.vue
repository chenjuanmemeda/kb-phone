<template>
    <div class="payPassword-wrap">
        <header-tit :title="title"></header-tit>
        <div class="isSafe-wrap" v-if="!isSafe">
            <div class="form-control">
                <i class="icon mobile"></i>
                <input type="text" placeholder="请输入手机号码" v-model="mobile" maxlength="11">
            </div>
            <div class="form-control">
                <i class="icon captcha"></i>
                <input type="text" placeholder="请输入图形验证码" v-model="captchaCodeValue" maxlength="4"/>
                <img :src="captchaCode" alt="" @click="changecaptchaCode" class="captchaCode">
            </div>
            <div class="form-control">
                <i class="icon vcode"></i>
                <input type="text" placeholder="请输入短信验证码" v-model="verifyCode" maxlength="6"/>
                <getvCode :query="getvCodeQuery()" class="getvCode"/>
            </div>
            <div class="btn-wrap">
                <cube-button class="then" @click="nextStep">下一步</cube-button>
            </div>
        </div>

        <div class="isSafe-wrap" v-if="isSafe">
            <div class="form-control">
                <label class="lab">支付密码 :</label>
                <input type="password" style="padding-left:5px" v-model="query.newPwd" placeholder="请输入新密码"/>
            </div>
            <div class="form-control ">
                <label class="lab">确认支付密码 :</label>
                <input type="password"  style="padding-left:5px"  placeholder="请再次输入新密码" v-model="query.rePwd"/>
            </div>
            <p class="tips">输入6-15位数字、字母或组合密码</p>
            <div class="btn-wrap">
                <cube-button class="then" @click="setPayPassword">确定</cube-button>
            </div>
        </div>
        <successPage v-model="isSuccess">
            <p>设置成功</p>
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
	import successPage from '../common/successPage';

	let encrypt = new JSencrypt();

	export default {
		data() {
			return {
				mobile: util.ck.get('_KBMB') || '',
				captchaCode: CONFIG.api.captchaCode,
				isSafe: false,
				captchaCodeValue: '',
				verifyCode: '',
				key: '',
				isSuccess: false,
				query: {
					newPwd: '',
					rePwd: '',
				},

			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			changecaptchaCode() {
				this.captchaCode = CONFIG.api.captchaCode + `&r=${~~(Math.random() * 999)}`;
			},
			nextStep() {
				let generateKeyQuery = {
					mobile: this.mobile,
					operate: 5,
					verifyCode: this.verifyCode
				};
				this.SET_GLOBALSTATE({state: 'loading'});
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
			},
			setPayPassword() {
				if (this.query.newPwd !== this.query.rePwd) {
					return this.SET_GLOBALSTATE({type: 'warn', txt: '两次输入的密码不一致！'});
				}
				let setPayPasswordQuery = {
					key: this.key
				};
				let RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbwQOJguMK/YjHUofKomXCBrPrLr28GFPTZBXU0FR9ixVzGtZ2l1x+TbP+K3RS6Wcodg5QtKhNwurork4y6W1kCAwEAAQ==';
				encrypt.setPublicKey(RSAKey);
				var encrypted = encrypt.encrypt(this.query.newPwd);
				setPayPasswordQuery.newPayPwd = window.encodeURIComponent(encrypted);

				httpUser.post(api_type.user('editPayPwd'), util.queryString(setPayPasswordQuery))
				.then(data => {
					if (data.code === 200) {
						// this.isSuccess = true;
						setTimeout(() => {
							this.$router.back();
						}, 1000);
						return this.SET_GLOBALSTATE({type: 'correct', txt: '修改成功'});
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					this.SET_GLOBALSTATE({type: 'done'});
				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
				;
			},
			getvCodeQuery() {
				let getvCode = {
					mobile: this.mobile,
					operate: 5,
					captchaCode: this.captchaCodeValue
				};

				return getvCode;
			}
		},
		computed: {
			title() {
				return !this.isSafe ? '安全验证' : '修改支付密码';
			}
		},
		components: {
			headerTit, getvCode, successPage
		},
		mounted() {

			this.changecaptchaCode();
		},
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .isSafe-wrap
        padding 0 20px

    .payPassword-wrap
        background-color #f9f8f6
        min-height 100vh

    .form-control
        position relative
        margin 0 auto
        border-bottom 1px solid #eee
        .lab
            display inline-block
            font-size 12px
            color #333
            line-height 50px
        input
            padding 18px 10px 18px 50px
            background-color: #f9f8f6
            outline none
            border 0
            font-size: 14px
            vertical-align: top
        .getvCode
            position absolute
            top 8px
            right 0
            padding 10px 15px
            width 3rem
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
		.captchaCode
			position absolute
			right 0
			top 3px
			width 3rem
			font-size: 14px
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

    .tips
        padding 10px 0px
        font-size: 12px
        color: #aaa

    

</style>