const text =
`
const openLoading = (opt)=>{
    let {scope, target} = opt;
    let customClass;
    scope.loadingInstance={};
    //需要加多个loading的情况
    if(target.constructor==Array){
    customClass = 'sap-loading1';
      for(let i=0;i<target.length;i++){
          scope.loadingInstance[target[i]]= scope.$loading({
          lock: true,
          target: target[i],
          customClass: customClass,
          spinner: 'el-icon-loading',
        });
      }
    }else{
     //只加一个loading
    scope.loadingInstance[0]= scope.$loading({
      customClass : 'sap-loading2',
      lock: true,
      target: target,
      spinner: 'el-icon-loading',
    });
   }
  };
  
     /**
   * 与打开全屏或者局部loading的方法相对应，关闭loading
   * @param {obj}  target:对象可以是string(单个)、arr（多个）;
   */
  const closeLoading = (opt)=>{
      let {scope, target} = opt;
      if(scope.loadingInstance){
        if(scope.loadingInstance[0]){
          scope.loadingInstance[0].close()
        }
        else if(target.constructor==Array){
          for(let i=0;i<target.length;i++){
            if(scope.loadingInstance){
              scope.loadingInstance[target[i]].close();
            }
          }
        }
        else{
          scope.loadingInstance[target].close();
        }
      }
    };
  
    export {
      openLoading,
      closeLoading,
  }
`;

export default text;
