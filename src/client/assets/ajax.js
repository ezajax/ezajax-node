var __ezajax=function(){var t=function(){return"XMLHttpRequest"in window?function(){return new XMLHttpRequest}:function(){return new ActiveXObject("Microsoft.XMLHTTP")}}(),e=function(t){var e="";for(var n in t)e+=n+"="+t[n]+"&";return e.slice(0,-1)},n=function(n){var r=this,a=t();r.url=n.url,r.type=n.type||"responseText",r.method=n.method||"GET",r.async=n.async||!0,r.data=n.data||{},r.complete=n.complete||function(){},r.success=n.success||function(){},r.error=n.error||function(t){alert(r.url+"->status:"+t+"error!")},r.abort=a.abort,r.setData=function(t){for(var e in t)r.data[e]=t[e]},r.send=function(){var t,n=e(r.data),o=!1,u=r.async,s=r.complete,c=r.method,i=r.type;"GET"===c&&(r.url+="?"+n,o=!0),a.open(c,r.url,u),o||(a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t=n),a.onreadystatechange=u?function(){4==a.readyState&&(s(),200==a.status?r.success(a[i]):r.error(a.status,a[i]))}:null,a.send(t),u||(s(),r.success(a[i]))},r.url&&r.send()};return function(t){return new n(t)}}();