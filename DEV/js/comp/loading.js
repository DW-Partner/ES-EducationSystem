/**
 * Copyright (c) 
 * @fileoverview loading
 * @author  weijialu
 * @version 1.1 | 2017-09-26
 * @param
 * @example
 */
    let loading = (param) => {
        let options = {
            element: $('.dom'),
            times: 1500,
            handClose: false,
            setClose: false,
        };
        options = $.extend( options, param );
        const status = options.element.data( 'loading' );
        if( options.setClose ){
            options.element.data('loading', '');
            return;
        }
        if( !status ){
            options.element.data('loading', '1');
            !options.handClose && setTimeout(function(){
                options.element.data('loading', '');
            },options.times);
        }
        return status;
    }
    export default loading;