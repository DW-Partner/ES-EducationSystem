/**
 * Copyright (c) 
 * @fileoverview cvsDataHandle
 * @author  weijialu
 * @version 1.1 | 2017-09-26
 * @param
 * @example
 */
    let cvsDataHandle = (param) => {
        let options = {
            input: '.inputFile',//
            lineStart: 1,
            keys: [],
            handle: ()=>{},
            callback: ()=>{}
        };
        options = $.extend( options, param );
        let error_line = [];
        let check = (index)=>{
            error_line.push( index+1 );
            return undefined;
        }

        var file_dom = $( options.input );
        let files = file_dom[ 0 ].files;
        if( typeof(FileReader) !== 'undefined' ){    //H5
            var reader = new FileReader();
            reader.readAsText( files[0] );            //以文本格式读取
            reader.onload = function(evt){
                var data = evt.target.result;        //读到的数据
                console.log(data);

                const line_split = data.split('\n');
                const line_num = data.split('\n').length;

                let data_arr = []
                line_split.map(function(item, index){
                    if( index >= options.lineStart ){
                        let item_arr = item.split( ',' );
                        let item_obj = {};
                        options.keys.map(function(key, i){
                            item_obj[ key ] = item_arr[ i ] || check(index);
                        })
                        data_arr.push( item_obj );
                    }

                })
                if( error_line.length ){
                    $.dialogFull.Alert("第" + error_line.join('、') + '行数据有误，请编辑后重新操作');
                    return;
                }

                console.log( data_arr )

                options.handle(data_arr);
                $.dialogFull.Tips("操作成功！");
                // $( options.input ).clone().after( $( options.input ) );
                file_dom.after( file_dom.clone().val("") );
                file_dom.remove();

            }
        }else{
            $.dialogFull.Alert("IE9及以下浏览器不支持，请使用Chrome或Firefox浏览器");
            return;
        }
        // return data;
    }
    export default cvsDataHandle;
