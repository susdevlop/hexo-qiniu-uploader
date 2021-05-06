# hexo-qiniu-uploader
A Hexo plugin for uploading assets to CDN

[![Latest Stable Version](https://img.shields.io/npm/v/hexo-qiniu-uploader.svg)](https://www.npmjs.com/package/hexo-qiniu-uploader)
[![NPM Downloads](https://img.shields.io/npm/dm/hexo-qiniu-uploader.svg)](https://npmjs.org/package/hexo-qiniu-uploader)
[![GitHub stars](https://img.shields.io/github/stars/susdevlop/hexo-qiniu-uploader?style=social&label=Star)](https://github.com/susdevlop/hexo-qiniu-uploader)

## 简介

这是一个可以帮你把所有图片上传到cdn的[hexo](https://github.com/tommy351/hexo)插件。

**此插件不需要关注图片、js、css以什么的方式引用，正确引用的图片、js、css都会可被上传到cdn中。原理是替换所有生成的资源引用，并把引用的资源上传到七牛云**

**项目作者：[Sushome](https://sushome.us)**  
**代码贡献:**
- [zhepama](https://github.com/zhepama)
- [gyk001](https://github.com/gyk001)
- [Bob Liu](https://github.com/MatrixHero)
- [Jinchun Xia](https://github.com/xiajinchun)
- [MatrixHero](https://github.com/MatrixHero)
- [binsee](https://github.com/binsee)
- [javy-liu](https://github.com/javy-liu)
- [k1988](https://github.com/k1988)
- [robinshen](https://github.com/robinshen)
- [楼教主](https://github.com/52cik)

## 安装

在你的hexo主目录下运行以下命令进行安装：

```
npm install hexo-qiniu-uploader --save
```

添加插件配置信息到 ``_config.yml`` 文件中，此插件需要配置三个字段的信息，分别是deplo、cdn、qiniu:

```

deploy:
  type: 'upload'  
cdn:
  enable: true
  onlypost: false
  url: https://static.xxx.cn
  img_url: https://static.xxx.cn
qiniu:
  bucket: 'bundle'
  dirPrefix: 'static'
  secret_file: qn-sec.json
  urlPrefix: 'http://bucket_name.qiniudn.com/static'
  allow_file: 'assets-css-images-js'
  update_exist: true

```

**这里对配置中的几个需要注意的参数进行说明：**

* `deploy` 字段：
```
deploy:
##type: 'upload' 此参数固定
```
* `cdn` 字段：
>enable为是否启用    
>onlypost: false仅替换文章中的图片    
url: https://static.xxx.cn    
img_url: https://static.xxx.cn       
* `qiniu` 字段：
>`urlPrefix` 参数：
>七牛空间地址的前缀，会按默认格式自动生成地址，所以此参数**可省略**。  
默认格式为 `http://bucket_name.qiniudn.com/static` ，如果你的七牛空间使用自定义域名或域名不是此格式的，请配置此参数。  
当你设置了 `dirPrefix` 参数后，如`static`。则此url地址必须加上目录后缀 `/static` ，
即`http://bucket_name.qiniudn.com/static`，否则静态资源将无法访问。   

> `access_key` 参数： 上传密钥AccessKey   
> `secret_key` 参数： 上传密钥SecretKey   
> `secret_file` 参数： 秘钥文件路径，可以将上述两个属性配置到文件内，防止泄露，json格式。绝对路径相对路径均可      


## 使用方法:
```
    hexo clean
    hexo generate
    hexo deploy
```