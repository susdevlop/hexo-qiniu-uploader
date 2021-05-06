'use strict';
global.hexo = hexo;
// var log = hexo.log;
console.log('-------开始-------')
if (!hexo.config.cdn || !hexo.config.cdn.enable) {
    return;
}

if (hexo.config.cdn.img_url === undefined) {
    hexo.config.cdn.img_url = hexo.config.cdn.url;
} else if (
    hexo.config.cdn.img_url.indexOf("http") !== 0 &&
    hexo.config.cdn.img_url.indexOf("//") !== 0
) {
    hexo.config.cdn.img_url = hexo.config.cdn.url + hexo.config.cdn.img_url ;
}

if (hexo.config.cdn.onlypost) {
    hexo.extend.filter.register('after_post_render', require('./lib/process').processPost);
}
else {
    hexo.extend.filter.register('after_render:html', require('./lib/process').processSite);
    hexo.extend.filter.register('after_render:css', require('./lib/process').processSheet);
}
hexo.extend.deployer.register('upload', function(){
    console.log('开始上传静态文件到七牛云');
    require('./lib/uploader').upload()
});