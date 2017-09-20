// PLUGIN_NAME: sample
var PLUGIN_NAME = 'sample';

var through = require('through-gulp');
var fs = require("fs");
var http = require("http");
var request = require("request");
var path = require("path");
var source = require('vinyl-source-stream'); //常规流转换为gulp支持的Vinyl文件格式
var gutil = require('gulp-util');
//gulp多功能的插件，可以替换扩展名，log颜色日志，模板

var chalk = require('chalk'); //设置颜色
chalk.blue('Hello world!');

/**
 * 用户列表返回数据实体
 * @BaseResponse
 * @param {number} id 标识符
 * @param {number} index 序列号
 * @param {string} userName 用户名
 * @param {string} phoneNumber 手机号
 * @param {boolean} isEnabled 是否启用
 * @param {Array<string>} roles 权限数组
 */

/**
 * 获取用户列表
 * @constructor
 * @method get
 * @function [<getList>]
 * @param {string} userName 用户名
 * @param {string} phoneNumber 手机号
 * @param {boolean} isEnabled 是否启用
 * @param {string} userGroupId 用户组编号
 */


//日志
gutil.log('stuff happened', 'Really it did', gutil.colors.magenta('123'));

var i = 0;
//gulp插件原理就是一个流进入，流处理完出来
function sample() {
    //通过through创建流stream
    var stream = through(function(file, encoding, callback) {

        //进程文件判断
        if (file.isNull()) {
            throw "NO Files,Please Check Files!"
        }
        if (file.isBuffer()) {
            //拿到单个文件buffer
            var content = file.contents.toString("utf-8");
            //console.log(contents);
            // file.contents = new Buffer(content, "utf-8");
            //可以通过buffer.toString("utf-8")转换成字符串
            //contents = file.contents.toString("utf-8")
            var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g, // 正则表达式  
                str = content; // 欲处理的文本
            //console.log(str); // 打印出：原文本
            console.log(str.match(reg)); // 打印出：匹配子串
            // str.replace(reg, function(word) { // 去除注释后的文本
            //     return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
            // });
        }
        //stream流是不能操作的,可以通过fs.readFileSync
        if (file.isStream()) {
            //同步读取
            var content = fs.readFileSync(file.path).toString("utf-8");
            file.contents = new Buffer(content, "utf-8");

        }
        // just pipe data next, or just do nothing to process file later in flushFunction
        // never forget callback to indicate that the file has been processed.
        this.push(file);
        callback();
        i++;
    }, function(callback) {
        // just pipe data next, just callback to indicate that the stream's over
        // this.push();
        gutil.log(gutil.colors.red(i), gutil.colors.green("已经处理完毕！"));
        callback();
    });
    //返回这个流文件
    return stream;
};
// exporting the plugin
module.exports = sample;