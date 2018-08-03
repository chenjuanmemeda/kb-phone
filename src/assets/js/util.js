import Cookie from 'js-cookie';
import Decimal from 'decimal.js';

let ua = window.navigator.userAgent.toLowerCase();

export const ckName = {
	tk: 'KBTK',
	userName: 'KBUSERNAME'
};

(function () {
	let ua = window.navigator.userAgent.toLowerCase();
	if (ua.indexOf('iphone') >= 0) {
		Cookie.set('CLIENTTYPE', 3);
	} else if (ua.indexOf('android') >= 0) {
		Cookie.set('CLIENTTYPE', 2);
	}
})();

export default class util {

	static getClientType = (() => {
		if (ua.indexOf('iphone') > 0) return 5;
		if (ua.indexOf('android') > 0) return 5;
		if (ua.indexOf('micromessenger') > 0) return 6;
	});

	static ck = (() => {
		return {
			set: (name, key) => {
				Cookie.set(name, key);
				return;
			},
			get: (name) => {
				return Cookie.get(name);
			},
			remove: (name) => {
				if (name === 'string') return Cookie.remove(name);
				name.forEach((item) => Cookie.remove(item));
			}
		};
	})();

	static getToken = (() => {
		return Cookie.get('_KBTK');
	});

	static getMobile = (() => {
		return Cookie.get('_KBMB');
	});

	/**
	 * 获取用户信息
	 * @returns {{}}
	 */
	static getUser = () => {
		var user = {};
		user.tk = Cookie.get(ckName.tk);
		user.userName = Cookie.get(ckName.userName);
		return user;
	};

	/**
	 * post表单请求，object类型转换为字符串
	 * @param obj
	 * @returns {string}
	 */
	static queryString = (obj) => {
		var context = '';
		for (var i in obj) {
			if (obj[i]) context += `&${i}=${obj[i]}`;
		}
		return context.replace(/&/, '');
	};

	static IsNaN = (value) => {
		console.log(value);
		if (!isNaN(value)) {
			return value;
		} else {
			return;
		}
	};

	/**
	 * 转换为元
	 * @param value
	 * @returns {number}
	 */
	static divide = (value) => {
		if (!value) return 0;
		return new Decimal(value).div('100').toString();
	};


	/**
	 * 转换为分
	 * @param value
	 * @returns {number}
	 */
	static mul = (value) => {
		if (!value) return 0;
		return new Decimal(value).mul('100').toString();
	};

	/**
	 * 秒转换为小时
	 * @param value
	 * @returns {number}
	 * @constructor
	 */
	static DateDivide = (value) => {
		return new Decimal(value).div('3600').toString();
	};

	static DateMultiply = (value) => {
		return new Decimal(value).mul('3600').toString();
	};

	/**
	 * 对象转换为json对象，移除set/get劫持留下的属性
	 * @param obj
	 * @constructor
	 */
	static JSONround = (obj) => {
		return JSON.parse(JSON.stringify(obj));
	};

	/**
	 * 数组去重
	 * @param arr
	 * @returns {Array}
	 */
	static equal = (arr) => {
		var ARR = [];
		var json = {};
		for (var i = 0; i < arr.length; i++) {
			if (!json[arr[i]]) {
				ARR.push(arr[i]);
				json[i] = 1;
			}
		}
		return ARR;
	};

	/**
	 * 获取url查询字符串
	 * @param name
	 * @returns {null}
	 */
	static getUrlParam = (name) => {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	};

	static browserType = () => {
		let browser = window.navigator.userAgent.toLowerCase();
		// console.log(browser);
		if (/micromessenger/i.test(browser)) {
			return true;
		} else {
			return false;
		}
	};

	static wechatVersion = () => {
		var ua = window.navigator.userAgent.toLowerCase();
		var reg = /MicroMessenger\/[5-9]/i;
		return reg.test(ua);
	};

	static getRect(el) {
		return {
			top: el.offsetTop,
			left: el.offsetLeft,
			width: el.offsetWidth,
			height: el.offsetHeight
		};
	};

	static titDemo = (id) => {
		let text = '';
		switch (parseInt(id)) {
			case 7:
				return text = '单双组排';
			case 8:
				return text = '灵活组排';
			case 9:
				return text = '定位赛';
			case 10:
				return text = '等级';
			case 11:
				return text = '金币';
			case 12:
				return text = '排位赛';
			case 13:
				return text = '陪玩';
			case 14:
				return text = '排位赛';
			case 15:
				return text = '等级';
			case 99:
				return text = '其它';
			default:
				return '';
		}
		return text;
	};

	static regExp = {
		isUserName: (value) => {
			return /[^a-zA-Z\d\w]$/.test(value);
		},
		isMobile: (value) => {
			return /^[1][3,4,5,7,8][0-9]{9}$/.test(value);
		},
		isCaptchaCode: (value) => {
			return /[^a-zA-Z0-9]$/.test(value);
		},
		isQQ: (value) => {
			return (/^[1-9][0-9]{4,10}$/.test(value));
		},
		isPrice: (value) => {
			return /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/.test(value);
		},
		isPic: (value) => {
			return /^.*[^a][^b][^c]\.(?:png|jpg|gif|bmp|jpeg)$/.test(value);
		},
		isHours: (value) => {
			return /^([0-9]{1,9})$/.test(value);
		},
		isEmail: (value) => {
			return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value);
		},
		isPwd: (value) => {
			return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$/.test(value);
		},
		isAccount: (value) => {
			return /^([0-9]{16,19})$/.test(value);
		},
	};

	static Browser = (function () {
		let ua = window.navigator.userAgent.toLowerCase();

		return {
			isAndroid: ua.indexOf('android') >= 0 || false,
			isIOS: ua.indexOf('iphone') >= 0 || false
		};
	})();
}

export function oneOf(value, validList) {
	for (let i = 0; i < validList.length; i++) {
		if (value === validList[i]) {
			return true;
		}
	}
	return false;
}




