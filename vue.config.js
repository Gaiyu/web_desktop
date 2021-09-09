module.exports = {
	css: {
		loaderOptions: {
			sass: {
				prependData: `@import "@/scss/index.scss";`
	  		}
		}
	},
	devServer: {
		disableHostCheck: true
	}
}
