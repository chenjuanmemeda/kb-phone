<template>
    <div ref="viewport" class="navigator-component">
        <scroll ref="scroll" direction="horizontal">
            <ul class="tab-list" ref="tabList">
                <li v-for="item in navList" class="tab-item" @click="selectNav(item)">
                    <!--<slot name="item" :text="item.candyName" :index="item.id">-->
                    <a class="tab-name">
                        <p class="img-wrap" :style="{backgroundColor:getColor(item.logoImageUrl)}">
                            <img :src="item.logoImageUrl" alt="">
                        </p>
                        <p class="wrap">
                            <span class="candyName white-break">{{item.candyName}}</span>
                            <span class="description">{{item.description}}</span>
                        </p>
                    </a>
                    <!--</slot>-->
                </li>
            </ul>
        </scroll>

    </div>
</template>

<script type="text/ecmascript-6">
	import Scroll from './scroll';

	const EVENT_CHANGE = 'change';

	export default {
		props: {
			navList: {
				type: Array,
				default() {
					return [{
						id: 1,
						name: 'default'
					}];
				}
			},
			currentTabIndex: {
				type: Number,
				default: null
			}
		},
		data() {
			return {
				currentTab: 4,
				current: 1
			};
		},
		mounted() {
			this._initTabListWidth();
			this.$emit(EVENT_CHANGE);
			if (this.currentTabIndex === null) {
				this.current = this.currentTab;
			} else {
				this.current = this.currentTabIndex;
			}
			setTimeout(() => {
				this._adjust(this.current);
			}, 500);
		},
		methods: {

			getColor(color) {
				if (!color) return;
				return color.substring(color.indexOf('#'), color.length);
			},
			isCurrentTab(index) {
				return index === this.current;
			},
			selectNav(item) {
				// this.current = item.id;
				// this._adjust(item.id);
				this.$emit(EVENT_CHANGE, item);
				window.location.href = item.registUrl;
			},
			_initTabListWidth() {
				const tabList = this.$refs.tabList;
				const items = tabList.children;

				let width = 0;

				for (let i = 0; i < items.length; i++) {
					width += items[i].clientWidth;
				}

				tabList.style.width = (width + 56) + 'px';
			},
			_adjust(tabId) {
				const viewportWidth = this.$refs.viewport.clientWidth;
				const tabListWidth = this.$refs.tabList.clientWidth;
				const minTranslate = Math.min(0, viewportWidth - tabListWidth);
				const middleTranslate = viewportWidth / 2;
				const items = this.$refs.tabList.children;
				let width = 0;
				this.navList.every((item, index) => {
					if (item.id === tabId) {
						return false;
					}
					width += items[index].clientWidth;
					return true;
				});
				let translate = middleTranslate - width;
				translate = Math.max(minTranslate, Math.min(0, translate));
				this.$refs.scroll.scrollTo(translate, 0, 300);
			}
		},
		components: {
			Scroll
		}
	};
</script>

<style lang='stylus' rel='stylesheet/stylus' type="text/stylus">
    .navigator-component
        position relative
        margin-bottom 20px
        .list-wrapper
            background: none
            .scroll-content
                //用于横向滚动
                display: inline-block
            .tab-list
                margin: 0 auto
                padding 0 10px
                .tab-item
                    display: inline-block
                    line-height: 54px;
                    margin 0 5px
                    border-radius 8px
                    overflow hidden
                    vertical-align: top
                    .tab-name
                        display: block
                        position: relative
                        padding: 0
                        font-size: 14px
                        color: #666
                        overflow hidden
                        width 2.8rem
                        vertical-align: top
                        .img-wrap
                            img
                                display block
                                margin 0 auto
                                height 80px
                        .wrap
                            padding 5px 10px
                            background-color: #f9f8f6
                            .candyName
                                display block
                                text-align center
                                line-height 1.3
                                margin-bottom: 5px
                                font-size: 12px
                                overflow hidden
                                width 100%
                            .description
                                display block
                                width 100%
                                line-height: 1.3
                                font-size: 10px
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;

    .control-touch
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background-color: rgba(0, 0, 0, .5)
        z-index 999

</style>
