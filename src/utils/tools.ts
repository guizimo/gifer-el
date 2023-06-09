/**
 * 将base64转换为blob
 * @param base64
 * @returns {module:buffer.Blob}
 */
export const base64toBlob = (base64: any) => {
  const arr = base64.split(",");
  const type = arr[0].match(/:(.*?);/)[1];
  const str = atob(arr[1]);
  let n = str.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = str.charCodeAt(n);
  }
  return new Blob([u8arr], { type });
};

/**
 * 下载文件
 * @param url
 * @param name
 */
export const downloadFile = (url: string, name = 'test') => {
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", name);
  a.setAttribute("target", "_blank");
  let clickEvent = document.createEvent("MouseEvents");
  clickEvent.initEvent("click", true, true);
  a.dispatchEvent(clickEvent);
}

/**
 * 获取图片的宽高
 * @param blob
 * @param callback
 */
export const getImageSizeFromBlob = (blob: Blob, callback: (size: { width: number, height: number }) => void) => {
  const img = new Image();
  img.onload = function() {
    // @ts-ignore
    callback({width: this.width, height: this.height});
  };
  const reader = new FileReader();
  reader.onloadend = function() {
    img.src = reader.result as string;
  };
  reader.readAsDataURL(blob);
}
