import ReactDOM from "react-dom";

export default function getBoundingClientRect(element) {
    let rect = ReactDOM.findDOMNode(element).getBoundingClientRect();
    if (rect.x === undefined) {
        rect.x = rect.left;
    }
    if (rect.y === undefined) {
        rect.y = top;
    }
    return rect;
}