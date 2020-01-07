export const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}
export const isBackgroundToDark=(hexColor)=>{
    const rgb = hexToRgb(hexColor) 
    const darken = Math.round(((rgb.r * 299) +
    (rgb.g * 587) +
    (rgb.b * 114)) / 1000);
    return darken > 125
}
  