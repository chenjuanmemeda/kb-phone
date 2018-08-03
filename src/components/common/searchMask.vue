<template>
    <transition name="fade">
        <div class="search-mask" v-show="visible" @click="close" id="searchMask">
            <div class="search-bar">
                <span v-if="isFocus" class="back" @click="isFocus = false;isSearch = true;key=''"
                      style="font-size: 12px;">取消</span>
                <i v-if="!isFocus" class="back cubeic-back" @click="close" id="back"></i>
                <input type="text" class="search-input" @focus="isFocus = true;isSearch= false;" v-model="key"
                       maxlength="20"
                       placeholder="请输入关键字搜索">
                <span class="search-text" @click="search(key)">搜索</span>
            </div>
            <div class="search-history-wrap" v-if="!isSearch">
                <p class="tit border-bottom-1px">热门搜索</p>
                <!--<div class="items-wrap border-bottom-1px fix" v-if="historyMaps.length >0">-->
                <!--<span v-for="item of historyMaps" class="item" @click="searchHistory(item)">{{item}}</span>-->
                <!--</div>-->
                <div class="items-wrap fix">
                    <span v-for="item of defHistoryMaps" class="item" @click="searchHistory(item)">{{item}}</span>
                </div>
            </div>

            <div class="search-result-wrap" v-if="isSearch">
                <scroll ref="scroll"
                        v-if="rows.length > 0"
                        :startY="parseInt(startY)">
                    <ul class="list-content">
                        <li class="list-item border-bottom-1px" v-for="row in rows"
                            @click="gotoTelegram(row.androidLink)">
                            <p class="left-content">
                                <span class="name white-break">{{row.telegramName}}</span>
                                <span class="url">{{row.telegramUrl}}</span>
                            </p>
                            <span class="icon"></span>
                        </li>
                    </ul>
                </scroll>
                <p class="not-info" v-if="rows.length <= 0">
                    <i class="cubeic-warn"></i>
                    <span class="txt">没有找到 "{{key}}" 的相关信息</span>
                </p>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
	import Scroll from '../common/scroll/scroll';
	import {httpAnon, api_type} from '../../assets/js/api';
	import {mapMutations} from 'vuex';

	export default {
		name: 'searchMask',
		props: {
			value: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				defHistoryMaps: [
					'比特币', 'ETH', 'EOS'
				],
				key: '',
				isFocus: false,
				isSearch: false,
				visible: false,
				query: {
					pageIndex: 1,
					pageSize: 20
				},
				rows: [],
				startY: 0,
				historyMaps: [] || JSON.parse(localStorage.getItem('KB_searchHistory')).reverse(),
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			gotoTelegram(url) {
				window.location.href = url;
				// window.open(url);
			},
			close(e) {
				if (e.target.id === 'searchMask' || e.target.id === 'back') {
					let self = this;
					setTimeout(() => {
						self.isFocus = false;
						self.isSearch = false;
					}, 50);
					this.visible = false;
				}
			},
			search(key) {
				var self = this;

				if (!key) return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入关键字'});

				this.SET_GLOBALSTATE({type: 'loading'});

				let query = Object.assign(this.query, {keyword: key});
				this.isFocus = false;
				httpAnon.get(api_type.telegramInfo('getSearchList'), query)
				.then(data => {
					if (data.code === 200) {
						let KB_searchHistory = [];

						if (localStorage.getItem('KB_searchHistory')) {
							KB_searchHistory = JSON.parse(localStorage.getItem('KB_searchHistory'));

							if (KB_searchHistory.length >= 10) {
								KB_searchHistory.shift();
							}
							KB_searchHistory.push(key);
						} else {
							KB_searchHistory.push(key);

						}

						// localStorage.setItem('KB_searchHistory', JSON.stringify(KB_searchHistory));
						// this.historyMaps = KB_searchHistory.reverse();
						this.rows = data.data.resultList;

					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					return this.SET_GLOBALSTATE({type: 'done'});
				});

				setTimeout(() => {
					self.SET_GLOBALSTATE({type: 'done'});
				}, 1000);
				this.isSearch = true;
			},
			searchHistory(key) {
				this.key = key;
				this.search(key);
			},
			rebuildScroll() {
				this.$nextTick(() => {
					this.$refs.scroll.destroy();
					this.$refs.scroll.initScroll();
				});
			},
		},
		mounted() {
			if (this.value) {
				this.visible = true;
			}
		},
		computed: {
			scrollbarObj: function () {
				return this.scrollbar ? {fade: this.scrollbarFade} : false;
			},
		},
		components: {
			Scroll
		},
		watch: {
			value(val) {
				this.visible = val;
			},
			visible(val) {
				this.$emit('input', val);
			},
			scrollbarObj: {
				handler() {
					this.rebuildScroll();
				},
				deep: true
			},
		},
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .search-mask
        position fixed
        top 0
        left 0
        background-color: #f9f8f6
        width 100vw
        height 100vh
        z-index 99
        .search-bar
            display flex
            background-color: #f9f8f6
            line-height 40px
            align-items center
            .back
                display block
                flex 1
                text-align center
                font-size: 14px
            .search-input
                flex 5
                border-radius 999px
                border: 1px solid #e8e8e8
                line-height 24px
                font-size: 14px
                padding 0 10px
            .search-text
                display block
                flex 1
                text-align center
                font-size: 14px
        .search-history-wrap
            padding 5px 10px 100px 10px
            background-color: #f9f8f6
            .tit
                padding 5px 0 10px
                font-size: 12px
            .items-wrap
                padding 10px 0
                min-height 20px
                font-size: 0
                .item
                    display inline-block
                    background-color: #eee
                    padding 6px 9px
                    margin 3px 5px
                    font-size: 12px
                    border-radius 99px
                    color: #333

        .search-result-wrap
            padding 5px 10px
            margin-top 5px
            height 85vh
            background-color: #f9f8f6
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
            .list-content
                position: relative
                padding 5px 10px
                z-index: 10
                background-color: #f9f8f6
                .list-item
                    display flex
                    padding 12px 15px
                    margin-bottom: 0
                    background-color: #f9f8f6
                    border-bottom 0
                    font-size: 12px
                    border-radius 5px
                    align-items center
                    .left-content
                        flex 1
                        span
                            display block
                            line-height 1.2
                            &.name
                                font-size: 16px
                                width 6.5rem
                                margin-bottom: 6px
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
</style>