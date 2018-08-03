<template>
    <div class="vip">
        <header-tit :title="'VIP会员'"></header-tit>
        <div class="content">
            <h1>开通VIP会员</h1>
            <ul>
                <li class="item" v-for="(item,index) in items" :class="{'active':isActive === item.rechargeTemplateId}"
                    @click="selectItem(item)">
                    <p>{{item.timeCount}}天</p>
                    <div class="money">
                        ￥{{item.amount | divide}}
                        <span class="icon-ok">
                            <i class="cubeic-ok"></i>
                        </span>
                    </div>
                </li>
            </ul>
            <cube-button class="open-btn kongxin" @click="choicePayType">立即开通</cube-button>
            <div class="free-vip">
                <h1 style="padding-bottom: 0">免费兑换VIP时长</h1>
                <div class="vip-img"></div>
                <cube-button class="open-btn exchange" @click="$router.push('/candyShop')">兑换VIP时长</cube-button>
            </div>
            <div class="privileges">
                <h1 style="padding: 0">VIP特权</h1>
                <ul>
                    <li v-for="(i,index) in privileges">
                        <div class="priv-icon" :class="i.cls"></div>
                        <p class="priv-tit">{{i.tit}}</p>
                        <p class="tit-small">{{i.subTit}}</p>
                    </li>
                </ul>
            </div>
        </div>

        <div class="kb-modal" v-if="payPasswordModalShow">
            <div class="modal-wrap">
                <div class="modal-header border-bottom-1px">
                    <h6 class="tit">输入支付密码</h6>
                    <i class="cubeic-close close-btn" @click="payPasswordModalShow = false"></i>
                </div>
                <div class="modal-body border-bottom-1px">
                    <p class="payAmount">￥{{payAmount | divide}}</p>
                    <div class="payType-wrap" style="margin: 0 10px">
                        <input class="payPassoword" v-model="payPassword" type="password" placeholder="请输入支付密码"/>
                    </div>
                    <router-link  :to="'/payPassword'"><p class="forget">忘记密码</p></router-link>
                </div>
                <div class="modal-footer">
                    <a class="btn" @click="accountPay">确认</a>
                </div>
            </div>
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

        <div class="kb-modal" v-if="modalShow">
            <div class="modal-wrap">
                <div class="modal-header border-bottom-1px">
                    <h6 class="tit">请选择支付方式</h6>
                    <i class="cubeic-close close-btn" @click="modalShow = false"></i>
                </div>
                <div class="modal-body">
                    <div class="payType-wrap">
                        <a v-for="item of payTypeList" class="pay-type" @click="pay(item)">
                            <span class="icon" :class="item.clsName"></span>
                            <span>{{item.payTypeName}}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <successPage v-model="isSuccess">
            <p>支付成功</p>
        </successPage>
    </div>
</template>

