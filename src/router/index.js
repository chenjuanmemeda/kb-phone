import Vue from 'vue';
import Router from 'vue-router';

import Frame from '@/components/def/Frame';
import Index from '@/components/def/index';

const CandyNews = () => import('@/components/def/candyNews');
const FeedBack = () => import('@/components/def/feedBack');
const Suggest = () => import('@/components/def/Suggest');
const Telegram = () => import('@/components/def/telegram');
const TelegramSuggest = () => import('@/components/def/telegramSuggest');
const InviteAct = () => import('@/components/inviteAct/inviteAct');


/**
 * log
 */
import LogFrames from '@/components/log/logFrames';

const Sign = () => import('@/components/log/sign');

const test = () => import('@/components/test');

const Register = () => import('@/components/log/register');
const ForgetPassword = () => import('@/components/log/forgetPassword');
/**
 * user
 */
import UserFrames from '@/components/user/userFrames';
import userCenter from '@/components/user/userCenter';

const Vip = () => import('@/components/user/vip');
const CandyShop = () => import('@/components/user/candyShop');
const Wallet = () => import('@/components/user/wallet');
const UserInfo = () => import('@/components/user/userInfo');
const Invite = () => import('@/components/user/invite');
const PasswordOperation = () => import('@/components/user/passwordOperation');
const BusinessLog = () => import('@/components/user/businessLog');
const CandyInfo = () => import('@/components/user/candyInfo');
const WithdrawReq = () => import('@/components/user/withdrawReq');
const Password = () => import('@/components/user/password');
const CashPattern = () => import('@/components/user/cashPattern');
const PayPassword = () => import('@/components/user/payPassword');
const CandyLog = () => import('@/components/user/candyLog');
const AddBankCard = () => import('@/components/user/addBankCard');


Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			redirect: '/index'
		},
		{
			path: '/test',
			name: 'test',
			component: test,
		},
		{
			path: '/frame',
			name: 'frame',
			component: Frame,
			redirect: '/index',
			children: [
				{
					path: '/index',
					name: 'index',
					component: Index
				},
				{
					path: '/candyNews',
					name: 'candyNews',
					component: CandyNews
				},
				{
					path: '/feedBack',
					name: 'feedBack',
					component: FeedBack
				},
				{
					path: '/suggest',
					name: 'suggest',
					component: Suggest
				},
				{
					path: '/telegram',
					name: 'telegram',
					component: Telegram
				},
				{
					path: '/telegramSuggest',
					name: 'telegramSuggest',
					component: TelegramSuggest
				},
				{
					path: '/inviteAct',
					name: 'invite',
					component: InviteAct
				},
			]
		},
		{
			path: '/log',
			component: LogFrames,
			children: [
				{
					path: '/sign',
					name: 'sign',
					component: Sign
				},
				{
					path: '/register',
					name: 'register',
					component: Register
				},
				{
					path: '/forgetPassword',
					name: 'forgetPassword',
					component: ForgetPassword
				},

			]
		},
		{
			path: 'userFrame',
			component: UserFrames,
			children: [
				{
					path: '/userCenter',
					name: 'userCenter',
					component: userCenter
				},
				{
					path: '/candyShop',
					name: 'candyShop',
					component: CandyShop
				},
				{
					path: '/candyInfo',
					name: 'candyInfo',
					component: CandyInfo
				},
				{
					path: '/vip',
					name: 'vip',
					component: Vip
				},
				{
					path: '/userInfo',
					name: 'userInfo',
					component: UserInfo
				},
				{
					path: '/wallet',
					name: 'wallet',
					component: Wallet
				},
				{
					path: '/passwordOperation/:id',
					name: 'passwordOperation',
					component: PasswordOperation
				},
				{
					path: '/invite',
					name: 'invite',
					component: Invite
				},
				{
					path: '/businessLog',
					name: 'businessLog',
					component: BusinessLog
				},
				{
					path: '/withdrawReq',
					name: 'withdrawReq',
					component: WithdrawReq
				},
				{
					path: '/password',
					name: 'password',
					component: Password
				},
				{
					path: '/cashPattern',
					name: 'cashPattern',
					component: CashPattern
				},
				{
					path: '/payPassword',
					name: 'payPassword',
					component: PayPassword
				},
				{
					path: '/candyLog',
					name: 'candyLog',
					component: CandyLog
				},
				{
					path: '/addBankCard',
					name: 'addBankCard',
					component: AddBankCard
				}
			]
		},

	]
});
