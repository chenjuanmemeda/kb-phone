<template>
    <header class="header border-bottom-1px"><i class="cubeic-back" @click="goback"></i>{{ title}}
        <slot></slot>
    </header>
</template>

<script type="text/ecmascript-6">
	import util from '../../assets/js/util';

	export default {
		name: "",
		data() {
			return {};
		},
		props: {
			'title': {
				type: [String],
				default: '标题'
			}
		},
		methods: {
			goback() {
				if (this.$route.query.type && this.$route.query.type === 'gotoIndex') {
					return this.$router.push('/');
				}

				if (util.getUrlParam('backRouter')) {
					var backRouter = util.getUrlParam('backRouter');
					window.history.replaceState('', '', window.location.pathname);
					window.history.pushState(window.history.state, '', window.location.pathname + '');
					return this.$router.push(`/${backRouter}`);
				}

				this.$router.back();
			}
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .header
        background-color: $color-bgc
        line-height 40px
        text-align center
        font-size 16px
        color #333
        width 100%
        position relative
        i
            position absolute
            left 14px
</style>