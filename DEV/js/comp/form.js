/**
 * Copyright (c) 2011 - 2015,social-touch Inc. All rights reserved.
 * @fileoverview  表单验证、提交插件
 * @author  weijialu
 * @version 1.1 | 2017-09-26
 * @param
 * @example
 */
import validate from '../kit/validate.js';
let form = {
    get: (opts)=>{
        let options = {
            item: '.pub_form [data-validate]',//表单项dom
            key_validate: 'validate',//验证项dom
            key_must: 'must',//必填项dom
            handle: (opt)=>{
                opt.that.addClass('error');
                alert(opt.text);
            },
            error_text: false,//存放错误文案的属性名
            get_empty: true,//是否获取未填写项数据
        };
        options = $.extend(options, opts);
        const $ele = $( options.item );
        const len = $ele.length;
        let sub_data = {};
        for( let i=0; i<len; i++ ){
            const that = $ele.eq( i );
            const type = that.data( options.key_validate );
            const must = that.data( options.key_must );
            const value = that.val();
            const opts = {
                that: that,
                type: type,
                text: options.error_text ? that.attr( options.error_text ) : ''
            }
            const result = validate[ type ]( value, options.handle, opts, must );
            if( !result ){
                return;
            }
            if( value || options.get_empty ){
                const key = that.attr('name');
                sub_data[ key ] = value;
            }
        }
        return sub_data;
    },
    submit: (opts)=>{
        let options = {
            type: 'post',
            url: '#',
            dataType: 'json',
            data: {},
            success: ()=>{},
            error: ()=>{}
        };
        options = $.extend(options, opts);
        $.ajax({
            type: options.type,
            url: options.url,
            dataType: options.dataType,
            data: options.data,
            success: (msg)=>{
                 options.success(msg);
            },
            error: ()=>{
                options.error();
            }
        })
    }
}
export default form;
