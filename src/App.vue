<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
	import {httpAnon, httpUser, api_type} from "./assets/js/api";
	import util from './assets/js/util';
	import {mapMutations} from 'vuex';

	export default {
		name: 'app',
		methods: {
			...mapMutations(['SET_CANDYCOUNT', 'SET_USERAMOUNT', 'SET_GLOBALSTATE', 'SET_SUM', 'SET_USERINFO', 'SET_ISOVERDUE', 'SET_SOURCE']),
			getSum() {
				httpUser.get(api_type.userRewardRecord('getSum'))
				.then(data => {
					if (data.code === 200) {
						this.SET_CANDYCOUNT(data.data.candyCount);
						this.SET_SUM(data.data);
					}
				});
			},
			getAmount() {
				this.SET_GLOBALSTATE({state: 'loading'});

				httpUser.get(api_type.user('getAmount'))
				.then(data => {
					if (data.code === 200) {
						this.SET_USERAMOUNT(data.data);
					}
					this.SET_GLOBALSTATE({type: 'done'});
				});
			},

		},
		mounted() {

			if (this.tk) {
				httpUser.get(api_type.cookie('get'));
				this.getSum();
				this.getAmount();
			}

			if (this.$route.query.clientType) util.ck.set('CLIENTTYPE', this.$route.query.clientType);

			if (this.$route.query.st) {
				let query = {
					st: this.$route.query.st,
					sn: this.$route.query.sn,
				};
				httpAnon.post(api_type.order('getRecommender'), util.queryString(query))
				.then(data => {
					if (data.code === 200) {
						this.SET_SOURCE(data.data);
					}
				});
			}

		},
		computed: {
			globalState() {
				return this.$store.state.globalState;
			},
			tk() {
				return this.$store.state.tk;
			},
		},
		watch: {
			globalState: function (data) {

				let toast = this.$createToast(data);
				if (data.type === 'done') {
					if (!data.state) toast.hide();
					return;
				}

				toast.show();
			},
			tk: function (data) {
				if (data) {
					this.getSum();
					this.getAmount();

				}
			}
		}
	};
</script>

<style type="text/stylus" lang="stylus">
    body
        .cube-btn
            display inline-block
            padding 12px 16px
            font-size: 14px
            &:active:after
                border 0
            &:active
                background-color: #d6ae5d

    .cube-btn.cube-btn_disabled::after, .cube-btn.cube-btn_disabled.cube-btn_active::after, .cube-btn.cube-btn_disabled:active::after
        display none !important

    button, input, textarea
        outline none

    .cube-dialog-content-def p
        font-size: 12px

    .cube-toast-tip
        max-width 6.5rem !important;

    .cube-action-sheet-title
        display none !important


</style>
