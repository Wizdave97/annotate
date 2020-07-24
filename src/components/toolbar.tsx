import React from 'react';
import { fabric } from 'fabric';
import ToolButton from './toolButton';
import { connect, IState } from '../store/reducer/reducer';
import * as actions from '../store/actions';
type PropTypes = {
    canvas: fabric.Canvas
    active?: string | null
    strokeWidth: number,
    stroke: string,
    setActiveTool?: (name: string) => {}
}


const shapes = {
    Rect: 'Rect',
    Circle: 'Circle',
    Line: 'Line',
    Pointer: 'Pointer',
    Textbox: 'Textbox',
    Triangle: 'Triangle',
    PencilBrush: 'PencilBrush',
    Arrow: 'Arrow'
}



const Toolbar: React.FC<PropTypes> = (props) => {
    const { active } = props;
    const handleClick = (name: string) => (e: React.MouseEvent) => {
        props.setActiveTool!(name);
        if (name === shapes.PencilBrush) {
            props.canvas.isDrawingMode = true;
            props.canvas.freeDrawingBrush.color = props.stroke
            props.canvas.freeDrawingBrush.width = props.strokeWidth
            props.canvas.freeDrawingCursor = "pointer"
        }
        else {
            props.canvas.isDrawingMode = false;
            props.canvas.defaultCursor = "crosshair";
        }
    }
    return (
        <div className="w-16 fixed h-full flex flex-col overflow-y-auto justify-center items-center content-center shadow-md top-0 pt-20 left-0 z-10 bg-white" >
            <ToolButton active={active!} label="pointer" name={shapes.Pointer} clickHandler={handleClick}>
                <svg version="1.0" viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" >
                    <path d="M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2" />
                </svg>
            </ToolButton>
            <ToolButton active={active!} label="pencil brush" name={shapes.PencilBrush} clickHandler={handleClick}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    viewBox="0 0 404.24 404.24" className="w-6 h-6" >
                    <g>
                        <g>
                            <path d="M402.216,0c-16.933,15.714-38.99,24.752-62.08,25.44h-4.48h-0.96c-19.52,0-29.92,35.28-33.04,52.24l22.4,22.4h4.88
			c18.981,0.355,37.259-7.177,50.48-20.8C395.416,62.24,402.936,35.6,402.216,0z"/>
                        </g>
                    </g>
                    <g>
                        <g>
                            <path d="M251.096,124.96C219.816,152,24.136,323.52,1.976,404.24c80-22.48,251.92-218.08,278.96-249.44L251.096,124.96z" />
                        </g>
                    </g>
                    <g>
                        <g>
                            <polygon points="290.136,83.04 252.376,109.28 296.616,153.52 322.856,115.76 		" />
                        </g>
                    </g>
                </svg>
            </ToolButton>
            <ToolButton active={active!} label="circle" name={shapes.Circle} clickHandler={handleClick}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    className="w-6 h-6" viewBox="0 0 612 612" style={{ stroke: "rgb(0,0,0)", strokeWidth: 2 }} >
                    <g>
                        <g id="record">
                            <g>
                                <path d="M306,0C136.992,0,0,136.992,0,306s136.992,306,306,306s306-137.012,306-306S475.008,0,306,0z M305.694,574.343
				c-148.046,0-268.056-119.875-268.056-267.75c0-147.875,120.009-267.75,268.056-267.75S573.75,158.718,573.75,306.593
				C573.75,454.468,453.74,574.343,305.694,574.343z"/>
                            </g>
                        </g>
                    </g>
                </svg>
            </ToolButton>
            <ToolButton active={active!} label="rectangle" name={shapes.Rect} clickHandler={handleClick}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    className="w-6 h-6" viewBox="0 0 58.152 58.152" style={{ stroke: "rgb(0,0,0)", strokeWidth: 2 }}
                >
                    <g>
                        <g>
                            <path d="M58.152,58.152H0V0h58.152V58.152z M3,55.152h52.152V3H3V55.152z" />
                        </g>
                    </g>
                </svg>
            </ToolButton>
            <ToolButton active={active!} label="triangle" name={shapes.Triangle} clickHandler={handleClick}>
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    className="w-6 h-6" viewBox="0 0 72.72 72.719" style={{ stroke: "rgb(0,0,0)", strokeWidth: 2 }}
                >
                    <g>
                        <g>
                            <path d="M72.72,65.686H0L36.36,7.034L72.72,65.686z M5.388,62.686h61.943L36.36,12.727L5.388,62.686z" />
                        </g>
                    </g>
                </svg>
            </ToolButton>
            <ToolButton active={active!} label="Line" name={shapes.Line} clickHandler={handleClick}>
                <svg className="w-6 h-6">
                    <line x1="0" y1="0" x2="32" y2="32" style={{ stroke: "rgb(0,0,0)", strokeWidth: 2 }} />
                </svg>
            </ToolButton>
            <ToolButton active={active!} label="Arrow" name={shapes.Arrow} clickHandler={handleClick}>
                <svg className="w-6 h-6" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    viewBox="0 0 512 512" style={{ transform: "rotate(-60deg)", strokeWidth: 2 }}  >
                    <g>
                        <g>
                            <path d="M506.134,241.843c-0.006-0.006-0.011-0.013-0.018-0.019l-104.504-104c-7.829-7.791-20.492-7.762-28.285,0.068
			c-7.792,7.829-7.762,20.492,0.067,28.284L443.558,236H20c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20h423.557
			l-70.162,69.824c-7.829,7.792-7.859,20.455-0.067,28.284c7.793,7.831,20.457,7.858,28.285,0.068l104.504-104
			c0.006-0.006,0.011-0.013,0.018-0.019C513.968,262.339,513.943,249.635,506.134,241.843z"/>
                        </g>
                    </g>
                </svg>
            </ToolButton>
            <ToolButton active={active!} label="Text box" name={shapes.Textbox} clickHandler={handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 128 128">
                    <g>
                        <path d="M126.25,36H1.75A1.749,1.749,0,0,0,0,37.753V90.247A1.749,1.749,0,0,0,1.75,92h124.5a1.749,1.749,0,0,0,1.75-1.75V37.753A1.749,1.749,0,0,0,126.25,36ZM124.5,88.5H3.5V39.5h121Z" />
                        <path d="M39.691,82.747H60.367a1.75,1.75,0,1,0,0-3.5H41.441V65.75H60.367a1.75,1.75,0,0,0,0-3.5H41.441v-13.5H60.367a1.75,1.75,0,1,0,0-3.5H39.691A1.75,1.75,0,0,0,37.941,47V81A1.75,1.75,0,0,0,39.691,82.747Z" />
                        <path d="M11.75,48.753h8.588V81a1.75,1.75,0,0,0,3.5,0V48.753h8.589a1.75,1.75,0,1,0,0-3.5H11.75a1.75,1.75,0,0,0,0,3.5Z" />
                        <path d="M95.573,48.753h8.589V81a1.75,1.75,0,0,0,3.5,0V48.753h8.588a1.75,1.75,0,0,0,0-3.5H95.573a1.75,1.75,0,0,0,0,3.5Z" />
                        <path d="M66.724,82.492a1.749,1.749,0,0,0,2.4-.586l8.843-14.539,8.842,14.539A1.75,1.75,0,0,0,89.8,80.088L80.019,64,89.8,47.912a1.75,1.75,0,0,0-2.991-1.818L77.971,60.633,69.128,46.094a1.75,1.75,0,0,0-2.99,1.818L75.923,64,66.138,80.088A1.749,1.749,0,0,0,66.724,82.492Z" /></g></svg>
            </ToolButton>

        </div >
    )
}
const mapStateToProps = (state: IState) => ({
    active: state.active
})

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
    setActiveTool: (name: string) => dispatch(actions.setActiveTool(name))
})
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
