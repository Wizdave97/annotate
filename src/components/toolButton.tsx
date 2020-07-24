import React from 'react';
type PropTypes = {
    name: string
    label: string
    active: string | null
    clickHandler: (name: string) => (e:React.MouseEvent) => void
}
const toolButton: React.FC<PropTypes> = (props) => {
    const { clickHandler, label, name} = props
    return (
        <div role="button" className={`rounded-md overflow-hidden 
        w-10 h-10  mb-1 flex justify-center items-center 
        hover:bg-gray-300 ${props.active === props.name ? 'shadow-inner' : ''}`}
        onClick={clickHandler(name)} aria-label={label}>
            {props.children}
        </div>
    )
}

export default toolButton