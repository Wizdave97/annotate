import React, { useState, useRef } from 'react';
import Select, { EventType } from './select';

type PropTypes = {
    addLocalFile: (file: File) => any
    browseMondayFiles: () => any
    switchCanvasSize:(e: React.MouseEvent) => any
    deleteSelection: () => any
}

const Menubar: React.FC<PropTypes> = (props) => {
    const imagePickerRef = useRef(null);
    const canvasDimensionRef = useRef(null);
    const [filePickerToggle, setFilePickerToggle] = useState(false);
    const [canvasPicker, setCanvasPicker] = useState(false);
    const options = [
        {name: "From Device", value:"local", ext:"image/*", eventType: EventType.Change, handler: props.addLocalFile},
        {name: "From Monday", value:"monday", eventType: EventType.Click, handler: props.browseMondayFiles}
    ]
    const canvasOptions = [
        {name: "640 * 480", value:"xs", eventType: EventType.Click, handler: props.switchCanvasSize},
        {name: "800 * 600", value:"sm", eventType: EventType.Click, handler: props.switchCanvasSize},
        {name: "1024 * 768", value:"md", eventType: EventType.Click, handler: props.switchCanvasSize},
        {name: "1280 * 720", value:"lg", eventType: EventType.Click, handler: props.switchCanvasSize}
    ]
    return (
        <div className="h-16 w-full fixed pl-4 pr-4 flex flex-row justify-between items-center flex-no-wrap top-0 bg-white shadow-md z-20">
            <div className="flex flex-row flex-grow justify-start items-center">
                <span role="button" ref={imagePickerRef} onClick={() => setFilePickerToggle(!filePickerToggle)} className="p-2 bg-gray-200 rounded-md mx-2 cursor-pointer text-sm hover:bg-gray-300">Add Image</span>
                <Select options={options} toggleIsOpen={setFilePickerToggle} isOpen={filePickerToggle} anchorEl={imagePickerRef}/>
                <span role="button" ref={canvasDimensionRef} onClick={() => setCanvasPicker(!canvasPicker)} className="p-2 bg-gray-200 rounded-md cursor-pointer text-sm hover:bg-gray-300">Canvas Size</span>
                <Select options={canvasOptions} toggleIsOpen={setCanvasPicker} isOpen={canvasPicker} anchorEl={canvasDimensionRef}/>
                <span role="button" onClick={props.deleteSelection}  className="p-2 bg-gray-200 mx-2 rounded-md cursor-pointer hover:bg-gray-300" aria-label="delete selection">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20"><path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"/></svg>
                </span>
            </div>
            <div>
                <div>
                    <span role="button" className="rounded-l-md p-2 h-8  text-center bg-indigo-700 text-lg font-semibold hover:bg-indigo-900 text-gray-100">Documents</span>
                    <span role="button" className="rounded-r-md p-2 h-8  text-center bg-indigo-700 text-lg font-semibold hover:bg-indigo-900 text-gray-100">Images</span>
                </div>
            </div>
        </div>
    )
}

export default Menubar
