var defaults = require('./default_qiniu_config');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var log = hexo.log;
var qiniu = require('qiniu');
const getEtag = require("./qetag")
//  region 七牛云配置
// 如果配置独立秘钥文件，则使用文件里的秘钥配置
if(hexo.config.qiniu.secret_file){
    var secPath = path.normalize(path.resolve('', hexo.config.qiniu.secret_file));
    var qnSec=JSON.parse(fs.readFileSync(secPath,'utf-8'))
    if(qnSec.secret_key){
        hexo.config.qiniu.secret_key=qnSec.secret_key;
    }
    if(qnSec.access_key){
        hexo.config.qiniu.access_key=qnSec.access_key;
    }
}
// 七牛的配置组
var config = _.defaults(hexo.config.qiniu,defaults);
log.i('-----------------------------------------------------------');
log.i('allowFile:   ', config.allow_file.split('-'));
log.i('-----------------------------------------------------------');
//endregion
qiniu.conf.ACCESS_KEY = config.access_key;
qiniu.conf.SECRET_KEY = config.secret_key;
if(config.up_host){
    // #  up_host: https://up-z2.qiniup.com
    qiniu.conf.UP_HOST = config.up_host;
}
var bucket = config.bucket;
var allow_file = config.allow_file.split('-') || [];
var update_exist = config.update_exist ? config.update_exist : false;
//构造上传函数
function uploadFile(key, localFile) {
    // log.i(bucket, key, localFile);
    return new Promise((resolve, reject) => {
        var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
        var uptoken = putPolicy.token();
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
            if(!err) {
                // 上传成功， 处理返回值
                log.i('上传成功',ret.hash, ret.key);
                resolve();
            } else {
                // 上传失败， 处理返回代码
                log.e('上传失败',err,ret.key);
                reject();
            }
        });
    })
}

/**
 * 允许上传的文件
 * @param  {String}  path 需要上传的文件路径
 * @return {Boolean}
 */
function isAllowUpload(path){
    if (!allow_file.length) return false;
    return !!(allow_file.filter((n)=>{
        return path.indexOf(`${n}/`)>=0
    }).length)
}

/**
 * 遍历目录进行上传
 */
var sync = function (dir) {
    return new Promise(async resolve=>{
        if (!dir) {
            dir='';
            log.i('Now start qiniu sync.');
        }
        var files = fs.readdirSync(path.join(dir));
        for(let idx in files) {
            var fname = path.join(dir + '', files[idx] + '');
            var stat = fs.lstatSync(fname);
            if(stat.isDirectory() === true) {
                await sync(path.join(dir + '', files[idx] + ''));
            } else  {
                var name = path.join('public/', fname.replace('public/', '')).replace(/\\/g, '/').replace(/^\//g, '');
                if (isAllowUpload(name)) {
                    await check_upload(fname, name)
                }
            }
        }
        resolve();
    })

};
//构建bucketmanager对象
var client = new qiniu.rs.Client();
/**
 * 上传前预先检查
 * file为本地路径(绝对路径或相对路径都可)
 * name为远程文件名
 */
var check_upload = function (file, name) {
    //uploadFile(config.bucket, file.replace(/\\/g, '/'), name);
    //获取文件信息
    return new Promise((resolve, reject) => {
        client.stat(config.bucket, name, async function(err, ret) {
            if (!err) {
                getEtag(file, async function (hash) {
                    if (hash !== ret.hash) {
                        log.i('Need upload update file: ', file);
                        await uploadFile(name, file);
                        resolve();
                    } else {
                        // 不更新已存在的，忽略
                        if (!update_exist) {
                            log.i('ignore file: ',file);
                            reject()
                        } else {
                            await uploadFile(name, file);
                            resolve();
                        }
                    }
                });
            } else {
                console.log('err.code',name+' '+err.code);
                // 文件不存在
                if(err.code === 612 || err.code === 631){
                    log.i('Need upload file: ',file);
                    await uploadFile(name, file);
                    resolve();
                }else{
                    log.e('get file stat err: '+ name + '\n' + err);
                    reject()
                }
            }
        });
    }).catch(new Function());
};
var delFile = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                delFile(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
module.exports.upload = ()=>{
    console.log('正在遍历目录并准备上传');
    return sync.call(this,'public').then(()=>{
        allow_file.forEach(key=>{
            delFile('public/'+key)
        })
        console.log('完成')
    });
}