"use strict";

/**
 *
 *
 * @param {*} htmlContent
 * @param {*} rootUrl
 * @returns
 */
function replaceLink(htmlContent, rootUrl) {
    return htmlContent.replace(/<link(.*?)href="(.*?)"(.*?)>/gi, function (
        str,
        p1,
        p2
    ) {
        //如果以http开头的图片则不处理
        if (p2.indexOf("http") === 0) {
            return str;
        }
        //如果以//开头的图片也不处理
        if (p2.indexOf("//") === 0) {
            return str;
        }
        return str.replace(p2, rootUrl + p2 + `?v=${Math.random()}`);
    });
}
/**
 *
 *
 * @param {*} htmlContent
 * @param {*} rootUrl
 * @returns
 */
function replaceJs(htmlContent,rootUrl)
{
    return htmlContent.replace(
        /<script(.*?)src="(.*?)"(.*?)>/gi,
        function (str, p1, p2) {
          //如果以http开头的图片则不处理
          if (p2.indexOf("http") === 0) {
            return str;
          }
          //如果以//开头的图片也不处理
          if (p2.indexOf("//") === 0) {
            return str;
          }
          return str.replace(p2, rootUrl + p2 + `?v=${Math.random()}`);
        }
      );
}
/**
 *
 *
 * @param {*} htmlContent
 * @param {*} rootUrl
 * @returns
 */
function replaceImg(htmlContent,rootUrl)
{
    return htmlContent.replace(/<img\n?(.*?)src="(.*?)"\n?(.*?)>/gi, function (
        str,
        p1,
        p2
      ) {
        //如果是data:格式的则不处理
        if (/src="data:image(.*?)/gi.test(str)) {
          return str;
        }
        //如果以http开头的图片则不处理
        if (p2.indexOf("http") === 0) {
          return str;
        }
        //如果以//开头的图片也不处理
        if (p2.indexOf("//") === 0) {
          return str;
        }
        return str.replace(p2, rootUrl + p2 + `?v=${Math.random()}`);
      });
}
/**
 *
 *
 * @param {*} htmlContent
 * @param {*} rootUrl
 * @returns
 */
function replaceCss(htmlContent,rootUrl)
{
    return htmlContent.replace(
        /url\s*\([\"|']?(.*?)[\"|']?\)/gi,
        function (str, p1, p2) {
            //如果以http开头的图片则不处理
            if (p1.indexOf("http") >= 0) {
                return str;
            }
            //如果以//开头的图片也不处理
            if (p1.indexOf("//") === 0) {
                return str;
            }
            if (p1.indexOf("data:") >= 0){
                return str
            }
            return str.replace(p1, rootUrl + p1 + `?v=${Math.random()}`);
        }
    );
}


function lazyProcess(htmlContent) {
    htmlContent = replaceLink(htmlContent, this.config.cdn.url);
    htmlContent = replaceJs(htmlContent, this.config.cdn.url);
    htmlContent = replaceImg(htmlContent, this.config.cdn.url);
    htmlContent = replaceCss(htmlContent, this.config.cdn.url);
    return htmlContent;
  }

module.exports.processPost = function (data) {
  data.content = lazyProcess.call(this, data.content);
  return data;
};
module.exports.processSite = function (htmlContent) {
  return lazyProcess.call(this, htmlContent);
};
module.exports.processSheet = function (htmlContent) {
    return replaceCss.call(this,htmlContent, this.config.cdn.url)
};