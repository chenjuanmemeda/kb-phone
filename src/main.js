// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// By default we import all the components.
// Only reserve the components on demand and remove the rest.
// Style is always required.
import {
	/* eslint-disable no-unused-vars */
	Style,
	Button,
	Toolbar,
	CheckboxGroup,
	Radio,
	Input,
	Textarea,
	Select,
	Switch,
	Rate,
	Validator,
	Form,
	Loading,
	Tip,
	Popup,
	Toast,
	Picker,
	CascadePicker,
	DatePicker,
	SegmentPicker,
	TimePicker,
	Dialog,
	ActionSheet,
	Drawer,
	Scroll,
	Slide,
	IndexList,
	Swipe,
	Upload,
} from 'cube-ui';
import App from './App';
import router from './router';
import 'amfe-flexible';
import './assets/css/mixin.styl';
import _ from 'lodash/lodash';
import Vuex from 'vuex';
import {store} from './store/store';
import {filter} from './filter.js';
import VueClipboard from 'vue-clipboard2';
import headerTit from './components/header/header';
import VueCordova from 'vue-cordova';
import console from './vconsole';

// Vue.use(console);
Vue.use(VueClipboard);
Vue.use(Button);
Vue.use(Toolbar);
Vue.use(CheckboxGroup);
Vue.use(Radio);
Vue.use(Input);
Vue.use(Textarea);
Vue.use(Select);
Vue.use(Switch);
Vue.use(Rate);
Vue.use(Validator);
Vue.use(Form);
Vue.use(Loading);
Vue.use(Tip);
Vue.use(Toast);
Vue.use(Picker);
Vue.use(CascadePicker);
Vue.use(DatePicker);
Vue.use(SegmentPicker);
Vue.use(TimePicker);
Vue.use(Dialog);
Vue.use(ActionSheet);
Vue.use(Drawer);
Vue.use(Scroll);
Vue.use(Slide);
Vue.use(IndexList);
Vue.use(Swipe);
Vue.use(Upload);
Vue.use(Popup);
Vue.use(Vuex);
Vue.use(VueCordova, {
	optionTestKey: 'optionTestValue'
});

Vue.config.productionTip = false;
Vue.prototype.$_ = _;
Vue.component('header-tit', headerTit);


filter.map((key, i) => {
	Vue.filter(key.name, key.cb);
});

const mixin = {
	data() {
		return {
			cordova: Vue.cordova
		};
	}
};

/* eslint-disable no-new */
new Vue({
	mixins: [mixin],
	el: '#app',
	router,
	store: new Vuex.Store(store),
	template: '<App/>',
	components: {App},

});
