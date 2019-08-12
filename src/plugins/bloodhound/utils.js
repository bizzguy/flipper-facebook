
export function formatDate(dateString: string): string {
  var formattedDate = dateString.toTimeString().split(' ')[0] + '.' + pad(dateString.getMilliseconds(), 3)
  return formattedDate;
}

export function getPageName(textString: string): string {
  //const messageAnd = "ADBMobile Debug : Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Foot%20Locker%203.8.0.debug%20%284007212%29&RunMode=Application&OSVersion=Android%208.1.0&TimeSinceLaunch=149500&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&logged_in=n&banner=mobileapp.footlocker.com&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=06473502235624536297363351139995300016&pageName=fl%3Am%3Alog_in&cp=foreground&aamlh=7)"
  var trimmedString = trimStartEndChars(textString)
  console.log('*' + textString + '*')
  console.log('*' + trimmedString + '*')
  var decodedTrimmedString = decodeURIComponent(trimmedString);
  var params = decodedTrimmedString.split("&");
  let found = params.find(element => element.includes("pageName"));
  if (typeof(found) == "undefined") {
    return "* pageName not found"
  }
  let param = found.split("=")
  let paramValue = param[1];
  return paramValue;
}

export function trimStartEndChars(textString: string): string {
  // Android Format
  var trimmedString = textString.replace('ADBMobile Debug : Analytics - Request Queued (','');
  // iOS Format
  trimmedString = trimmedString.replace('ADBMobile Debug: Analytics - Request Queued (','');

  trimmedString = trimmedString.substr(0, trimmedString.length - 1);
  return trimmedString;
}

export function getEntryType(message: string): string {
  if (message.match('&internalaction=Lifecycle')) return 'lifecycle'
  if (message.match('&action=')) return 'action'
  return 'other';
}

export function pad(chunk: mixed, len: number): string {
  let str = String(chunk);
  while (str.length < len) {
    str = `0${str}`;
  }
  return str;
}