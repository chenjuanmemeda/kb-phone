<template>
    <div class="test-wrap">
        <button @click="scanClick()">扫一扫</button>
        <button @click="locationClick()">获取定位</button>
        <button @click="colorClick()">修改背景色</button>
        <button @click="shareClick()">分享</button>
        <button @click="payClick()">支付</button>
        <button @click="shake()">摇一摇</button>
        <button @click="goBack()">返回</button>
        <input type="text" placeholder="方法名" v-model="operationName"/>
        <button @click="test()">test</button>

        <button @click="openConsole">打开console</button>

    </div>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue';

	export default {
		name: "",
		data() {
			return {
				cordova: Vue.cordova,
				operationName: '',
			};
		},
		mounted() {
			console.log(this.cordova);
		},
		methods: {
			openConsole() {
				var __vconsole = document.getElementById('__vconsole');
				__vconsole.style.display = 'block';
				console.log();
			},

			loadUrl(url) {
				let iFrame = null;
				iFrame = document.createElement("iframe");
				iFrame.setAttribute("src", url);
				iFrame.setAttribute("style", "display:none;");
				iFrame.setAttribute("height", "0px");
				iFrame.setAttribute("width", "0px");
				iFrame.setAttribute("frameborder", "0");
				document.body.appendChild(iFrame);
				// 发起请求后这个iFrame就没用了，所以把它从dom上移除掉
				iFrame.parentNode.removeChild(iFrame);
				iFrame = null;
			},
			test() {
				var url = `${this.operationName}://aasdasd`;
				console.log(url);
				this.loadUrl(url);
			},
			/**
			 * 扫一扫
			 */
			scanClick() {
				this.loadUrl('haleyAction://scanClick');
			},
			/**
			 *获取定位
			 */
			locationClick() {
				this.loadUrl('haleyAction://getLocation');
			},
			/**
			 *修改背景色
			 */
			colorClick() {
				this.loadUrl('haleyAction://setColor?r=67&g=205&b=128&a=0.5');
			},
			/**
			 *分享
			 */
			shareClick() {
				this.loadUrl('haleyAction://shareClick?title=测试分享的标题&content=测试分享的内容&url=http://www.baidu.com');
			},
			/**
			 * 支付
			 */
			payClick() {
				this.loadUrl('haleyAction://payAction?order_no=201511120981234&channel=wx&amount=1&subject=粉色外套');
			},
			/**
			 * 摇一摇
			 */
			shake() {
				this.loadUrl('haleyAction://shake');
			},
			goBack() {
				this.loadUrl('haleyAction://back');
			}

		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .test-wrap
        text-align center
        font-size: 14px
        line-height 1.5
        button
            display block
            width 100px
            margin 10px auto
            padding 5px

</style>