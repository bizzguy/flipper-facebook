
export function formatDate(dateString: string): string {
  var formattedDate = dateString.toTimeString().split(' ')[0] + '.' + pad(dateString.getMilliseconds(), 3)
  return formattedDate;
}

export function getPageName(textString: string): string {

    try {
        var trimmedString = trimStartEndChars(textString)
        var decodedTrimmedString = decodeURIComponent(trimmedString);
        var params = decodedTrimmedString.split("&");
        let found = params.find(element => element.includes("pageName"));
        if (typeof(found) == "undefined") {
            return "* pageName not found"
        }
        let param = found.split("=")
        let paramValue = param[1];
        return paramValue;
    } catch (err) {
      return "* pageName not parseable"
    }
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

export function getTestDataRow(testDataRowNumber: number): string {
  if (testDataRowNumber == 1) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&OSVersion=Android%208.1.0&action=scAdd&TimeSinceLaunch=358&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&logged_in=y&banner=mobileapp.champssports.com&eVar28=11.5&vip=vip&userid=7a24413fe773f2e6833b2b7ebdd62590&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&pe=lnk_o&pev2=AMACTION%3AscAdd&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=Champs%20Sports%203.7.5.debug%20%284006501%29&cp=foreground&aamlh=9&events=scAdd&products=%3B3238650%3B1%3B35.0)"
  if (testDataRowNumber == 2) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&OSVersion=Android%208.1.0&action=Size_Pressed_Event&TimeSinceLaunch=354&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&eVar36=11.5&logged_in=y&banner=mobileapp.champssports.com&vip=vip&userid=7a24413fe773f2e6833b2b7ebdd62590&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&pe=lnk_o&pev2=AMACTION%3ASize_Pressed_Event&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=Champs%20Sports%203.7.5.debug%20%284006501%29&cp=foreground&aamlh=9)"
  if (testDataRowNumber == 3) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&OSVersion=Android%208.1.0&TimeSinceLaunch=350&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&prop73=3238650&logged_in=y&banner=mobileapp.champssports.com&vip=vip&userid=7a24413fe773f2e6833b2b7ebdd62590&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=cs%3Am%3Apdp&cp=foreground&aamlh=9&events=prodView&products=%3B3238650%3B1%3B35.00)"
  if (testDataRowNumber == 4) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&OSVersion=Android%208.1.0&action=scAdd&TimeSinceLaunch=340&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&logged_in=y&banner=mobileapp.champssports.com&eVar28=12.0&vip=vip&userid=7a24413fe773f2e6833b2b7ebdd62590&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&pe=lnk_o&pev2=AMACTION%3AscAdd&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=Champs%20Sports%203.7.5.debug%20%284006501%29&cp=foreground&aamlh=9&events=scAdd&products=%3B3237410%3B1%3B35.0)"
  if (testDataRowNumber == 5) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&OSVersion=Android%208.1.0&TimeSinceLaunch=335&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&prop73=3237410&logged_in=y&banner=mobileapp.champssports.com&vip=vip&userid=7a24413fe773f2e6833b2b7ebdd62590&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=cs%3Am%3Apdp&cp=foreground&aamlh=9&events=prodView&products=%3B3237410%3B1%3B35.00)"
  if (testDataRowNumber == 6) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&OSVersion=Android%208.1.0&TimeSinceLaunch=334&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&logged_in=y&banner=mobileapp.champssports.com&vip=vip&userid=7a24413fe773f2e6833b2b7ebdd62590&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=cs%3Am%3Acart&cp=foreground&aamlh=9&events=scView&products=%3B3237410%3B1%3B35.0)"
  if (testDataRowNumber == 7) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&OSVersion=Android%208.1.0&TimeSinceLaunch=208&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&logged_in=y&banner=mobileapp.champssports.com&vip=vip&userid=7a24413fe773f2e6833b2b7ebdd62590&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=cs%3Am%3Acheck_out_flow_shipping&cp=foreground&aamlh=9)"
  if (testDataRowNumber == 8) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&OSVersion=Android%208.1.0&action=scCheckout&TimeSinceLaunch=207&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&logged_in=y&banner=mobileapp.champssports.com&vip=vip&userid=7a24413fe773f2e6833b2b7ebdd62590&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&pe=lnk_o&pev2=AMACTION%3AscCheckout&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=Champs%20Sports%203.7.5.debug%20%284006501%29&cp=foreground&aamlh=9)"
  if (testDataRowNumber == 9) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&OSVersion=Android%208.1.0&action=event-sign-in&TimeSinceLaunch=206&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&logged_in=y&banner=mobileapp.champssports.com&userid=7a24413fe773f2e6833b2b7ebdd62590&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&pe=lnk_o&pev2=AMACTION%3Aevent-sign-in&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=Champs%20Sports%203.7.5.debug%20%284006501%29&cp=foreground&aamlh=9)"
  if (testDataRowNumber == 10) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&CarrierName=Android&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&OSVersion=Android%208.1.0&TimeSinceLaunch=192&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&.a&logged_in=n&banner=mobileapp.champssports.com&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=cs%3Am%3Alog_in&cp=foreground&aamlh=9)"
  if (testDataRowNumber == 11) return "ADBMobile Debug: Analytics - Request Queued (ndh=1&ce=UTF-8&c.&a.&DayOfWeek=3&CarrierName=Android&LaunchEvent=LaunchEvent&ignoredSessionLength=0&HourOfDay=9&DaysSinceFirstUse=182&internalaction=Lifecycle&UpgradeEvent=UpgradeEvent&DaysSinceLastUse=182&MonthlyEngUserEvent=MonthlyEngUserEvent&AppID=Champs%20Sports%203.7.5.debug%20%284006501%29&RunMode=Application&Launches=6&OSVersion=Android%208.1.0&DailyEngUserEvent=DailyEngUserEvent&Resolution=1440x2712&DeviceName=Android%20SDK%20built%20for%20x86&CrashEvent=CrashEvent&.a&.c&t=00%2F00%2F0000%2000%3A00%3A00%200%20300&pe=lnk_o&pev2=ADBINTERNAL%3ALifecycle&aamb=j8Odv6LonN4r3an7LhD3WZrU1bUpAkFkkiY1ncBR96t2PTI&mid=69334003984915663194972456892563206471&pageName=Champs%20Sports%203.7.5.debug%20%284006501%29&cp=foreground&aamlh=9)"

}

