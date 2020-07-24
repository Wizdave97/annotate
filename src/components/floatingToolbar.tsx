import React from 'react';

type ToolbarProps = {
    fontStyle: string
    fontWeight: number
    font: number
    stroke: string
    fill: string
    strokeWidth: number
    setProperty(key: string, value: string | number): any
}
const floatingToolBar: React.FC<ToolbarProps> = props => {
    
    return (
        <aside className="fixed top-16 bg-white  right-0 z-30 pt-4 shadow-xl w-24">
            <ul className="w-full overflow-y-auto flex flex-col">
                <li className="flex flex-col mb-2 p-2 border-b border-gray-500">
                    <label htmlFor="stroke-width" className="w-full text-xs font-semibold mb-2">Stroke Width</label>
                    <input type="number"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.persist();
                        props.setProperty(e.target.name, +e.target.value);
                    }}
                     value={props.strokeWidth} name="strokeWidth" id="stroke-width" min="1" max="20" className="w-full p-2 text-xs outline-none border border-gray-200"/>
                </li>
                <li className="flex flex-col mb-2 p-2 border-b border-gray-500">
                    <label htmlFor="fill" className="w-full text-xs font-semibold mb-2">Fill</label>
                    <input type="color" name="fill"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.persist();
                        props.setProperty(e.target.name, e.target.value);
                    }} 
                    value={props.fill} id="fill" className="h-6 w-6 text-xs rounded-sm outline-none border border-gray-200"/>
                </li>
                <li className="flex flex-col mb-2 p-2 border-b border-gray-500">
                    <label htmlFor="stroke" className="w-full  text-xs font-semibold mb-2">Stroke</label>
                    <input type="color" name="stroke" 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.persist();
                        props.setProperty(e.target.name, e.target.value);
                    }}
                    value={props.stroke} id="stroke" className="h-6 w-6 text-xs rounded-sm outline-none border border-gray-200"/>
                </li>
                <li className="flex flex-col mb-2 p-2 border-b border-gray-500">
                    <label htmlFor="font-style" className="w-full text-xs font-semibold mb-2">Font Style</label>
                    <select id="font-style"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        e.persist();
                        props.setProperty(e.target.name, e.target.value);
                    }}
                     value={props.fontStyle} name="fontStyle" className="w-full p-2 text-xs outline-none border border-gray-200">
                        <option value="normal" className="font-bold text-xs">normal</option>
                        <option value="italic" className="font-bold text-xs">italic</option>
                        <option value="oblique" className="font-bold text-xs">oblique</option>
                    </select>
                </li>
                <li className="flex flex-col mb-2 p-2 border-b border-gray-500">
                    <label htmlFor="font-weight" className="w-full text-xs font-semibold mb-2">Font Weight</label>
                    <select id="font-weight"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        e.persist();
                        props.setProperty(e.target.name, +e.target.value);
                    }}
                     value={props.fontWeight} name="fontWeight" className="w-full p-2 text-xs outline-none border border-gray-200">
                        <option value="200" className="font-bold text-xs">thin</option>
                        <option value="400" className="font-bold text-xs">normal</option>
                        <option value="600" className="font-bold text-xs">medium</option>
                        <option value="800" className="font-bold text-xs">bold</option>
                    </select>
                </li>
                <li className="flex flex-col mb-2 p-2 border-b border-gray-500">
                    <label htmlFor="font-size" className="w-full text-xs font-semibold mb-2">Font Size</label>
                    <input type="number" 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.persist();
                        props.setProperty(e.target.name, +e.target.value);
                    }}
                    name="font" value={props.font} id="font-size" min="10" max="24" className="w-full text-xs p-2 outline-none border border-gray-200"/>
                </li>
            </ul>
        </aside>
    )
}

export default floatingToolBar;