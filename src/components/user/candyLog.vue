<template>
    <div class="candyLog-wrap">
        <header-tit :title="'糖果明细'"></header-tit>
        <ul class="log-list">
            <li v-for="row of rows" class="border-bottom-1px">
                <p class="info">
                    <span class="note">{{row.note}}</span>
                    <span class="tip">{{row.timeCreate}}</span>
                </p>
                <p class="count">
                    {{row.changeCount}}
                </p>
            </li>
        </ul>
        <div class="no-info" v-if="rows.length <= 0">
            <img src="../../assets/img/no-info.png"/>
            <p>暂无数据</p>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import headerTit from '../header/header';
	import {httpUser, api_type} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';

	export default {
		data() {
			return {
				rows: [],
				query: {
					pageIndex: 1,
					pageSize: 20
				}
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			getList() {

				this.SET_GLOBALSTATE({state: 'loading'});
				httpUser.get(api_type.userCandyStatement('getList'),this.query)
				.then(data => {
					if (data.code === 200) {
						this.rows = data.data.resultList;
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					this.SET_GLOBALSTATE({type: 'done'});
				});
			},
		},
		mounted() {
			this.getList();
		},
		components: {
			'header-tit': headerTit
		},
	};
</script>

<style type="text/stylus" lang="stylus">
    .candyLog-wrap
        background-color: #f9f8f6
        min-height 100vh
        .log-list
            font-size: 0
            padding 0 20px
            li
                display flex
                font-size: 14px
                padding 12px 0
                justify-content center
                .info
                    flex 1
                    .note
                        display block
                        font-size: 16px
                        margin-bottom: 3px
                    .tip
                        display block
                        font-size: 12px
                        color: #aaa
                .count
                    text-align right
                    font-size: 16px
                    line-height 26px

    .no-info
        display block
        margin 30px auto 0
        text-align center
        img
            width 6rem
        p
            margin-top 20px
            font-size: 14px



</style>