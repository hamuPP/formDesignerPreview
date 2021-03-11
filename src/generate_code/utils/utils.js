/**
 * Created by tangyue on 21/3/10
 */
const text =
`
 // 获取元素需要滚动至的上距离
  export const getElementTopDistance = (ele) =>{
      let rec = ele.getBoundingClientRect();
      // 如果找不到，就当是0。因为这个方法原本是给业务中心用的，业务中心有个header-nav的头
      let totalHeaderHeight = 0;
      try{
          let eleHeader = document.getElementsByClassName('header-nav')[0];
          let eleHeaderMenu = document.getElementsByClassName('header-menu')[0];
          let eleHeaderRec = eleHeader.getBoundingClientRect();
          let eleHeaderMenuRec = eleHeaderMenu.getBoundingClientRect();
          totalHeaderHeight = (eleHeaderRec.height || 0) + (eleHeaderMenuRec.height || 0);
      }catch(e){
          totalHeaderHeight = 0;
      }
    
      let footerHeight = 100;// 大概的一个值，比footer+悬浮操作栏还要高一些
      let isElementVisible = (
        rec.top >= totalHeaderHeight &&
        rec.left >= 0 &&
        rec.bottom <= ((window.innerHeight || document.documentElement.clientHeight) - footerHeight) &&
        rec.right <= (window.innerWidth || document.documentElement.clientWidth)
      );//元素是否在可见区域内，可见的就不用滚了
      if(isElementVisible){return 0}
      else {
        var pa = ele.parentElement.parentElement.parentElement;
        var row = ele.parentElement.parentElement;
        var childrens = pa.children;
        let dis = 0;
        for(var i = 0,len = childrens.length;i<len;i++){
          let child = childrens[i];
          dis += child.offsetHeight;
          if(child === row){
            break;
          }
        }
        console.log('dis', dis)
        return dis;
      }
  };
`;

export default text;
