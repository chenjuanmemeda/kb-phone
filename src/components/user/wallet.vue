<template>
    <div>
        <header-tit :title="'钱包'"></header-tit>
        <div class="wallet-wp">
            <div class="amount-wp">
                <img src="../../assets/img/logo.png" alt="" width="50" height="50">
                <p class="amount-tit">余额（元）</p>
                <p class="amount">￥{{userAmount | divide}}</p>
            </div>
        </div>
        <div class="mid-block"></div>
        <ul class="operation-list">
            <router-link tag="li" :to="'/cashPattern'" class="item border-bottom-1px">
                <span>提现方式</span>
                <i class="arrow cubeic-arrow"></i>
            </router-link>
            <router-link tag="li" :to="'/payPassword'" class="item border-bottom-1px">
                <span>支付密码</span>
                <i class="arrow cubeic-arrow"></i>
            </router-link>
            <router-link tag="li" :to="'/businessLog'" class="item border-bottom-1px">
                <span>交易明细</span>
                <i class="arrow cubeic-arrow"></i>
            </router-link>
        </ul>
        <div class="btn-wrap">
            <cube-button
                    @click=" isExist4PayPwd === 0 ? settingPayPasswordModal = true : $router.push('/withdrawReq')">
                提现
            </cube-button>
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
	import {httpAnon, httpUser, api_type} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';

	export default {
		name: "",
		data() {
			return {
				settingPayPasswordModal: false,
				isExist4PayPwd: this.$store.state.isExist4PayPwd
			};
		},
		methods: {
			...mapMutations(['SET_isExist4PayPwd']),
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
		components: {
			'header-tit': headerTit
		},

		mounted() {
			this.getDetail();
			console.log(this.isExist4PayPwd);
		},
		computed: {
			userAmount() {
				return this.$store.state.userAmount;
			}
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>

    .mid-block
        background-color: #fff
        height 10px

    .wallet-wp
        background-color: #f9f8f6
        padding 20px 0 30px
        .amount-wp
            text-align center
            .amount-tit
                margin 20px 0 5px
                font-size: 14px
            .amount
                font-size: 24px

    .operation-list
        padding 0 20px
        background-color: #f9f8f6
        .item
            display flex
            line-height 50px
            span
                flex 1
                font-size: 14px
            .arrow
                flex 0 0 20px
                font-size: 14px
                color: #999

    .btn-wrap
        margin 60px auto 0
        width 6rem

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
                padding 15px
                .payAmount
                    display block
                    margin-bottom: 10px
                    color: red
                    text-align center
                .payType-wrap
                    display flex
                    .pay-type
                        flex 1
                        font-size: 14px
                        text-align center
                        padding-bottom 20px
                        .icon
                            display block
                            margin 10px auto 5px
                            &.alipay
                                width 32px
                                height 32px
                                background-image: url(../../assets/img/payType/alipay.png)
                            &.wechat
                                width 39px
                                height 33px
                                background-image: url(../../assets/img/payType/wechat.png)
                            &.account
                                width 32px
                                height 33px
                                background-image: url(../../assets/img/payType/account.png)
                    .payPassoword
                        width 100%
                        padding-left 15px
                        line-height 45px
                        font-size: 14px
                        border-radius 4px
                        border 1px solid #eee
            .modal-footer
                text-align center
                .btn
                    display block
                    width 100%
                    height 100%
                    font-size: 14px
                    line-height 45px

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
</style>