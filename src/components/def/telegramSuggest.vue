<template>
    <div class="suggest-wrap">
        <header-tit :title="'电报群推荐'"></header-tit>
        <p class="tips">*请在下面填写您想推荐的电报群，电报群被采纳后，我们将赠送1000快币糖果给您。</p>
        <div class="form-control" style="margin-top: 10px">
            <h6 class="tit">电报群链接地址：</h6>
            <input type="text" v-model="query.telegramUrl" placeholder="电报群链接地址">
        </div>
        <div class="form-control" style="margin-top: 10px">
            <h6 class="tit">电报群名称：</h6>
            <input type="text" v-model="query.telegramName" placeholder="电报群名称">
        </div>
        <div class="form-control">
            <h6 class="tit">电报群介绍或推荐理由：</h6>
            <textarea v-model="query.reason" placeholder="请填写你的介绍或理由"></textarea>
        </div>
        <div class="btn-wrap">
            <cube-button @click="addByRecommend">提交</cube-button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
	import {httpUser, api_type} from "../../assets/js/api";
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';

	export default {
		data() {
			return {
				query: {
					registUrl: '',
					description: ''
				}
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),

			addByRecommend() {

				if (!this.query.telegramUrl) {
					return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入电报群链接！'});
				}

				let submitQuery = {
					telegramUrl: window.encodeURIComponent(this.query.telegramUrl),
					telegramName: window.encodeURIComponent(this.query.telegramName),
					reason: window.encodeURIComponent(this.query.reason)
				};

				this.SET_GLOBALSTATE({type: 'loading'});

				httpUser.post(api_type.telegramInfo('recommend'), util.queryString(submitQuery))
				.then(data => {
					if (data.code === 200) {
						this.SET_GLOBALSTATE({type: 'correct', txt: '推荐成功'});
						setTimeout(() => {
							this.$router.back();
						}, 1500);
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}

				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			}
		},
		deactivated() {
			this.$destroy();
		}

	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .suggest-wrap
        .form-control
            padding 10px 20px
            margin-bottom: 10px
            .tit
                padding 0
                font-size: 14px
                margin-bottom 8px
            input
                width 100%
                border-radius 5px
                line-height 35px
                border: 1px solid #e2bf59
                font-size: 14px
                padding-left 5px
            textarea
                width 100%
                padding 5px
                border-radius 5px
                border: 1px solid #e2bf59
                height 120px
                box-sizing border-box

    .tips
        padding 10px 10px 0 10px
        color: #aaa
        font-size: 10px

    .btn-wrap
        margin 0 auto
        width 6rem


</style>