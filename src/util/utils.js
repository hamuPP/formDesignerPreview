/**
 * Created by tangyue on 21/1/27
 */
export const generate1to24 = (min =1, max =24) => {
  let list = [];
  for (var i = min, len = max; i <= len; i++) {
    list.push({
      label: i,
      value: i,
    })
  }
  return list;
};

// 下载文件到本地
export const downloadLocalFile = (filename, reqData, fileContentType)=>{
  if (window.Blob && navigator.msSaveOrOpenBlob) {
    try {
      let blob = new Blob([reqData], { type: fileContentType });
      navigator.msSaveOrOpenBlob(blob, filename);
    } catch (e) {
      console.log("e", e);
    }
  } else {
    try {

      var a = document.createElement("a");
      var useDownload = (navigator.userAgent == null || navigator.userAgent.indexOf("PaleMoon/") < 0) && typeof a.download !== "undefined";
      // 目前只能用谷歌下载
      a.href = URL.createObjectURL(
        new Blob([reqData], { type: fileContentType })
      );
      a.download = filename;

      document.body.appendChild(a);
      try {
        window.setTimeout(function () {
          URL.revokeObjectURL(a.href);
        }, 0);

        a.click();
        a.parentNode.removeChild(a);
      } catch (e) {
        // ignore
      }

    } catch (e) {
      console.log(e);
    }
  }
};
