<template>
    <div>
        <header-tit :title="'兑换详情'"></header-tit>
        <div class="candy-info-wp">
            <div class="candy-bg">
                <h1 class="name">
                    <span class="day">{{query.days}}</span>
                    <span class="format">天VIP</span>
                </h1>
            </div>
            <p class="product-name">{{query.productName}}</p>
            <p class="candy-count">{{query.candyCount}}糖果</p>
            <p class="tip">(限量供应)</p>
            <div class="candy-tips">
                <h6>礼品说明：</h6>
                <p>{{query.productDescription}}</p>
            </div>
            <div class="btn-wp">
                <cube-button @click="exchange(query.productId)" :class="{'disabled': candyCount <= 0}">{{btnText}}
                </cube-button>
            </div>
        </div>

        <successPage v-model="isSuccess">
            <p>兑换成功</p>
        </successPage>
    </div>
</template>

<script type="text/ecmascript-6">
	import headerTit from '../header/header';
	import successPage from '../common/successPage';
	import {httpUser, api_type} from "../../assets/js/api";
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';

	export default {
		name: "",
		data() {
			return {
				isSuccess: false,
				query: {},
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			exchange(pid) {
				if (this.candyCount < this.query.candyCount) return this.$router.push('/invite');

				this.SET_GLOBALSTATE({state: 'loading'});

				httpUser.post(api_type.product('exchange'), util.queryString({productId: pid}))
				.then(data => {
					if (data.code === 200) {
						this.isSuccess = true;
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					this.SET_GLOBALSTATE({type: 'done'});
				});
			}
		},
		mounted() {
			this.query = this.$route.query;
		},
		computed: {
			candyCount() {
				return this.$store.state.candyCount;
			},
			btnText() {
				return (this.candyCount < this.query.candyCount) ? '糖果不足，邀请好友赚糖果' : '立即兑换';
			}

		},
		components: {
			'header-tit': headerTit, successPage
		},
		deactivated() {
			this.$destroy();
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .candy-info-wp
        padding 24px 20px
        font-size: 14px
        background-color: #f9f8f6
        .candy-tips
            margin 20px 0
            padding 12px
            border: 1px solid #ddd
            -webkit-border-radius: 4px
            -moz-border-radius: 4px
            border-radius: 4px
            h6
                color: #edc95a
                margin-bottom: 6px
            p
                color: #999
                font-size: 12px
        .candy-bg
            margin 0 auto 10px
            width 240px
            height 117px
            -webkit-background-size: 100%
            background-size: 100%
            background-image: url(../../assets/img/candy-bg.png)
            background-repeat: no-repeat
            .name
                line-height 115px
                color: #fff
                text-shadow 0 -3px 8px #ad6515
                text-align center
                .day
                    font-size: 80px
                    margin-right: 2px
                    font-weight: bold
                    vertical-align: middle
                .format
                    font-size: 30px
                    vertical-align: middle
                    font-weight: bold
        .product-name
            text-align center
            font-size: 14px
        .candy-count
            text-align center
            margin 20px 0 5px
            font-size: 20px
            color: #c8a258
        .tip
            text-align center
            color: #c8a258
            font-size: 10px

    .btn-wp
        margin 0 auto
        width 6rem
        button.disabled
            background-color: #ccc


</style>