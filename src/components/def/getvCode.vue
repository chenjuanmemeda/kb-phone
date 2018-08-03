<template>
    <cube-button class="getvCode" @click="submit" :disabled="isInterval">{{text}}</cube-button>
</template>

<script type="text/ecmascript-6">
	import {CONFIG, httpUser, httpAnon, api_type} from '../../assets/js/api';
	import {mapMutations} from 'vuex';

	export default {
		name: "",
		props: {
			query: {
				mobile: '',
				operate: ''
			}
		},
		data() {
			return {
				text: '获取验证码',
				timeout: 60,
				interval: null,
				isInterval: false,
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),

			submit() {
				this.SET_GLOBALSTATE({state: 'loading'});

				httpAnon.get(api_type.sms('getVerifyCode'), this.query)
				.then(data => {
					if (data.code === 200) {
						this.SET_GLOBALSTATE({type: 'correct', txt: '发送成功'});
						this.text = this.timeout + 's';
						this.isInterval = true;

						this.interval = setInterval(() => {
							this.timeout--;
							this.text = this.timeout + 's';
							if (this.timeout <= 0) {
								this.text = '获取验证码';
								this.timeout = 60;
								this.isInterval = false;
								clearInterval(this.interval);
							}
						}, 1000);
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			}
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .getvCode
        float: right
        width 3rem
        position absolute
        top 3px
        right 5px
        font-size: 14px
</style>