export function filterLogMessage(log: string): boolean {
  // return true to include message
  // return false to exclude message
  //console.log(log)

  var include = false
  if (log.tag.toLowerCase().match('ualib'))       include = true
  if (log.message.toLowerCase().match('airship')) include = true
  if (log.tag.toLowerCase().match('channel id'))  include = true

  if (log.tag.match('SurfaceFlinger'))  include = false
  if (log.tag.match('ActivityManager')) include = false
  if (log.tag.match('LeakCanary')) include = false

  return include;
}

export function findJSON(textString: string): string {
    console.log(textString)
    var firstOpen, firstClose, candidate;
    firstOpen = textString.indexOf('{', firstOpen + 1);
    do {
      firstClose = textString.lastIndexOf('}');
      console.log('firstOpen: ' + firstOpen, 'firstClose: ' + firstClose);
      if(firstClose <= firstOpen) {
          return null;
      }
      do {
          candidate = textString.substring(firstOpen, firstClose + 1);
          console.log('candidate: ' + candidate);
          try {
              var res = JSON.parse(candidate);
              console.log('...found');
              //return [res, firstOpen, firstClose + 1];
              return candidate;
          }
          catch(e) {
              console.log('...failed');
          }
          firstClose = textString.substr(0, firstClose).lastIndexOf('}');
      } while(firstClose > firstOpen);
      firstOpen = textString.indexOf('{', firstOpen + 1);
    } while(firstOpen != -1);
    return null;
}
