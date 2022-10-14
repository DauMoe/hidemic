const RangeValues = (item) => {
  let value = new Number(item[1])
  let normalLevel = new String(item[3])

  if (normalLevel == null ||
      normalLevel == undefined ||
      normalLevel === "" ||
      normalLevel.toLocaleUpperCase().includes("ÂM") ||
      normalLevel.toLocaleUpperCase().includes("AM") ||
      normalLevel.toLocaleUpperCase().includes("NEG")
  ) {
      if (value == null ||
          value == undefined ||
          value === "" ||
          value.toString().toLocaleUpperCase().includes("ÂM") ||
          value.toString().toLocaleUpperCase().includes("AM") ||
          value.toString().toLocaleUpperCase().includes("NEG") ||
          value.toString().toLocaleUpperCase().includes("NORM")
      ) {
          return 'N';
      }
      else {
          return 'H';
      }
      return 'N'
  }

  if (normalLevel.includes('-')) {
      let arrstr = null;
      arrstr = normalLevel.split('-');
      let min = Number(arrstr[0]);
      let max = Number(arrstr[1]);
      if (value < min) {
          return 'L'
      }
      if (value > max) {
          return 'H'
      }
  } else if (normalLevel.includes('<=')) {
      let max = Number(normalLevel.replace('<=', '').trim())
      if (value <= max) {
          return 'N'
      }
      return 'H'
  } else if (normalLevel.includes('>=')) {
      let min = Number(normalLevel.replace('>=', '').trim())
      if (value >= min) {
          return 'N'
      }
      return 'L'
  } else if (normalLevel.includes('<')) {
      let max = Number(normalLevel.replace('<', '').trim())
      if (value < max) {
          return 'N'
      }
      return 'H'
  } else if (normalLevel.includes('>')) {
      let min = Number(normalLevel.replace('>', '').trim())
      if (value > min) {
          return 'N'
      }
      return 'L'
  }

  return 'N'

}

export default RangeValues