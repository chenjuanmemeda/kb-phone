<template>
    <div class="addBankCard-wrap">
        <header-tit :title="'新增提现方式'"></header-tit>
        <div class="type-wrap">
            <a class="item" :class="{'active':query.payType === 1}" @click="withdrawTypeChoice(1)">支付宝</a>
            <a class="item" :class="{'active':query.payType === 2}" @click="withdrawTypeChoice(2)">银行卡</a>
        </div>
        <p class="blank-block"></p>
        <div class="form-control border-bottom-1px">
            <label class="lab">收款账号</label>
            <input type="text" :placeholder="query.payType === 1 ? '请输入支付宝手机账号' : '请输入收款账号' "
                   v-model="query.bankCardNumber" :maxlength="maxLength"/>
        </div>
        <div class="form-control">
            <label class="lab">收款人姓名</label>
            <input type="text" placeholder="请输入收款人名称" v-model="query.bankCardName"/>
        </div>
        <div class="form-control border-top-1px" v-if="query.payType === 2 ">
            <label class="lab">开户行名称</label>
            <input type="text" placeholder="请输入开户行名称" v-model="bankName"/>
        </div>
        <div class="btn-wrap">
            <cube-button @click="save">保存</cube-button>
        </div>
        <successPage v-model="isSuccess">
            <p>添加成功</p>
        </successPage>
    </div>
</template>

<script type="text/ecmascript-6">
	import {httpUser, api_type} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';
	import successPage from '../common/successPage';

	export default {
		data() {
			return {
				maxLength: 11,
				isSuccess: false,
				query: {
					payType: 1,
					bankName: ''
				},
				bankName: ''
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			withdrawTypeChoice(type) {
				this.query.payType = type;
				this.maxLength = type == 1 ? 11 : 19;
				this.query.bankCardNumber = '';
				this.query.bankCardName = '';
			},
			save() {
				this.SET_GLOBALSTATE({state: 'loading'});

				if (this.query.payType === 1) {
					this.query.bankName = '支付宝';
					if (!util.regExp.isMobile(this.query.bankCardNumber)) {
						return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入正确格式的支付宝手机账号！'});
					}
				}
				if (this.query.payType === 2) {
					this.query.bankName = this.bankName;
					if (!util.regExp.isAccount(this.query.bankCardNumber)) {
						console.log(this.query.bankCardNumber.length);
						return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入正确格式的银行账号！'});
					}
				}

				httpUser.post(api_type.bankCard('add'), util.queryString(this.query))
				.then(data => {
					if (data.code === 200) {

						setTimeout(() => {
							this.$router.push('/cashPattern');
						}, 1000);

						return this.SET_GLOBALSTATE({type: 'correct', txt: '保存成功！'});

					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					this.SET_GLOBALSTATE({type: 'done'});
				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			}
		},
		components: {
			successPage
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .blank-block
        height 10px
        background-color: #fff

    .addBankCard-wrap
        background-color: #f9f8f6
        min-height 100vh
        .type-wrap
            display flex
            padding 0 2rem
            text-align center
            .item
                position relative
                flex 1
                padding 15px 20px
                font-size: 14px
                &.active
                    color: #e2bf59
                    &:after
                        position absolute
                        bottom 0
                        left 50%
                        transform translateX(-50%)
                        content ' '
                        width 0.8rem
                        height 2px
                        background-color: #e2bf59
        .form-control
            display flex
            font-size: 14px
            margin 0 20px
            .lab
                padding 18px 0
                flex 0 0 80px
            input
                padding 18px 0
                flex 1
                background-color: #f9f8f6
                outline none

        .btn-wrap
            width 6rem
            margin 30px auto 0


</style>