<template>
    <div class="userInfo-wrap">
        <header-tit :title="'个人资料'"></header-tit>
        <div class="form-control" style="padding: 12px 0">
            <p class="avatar-wrap">
                <img :src="userInfo.userImageUrl" alt="" width="50" height="50" @error="imgErr">
            </p>

            <Upload :action="uploadUrl" name="files" id="uploadAvatar"
                    :on-success="handleSuccess"
                    :before-upload="handleBeforeUpload"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    class="upload-block">
                修改头像
                <!--<span class="upload-mask" v-if="!headImgLoading && passObj.imgs.length < 4"><i class="ion ion-plus-round"></i></span>-->
            </Upload>
            <i class="cubeic-arrow"></i>
        </div>
        <div class="form-control">
            <label class="lab">用户名</label>
            <p class="info">{{userInfo.loginName}}</p>
            <input type="text" v-model="loginName" v-if="!userInfo.loginName" placeholder="请输入6-15位非纯数字的用户名"
                   style="width: 72%"/>
        </div>
        <div class="form-control">
            <label class="lab">昵称</label>
            <input type="text" v-model="userInfo.userName" placeholder="请输入2-12位长度的昵称" style="width: 72%"/>
        </div>
        <div class="form-control" style="display: flex">
            <label class="lab">性别</label>
            <!---->
            <label class="radio" for="man" v-if="!userInfo.sex">
                <input type="radio" id="man" name="sex" value="1" v-model="selected">
                <span>男</span>
            </label>
            <label class="radio" for="lady" v-if="!userInfo.sex">
                <input type="radio" id="lady" name="sex" value="2" v-model="selected">
                <span>女</span>
            </label>
            <!--<cube-radio-group v-model="selected" :options="options" :horizontal="true"-->
            <!--style="width: 72%"/>-->
            <p class="info" style="line-height: 50px;"
               v-if="userInfo.sex !== 0 && userInfo.sexText">
                {{userInfo.sexText}}
            </p>
        </div>
        <div class="btn-wrap">
            <cube-button @click="save">保存</cube-button>
        </div>

        <successPage v-model="isSuccess" :path="'/userCenter'">
            <p>修改成功</p>
        </successPage>
    </div>
</template>

<script type="text/ecmascript-6">
	import {httpUser, api_type, CONFIG} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';
	import successPage from '../../components/common/successPage';
	import Upload from '../../components/common/upload/upload';

	let defaultAvatar = require('../../assets/img/avatar-default.png');

	export default {
		data() {
			return {
				loginName: '',
				uploadUrl: CONFIG.api.img,
				headImgLoading: false,
				isSuccess: false,
				selected: 2,
				options: [
					{
						label: '男',
						value: '1'
					},
					{
						label: '女',
						value: '2'
					}
				],
				userInfo: {},
				avatarUrl: '',

			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),

			imgErr(err) {
				if (err) this.userInfo.userImageUrl = defaultAvatar;
			},
			// 获取用户信息
			getDetail() {
				this.SET_GLOBALSTATE({type: 'loading'});

				httpUser.get(api_type.user('getDetail'))
				.then(data => {
					if (data.code === 200) {
						this.userInfo = data.data;
						// this.selected = this.userInfo.sexText;
						if (!data.data.userImageUrl) this.userInfo.userImageUrl = defaultAvatar;

					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}

					this.SET_GLOBALSTATE({type: 'done'});
				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			},
			//保存修改
			save() {

				let query = {
					userId: this.userInfo.userId,
					loginName: this.userInfo.loginName || this.loginName,
					sex: (this.userInfo.sex == 0) ? this.selected : this.userInfo.sex,
					userName: this.userInfo.userName,
					userImageUrl: this.userInfo.userImageUrl
				};

				if (query.userName.length < 2 || query.userName.length > 12) return this.SET_GLOBALSTATE({
					type: 'error',
					txt: '请输入2-12为长度的昵称'
				});

				if (this.userInfo.userImageUrl == defaultAvatar) {
					query.userImageUrl = '';
				}


				this.SET_GLOBALSTATE({type: 'loading'});

				httpUser.post(api_type.user('editDetail'), util.queryString(query))
				.then(data => {
					if (data.code === 200) {
						// this.isSuccess = true;
						setTimeout(() => {
							this.$router.push('/userCenter');
						}, 1000);
						return this.SET_GLOBALSTATE({type: 'correct', txt: '修改成功'});

					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}
					return this.SET_GLOBALSTATE({type: 'done'});
				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			},
			handleBeforeUpload() {
				this.headImgLoading = true;
			},
			handleSuccess(res) {
				if (res.code !== 200) {
					this.headImgLoading = false;
					return this.SET_GLOBALSTATE({type: 'error', txt: res.msg});
				} else {
					this.headImgLoading = false;
					this.userInfo.userImageUrl = res.data[0];
				}
			},
		},
		mounted() {
			this.getDetail();
		},
		components: {
			successPage, Upload
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>

    .userInfo-wrap
        background-color: #f9f8f6
        min-height 100vh

    .form-control
        position relative
        width 8.5rem
        margin 0 auto 8px
        border-bottom 1px solid #eee
        .avatar-wrap
            display inline-block
            border-radius 999px
            width 50px
            height 50px
            overflow hidden
            margin-right: 15px
            vertical-align: middle
        .info
            display inline-block
            font-size: 14px
            color: #999
        .lab
            display inline-block
            font-size: 14px
            width 60px
            color: #999
            line-height 50px
            vertical-align: middle
        input
            padding 0
            line-height 50px
            background-color: #f9f8f6
            outline none
            border 0
            font-size: 14px
        .cubeic-arrow
            float: right
            line-height 50px
            color: #aaa
            font-size: 14px

    .btn-wrap
        margin 60px auto 0
        width 6rem

    .cube-radio-group
        display inline-block
        font-size: 14px
        background-color: transparent
        .cube-radio.border-right-1px:after
            display none

    .cube-radio-group[data-horz="true"]::after
        display none

    #uploadAvatar
        display inline-block
        line-height 48px
        width 6rem
        font-size: 14px
        color: #999

    .cube-radio_selected
        display inline-block !important
        vertical-align: top

    .radio
        font-size: 14px
        line-height 50px
        width 60px
        input
            vertical-align: middle
        span
            vertical-align: middle
            line-height 46px


</style>