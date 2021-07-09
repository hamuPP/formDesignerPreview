# 2021年7月9日15:27:54
把el-form 上的    :disabled="view"去掉，改为在form-item单独设置是否disable。
因为在form上设置disable后，表单内的所有输入组件都会被禁用，包括我的分页组件里的输入框