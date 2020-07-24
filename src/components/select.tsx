import React from 'react';
export enum EventType {
    Click,
    Change
}

type SelectPropTypes = {
    isOpen: boolean
    anchorEl: React.RefObject<HTMLElement>
    toggleIsOpen: (open: boolean) => void
    options: { name: string, value: string, ext?: string, eventType: EventType, handler: (arg?: any) =>{} }[]
}

const Select: React.FC<SelectPropTypes> = (props) => {
    const { options, isOpen } = props;
    const top = props.anchorEl.current?.offsetTop! + props.anchorEl.current?.offsetHeight!
    const left = props.anchorEl.current?.offsetLeft
    return (
        <React.Fragment>
            <ul
                style={{
                    top: top ? top : 0,
                    left: left ? left : 0
                }}
                className={`p-0 h-0 w-32 bg-white overflow-hidden absolute transition-all duration-150 z-40 flex flex-col ${isOpen ? `h-${String(16 * options.length)}` : ''}`}>
                {options.map((opt, index) => {
                    return (
                        <li className="w-full h-16 flex justify-center items-center hover:bg-gray-300" key={index.toString()}>
                            <label htmlFor={index.toString() + opt.name} onClick={() => props.toggleIsOpen(false)} className="relative w-full p-4 text-center text-sm font-bold cursor-pointer">
                                {opt.name}
                                <input accept={opt.ext} id={index.toString() + opt.name} className="w-0 h-0 p-0 top-0 left-0 absolute opacity-0  cursor-pointer" type={opt.eventType === EventType.Change ? "file" : "button"}
                                    onClick={opt.eventType === EventType.Click ? (e: React.MouseEvent<HTMLInputElement>) =>{
                                        e.persist();
                                        opt.handler(e);
                                    } : undefined}
                                    onChange={opt.eventType === EventType.Change ? (e: React.ChangeEvent<HTMLInputElement>) => {
                                        e.persist()
                                        opt.handler(e.target.files![0])
                                    } : undefined}
                                    data-value={opt.value} />
                            </label>
                        </li>
                    )
                })}
            </ul>

        </React.Fragment>
    )
}

export default Select;