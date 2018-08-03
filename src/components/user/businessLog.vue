<template>
    <div class="businesslog-wrap">
        <header-tit :title="'交易明细'"></header-tit>
        <ul class="list-wrap">
            <li class="item border-bottom-1px" v-for="(row,$index) of rows" :key="$index">
                <p class="info">
                    <span class="note">{{row.note}}</span>
                    <span class="timeCreate">{{row.timeCreate}}</span>
                </p>
                <p class="amount" :class="{'red':row.changeAmount < 0,'green':row.changeAmount > 0}">{{row.changeAmount
                    | divide}}元</p>
            </li>
        </ul>
        <div class="no-info" v-if="rows.length <= 0">
            <img src="../../assets/img/no-info.png"/>
            <p>暂无数据</p>
        </div>
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
				query: {
					pageIndex: 1,
					pageSize: 10
				},
				rows: []
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),

			getList() {
				this.SET_GLOBALSTATE({type: 'loading'});

				httpUser.get(api_type.userStatement('getList'), util.JSONround(this.query))
				.then(data => {
					if (data.code === 200) {
						this.rows = data.data.resultList;
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					this.SET_GLOBALSTATE({type: 'done'});


				});
			}
		},
		mounted() {
			this.getList();
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .businesslog-wrap
        background-color: #f9f8f6
        min-height 100vh

    .list-wrap
        background-color: #f9f8f6
        padding 0 20px
        .item
            display flex
            padding 15px 0
            font-size: 14px
            .info
                flex 1
                span
                    display block
                .note
                    color: #333
                    margin-bottom: 5px
                    font-size: 16px
                .timeCreate
                    color: #aaa
                    font-size: 12px
            .amount
                text-align right
                flex 0 0 80px
                &.red
                    color: red
                &.green
                    color: green

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