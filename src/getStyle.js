export default function getStyle(ele, styleName="") {
    let style = null;

    if (window.getComputedStyle) {
        style = window.getComputedStyle(ele, null);
    } else {
        style = ele.currentStyle;
    }

    if(styleName && styleName.length>0){
        return style[styleName];
    }

    return style;
}