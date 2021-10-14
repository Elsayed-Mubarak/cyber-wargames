
// if the request is not far 60 minute from the lastSpan

const Milli = {
    second: 1000,
    minute: 60000,
    hour: 3600000,
    day: 86400000,
    month: 2592000000,
    year: 31104000000
  };
  
  // cb accepts unite
  function throughTime (t, v, cb) {
    let k;
    switch (t) {
      case 'second':
      case 'seconds':
        k = cb(v, Milli.second);
        break;
      case 'minute':
      case 'minutes':
        k = cb(v, Milli.minute);
        break;
      case 'hour':
      case 'hours':
        k = cb(v, Milli.hour);
        break;
      case 'day':
      case 'days':
        k = cb(v, Milli.day);
        break;
      case 'month':
      case 'months':
        k = cb(v, Milli.month);
        break;
      case 'year':
      case 'years':
        k = cb(v, Milli.year);
        break;
      default:
        return false;
    }
    return k;
  }
  
  module.exports = {
  
    // return different in x-format
    // dif('days', dateObj1, dateObj2);
    difIn (t, d1, d2) {
  
      d1 = Date.parse(d1);
      d2 = Date.parse(d2);
  
      let dif = d1 - d2;
      if (dif < 0)dif *= -1;
  
      dif = throughTime(t, dif, function (dif, unit) {
        return dif / unit;
      });
  
      return dif.toFixed(3);
  
    },
  
    // v : verb -> add/remove
    // n : number -> 1/2/3
    // t : time -> 'minutes/hours/day'
    // d : date -> dateObject
    // add or remove (v) specific number (n)  of (t = minutes/hours/days) to date (d = dateObject)
    cal (v, n, t, d) {
      let c = 0;
  
      c = throughTime(t, n, function (n, unit) {
        return n * unit;
      });
  
      // console.log(`${v} ${n} ${t} to ${d}`);
      // console.log(`${n} ${t} to milliseconds = ${c}`);
  
      switch (v) {
        case 'add':
          d.setTime(d.getTime() + c);
          break;
        case 'remove':
          d.setTime(d.getTime() - c);
          break;
        default:
          return false;
      }
  
      return d;
    },
    // convert date to (t = minutes/hours/days)
    to (t, d) {
      const n = Date.parse(d);
      return throughTime(t, n, function (n, unit) {
        return n * unit;
      });
    }
  };