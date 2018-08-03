<template>
    <div class="cash-pattern">
        <header-tit :title="'提现方式'"></header-tit>
        <router-link tag="a" :to="'/addBankCard'" class="addBankCard">
            <span>新增提现方式</span>
            <i class="cubeic-arrow"></i>
        </router-link>

        <div class="no-info" v-if="rows.length <= 0">
            <img src="../../assets/img/no-info.png"/>
            <p>暂无数据</p>
        </div>

        <a class="card fix" v-for="row of rows" @click="bankCardOperation({bankCardId:row.bankCardId})">
            <img :src="img[row.payType - 1]" alt="" width="100%"/>
            <p class="bankName">{{row.bankName}}</p>
            <p class="name">{{row.bankCardName}}</p>
            <p class="number">{{row.bankCardNumber}}</p>
        </a>
    </div>
</template>

<script type="text/ecmascript-6">
	import {httpUser, api_type} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';

	let alipayImg = require('../../assets/img/alipay-card.png');
	let bankCardImg = require('../../assets/img/bank-card.png');

	export default {
		data() {
			return {
				rows: [],
				img: [alipayImg, bankCardImg],
				actionSheet: null
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			getBankCardList(type) {
				if (!type) this.SET_GLOBALSTATE({state: 'loading'});

				httpUser.get(api_type.bankCard('getList'))
				.then(data => {
					if (data.code === 200) {
						this.rows = data.data.resultList;
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					if (!type) this.SET_GLOBALSTATE({type: 'done'});
				});
			},
			bankCardOperation(query) {
				let removeBankCardQuery = query;

				this.actionSheet = this.$createActionSheet({
					title: '操作',
					data: [
						{content: '删除'}
					],
					onSelect: (item, index) => {
						if (index === 0) {
							this.removeBankCard(removeBankCardQuery);
						}
					}
				});

				this.actionSheet.show();
			},
			removeBankCard(query) {
				this.SET_GLOBALSTATE({type: 'loading'});
				httpUser.post(api_type.bankCard('delete'), util.queryString(query))
				.then(data => {
					if (data.code === 200) {
						this.actionSheet.hide();
						this.getBankCardList('delete');
						return this.SET_GLOBALSTATE({type: 'correct', txt: data.msg});
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}

				});

			}
		},
		mounted() {
			this.getBankCardList();
		},
		deactivated() {
			this.$destroy();
		}

	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .cash-pattern
        .no-info
            display block
            margin 30px auto 0
            text-align center
            img
                width 6rem
            p
                margin-top 20px
                font-size: 14px
        .addBankCard
            position relative
            display block
            padding 20px 30px
            font-size: 14px
            background-color: #f9f8f6
            .cubeic-arrow
                position absolute
                top 20px
                right 30px
        .card
            display block
            position relative
            margin 15px auto 15px
            width 9rem
            min-height 150px
            -webkit-background-size: 100% 100%
            background-size: 100% 100%
            font-size: 14px
            color: #fff
            img
                position absolute
                top: 0
                left: 0
                z-index -1
            .bankName
                margin 0 20px
                line-height 50px
                text-align: right
            .name
                margin 0 20px 10px
                font-size: 16px
                font-size: 16px
            .number
                margin 0 20px
                font-size: 14px


</style>