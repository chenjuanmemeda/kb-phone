import axios from 'axios';
import util, {regExp} from './util';
import Router from 'vue-router';
import Cookies from 'js-cookie';

export const CONFIG = {
	api: process.env.NODE_ENV === 'production' ? {
		img: 'http://192.168.1.10:7190/api/anon/common/upload.do',
		url: 'http://192.168.1.10:7190/api/',
		captchaCode: 'http://192.168.1.10:7190/api/anon/graphCaptcha/get.do?specs=2'

		// img: 'http://60.191.193.98:7880/api/anon/common/upload.do',
		// url: 'http://60.191.193.98:7880/api/',
		// captchaCode: 'http://60.191.193.98:7880/api/anon/graphCaptcha/get.do?specs=2'

		// img: 'http://www.kuaibi888.com/api/anon/common/upload.do',
		// url: 'http://www.kuaibi888.com/api/',
		// captchaCode: 'http://www.kuaibi888.com/api/anon/graphCaptcha/get.do?specs=2'

	} : {
		img: 'http://192.168.1.10:7187/api/anon/common/upload.do',
		url: 'http://192.168.1.10:7187/api/',
		captchaCode: 'http://192.168.1.10:7187/api/anon/graphCaptcha/get.do?specs=2'
	}
};

axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

const REQ_headers = {
	'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
	'X-Requested-With': 'XMLHttpRequest',
};

/**
 * 判断返回的值是否为203，如果为true，则跳转到 #/login
 * @param state
 * @param msg
 */
function redirectUrl(state, msg) {
	if (state === 203 || state === 206) {
		if (window.KuaiBiAnd) {
			window.KuaiBiAnd.disconnectServer();
		}
		util.ck.remove(['_KBTK', '_KBMB']);
		window.location.href = '#/sign?type=gotoIndex';
	}
}


/**
 * GET请求，请求类型：表单格式
 * @param url
 * @param params
 * @returns {Promise}
 */
function fetchGET(url, params) {
	return new Promise((resolve, reject) => {

		if (url.indexOf('getVerifyCode') > 0) {
			params = Object.assign(params, {clientSource: util.getClientType()});
		}

		axios.get(url, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest',
			},
			params: params
		})
		.then(response => {
			resolve(response.data);
		}, err => {
			reject({err: err, txt: '网络出错！'});
		})
		.catch((error) => {
			reject({err: error, txt: '网络出错！'});
		});
	});
}

/**
 * GET请求，请求类型：表单格式，token
 * @param url
 * @param params
 * @returns {Promise}
 */
function fetchGET_TK(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			headers: {
				'token': util.getToken(),
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest',
			},
			params: params
		})
		.then(response => {
			redirectUrl(response.data.code, response.data.msg);
			resolve(response.data);
		}, err => {
			reject(err);
		})
		.catch((error) => {
			reject(error);
		});
	});
}

/**
 * POST请求，请求类型：表单格式
 * @param url
 * @param params
 * @returns {Promise}
 */
function fetchPOST(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest'
			}
		})
		.then(response => {
			resolve(response.data);
		}, err => {
			reject({err: err, txt: '网络出错！'});
		})
		.catch((error) => {
			reject({err: error, txt: '网络出错！'});
		});
	});
}

/**
 * POST请求，请求类型：表单格式，token
 * @param url
 * @param params
 * @returns {Promise}
 */
// 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//   'X-Requested-With': 'XMLHttpRequest',
function fetchPOST_TK(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, params, {
			headers: {
				'token': util.getToken(),
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest'
			}
		})
		.then(response => {
			redirectUrl(response.data.code, response.data.msg);
			resolve(response.data);
		}, err => {
			reject({err: err, txt: '网络出错！'});
		})
		.catch((error) => {
			reject({err: error, txt: '网络出错！'});
		});
	});
}

/**
 * POST请求，请求类型：JSON格式，token
 * @param url
 * @param params
 * @returns {Promise}
 */
function fetchPOSTJSON_TK(url, params) {
	REQ_headers['Content-Type'] = 'application/json';
	return new Promise((resolve, reject) => {
		axios.post(url, params,
			{
				headers: {
					'token': user.tk, ...REQ_headers
				}
			})
		.then(response => {
			redirectUrl(response.data.code, response.data.msg);
			resolve(response.data);
		}, err => {
			reject(err);
		})
		.catch((error) => {
			reject(error);
		});
	});
}

/**
 * 虚贝POST请求：表单格式
 * @param url
 * @param params
 * @returns {Promise<any>}
 */
function fetchPOST_XUBEI(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, params, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest',
			}
		})
		.then(response => {
			resolve(response.data);
		}, err => {
			reject(err);
		})
		.catch((error) => {
			reject(error);
		});
	});
}

/**
 * api类型
 * @type {[string,string,string,string,string,string,string,string,string,string,string,string,string,string,string]}
 */
const API_TYPE = ['game', 'user', 'order', 'partner', 'shop', 'trace', 'wxUser',
	'recharge', 'withdraw', 'setting', 'waiter', 'account', 'goods',
	'common', 'paytype', 'wxUserMessage', 'userStatement', 'product', 'sms', 'accountStatement', 'bankCard', 'luckyDraw', 'ticketRecord', 'product', 'userRewardRecord', 'advise', 'rechargeTemplate', 'payType', 'websiteIndex', 'userCandyStatement', 'candyInfo', 'cookie', 'telegramInfo'];


export const api_type = {};

/**
 * 返回api的类型：key/path.do
 * @returns {{}}
 */
function getApiType() {
	API_TYPE.forEach((key, index) => {
		api_type[key] = (path) => {
			return `${key}/${path}.do`;
		};
	});
	return api_type;
}

/**
 * 导出匿名接口异步请求模块
 * @type {{commonGET: (function(*, *=)), post: (function(*, *=))}}
 */
export const httpAnon = {
	get: (apiType, params = '') => {
		return fetchGET(`${CONFIG.api.url}anon/${apiType}`, params);
	},
	post: (apiType, params = '') => {
		return fetchPOST(`${CONFIG.api.url}anon/${apiType}`, params);
	},
	getPrice: (params = '') => {
		return fetchGET(`${CONFIG.api.url}anon/game/getDivisionPrice.do`, params);
	},
	post_xb: (apiType, params = '') => {
		return fetchPOST_XUBEI(`${CONFIG.api.xubei}goods/${apiType}`, params);
	},
	postJSON: (apiType, params = '') => {
		return fetchPOSTJSON_TK(`${CONFIG.api.url}anon/${apiType}`, params);
	},
	add: (params) => {
		return fetchPOST(`${CONFIG.api.url}anon/trace/add.do`, params);
	}
};

/**
 * 导出用户登录后异步请求模块
 * @type {{get: (function(*, *=)), post: (function(*, *=)), postJSON: (function(*, *=)), commonPOST: (function(*, *=))}}
 */
export const httpUser = {
	get: (apiType, params = '') => {
		return fetchGET_TK(`${CONFIG.api.url}${apiType}`, params);
	},
	post: (apiType, params = '') => {
		return fetchPOST_TK(`${CONFIG.api.url}${apiType}`, params);
	},
	postJSON: (apiType, params = '') => {
		return fetchPOSTJSON_TK(`${CONFIG.api.url}${apiType}`, params);
	},
};


(function () {
	getApiType();
})();
