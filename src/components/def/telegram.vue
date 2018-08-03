<template>
    <div class="telegram-wrap">
        <header-tit :title="'电报群'" style="background-color: #fff;">
            <span class="cubeic-search" @click="searchModalOpen()"></span>
        </header-tit>
        <img class="banner" src="../../assets/img/telegram-banner.png" @click="$router.push('/telegramSuggest')"/>
        <ul class="type-list">
			
            <li class="item" :class="{active:searchType === type.value}" v-for="(type,index) of types" @click="changeType(type.value)" >
				{{type.text}}
            </li>
        </ul>
        <div class="scroll-list-wrap list-wrap" v-if="rows.length >= 1">
            <scroll ref="scroll"
                    :listWrapBGC="'white'"
                    :scrollbar="scrollbarObj"
                    :pullDownRefresh="pullDownRefreshObj"
                    :pullUpLoad="pullUpLoadObj"
                    :startY="parseInt(startY)"
                    @pullingDown="onPullingDown"
                    @pullingUp="onPullingUp">
                <ul class="list-content">
                    <li class="list-item" v-for="row in rows" @click="gotoTelegram(row)">
                        <p class="left-content">
                            <span class="name white-break">{{row.telegramName}}</span>
                            <span class="url">{{row.telegramUrl}}</span>
                        </p>
                        <span class="icon"></span>
                    </li>
                </ul>
            </scroll>
        </div>
        <p class="not-info" v-if="rows.length <= 0 && loadingState">
            <i class="cubeic-warn"></i>
            <span class="txt">暂无信息</span>
        </p>
        <searchMask v-model="isSearch"></searchMask>
    </div>
</template>

