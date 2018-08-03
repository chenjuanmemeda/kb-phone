<template>
    <transition name="showUp">
        <div class="success-page" v-if="visible">
            <span class="success-icon"></span>
            <slot>

            </slot>
            <div class="success-page-btn-wrap" v-if="hasButton">
                <cube-button @click="close">完成</cube-button>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
	export default {
		props: {
			value: {
				type: Boolean,
				default: false
			},
			hasButton: {
				type: Boolean,
				default: true
			},
			path: ''
		},
		data() {
			return {
				visible: false,
			};
		},
		methods: {
			close() {
				if (this.path) return this.$router.push(this.path);
				this.visible = false;
			},
		},
		watch: {
			value(val) {
				this.visible = val;
			},
			visible(val) {
				this.$emit('input', val);
			}
		},
		mounted() {
			if (this.value) {
				this.visible = true;
			}
		},
	};
</script>

<style type="text/stylus" lang="stylus">
    .success-page
        position fixed
        top 0
        left 0
        background-color: #f9f8f6
        width 100vw
        min-height 100vh
        text-align center
        line-height 1.5
        font-size: 14px
        box-shadow 0 -1px 6px rgba(55, 55, 55, .2)
        z-index 999
        .success-icon
            display block
            margin 100px auto 10px
            width 60px
            height 60px
            -webkit-background-size: 100% 100%
            background-size: 100% 100%
            background-image: url(../../assets/img/success-icon.png)
        p
            color: #666

    .showUp-enter-active, .showUp-leave-active
        transition: top .4s

    .showUp-enter, .showUp-leave-to
        top: 100vh

    .success-page-btn-wrap
        margin 50px auto 0
        width 6rem
</style>