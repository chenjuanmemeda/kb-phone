<template>
    <div class="with-draw">
        <header-tit :title="'提现'"></header-tit>
        <div class="midblock" style="height: 6px;background-color: #fff;width: 100%"></div>
        <router-link v-if="rows.length <= 0" tag="a" :to="'/addBankCard'" class="addBankCard">暂无提现方式，点击前往添加 <i
                class="cubeic-arrow"></i></router-link>
        <div class="select-wrap" v-if="rows.length > 0">
            <cube-select
                    v-model="defBankCard"
                    :title="'请选择提现方式'"
                    :options="rows">
            </cube-select>
            <div class="midblock" style="height: 3px;background-color: #fff;width: 100%"></div>
            <i class="cubeic-arrow"></i>
        </div>
        <div class="midblock" style="height: 6px;background-color: #fff;width: 100%"></div>
        <div class="withdraw-form-wrap">
            <div class="form-control">
                <span>提现金额（元）：</span>
                <input type="text" v-model="query.amount" style="width: 4.5rem"/>
            </div>
            <div class="form-control">
                <span>支付密码：</span>
                <input type="password" autocomplete="new-password" v-model="query.pwd" maxlength="15"/>
            </div>
        </div>
        <div class="btn-wrap">
            <cube-button @click="withdrawReq">立即提现</cube-button>
        </div>

        <div class="kb-modal" v-if="settingPayPasswordModal">
            <div class="modal-wrap">
                <div class="modal-header border-bottom-1px">
                    <h6 class="tit">&nbsp;</h6>
                    <i class="cubeic-close close-btn" @click="settingPayPasswordModal = false"></i>
                </div>
                <div class="modal-body">
                    <p class="payPassword-tips"><i class="cubeic-warn"></i><span>为了您的账户安全，请先设置支付密码！</span></p>
                </div>
                <div class="modal-footer border-top-1px" style="display: flex">
                    <a class="btn border-right-1px" @click="settingPayPasswordModal = false" style="flex: 1">取消</a>
                    <a class="btn" @click="$router.push('/payPassword')" style="flex: 1">确认</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import headerTit from '../../components/header/header';
	import {httpAnon, httpUser, api_type, CONFIG} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import JSencrypt from '../../../node_modules/jsencrypt/bin/jsencrypt';
	import {mapMutations} from 'vuex';

	let encrypt = new JSencrypt();
	export default {
		name: "withdrawReq",
		data() {
			return {
				settingPayPasswordModal: false,
				defBankCard: '',
				query: {
					amount: '',
				},
				rows: [],
				isExist4PayPwd: this.$store.state.isExist4PayPwd
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE', 'SET_isExist4PayPwd']),

			getBankCardList() {
				this.SET_GLOBALSTATE({type: 'loading'});

				httpUser.get(api_type.bankCard('getList'), '')
				.then(data => {
					if (data.code === 200) {
						let result = data.data.resultList;
						if (result.length > 0) {
							this.defBankCard = result[0].bankCardId;

							result.forEach((item) => {
								this.rows.push({
									text: `${item.bankName}:  ${item.bankCardName}  ${item.bankCardNumber}`,
									value: item.bankCardId
								});
							});

						}
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					this.SET_GLOBALSTATE({type: 'done'});
				});
			},
			withdrawReq() {
				if (this.isExist4PayPwd === 0) return this.settingPayPasswordModal = true;

				if (this.rows.length <= 0) return this.SET_GLOBALSTATE({type: 'error', txt: '暂无提现方式，请先添加！'});

				if (!this.query.amount) return this.SET_GLOBALSTATE({type: 'error', txt: '请输入提现金额！'});

				if (!this.query.pwd || this.query.pwd.length < 6 || this.query.pwd.length > 15) return this.SET_GLOBALSTATE({
					type: 'error',
					txt: '请输入6-15位的支付密码！'
				});

				let RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbwQOJguMK/YjHUofKomXCBrPrLr28GFPTZBXU0FR9ixVzGtZ2l1x+TbP+K3RS6Wcodg5QtKhNwurork4y6W1kCAwEAAQ==';
				encrypt.setPublicKey(RSAKey);
				let encrypted = encrypt.encrypt(this.query.pwd);

				let query = {
					bankCardId: this.defBankCard,
					amount: util.mul(this.query.amount)
				};
				query.payPassword = window.encodeURIComponent(encrypted);

                this.SET_GLOBALSTATE({type: 'loading'});
				httpUser.post(api_type.withdraw('add'), util.queryString(query))
				.then(data => {
					if (data.code === 200) {
						setTimeout(function () {
							this.$router.push('/wallet');
						}, 1000);
						this.SET_GLOBALSTATE({type: 'correct', txt: '提现成功'});
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					this.SET_GLOBALSTATE({type: 'done'});
				});
			},
			getDetail() {
				httpUser.get(api_type.user('getDetail'))
				.then(data => {
					if (data.code === 200) {
						this.isExist4PayPwd = data.data.isExist4PayPwd;
						this.SET_isExist4PayPwd(data.data.isExist4PayPwd);
					}
				});
			}
		},
		mounted() {
			this.getBankCardList();
			this.getDetail();
		},
		components: {
			'header-tit': headerTit
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .with-draw
        min-height 100vh
        .select-wrap
            position relative
            .cube-select
                background-color: #f9f8f6
                padding 20px 30px
                &:after
                    display none
            .cubeic-arrow
                position absolute
                top 21px
                right 25px
                font-size: 18px
                color: #aaa
        .withdraw-form-wrap
            background-color #f9f8f6
            .form-control
                position relative
                width 8.5rem
                margin 0 auto 8px
                span
                    display inline-block
                    font-size 14px
                    color #333
                input
                    padding 18px 10px 18px 5px
                    background-color: #f9f8f6
                    outline none
                    border 0
                    font-size: 14px
        .btn-wrap
            margin 60px auto 0
            width 6rem

    .addBankCard
        display block
        font-size: 14px
        padding 20px 30px
        background-color: #f9f8f6
        .cubeic-arrow
            float: right

    .cube-select-icon
        display none !important

    .cube-select_active
        .cube-select-icon
            display none !important

    .kb-modal
        position fixed
        top 0
        left 0
        width 100vw
        height 100vh
        background-color: rgba(0, 0, 0, .5)
        .modal-wrap
            position absolute
            left 50%
            top 50%
            transform translate(-50%, -50%)
            width 9rem
            max-width 100%
            border-radius 5px
            background-color: #fff
            .modal-header
                display flex
                padding 10px
                .tit
                    flex 1
                    font-size: 14px
                    color: #999
                .close-btn
                    flex 0 0 15px
                    font-size: 14px
                    color: #999
            .modal-body
                padding 15px 5px
                .payPassword-tips
                    margin 5px 0 5px
                    font-size: 14px
                    text-align center
                    vertical-align: middle
                    i
                        font-size: 18px
                        margin-right: 5px
                        color: #ee0000
                        vertical-align: middle
                    span
                        vertical-align: middle

            .modal-footer
                text-align center
                .btn
                    display block
                    width 100%
                    height 100%
                    font-size: 14px
                    line-height 45px
</style>