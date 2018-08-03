<template>
    <div class="index-wrap">
        <p class="overdue-info" v-if="tk">{{overDue}}
            <router-link tag="button" :to="'/vip'" class="green-btn">充值</router-link>
        </p>
        <!--<p class="overdue-info overdue" v-show="lastDay <= 0 && tk">您的VIP已过期-->
        <!--<router-link tag="button" :to="'/vip'" class="green-btn">充值</router-link>-->
        <!--</p>-->
        <div class="nav-block">
            <router-link tag="a" class="item" v-for="(nav,$index) of navArr" :to="nav.path" :key="$index">
                <i class="icon" :class="nav.icon"></i>
                <span class="txt">{{nav.text}}</span>
            </router-link>
        </div>
        <div class="business-nav">
            <!--(item.websiteUrl)-->
            <a class="nav-item" v-for="item of businessNav"
               @touchstart="stop"
               @touchmove="stop"
               @touchcancel="stop"
               @touchend="stop"
               :href="tk ? item.websiteUrl : '#/sign'"
            >
                <i class="icon">
                    <img :src="getIcon(item.websiteIndexId)" alt="" width="100%"/>
                </i>
                <span class="txt">{{item.websiteName}}</span>
            </a>
        </div>

        <p class="line-tit">
            电报群
            <a @click="telegramPath" style="float: right;font-size: 12px;">查看更多<i
                    class="cubeic-arrow"></i>
            </a>
        </p>
        <div class="telegram-list fix">
            <a v-for="item of telegramList5.slice(0,3)" @click="gotoTelegram(item)" class="item">
                <span class="white-break">
                    {{item.websiteName}}
                </span>
            </a>
            <a v-for="item of telegramList6.slice(0,3)" @click="gotoTelegram(item)" class="item">
                <span class="white-break">
                    {{item.websiteName}}
                </span>
            </a>
            <a v-for="item of telegramList7.slice(0,3)" @click="gotoTelegram(item)" class="item">
                <span class="white-break">
                    {{item.websiteName}}
                </span>
            </a>
        </div>

        <p class="line-tit">免费领糖果
            <router-link tag="a" :to="'/candyNews'" style="float: right;font-size: 12px;">查看更多<i
                    class="cubeic-arrow"></i></router-link>
        </p>

        <navigator :navList="candyList" @change="change" :currentTabIndex="currentTabIndex">
            <span slot="item" slot-scope="props" class="tab-name" :class="{'link-active':isCurrent(props.index)}">{{props.text}}</span>
        </navigator>

        <p class="line-tit">其它交易平台</p>

        <p class="mid-tit">最热</p>
        <div class="other-wrap">
            <a v-for="row of rows2" :href="row.websiteUrl" class="white-break">{{row.websiteName}}</a>
        </div>

        <p class="mid-tit">最新</p>
        <div class="other-wrap">
            <a v-for="row of rows3" :href="row.websiteUrl" class="white-break">{{row.websiteName}}</a>
        </div>

        <p class="mid-tit">优选</p>
        <div class="other-wrap">
            <a v-for="row of rows4" :href="row.websiteUrl" class="white-break">{{row.websiteName}}</a>
        </div>
        <!--<button @click="testss">test</button>-->
        <!--<router-link tag="a" :to="'/sign'" class="float-sign" v-if="!tk"></router-link>-->

		<div class="kb-modal" v-if="inviteModal">
            <div class="modal-wrap">
                <!-- <div class="modal-header">
                    <h6 class="tit">&nbsp;</h6>
                    <i class="cubeic-close close-btn" @click="inviteModal = !inviteModal"></i>
                </div> -->
                <div class="modal-body">
                    <router-link to="inviteAct"><div class="go-detail">查看详情</div></router-link>
                </div>
                <!-- <div class="modal-footer border-top-1px" style="display: flex">
                    <a class="btn border-right-1px" @click="inviteModal = !inviteModal" style="flex: 1">取消</a>
                    <a class="btn" @click="$router.push('/payPassword')" style="flex: 1">确认</a>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
	import util from '../../assets/js/util';
	import {httpAnon, api_type, httpUser} from "../../assets/js/api";
	import {mapMutations} from 'vuex';
	import Navigator from './navigator';


	export default {
		name: 'index',
		data() {
			return {
				isSuccess: false,
				inviteModal: true,
				navArr: [
					{text: '领糖果', path: '/candyNews', icon: 'candyShop'},
					{text: '意见反馈', path: '/feedback', icon: 'feedback'},
					{text: '邀请注册', path: util.getToken() ? '/invite' : '/sign', icon: 'invite'},
					{text: '个人中心', path: util.getToken() ? '/userCenter' : '/sign', icon: 'userCenter'},
				],
				businessNav: [],
				otherRows: [],
				rows2: [],
				rows3: [],
				rows4: [],
				isOverDue: false,
				currentTabIndex: 1, // 当前默认tab,
				telegramList5: [],
				telegramList6: [],
				telegramList7: [],
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE', 'SET_CANDYLIST', 'SET_USERINFO']),
			gotoTelegram(item) {
				if (util.Browser.isAndroid) {
					window.location.href = item.androidLink;
				} else if (util.Browser.isIOS) {
					window.location.href = item.androidLink;
				} else {
					window.open(item.telegramUrl);
				}

			},
			telegramPath() {
				console.log(this.isOverDue);

				if (!util.getToken()) return this.$router.push('/sign');

				if (util.getToken() && this.isOverDue) {

					this.$router.push('/telegram');
					return;
				}

				if (!this.isOverDue) {
					console.log(11);
					return this.isOverDueMethods();
				}

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
			testss() {
				// this.loadUrl('wlhd://tg:resolve?domain=huobiofficial');
			},
			stop(e) {
				// this.loadUrl('wlhd://tg:join?invite=AAAAAD3R46fHijBWEfRaCw');

				switch (e.type) {
					case 'touchmove':
						return;
					case 'touchend':
						// this.loadUrl('wlhd://tg:resolve?domain=huobiofficial');
						break;

				}
				e.stopPropagation();
			},
			getIcon(index) {
				return require(`../../assets/img/index/icon${index}.png`);
			},
			gotoSign() {
				this.$router.push('/sign');
			},
			getWebSite() {
				this.SET_GLOBALSTATE({type: 'loading'});

				httpAnon.get(api_type.websiteIndex('getList'))
				.then(data => {
					if (data.code === 200) {

						this.businessNav = data.data.slice(0, 10);
						this.otherRows = data.data.slice(10, data.data.length);

						this.otherRows.forEach((item, i) => {
							if (item.showType === 2) this.rows2.push(item);
							if (item.showType === 3) this.rows3.push(item);
							if (item.showType === 4) this.rows4.push(item);
							if (item.showType === 5) this.telegramList5.push(item);
							if (item.showType === 6) this.telegramList6.push(item);
							if (item.showType === 7) this.telegramList7.push(item);
						});

						return this.SET_GLOBALSTATE({type: 'done'});

					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}

				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			},
			getrCandyList() {
				httpAnon.get(api_type.candyInfo('getList'), {pageIndex: 1, pageSize: 5})
				.then(data => {
					if (data.code === 200) {

						let rows = data.data.resultList;

						rows.forEach((item, i) => {
							item.id = i;
							item.name = item.candyName;
						});

						// this.candyList = rows;
						this.SET_CANDYLIST(rows);

					}
				});
			},
			isCurrent(index) {
				return index === this.currentTabIndex;
			},
			change(item) {
			},

			getDetail() {
				httpUser.get(api_type.user('getDetail')).then((data) => {
					if (data.code === 200) {
						this.SET_USERINFO(data.data);
						let now = new Date().getTime();

						let overdue = new Date(data.data.rechargeTime.replace(/-/g, '/')).getTime();
						// let overdue = new Date('2018-7-25 12:15:15').getTime();

						let result = (overdue - now) / (1000 * 60 * 60 * 24);

						if (result <= 0) {
							// this.SET_ISOVERDUE(true);
							this.isOverDue = false;
							this.isOverDueMethods();
						} else {
							this.isOverDue = true;
						}

					} else {


						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
				});
			},
			isOverDueMethods() {
				if (this.tk) {
					this.$createDialog({
						type: 'confirm',
						icon: 'cubeic-alert',
						showClose: true,
						title: '您的VIP已过期',
						content: '充值或邀请好友注册即可重新获得VIP特权',
						confirmBtn: {
							text: '邀请好友',
							active: false,
							disabled: false,
							href: 'javascript:;'
						},
						cancelBtn: {
							text: '充值',
							active: true,
							disabled: false,
							href: 'javascript:;'
						},
						onCancel: () => {
							this.$router.push('/vip');
						},
						onConfirm: () => {
							this.$router.push('/invite');
						}
					}).show();
				}
			}
		},
		mounted() {

		},
		created() {

			if (this.$route.query.redirectUrl) {
				this.$router.push(`/${this.$route.query.redirectUrl}`);
			}

			if (util.getUrlParam('router')) {
				var router = util.getUrlParam('router');
				var query = '?data=' + util.getUrlParam('data') + '&backRouter=userCenter';
				window.history.replaceState(query, '', window.location.pathname);
				window.history.pushState(window.history.state, '', window.location.pathname + window.history.state);
				this.$router.push(`/${router}`);

			}

			this.getWebSite();
			this.getrCandyList();
			if (util.getToken()) {
				this.getDetail();
			}
		},
		components: {
			Navigator
		},
		computed: {
			candyList() {
				return this.$store.state.candyList;
			},
			tk() {
				return util.getToken();
			},
			userInfo() {

				return this.$store.state.userInfo;
			},
			overDue() {
				if (!this.tk) return;

				let now = new Date().getTime();
				let overdue = new Date(this.userInfo.rechargeTime.replace(/-/g, '/')).getTime();
				// let overdue = new Date('2018-7-25 12:15:15').getTime();
				let result = (overdue - now) / (1000 * 60 * 60 * 24);

				if (result > 0) {


					if (result < 1) return `VIP将于1天后到期`;

					return `VIP将于${~~(result)}天后到期`;
				} else {
					return '您的VIP已到期';
				}
			},
		},
		watch: {
			tk: function (data) {
				console.log(data);
			},
			overDue: function (data) {
				console.log(data);
			}
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .navigator-view
        .navigator-container
            height: 52px;
            background: #fff;
            box-shadow: 0 2px 3px rgba(0, 0, 0, .12)
            overflow: hidden;
        .tab-render-content
            position: absolute;
            left: 0;
            top: 50px;
            right: 0;
            bottom: 0;
            margin-top: 15px;
            padding: 15px;
            background: #fff;
            line-height: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .nav-block
        display flex
        text-align center
        padding 10px
        background-color: #f9f8f6
        .item
            flex 1
            font-size: 14px
            color: #333
            /*margin-right 0.6rem*/
            padding 5px 0 10px
            &:last-child
                margin-right: 0
            .icon
                display block
                margin 0 auto
                width 75px
                height 75px
                -webkit-background-size: 100% 100%
                background-size: 100% 100%
                &.candyShop
                    background-image: url(../../assets/img/nav-icon-candy-shop.png)
                &.feedback
                    background-image: url(../../assets/img/nav-icon-feedback.png)
                &.invite
                    background-image: url(../../assets/img/nav-icon-deafult.png)
                &.userCenter
                    background-image: url(../../assets/img/nav-icon-setting.png)
            .txt
                font-size: 12px

    .business-nav
        display flex
        padding 20px 0 10px
        flex-wrap: wrap
        .nav-item
            display block
            flex 0 0 1.97rem
            text-align center
            margin 0 0 20px
            font-size: 0
            .icon
                display block
                margin 0 auto 6px
                width 30px
                height 30px
                border-radius 5px
            .txt
                display block
                margin 0
                font-size: 12px

    .candy-item-slide
        width 100%

    .line-tit
        padding 0 20px 10px
        color: #c8a258
        font-size: 14px

    .mid-tit
        color: #c8a258
        font-size: 12px
        text-align center
        margin-bottom: 3px

    .other-wrap
        display flex
        width 9.1rem
        margin 0 auto
        flex-wrap wrap
        margin-bottom: 15px
        a
            padding 8px 9px
            flex 0 0 1.3rem
            font-size: 10px
            color: #333

    .index-wrap
        .green-btn
            background-color: #8cc152
            color: #fff
            border-radius 99px
            padding 2px 10px
            border: 0
            margin-left: 5px
            font-size: 12px
        .overdue-info
            background-color: #f9f8f6
            padding 10px 10px 0 10px
            font-size: 12px
            text-align right

    .telegram-list
        display flex
        margin 0 auto
        width 9.1rem
        font-size: 0
        margin-bottom: 20px
        flex-wrap wrap
        .item
            flex 1
            padding 0 15px
            font-size: 12px
            line-height 40px
            background-color: #f9f8f6
            span
                display block
                margin 0 auto
                width 1.8rem
.kb-modal
	position fixed
	top 0
	left 0
	width 100vw
	height 100vh
	background-color: rgba(0, 0, 0, .5)
	z-index 9999999
	.modal-wrap
		position absolute
		left 50%
		top 50%
		transform translate(-50%, -50%)
		width 9rem
		max-width 100%
		border-radius 5px
		background-image url('../../assets/img/invite-act/act-modal.png')
		background-repeat no-repeat
		background-size 100%
		.modal-header
			display flex
			padding 10px
			border none
			.tit
				flex 1
				font-size: 14px
				color: #999
			.close-btn
				flex 0 0 15px
				font-size: 14px
				color: #999
		.modal-body
			height  353px
			.go-detail
				display block
				width 100px
				height 35px
				line-height 30px
				margin 120px auto  0
				background-image url('../../assets/img/invite-act/go-detail-btn.png')
				background-size 100%
				background-repeat no-repeat
				font-size 10px
				color #333333
				text-align  center
			
		.modal-footer
			text-align center
			.btn
				display block
				width 100%
				height 100%
				font-size: 14px
				line-height 45px

</style>