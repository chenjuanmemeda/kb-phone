<template>
    <div class="feed-back">
        <header-tit :title="'意见反馈'"></header-tit>
        <div class="feed-back-content">
            <p>*请填写您遇到的问题或意见建议并留下您的联系方式，我们将为您提供更好的产品和服务。</p>
            <h1 class="advice">意见描述：</h1>
            <div style="display: flex">
                <textarea name="" id="" class="question" placeholder="请填写你的问题或建议" style="flex: 1"
                      v-model="query.content"></textarea>
            </div>
            <div class="form-control">
                <h1 class="advice">联系方式：</h1>
                <input type="text" v-model="query.contactWay" placeholder="请填写你的电话或邮箱">
            </div>
            <h1 class="advice">截图：<span class="file-type">（支持jpg，jpeg，png，gif等图片格式，图片小于5MB）</span></h1>

            <div class="inp-block">

                <Upload :action="uploadUrl" name="files" id="uploadAvatar"
                        :on-success="handleSuccess"
                        :before-upload="handleBeforeUpload"
                        :format="['jpg','jpeg','png']"
                        :multiple="true"
                        :max-size="2048"
                        class="upload-block">
                    <i class="cubeic-add add"></i>
                </Upload>
                <ul class="img-list">
                    <li v-for="(img,$index) of uploadImgArr" @click="removeImg($index)">
                        <img :src="img" alt="" width="56" height="56">
                    </li>
                </ul>
            </div>
        </div>
        <div class="btn-wrap">
            <cube-button @click="advise">提交</cube-button>
        </div>

        <successPage v-model="isSuccess">
            <p>提交成功</p>
        </successPage>
    </div>
</template>

<script type="text/ecmascript-6">
	import {httpAnon, CONFIG, api_type} from '../../assets/js/api';
	import util from '../../assets/js/util';
	import {mapMutations} from 'vuex';
	import Upload from '../common/upload/upload';
	import successPage from '../common/successPage';

	export default {
		name: "feedBack",
		data() {
			return {
				uploadUrl: CONFIG.api.img,
				query: {},
				valid: undefined,
				isSuccess: false,
				telValue: '',
				text: '',
				rules: {
					required: true,
					type: 'string',
					custom: (val) => {
						const result = util.regExp.isMobile(val) || util.regExp.isEmail(val);
						return result;
					}
				},
				messages: {
					custom: '请输入格式正确的手机号码或者邮箱'
				},
				filesName: [],
				headImgLoading: false,
				uploadImgArr: []
			};
		},
		methods: {
			...mapMutations(['SET_GLOBALSTATE']),

			//移除图片
			removeImg(index) {
				this.$createDialog({
					type: 'confirm',
					icon: 'cubeic-alert',
					content: '是否删除该图片？',
					confirmBtn: {
						text: '确定',
						active: true,
						disabled: false,
						href: 'javascript:;'
					},
					cancelBtn: {
						text: '取消',
						active: false,
						disabled: false,
						href: 'javascript:;'
					},
					onConfirm: () => {
						this.uploadImgArr.splice(index, 1);
					}
				}).show();
			},
			advise() {
				this.SET_GLOBALSTATE({type: 'loading'});
				if (this.uploadImgArr.length > 0) this.query.imgs = this.uploadImgArr.join(', ');
				httpAnon.post(api_type.advise('add'), util.queryString(this.query))
				.then(data => {
					if (data.code === 200) {
						// this.isSuccess = true;
						this.query = {};
						this.uploadImgArr = [];

						setTimeout(() => {
							this.$router.push('/');
						}, 1000);

						return this.SET_GLOBALSTATE({type: 'correct', txt: '提交成功'});
					} else {
						return this.SET_GLOBALSTATE({type: 'error', txt: data.msg});
					}

				}).catch(e => this.SET_GLOBALSTATE({type: 'error', txt: e.txt}));
			},
			handleBeforeUpload(e) {
				this.headImgLoading = true;
			},
			handleSuccess(res) {
				if (res.code !== 200) {
					this.headImgLoading = false;
					return this.SET_GLOBALSTATE({type: 'error', txt: res.msg});
				} else {
					this.headImgLoading = false;
					this.uploadImgArr.push(res.data[0]);
				}
			},
		},
		components: {
			Upload, successPage
		},
		deactivated() {
			this.$destroy();
		}
	};
</script>

<style type="text/stylus" lang="stylus" scoped>
    .feed-back
        .feed-back-content
            padding 5px 20.5px
            p
                color #999
                font-size 12px
                line-height 1.5
            h1
                font-size 10px
                color #333
                padding 18.5px 0 10px
                .file-type
                    font-size 12px
                    color #999
                    line-height 1.5
            .question
                width 100%
                height 175px
                border: 1px solid #eeeeee
                border-radius 5px
                padding 8px 0 0 8px
                outline none
                &:focus
                    border: 1px solid #edc95a
            .cube-btn
                width 32%
                margin 35.5px auto 0
            textarea:
            :-webkit-input-placeholder
                color #999
                font-size 10px
                outline none
                border none
                // resize none
                font-size 10px
            textarea:-moz-placeholder
                color #999
                outline none
                border none
                font-size 10px
            // resize none
            textarea:
            :-moz-placeholder
                color #999
                outline none
                border none
                font-size 10px
            // resize none
            textarea:-ms-input-placeholder
                color #999;
                outline none
                border none
                font-size 10px

    .inp-block
        display flex
        padding 8px 0
        height 55px
        text-align center
        .add
            color: #ccc
            line-height 55px
            font-size: 32px
        .lab
            flex 0 0 85px
            font-size: 12px
            align-items center
            line-height 33px
        .upload-block
            position relative
            margin-right 10px
            width 55px
            height 55px
            border 1px solid #eee
            border-radius 5px
            img
                border-radius 5px
            .upload-mask
                position absolute
                top 0
                left 0
                display block
                width 45px
                height 45px
                line-height 45px
                border-radius 5px
                text-align center
                border 1px dashed #aaa
                .ion
                    color: #666
                    font-size: 16px

    .img-list
        font-size: 0
        li
            display inline-block
            overflow hidden
            vertical-align: middle
            margin-right: 10px
            -webkit-border-radius: 5px
            -moz-border-radius: 5px
            border-radius: 5px

    .btn-wrap
        margin 30px auto 0
        width 6rem

    .form-control
        input
            width 100%
            line-height 40px
            padding 0 10px
            font-size: 12px
            border-radius 4px
            border: 1px solid #eee
            box-sizing border-box
            outline none
            &:focus
                border-color #e2bf59

</style>