/*
 * @Author: your name
 * @Date: 2020-08-17 16:27:34
 * @LastEditTime: 2020-08-26 11:08:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \亿阳git\mss-product-workflow-vue\src\api\commonUrl.js
 */

/**
 *  基础路径，优先使用在config.js中配置的路径，若没有，此处会重新赋值
 * @type {string}
 */
export let baseUrl = window.g && window.g.baseUrl ? window.g.baseUrl : 'http://192.168.12.118:8080';
// export let baseUrl='http://192.168.12.104:8080'

