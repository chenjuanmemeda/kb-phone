import util from '../assets/js/util';
import {
	SET_CANDYCOUNT,
	SET_USERAMOUNT,
	SET_GLOBALSTATE,
	SET_USERINFO,
	SET_SUM,
	SET_TK,
	SET_CANDYLIST,
	SET_ISOVERDUE,
	SET_SOURCE,
	SET_isExist4PayPwd
} from './mutations_type.js';

const ua = window.navigator.userAgent.toLowerCase();


export const store = {
	state: {
		candyCount: 0,
		userAmount: 0,
		sum: {},
		globalState: {
			type: '',
			txt: '',
			time: 0
		},
		userInfo: {rechargeTime: ''},
		source: {},
		tk: util.getToken() || '',
		candyList: [{
			'candyName': '---',
			'summary': '---',
			'description': '---',
			'logoImageUrl': '',
			'registUrl': ''
		}, {
			'candyName': '---',
			'summary': '---',
			'description': '---',
			'logoImageUrl': '',
			'registUrl': ''
		}, {
			'candyName': '---',
			'summary': '---',
			'description': '---',
			'logoImageUrl': '',
			'registUrl': ''
		}, {
			'candyName': '---',
			'summary': '---',
			'description': '---',
			'logoImageUrl': '',
			'registUrl': ''
		}, {
			'candyName': '---',
			'summary': '---',
			'description': '---',
			'logoImageUrl': '',
			'registUrl': ''
		}],
		isOverdue: false,
		isExist4PayPwd: 0
	},
	mutations: {
		[SET_CANDYCOUNT](state, payload) {
			state.candyCount = payload;
		},
		[SET_USERAMOUNT](state, payload) {
			state.userAmount = payload;
		},
		[SET_USERINFO](state, payload) {
			state.userInfo = payload;
		},
		[SET_SUM](state, payload) {
			state.sum = payload;
		},
		[SET_TK](state, payload) {
			state.tk = payload;
		},
		[SET_CANDYLIST](state, payload) {
			state.candyList = payload;
		},
		[SET_GLOBALSTATE](state, payload) {
			if (payload.type === 'loading') {
				payload.time = 0;
			}

			if (payload.type === 'error' || payload.type === 'warn') {
				payload.time = 2500;
			}

			state.globalState = payload;
		},
		[SET_ISOVERDUE](state, payload) {
			state.isOverdue = payload;
		},
		[SET_SOURCE](state, payload) {
			state.source = payload;
		},
		[SET_isExist4PayPwd](state,payload){
			state.isExist4PayPwd = payload;
		}
	}
};