<script type="text/ecmascript-6">
	import {httpAnon, httpUser, api_type} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';
	import JSencrypt from '../../../node_modules/jsencrypt/bin/jsencrypt';
	import successPage from '../common/successPage';

	let encrypt = new JSencrypt();

	export default {
		name: 'vip',
		data() {
			return {
				items: [],
				isActive: '',
				privileges: [
					{tit: '绿色上网', subTit: '跨境资产交易更方便', cls: 'index-0'},
					{tit: '资源丰富', subTit: '支持大部分主流交易所', cls: 'index-1'},
					{tit: '快速便捷', subTit: '简介首页快速导航', cls: 'index-2'},
					{tit: '更多', subTit: '敬请期待', cls: 'index-3'}
				],
				payTypeList: [],
				modalShow: false,
				payPasswordModalShow: false,
				payPassword: '',
				isSuccess: false,
				payAmount: 0,
				settingPayPasswordModal: false,
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),

			getRechargeTemplate() {
				this.SET_GLOBALSTATE({type: 'loading'});

				httpUser.get(api_type.rechargeTemplate('list'))
				.then(data => {
					if (data.code === 200) {
						this.items = data.data;
						this.isActive = data.data[0].rechargeTemplateId;
						this.payAmount = data.data[0].amount;
					}
					this.SET_GLOBALSTATE({type: 'done'});
				});
			},
			selectItem(value) {
				this.payAmount = value.amount;
				this.isActive = value.rechargeTemplateId;


			},
			getPayTypeList() {
				httpUser.get(api_type.payType('list'), {clientType: 4})
				.then(data => {

					if (data.code === 200) {
						let rows = data.data.slice();
						rows.forEach((item) => {
							if (item.payTypeName === '支付宝') {
								item.payType = 1;
								item.clsName = 'alipay';
							}
							if (item.payTypeName === '微信') {
								item.payType = 2;
								item.clsName = 'wechat';
							}
						});

						rows.push({
							payType: 0,
							payTypeName: '余额',
							clsName: 'account'
						});
						this.payTypeList = rows;
					}
				});
			},
			pay(item) {


				let payQuery = {
					rechargeType: '0',
				};

				if (item.payType !== 0) {
					this.SET_GLOBALSTATE({type: 'loading'});

					// 支付宝，微信支付
					payQuery.rechargeTemplateId = this.isActive;
					payQuery.payTypeId = item.payTypeId;
					httpUser.post(api_type.recharge('add'), util.queryString(payQuery))
					.then(data => {
						if (data.code === 200) {
							var res = data.data.signData;
							var amount = util.divide(res.money);
							let url = `${res.formAction}?pid=${res.pid}&money=${amount}&lb=${res.lb}&data=${res.data}&m=${res.m}&url=${res.url}`;
							window.location.href = url;
						} else {
							return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
						}
						return this.SET_GLOBALSTATE({type: 'done'});
					});
				} else {

					httpUser.get(api_type.user('getDetail'))
					.then(data => {
						if (data.code === 200) {
							this.modalShow = false;
							if (data.data.isExist4PayPwd === 0) {
								this.settingPayPasswordModal = true;
							} else {
								this.payPasswordModalShow = true;
							}
						}
					});

				}
			},
			accountPay() {

				if (this.payPassword.length < 6) {
					return this.SET_GLOBALSTATE({type: 'error', txt: '请输入正确的支付密码'});
				}

				let accountQuery = {
					payTypeId: '0',
					rechargeType: '0',
					rechargeTemplateId: this.isActive
				};
				let RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbwQOJguMK/YjHUofKomXCBrPrLr28GFPTZBXU0FR9ixVzGtZ2l1x+TbP+K3RS6Wcodg5QtKhNwurork4y6W1kCAwEAAQ==';

				encrypt.setPublicKey(RSAKey);
				let encrypted = encrypt.encrypt(this.payPassword /*支付密码*/);
				accountQuery.payPassword = window.encodeURIComponent(encrypted);

				this.SET_GLOBALSTATE({type: 'loading'});
				httpUser.post(api_type.recharge('addByAmount'), util.queryString(accountQuery))
				.then(data => {
					if (data.code === 200) {

						this.payPasswordModalShow = false;

						return this.SET_GLOBALSTATE({type: 'correct', txt: data.msg});
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					return this.SET_GLOBALSTATE({type: 'done'});
				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			},
			choicePayType() {
				this.modalShow = true;
			}
		},
		mounted() {
			this.getRechargeTemplate();
			this.getPayTypeList();
		},
		components: {
			successPage
		},

	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .vip
        min-height 100vh
        background-color #f9f8f6
        .content
            padding 0 20px 15px
            text-align center
            h1
                color #333
                font-size 10px
                text-align center
                padding 10px 0
            ul
                display flex
                padding-bottom 20px
                min-height 50px
                .item
                    flex 1
                    margin-right: 10px
                    border 1px solid #999
                    border-radius 5px
                    overflow hidden
                    &:last-child
                        margin-right: 0
                    &.active
                        border 1px solid #c8a258
                        p
                            background-color #c8a258
                            color #fff
                        .money
                            color #c8a258
                            .icon-ok
                                display block
                    p
                        color #999
                        font-size 10px
                        text-align center
                        padding 8px 0 5px
                        background-color #e3e3e2
                    .money
                        font-size 14px
                        color #999
                        line-height 1.5
                        text-align center
                        padding 12px 0 10px
                        position relative
                        font-size: 12px
                        .icon-ok
                            display none
                            position absolute
                            bottom 0
                            right 0
                            border 10px solid #c8a258
                            border-top 10px solid transparent
                            border-left 10px solid transparent
                            i
                                position absolute
                                right -11px
                                bottom: -15px
                                font-size: 14px
                                color: #fff
            .open-btn
                width 6rem
                margin 0 auto
                &.kongxin
                    padding 10px 16px
                    width 5rem
                    background-color #fff
                    color: #c8a258
                    border:1px solid #c8a258
                &.exchange
                    margin-bottom 12.5px
            .free-vip
                border 1px solid #eee
                margin-top 25px
                padding 5px 0
                .vip-img
                    width 205px
                    height 114px
                    margin 24px auto
                    -webkit-background-size: 100% 100%
                    background-size: 100% 100%
                    background-image: url(../../assets/img/vip/vip-card.png)
            .privileges
                margin-top 26.5px
                ul
                    display flex
                    padding-top 20.5px
                    font-size 0
                    li
                        flex 1
                        width 24%
                        min-height 55px
                        display inline-block
                        margin 0
                        font-size: 14px
                        text-align center
                        .priv-icon
                            width 50px
                            height 50px
                            border-radius 50px
                            margin 0 auto
                            -webkit-background-size: 100% 100%
                            background-size: 100% 100%
                            &.index-0
                                background-image: url(../../assets/img/vip/priv-1.png)
                            &.index-1
                                background-image: url(../../assets/img/vip/priv-2.png)
                            &.index-2
                                background-image: url(../../assets/img/vip/priv-3.png)
                            &.index-3
                                background-image: url(../../assets/img/vip/priv-4.png)
                        .priv-tit
                            margin 5px 0 8px
                            font-size: 14px
                        .tit-small
                            font-size: 8px
                            line-height 14px

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
                .forget
                    color red
                    font-size 14px
                    text-align right 
                    margin 10px 10px 0 
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