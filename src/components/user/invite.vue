<template>
    <div class="invite">
        <header-tit :title="'邀请注册'"></header-tit>
        <router-link tag="a" :to="'/candyLog'" class="detail-btn">明细</router-link>
        <div class="content">
            <div class="candy-count">
                <div class="wrap">
                    <i class="icon"></i>
                    <span>
                    糖果总量
                    <br>
                    <span class="count">{{$store.state.candyCount}}</span>
                </span>
                    <div class="exchange">
                        <router-link tag="span" :to="'/candyShop'" class="green-btn">兑换</router-link>
                        <p>免费兑换VIP时长</p>
                    </div>
                </div>
                <div class="invite-code">
                    <span style="line-height: 22px">我的邀请码：{{inviteSn}}</span>
                    <button class="green-btn" id="copySn" :data-clipboard-text="inviteSn" @click="copy">复制</button>
                </div>
                <div class="invite-code">
                    <span style="display: inline-block;width: 6.9rem;padding-top: 0;vertical-align: middle;line-height: 22px"
                          class="white-break">我的邀请链接：{{inviteUrl}}</span>
                    <button class="green-btn" id="copyUrl" :data-clipboard-text="inviteUrl" @click="copyUrl"
                            style="vertical-align: middle">复制
                    </button>
                </div>
                <div class="tips">
                    <p class="tips-tit">糖果可以兑换：（分享给好友获得更多糖果来兑换奖品)</p>
                    <p>
                        1.现在可以兑换VIP时长；<br>
                        &nbsp&nbsp2.将来可以兑换代币，上交易所后可以兑换真钱；<br>
                        &nbsp&nbsp3.更多大奖陆续开放，等你来拿。
                    </p>
                </div>
            </div>

        </div>
        <div class="content split">
            <div class="invite-state">
                <h1>我的邀请状态</h1>
                <ul class="list">
                    <li>
                        <b>M1</b>
                        <span>{{levelUserCount.level01UserCount}}</span>
                    </li>
                    <li>
                        <b>M2</b>
                        <span>{{levelUserCount.level02UserCount}}</span>
                    </li>
                    <li>
                        <b>M3</b>
                        <span>{{levelUserCount.level03UserCount}}</span>
                    </li>
                    <li>
                        <b>M4</b>
                        <span>{{levelUserCount.level04UserCount}}</span>
                    </li>
                    <li>
                        <b>M5</b>
                        <span>{{levelUserCount.level05UserCount}}</span>
                    </li>
                    <li>
                        <b>M6</b>
                        <span>{{levelUserCount.level06UserCount}}</span>
                    </li>
                </ul>
                <div class="rules">
                    <h1>邀请获得糖果规则：</h1>
                    <P> M1完成注册获得3200糖果；M1在平台购买VIP后，你将获得充值金额的50%作为收益。如张三是你的M1，
                        他购买了30天(价值¥30)VIP，你钱包会获得一笔来自张三充值佣金¥15(可提现)的收入；</P>
                    <P>M2完成注册获得1600糖果，M1在平台消费后，获得16%做为收益；</P>
                    <P>M3完成注册获得800糖果；</P>
                    <P>M4完成注册获得400糖果；</P>
                    <P>M5完成注册获得200糖果；</P>
                    <P>M6完成注册获得100糖果；</P>
                    <P>最多能获得6级内糖果奖励</P>
                </div>
            </div>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
	import headerTit from '../header/header';
	import {httpAnon, httpUser, api_type, CONFIG} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';
	import Clipboard from 'clipboard';

	export default {
		name: 'invite',
		data() {
			return {
				inviteSn: '---',
				inviteUrl: '---',
			};
		},
		components: {
			'header-tit': headerTit
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),
			// 获取sn
			getSn() {
				this.SET_GLOBALSTATE({state: 'loading'});
				httpUser.get(api_type.user('getRecommendSn'))
				.then(data => {
					if (data.code === 200) {
						this.inviteSn = data.data;
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					this.SET_GLOBALSTATE({type: 'done'});
				});
			},
			getUrl() {
				this.SET_GLOBALSTATE({state: 'loading'});
				httpUser.get(api_type.user('getRecommendUrl'))
				.then(data => {
					if (data.code === 200) {
						this.inviteUrl = data.data;
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					this.SET_GLOBALSTATE({type: 'done'});
				});
			},
			copy(e) {
				let cb = new Clipboard('#copySn');
				cb.on('success', e => {
					this.SET_GLOBALSTATE({type: 'correct', txt: '复制成功'});
					cb.destroy();
				});


				cb.on('error', e => {
					// 不支持复制
					this.SET_GLOBALSTATE({type: 'error', txt: '复制失败'});
					// 释放内存
					cb.destroy();
				});
			},
			copyUrl(e) {
				let cb = new Clipboard('#copyUrl');
				cb.on('success', e => {
					this.SET_GLOBALSTATE({type: 'correct', txt: '复制成功'});
					cb.destroy();
				});


				cb.on('error', e => {
					// 不支持复制
					this.SET_GLOBALSTATE({type: 'error', txt: '复制失败'});
					// 释放内存
					cb.destroy();
				});
			}
		},
		mounted() {
			this.getSn();
			this.getUrl();
		},
		computed: {
			levelUserCount() {
				return this.$store.state.sum;
			}
		},
		deactivated() {
			this.$destroy();
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .invite
        min-height 100vh
        position relative
        .detail-btn
            font-size 12px
            color #999
            position absolute
            top 2%
            right 5%
        .content
            background-color #f9f8f6
            padding 5px 21px 15px
            .candy-count
                position relative
                margin 0 auto 8px
                .wrap
                    .icon
                        display inline-block
                        vertical-align: middle
                        width 60px
                        height 60px
                        -webkit-background-size: 100% 100%
                        background-size: 100% 100%
                        background-image: url(../../assets/img/candy-L.png)
                    span
                        display inline-block
                        font-size 10px
                        color #999
                        line-height 1.5
                        text-align left
                        font-size: 14px
                        vertical-align: middle
                        .count
                            color #333
                            font-size 14px
                            padding 0
                    .exchange
                        float: right
                        display inline-block
                        text-align center
                        vertical-align: middle
                        .green-btn
                            background-color #8cc152
                            padding 1px 7px
                            color #ffffff
                            border-radius 8.5px
                            border: 0
                            font-size: 12px
                        p
                            color #999
                            font-size 12px
                            line-height 1.5
                .invite-code
                    display block
                    margin-bottom 10px
                    span
                        color #333
                        font-size 10px
                    .green-btn
                        background-color #8cc152
                        padding 1px 7.5px
                        color #ffffff
                        border-radius 8.5px
                        border: 0
                        font-size: 12px
                        outline none
                .tips
                    border 1px solid #eee
                    text-indent 6px
                    padding-bottom 13.5px
                    border-radius 5px
                    margin-top: 15px
                    .tips-tit
                        color #c19847
                        font-size 8px
                        padding 14.5px 0 0
                    p
                        color #999
                        font-size 10px
                        line-height 1.5
            &.split
                margin-top 10px
                border none
                h1
                    font-size 10px
                    color #333
                    padding 10px 0 0
                .list
                    display flex
                    flex-wrap wrap
                    li
                        flex 0 0 4rem
                        padding 12px 0 12px 10px
                        display inline-block
                        b
                            font-weight bold
                            font-size 18px
                            color #999999
                        span
                            color #c19847
                            font-size 15px
            .rules
                border 1px solid #e5e5e5
                padding 5px 15px
                border-radius 5px
                p
                    color #999
                    font-size 8px
                    line-height 1.3
                    margin-bottom 10px

</style>