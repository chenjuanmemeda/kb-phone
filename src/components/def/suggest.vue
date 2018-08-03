<template>
    <div class="suggest-wrap">
        <header-tit :title="'项目推荐'"></header-tit>
        <div class="form-control" style="margin-top: 10px">
            <h6 class="tit">糖果项目链接地址：</h6>
            <input type="text" v-model="query.registUrl">
        </div>
        <div class="form-control">
            <h6 class="tit">项目介绍或推荐理由：</h6>
            <textarea v-model="query.description"></textarea>
            <p class="tips">请在上面填写您推荐的糖果信息，糖果项目被采纳后，我们将赠送1000快币糖果给您</p>
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

				if (!this.query.registUrl) {
					return this.SET_GLOBALSTATE({type: 'warn', txt: '请输入糖果项目链接！'});
				}

				let submitQuery = {
					registUrl: window.encodeURIComponent(this.query.registUrl),
					description: window.encodeURIComponent(this.query.description),
				};

				this.SET_GLOBALSTATE({type: 'loading'});

				httpUser.post(api_type.candyInfo('addByRecommend'), util.queryString(submitQuery))
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
                color: #aaa
                font-size: 12px

    .btn-wrap
        margin 0 auto
        width 6rem


</style>