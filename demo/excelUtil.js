/** 
 * @param { string } filename下载的文件名
 * @param { array } [datas]处理的数据
 * @param { string } reg换行匹配字符
 * @param { array } [colfield]传入表头数组
 * @return { null }
 * 兼容ie10及以上主流浏览器
*/
function outputExcel(filename, datas, reg, colfield)  {
	var dataStr = '';
	var regs = reg || Object.keys(datas[0])[Object.keys(datas[0]).length - 1];
	for (var i = 0, len = datas.length; i < len; i++) {
		var item = datas[i];
		if (i == 0) {
			if (colfield) {
				dataStr += colfield.join(',')+",\r\n";
			}else{
				for (var key in item) {
					if (key === regs) dataStr += key+",\r\n";
					else dataStr += key+",";
				}
			}
		}
		for (var key in item) {
			if (key === regs) dataStr += item[key]+",\r\n";
			else dataStr += item[key]+",";
		}
	}
	// Excel默认并不是以UTF-8来打开文件，所以在csv开头加入BOM，告诉Excel文件使用utf-8的编码方式。
	var BOM = "\uFEFF";
	//使用Blob对象可以避免csv字符串太大时下载csv会导致浏览器崩溃
	var csvData = new Blob([BOM + dataStr], { type: 'text/csv' });
	if (window.ActiveXObject || "ActiveXObject" in window) {
		// ie
		navigator.msSaveBlob(csvData, filename);
	}else{
		// Firefox、Chrome、Safari浏览器中使用a标签，利用html5中增加的download属性来下载csv
		var a = document.createElement('a');
		// objectURL = URL.createObjectURL(blob || file);
		// Blob对象,就是二进制数据,比如通过new Blob()创建的对象就是Blob对象.又比如,在XMLHttpRequest里,如果指定responseType为blob,那么得到的返回值也是一个blob对象.
		var objectURL = URL.createObjectURL(csvData);
		a.href = objectURL;
		a.download = filename;
		document.body.appendChild(a);
		if(navigator.userAgent.indexOf("safari")>-1){
			//Safari中并不支持除了input外的元素直接调用click方法，所以利用自定义事件
			var click_ev = document.createEvent("MouseEvents");
			click_ev.initEvent("click", true, true );
			a.dispatchEvent(click_ev);
		} else {
			a.click();
		}
		// 移除a标签
		document.body.removeChild(a);
		//释放对象URL
		URL.revokeObjectURL(objectURL);
	}
}