<script type="text/ecmascript-6">
	import Scroll from '../common/scroll/scroll';
	import searchMask from '../common/searchMask';
	import {httpAnon, api_type} from "../../assets/js/api";
	import {mapMutations} from 'vuex';

	export default {
		data() {
			return {
				isSearch: false,
				types: [
					{
						text: '全部',
						value: ''
					},
					{
						text: '币种交流',
						value: '1'
					},
					{
						text: '交易平台',
						value: '2'
					},
					{
						text: '其它',
						value: '3'
					}
				],
				scrollbar: true,
				scrollbarFade: true,
				pullDownRefresh: true,
				pullDownRefreshThreshold: 90,
				pullDownRefreshStop: 40,
				pullUpLoad: true,
				pullUpLoadThreshold: 0,
				startY: 0,
				scrollToX: 0,
				scrollToY: -200,
				scrollToTime: 700,
				scrollToEasing: 'bounce',
				scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],
				itemIndex: 0,
				rows: [],
				searchType: '',
				query: {
					pageIndex: 1,
					pageSize: 20
				},
				rowsLength: '',
				loadingState: false
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			searchModalOpen() {
				this.isSearch = true;
			},
			gotoTelegram(row) {
				window.location.href = row.androidLink;
				// if (util.Browser.isAndroid()) {
				// 	return window.open(row.androidLink);
				// }
				// return window.open()
				// if (util.Browser.isIOS()){
				// 				// return window.open(row.androidLink);
				// }
			},
			changeType(type) {
				this.rows = [];
				this.searchType = type;
				this.query.pageIndex = 1;
				this.SET_GLOBALSTATE({type: 'loading'});
				this.search();
				this.$refs.scroll.scrollTo(0, 0);
			},
			search(type) {

				let query = Object.assign(this.query);

				if (this.searchType) {
					query.telegramType = this.searchType;
				}
				this.loadingState = false;
				this.SET_GLOBALSTATE({type: 'loading'});

				httpAnon.get(api_type.telegramInfo('getList'), query).then(data => {
					if (data.code === 200) {
						this.rowsLength = data.data.resultList.length;

						if (type === 'pulling') {
							this.rows = [...this.rows, ...data.data.resultList];

						} else {
							this.rows = data.data.resultList;
						}

						this.loadingState = true;
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					this.SET_GLOBALSTATE({type: 'done'});
				});


			},
			/**
			 * 上拉加载
			 */
			onPullingDown() {
				// 模拟更新数据
				console.log('pulling down and load data');
				setTimeout(() => {
					if (this._isDestroyed) {
						return;
					}
					this.query.pageIndex = 1;
					this.search();
					// if (Math.random() > 0.5) {
					// 	// 如果有新数据
					// 	this.items.unshift('normalScrollListPage.newDataTxt');
					// } else {
					// 	// 如果没有新数据
					// }
					this.$refs.scroll.forceUpdate();
				}, 500);
			},
			/**
			 * 下拉加载
			 */
			onPullingUp() {
				setTimeout(() => {
					if (this._isDestroyed) {
						return;
					}
					this.query.pageIndex += 1;
					this.search('pulling');
					// if (Math.random() > 0.5) {
					// 	// 如果有新数据
					// 	this.items.unshift('normalScrollListPage.newDataTxt');
					// } else {
					// 	// 如果没有新数据
					// }
					this.$refs.scroll.forceUpdate();
				}, 500);
			},
			rebuildScroll() {
				this.$nextTick(() => {
					this.$refs.scroll.destroy();
					this.$refs.scroll.initScroll();
				});
			},
		},
		mounted() {
			this.search();
		},
		computed: {
			scrollbarObj: function () {
				return this.scrollbar ? {fade: this.scrollbarFade} : false;
			},
			pullDownRefreshObj: function () {
				return this.pullDownRefresh ? {
					threshold: parseInt(this.pullDownRefreshThreshold),
					stop: parseInt(this.pullDownRefreshStop)
				} : false;
			},
			pullUpLoadObj: function () {
				return this.pullUpLoad ? {
					threshold: parseInt(this.pullUpLoadThreshold),
					txt: {more: '下拉加载', noMore: '没有更多数据了'}
				} : false;
			}
		},
		watch: {
			scrollbarObj: {
				handler() {
					this.rebuildScroll();
				},
				deep: true
			},
			pullDownRefreshObj: {
				handler(val) {
					const scroll = this.$refs.scroll.scroll;
					if (val) {
						scroll.openPullDown();
					} else {
						scroll.closePullDown();
					}
				},
				deep: true
			},
			pullUpLoadObj: {
				handler(val) {
					const scroll = this.$refs.scroll.scroll;
					if (val) {
						scroll.openPullUp();
					} else {
						scroll.closePullUp();
					}
				},
				deep: true
			},
			startY() {
				this.rebuildScroll();
			}
		},
		components: {
			Scroll, searchMask
		},
		deactivated() {
			this.$destroy();
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>

    .telegram-wrap
        .banner
            width 100%
            background-color: #f8f8f8
        .type-list
            display flex
            font-size: 0
            .item
                flex 1
                padding 10px 0
                text-align center
                font-size: 12px
                &.active
                    color: #c8a258
        .list-wrap
            height 57vh
            background-color: #f6f6f6
            font-size: 0
            .item
                padding 10px

    .cubeic-search
        position absolute
        top 0
        right 15px
        font-size: 20px

    .list-content
        position: relative
        padding 10px 12px
        z-index: 10
        background: #fff
        .list-item
            display flex
            padding 0 15px
            margin-bottom: 10px
            background-color: #f9f8f6
            border-bottom 0
            font-size: 12px
            border-radius 5px
            align-items center
            box-shadow 0 2px 3px rgba(55, 55, 55, .2)
            .left-content
                margin 16px 0
                flex 1
                span
                    display block
                    line-height 1.2
                    &.name
                        font-size: 14px
                        width 6.5rem
                        margin-bottom: 2px
                    &.url
                        text-decoration underline
                        color: #66a4f9
            .icon
                flex 0 0 40px
                height 40px
                background-color: #aaa
                border-radius 999px
                -webkit-background-size: 100% 100%
                background-size: 100% 100%
                background-image: url(../../assets/img/telegram.png)

    .not-info
        margin-top: 15vh
        text-align center
        i
            font-size: 42px
            color: #aaa
        .txt
            margin-top: 10px
            display block
            text-align center
            font-size: 14px
            color: #aaa

</style>