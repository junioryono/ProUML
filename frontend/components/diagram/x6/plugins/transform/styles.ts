export const content = `

.x6-widget-transform {
    position: absolute;
    box-sizing: content-box !important;
    margin: -4px 0 0 -4px;
    padding: 4px;
    user-select: none;
    pointer-events: none;
}

.x6-widget-transform > div {
    position: absolute;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #000;
    transition: background-color 0.2s;
    pointer-events: auto;
    -webkit-user-drag: none;
    user-drag: none;
}

.x6-widget-transform > div:hover {
    background-color: #d3d3d3;
}

.x6-widget-transform-cursor-n {
    cursor: n-resize;
}

.x6-widget-transform-cursor-s {
    cursor: s-resize;
}

.x6-widget-transform-cursor-e {
    cursor: e-resize;
}

.x6-widget-transform-cursor-w {
    cursor: w-resize;
}

.x6-widget-transform-cursor-ne {
    cursor: ne-resize;
}

.x6-widget-transform-cursor-nw {
    cursor: nw-resize;
}

.x6-widget-transform-cursor-se {
    cursor: se-resize;
}

.x6-widget-transform-cursor-sw {
    cursor: sw-resize;
}

.x6-widget-transform-resize {
    width: 10px;
    height: 10px;
    border-radius: 6px;
}

.x6-widget-transform-resize[data-position='top-left'] {
    top: -2px;
    left: -2px;
}

.x6-widget-transform-resize[data-position='top-right'] {
    top: -2px;
    right: -2px;
}

.x6-widget-transform-resize[data-position='bottom-left'] {
    bottom: -2px;
    left: -2px;
}

.x6-widget-transform-resize[data-position='bottom-right'] {
    right: -2px;
    bottom: -2px;
}

.x6-widget-transform-resize[data-position='top'] {
    top: -2px;
    left: 50%;
    margin-left: -5px;
}

.x6-widget-transform-resize[data-position='bottom'] {
    bottom: -2px;
    left: 50%;
    margin-left: -5px;
}

.x6-widget-transform-resize[data-position='left'] {
    top: 50%;
    left: -2px;
    margin-top: -5px;
}

.x6-widget-transform-resize[data-position='right'] {
    top: 50%;
    right: -2px;
    margin-top: -5px;
}

.x6-widget-transform.prevent-aspect-ratio .x6-widget-transform-resize[data-position='top'], .x6-widget-transform.prevent-aspect-ratio .x6-widget-transform-resize[data-position='bottom'], .x6-widget-transform.prevent-aspect-ratio .x6-widget-transform-resize[data-position='left'], .x6-widget-transform.prevent-aspect-ratio .x6-widget-transform-resize[data-position='right'] {
    display: none;
}

.x6-widget-transform.no-orth-resize .x6-widget-transform-resize[data-position='bottom'], .x6-widget-transform.no-orth-resize .x6-widget-transform-resize[data-position='left'], .x6-widget-transform.no-orth-resize .x6-widget-transform-resize[data-position='right'], .x6-widget-transform.no-orth-resize .x6-widget-transform-resize[data-position='top'] {
    display: none;
}

.x6-widget-transform.no-resize .x6-widget-transform-resize {
    display: none;
}

.x6-widget-transform-rotate {
    top: -20px;
    left: -20px;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    cursor: crosshair;
}

.x6-widget-transform.no-rotate .x6-widget-transform-rotate {
    display: none;
}

.x6-widget-transform-active {
    border-color: transparent;
    pointer-events: all;
}

.x6-widget-transform-active > div {
    display: none;
}

.x6-widget-transform-active > .x6-widget-transform-active-handle {
    display: block;
    background-color: #808080;
}

`;
