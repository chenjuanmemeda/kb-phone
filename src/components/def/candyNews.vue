<template>
    <div class="candyNews-wrap">
        <p class="back" @click="$router.back()">
            <i class="cubeic-back"></i>
        </p>
        <router-link tag="a" :to="suggestPath" class="banner">
            <img src="../../assets/img/other-banner.png" alt="" width="100%" style="min-height: 140px">
        </router-link>
        <div class="info-wrap">
            <ul class="select-item">
                <li v-for="item of searchTypeArr" @click="choice(item.type)"
                    :class="{'active': searchType === item.type}">
                    {{item.txt}}
                </li>
            </ul>
            <ul class="items-wrap">
                <li class="item border-bottom-1px" v-for="row of rows">
                    <div class="img-wrap">
                        <img :src="row.logoImageUrl" alt="" class="img" width="100%">
                    </div>
                    <div class="info">
                        <div class="head">
                            <h6 class="tit">{{row.candyName}}</h6>
                            <a class="btn" :href="row.registUrl" target="_blank">前往领取</a>
                        </div>
                        <div class="body">
                            <p class="main-info">{{row.summary}}</p>
                            <p class="tips">{{row.description}}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!--<router-link tag="a" :to="'/sign'" class="float-sign" v-if="!$store.state.tk"></router-link>-->
    </div>
</template>

<script type="text/ecmascript-6">
	import {httpAnon, CONFIG, api_type} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';

	export default {
		data() {
			return {
				searchTypeArr: [
					{txt: '全部', type: ''},
					{txt: '最新', type: 'isHot'},
					{txt: '最热', type: 'isNew'},
					{txt: '即将上线', type: 'isOnline'},
				],
				query: {
					pageIndex: 1,
					pageSize: 20
				},
				searchType: '',
				rows: []
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			getList() {

				let submitQuery = Object.assign({}, this.query);

				if (this.searchType) {
					submitQuery[this.searchType] = 1;
				}

				this.SET_GLOBALSTATE({type: 'loading'});
				httpAnon.get(api_type.candyInfo('getList'), submitQuery)
				.then(data => {
					if (data.code === 200) {
						this.rows = data.data.resultList;
					} else {
						return this.SET_GLOBALSTATE({type: 'errro', txt: data.msg});
					}

					return this.SET_GLOBALSTATE({type: 'done'});

				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			},
			choice(args) {
				this.searchType = args;
				this.getList();
			}
		},
		mounted() {
			this.getList();
		},
		computed: {
			suggestPath() {
				return util.getToken() ? '/suggest' : '/sign';
			}
        }

	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .candyNews-wrap
        position relative
        .banner
            display block
        .back
            position absolute
            top 10px
            left: 10px
            width 35px
            height 35px
            border-radius: 99px
            background-color: rgba(255, 255, 255, .5)
            text-align center
            i
                color: #666
                font-size: 20px
                line-height 35px
        .info-wrap
            padding 10px 15px
            .select-item
                font-size: 0
                li
                    display inline-block
                    padding 3px 15px
                    font-size: 14px
                    vertical-align: top
                    &.active
                        color: #e2bf59

        .items-wrap
            margin-top 10px
            font-size: 0
            .item
                display flex
                margin-bottom: 10px
                font-size: 12px
                overflow hidden
                .img-wrap
                    padding 20px 0
                    flex 0 0 100px
                    vertical-align: middle
                    overflow hidden
                .info
                    flex 1
                    padding 20px 10px
                    .head
                        display flex
                        margin-bottom: 10px
                        .tit
                            flex 1
                            font-weight: bold
                            font-size: 16px
                            line-height 1.5
                        .btn
                            flex 0 0 2rem
                            color: #fff
                            background-color: #e2bf59
                            text-align center
                            padding 5px 0
                            border-radius 99px
                            font-size: 12px
                            line-height 1.3
                            border 0
                    .body
                        .main-info
                            margin-bottom: 10px
                            font-size: 12px
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                        .tips
                            color: #aaa
                            font-size: 12px
                            line-height 1.2
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            -webkit-box-orient: vertical;


</style>