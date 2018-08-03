<template>
    <div class="candyShop-wrap">
        <header-tit :title="title"></header-tit>
        <ul class="candy-shop-wp">
            <li class="item" v-for="row of rows" @click="gotoInfo(row)">
                <div class="candy-bg">
                    <h3 class="name"><span class="day">{{row.days}}</span><span class="format">天VIP</span></h3>
                </div>
                <a>
                    <p class="product-name">{{row.productName}}</p>
                    <p class="candy-count">{{row.candyCount}}糖果</p>
                    <p class="tip">(限量供应)</p>
                </a>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
	import {httpUser, api_type} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';

	export default {
		name: "",
		data() {
			return {
				title: '糖果商城',
				rows: [],

			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			getListExhcange() {

				this.SET_GLOBALSTATE({state: 'loading'});

				httpUser.get(api_type.product('getList4Exchange'))
				.then(data => {
					if (data.code === 200) {
						this.rows = data.data.resultList;
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			},
			gotoInfo(query) {

				let queryArr = util.JSONround(query);
				this.$router.push({path: '/candyInfo', query: queryArr});
			},
		},
		mounted() {
			this.getListExhcange();
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .candyShop-wrap
        background-color: #f9f8f6
        min-height 100vh

    .candy-shop-wp
        padding 15px 10px
        display flex
        flex-wrap: wrap;
        .item
            text-align center
            flex 0 0 47%
            margin 0 1.5% 3%
            padding 15px 0
            border 1px solid #ddd
            box-sizing border-box
            background-color: #fff
            a
                display block
                width 100%
                font-size: 14px
                .product-name
                    font-size: 12px
                .candy-count
                    margin 8px 0 3px
                    font-size: 16px
                    color: #c8a258
                .tip
                    color: #c8a258
                    font-size: 10px
        .candy-bg
            display block
            margin 0 auto
            width 125px
            height 65px
            -webkit-background-size: 100%
            background-size: 100%
            background-image: url(../../assets/img/candy-bg.png)
            background-repeat: no-repeat
            .name
                line-height 57px
                color: #fff
                text-shadow 0 -3px 8px #ad6515
                .day
                    font-size: 36px
                    margin-right: 2px
                    font-weight: bold
                    vertical-align: middle
                .format
                    font-size: 18px
                    vertical-align: middle
                    font-weight: bold
</style>