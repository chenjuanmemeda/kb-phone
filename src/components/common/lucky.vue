<template>
    <div class="container">
        <div class="lucky-wheel">
            <div class="lucky-title"></div>
            <div class="wheel-main">
                <div class="wheel-pointer-box">
                    <div class="wheel-pointer" @click="rotate_handle()"
                         :style="{transform:rotate_angle_pointer,transition:rotate_transition_pointer}"></div>
                </div>
                <div class="wheel-bg" :style="{transform:rotate_angle,transition:rotate_transition}">
                    <div class="prize-list">
                        <div class="prize-item" v-for="(item,index) in prize_list" :key="index">
                            <div class="prize-pic">
                                <img :src="item.icon">
                            </div>
                            <div class="prize-count" v-if="item.count">
                                {{item.count}}
                            </div>
                            <div class="prize-type">
                                {{item.name}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="content">
                <div class="lottery_ticket">今日免费抽奖次数： {{ lottery_ticket}}</div>
            </div>
            <div class="invite-prize-wrap">
                <p class="title">邀请排行奖励</p>
                <ul class="invite-prize-list">
                    <li class="item">
                        <span class="left"></span>
                        <span class="right">
                            <p>ETH/以太坊数字货币 X 3</p>
                            <p>价值10000人民币</p>
                        </span>
                    </li>
                     <li class="item">
                        <span class="left"></span>
                        <span class="right">
                            <p>ETH/以太坊数字货币 X 3</p>
                            <p>价值10000人民币</p>
                        </span>
                    </li>
                     <li class="item">
                        <span class="left"></span>
                        <span class="right">
                            <p>ETH/以太坊数字货币 X 3</p>
                            <p>价值10000人民币</p>
                        </span>
                    </li>
                     <li class="item">
                        <span class="left"></span>
                        <span class="right">
                            <p>ETH/以太坊数字货币 X 3</p>
                            <p>价值10000人民币</p>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="tip">
                <div class="tip-title">活动规则</div>
                <div class="tip-content">
                    <p> 1.每日签到后，即可获得一次幸运大转盘的机会，仅限当天有效，过期作废。 2.金币抽奖，每10个金豆可兑换一次大转盘机会。</p>
                    <p> 2.金币抽奖，每10个金豆可以兑换一次大转盘抽奖机会</p>
                    <p> 3.所中金豆或积分到【我的账户】中查询。累计达到100金豆及以上，可以兑换相应奖品</p>
                </div>
            </div>
        </div>
        <div class="toast" v-show="toast_control">
            <div class="toast-container">
                <img :src="toast_pictrue" class="toast-picture">
                <div class="close" @click="close_toast()"></div>
                <div class="toast-title">
                    {{toast_title}}
                </div>
                <div class="toast-btn">
                    <div class="toast-cancel" @click="close_toast">关闭</div>
                </div>
            </div>
        </div>
        <div class="toast-mask" v-show="toast_control"></div>
    </div>
</template>
<script type="text/ecmascript-6">
	export default {
		data() {
			return {
				easejoy_bean: 0, //金豆
				lottery_ticket: 0, //抽奖次数
				prize_list: [
					{
						icon: require("../../assets/img/draw/draw-box1.png"), // 奖品图片
						count: 0, // 奖品数量
						name: "地狱火皮肤", // 奖品名称
						isPrize: 0// 该奖项是否为奖品
					},
					// {
					// 	icon: require("../../assets/img/draw/draw-box2.png"),
					// 	count: 0,
					// 	name: "毛绒四件套",
					// 	isPrize: 0
					// },
					// {
					// 	icon: require("../../assets/img/draw/draw-box3.png"),
					// 	count: 0,
					// 	name: "谢谢参与",
					// 	isPrize: 0
					// },
					// {
					// 	icon: require("../../assets/img/draw/draw-box4.png"),
					// 	count: 5,
					// 	name: "元红包",
					// 	isPrize: 1
					// },
					// {
					// 	icon: require("../../assets/img/draw/draw-box5.png"),
					// 	count: 0,
					// 	name: "逍遥游鲲抱枕",
					// 	isPrize: 0
					// },
					// {
					// 	icon: require("../../assets/img/draw/draw-box6.png"),
					// 	count: 1,
					// 	name: "元红包",
					// 	isPrize: 1
					// },
					// {
					// 	icon: require("../../assets/img/draw/draw-box1.png"),
					// 	count: 0,
					// 	name: "仲夏夜之梦皮肤",
					// 	isPrize: 0
					// },
					// {
					// 	icon: require("../../assets/img/draw/draw-box3.png"),
					// 	count: 2,
					// 	name: "元红包",
					// 	isPrize: 1
					// },
					// {
					// 	icon: require("../../assets/img/draw/draw-box1.png"),
					// 	count: 0,
					// 	name: "源计划迷你手办套装",
					// 	isPrize: 0
					// }
				], //奖品列表
				toast_control: false, //抽奖结果弹出框控制器
				hasPrize: false, //是否中奖
				start_rotating_degree: 0, //初始旋转角度
				rotate_angle: 0, //将要旋转的角度
				start_rotating_degree_pointer: 0, //指针初始旋转角度
				rotate_angle_pointer: 0, //指针将要旋转的度数
				rotate_transition: "transform 6s ease-in-out", //初始化选中的过度属性控制
				rotate_transition_pointer: "transform 12s ease-in-out", //初始化指针过度属性控制
				click_flag: true, //是否可以旋转抽奖
				i: 0 //测试使用
			};
		},
		created() {
			this.init_prize_list();
		},
		computed: {
			toast_title() {
				return this.hasPrize
					? "恭喜您，获得" + this.prize_list[this.i].count + ' ' + this.prize_list[this.i].name
					: "未中奖";
			},
			toast_pictrue() {
				return this.hasPrize
					? require("../../assets/img/draw/congratulation.png")
					: require("../../assets/img/draw/sorry.png");
			}
		},
		methods: {
			//此方法为处理奖品数据
			init_prize_list(list) {
			},
			rotate_handle() {
				this.rotating();
				this.i = this.i + 2;
			},
			rotating(index) {
				if (!this.click_flag) return;
				var type = 0; // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
				var during_time = 5; // 默认为1s
				var random = Math.floor(Math.random() * 7);
				var result_index = index || random; // 最终要旋转到哪一块，对应prize_list的下标
				var result_angle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5]; //最终会旋转到下标的位置所需要的度数
				var rand_circle = 6; // 附加多转几圈，2-3
				this.click_flag = false; // 旋转结束前，不允许再次触发
				if (type == 0) {
					// 转动盘子
					var rotate_angle =
						this.start_rotating_degree +
						rand_circle * 360 +
						result_angle[result_index] -
						this.start_rotating_degree % 360;
					this.start_rotating_degree = rotate_angle;
					this.rotate_angle = "rotate(" + rotate_angle + "deg)";
					// // //转动指针
					// this.rotate_angle_pointer = "rotate("+this.start_rotating_degree_pointer + 360*rand_circle+"deg)";
					// this.start_rotating_degree_pointer =360*rand_circle;
					var that = this;
					// 旋转结束后，允许再次触发
					setTimeout(function () {
						that.click_flag = true;
						that.game_over(this.i);
					}, during_time * 1000 + 1500); // 延时，保证转盘转完
				} else {
					//
				}
			},
			game_over() {
				this.toast_control = true;
				this.hasPrize = this.prize_list[this.i].isPrize;
			},
			//关闭弹窗
			close_toast() {
				this.toast_control = false;
			}
		}
	};
</script>
<style type="text/stylus" lang="stylus" scoped>
    .container
        width 100%
        .lucky-wheel
            width 100%
            height 700px
            background rgb(252, 207, 133) url("../../assets/img/draw/color_pillar.png") no-repeat center bottom
            background-size 100%
            padding-top 1.5625rem
            border 1px solid green
            .lucky-title
                width 100%
                height 150px
                background url("../../assets/img/draw/lucky_title.png") no-repeat center top
                background-size 100%
            .wheel-main
                display flex
                align-items center
                justify-content center
                position relative
                .wheel-bg
                    width 18.4375rem
                    height 520px
                    background url("../../assets/img/draw/draw_wheel.png") no-repeat center top
                    background-size 100%
                    color #fff
                    font-weight 500
                    display flex
                    flex-direction column
                    justify-content center
                    align-content center
                    transition transform 3s ease
                    div
                        text-align center
                    .prize-list
                        width 100%
                        height 100%
                        position relative
                        .prize-item
                            position absolute
                            top 0
                            left 0
                            z-index 2
                            &:first-child
                                top 0
                                left 128px
                                transform rotate(20deg)
                            &:nth-child(2)
                                top 44.8px
                                left 172.8px
                                transform rotate(67deg)
                            &:nth-child(3)
                                top 102.4px
                                left 169px
                                transform rotate(-250deg)
                            &:nth-child(4)
                                top 144px
                                left 132.1px
                                transform rotate(-210deg)
                            &:nth-child(5)
                                top 147.2px
                                left 70.4px
                                transform rotate(-160deg)
                            &:nth-child(6)
                                top 100.8px
                                left 30.4px
                                transform rotate(-111deg)
                            &:nth-child(7)
                                top 44.8px
                                left 28.8px
                                transform rotate(-69deg)
                            &:nth-child(8)
                                top 0
                                left 72px
                                transform rotate(-20deg)
                        .prize-item
                            width 80px
                            height 144px
                            .prize-pic
                                img
                                    width 4.0625rem
                                    height 2.5rem
                                    margin-top 1.5625rem

                            .prize-count
                                font-size 0.875rem

                            .prize-type
                                font-size 0.75rem

                .wheel-pointer-box
                    position absolute
                    top 28%
                    left 50%
                    z-index 100
                    transform translate(-50%, -60%)
                    width 80px
                    height 80px
                    .wheel-pointer
                        width 80px
                        height 80px
                        background url("../../assets/img/draw/draw_btn.png") no-repeat center top
                        background-size 100%
                        transform-origin center 60%
        .main
            width 100%
            min-height 14.25rem
            background rgb(243, 109, 86)
            padding-bottom 1.6875rem
            .main-bg
                width 100%
                height 6.5625rem
                position absolute
                top -3.4375rem
                left 0
                background url("../../assets/img/draw/luck_bg.png") no-repeat center top
                background-size 100%
            .bg-p
                width 100%
                height 2.95rem
                background rgb(252, 207, 133)
            .content
                background rgb(243, 109, 86)
                width 100%
                height 10px
                font-size 16px
                color #ffeb39
                div
                    text-align center
            .invite-prize-wrap
                .title
                    text-align center
                    padding 10px
                    font-size 16px
                .invite-prize-list
                    background-color #ffffff
                    padding 0 15px
                    .item
                        padding 10px 
                        margin-bottom 10px
                        border 1px solid green
                        font-size  10px
                        display inline-block
                        width 95%
                        .left
                            float left 
                            width 50px
                            height 50px
                            border 1px solid #eee
                        .right
                            float right 
            .tip
                position relative
                margin 2.5rem auto 0
                // border 1px solid #fbc27f
                .tip-title
                    // position absolute
                    // top -1rem
                    // left 50%
                    // transform translate(-50%, 0)
                    // font-size 1rem
                    // color #fccc6e
                    // background rgb(243, 109, 86)
                    // padding 0.3125rem 0.625rem
                    text-align center
                    padding 5px
                .tip-content
                    padding 10px 15px
                    font-size 10px
                    color #fff8c5
                    line-height 1.5
        .toast-mask
            position fixed
            top 0
            left 0
            background rgba(0, 0, 0, 0.6)
            z-index 10000
            width 100%
            height 100%
        .toast
            position fixed
            top 50%
            left 50%
            z-index 20000
            transform translate(-50%, -50%)
            width 15.4375rem
            background #fff
            border-radius 0.3125rem
            padding 0.3125rem
            background-color rgb(252, 244, 224)
            .toast-container
                position relative
                width 100%
                height 100%
                border 1px dotted #fccc6e
                .toast-picture
                    position absolute
                    top -6.5rem
                    left -1.5rem
                    width 18.75rem
                    height 8.5625rem
                .toast-title
                    padding 2.8125rem 0
                    font-size 18px
                    color #fc7939
                    text-align center
                .toast-btn
                    display flex
                    align-items center
                    justify-content center
                    margin-bottom 0.9375rem
                    div
                        background-image -moz-linear-gradient(
                                -18deg,
                                rgb(242, 148, 85) 0%,
                                rgb(252, 124, 88) 51%,
                                rgb(252, 124, 88) 99%
                        )
                        background-image -ms-linear-gradient(
                                -18deg,
                                rgb(242, 148, 85) 0%,
                                rgb(252, 124, 88) 51%,
                                rgb(252, 124, 88) 99%
                        )
                        background-image -webkit-linear-gradient(
                                -18deg,
                                rgb(242, 148, 85) 0%,
                                rgb(252, 124, 88) 51%,
                                rgb(252, 124, 88) 99%
                        )
                        box-shadow 0px 4px 0px 0px rgba(174, 34, 5, 0.7)
                        width 4.6875rem
                        height 1.875rem
                        border-radius 1.875rem
                        text-align center
                        line-height 1.875rem
                        color #fff

                .close
                    position absolute
                    top -0.9375rem
                    right -0.9375rem
                    width 2rem
                    height 2rem
                    background url("../../assets/img/draw/close_store.png") no-repeat center top
                    background-size 100%

.toast-pictrue-change
    position absolute
    top -1.5rem
    left -1.375rem
    width 17.5rem
    height 3.125rem

    

    

</style>