import React from "react";
import { fabric } from 'fabric';
import Toolbar from "./components/toolbar";
import Menubar from "./components/menubar";
import FloatingToolbar from "./components/floatingToolbar";
import Dialog from './components/dialog';
import { connect, IState } from './store/reducer/reducer';
import * as actions from './store/actions';
import mondaySdk from "monday-sdk-js";
import io from 'socket.io-client';
const monday = mondaySdk();
type AppProps = {
  active?: string
  setActiveTool?: (name: string) => {}
}
type AppState = {
  socket: SocketIOClient.Socket | null
  [key: string]: any
  canvas: null | fabric.Canvas
  settings: { [key: string]: any }
  startPos: null | fabric.Point
  endPos: null | fabric.Point
  newObj: fabric.Object | null
  fill: string
  strokeWidth: number
  fontStyle: "" | "normal" | "italic" | "oblique"
  fontWeight: number 
  stroke: string
  font: number
  userId: number | null
  accountId: number | null,
  sessionType: Session | null
  sessionId: string | null
}
interface Extra {
  pointType: string
  line: fabric.Line
  arrow: fabric.Triangle
  circle: fabric.Circle
  customType: string
}

const shapes = {
  Rect: 'Rect',
  Circle: 'Circle',
  Line: 'Line',
  Pointer: 'Pointer',
  Textbox: 'Textbox',
  Triangle: 'Triangle',
  Arrow: 'Arrow'
}
export enum Session {
  Private = 1,
  Collaborative,
  Active
}
const socket = io('http://localhost:4000');
class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    // Default state
    this.state = {
      sessionId: null,
      socket: null,
      sessionType: null,
      canvas: null,
      settings: {},
      startPos: null,
      endPos: null,
      newObj: null,
      fill: "white",
      strokeWidth: 1,
      fontStyle: "normal",
      fontWeight: 400,
      stroke: "black",
      font: 16,
      userId: null,
      accountId: null
    };
  }

  componentDidMount() {
    this.setState({socket: socket})
    monday.api(`
    query {
      me {
        id
        account {
          id
        }
      }
    }`).then((res: any) => {
      if(res && res.data) {
        this.setState({userId: res.data.me.id, accountId: res.data.me.account.id})
      }
    }).catch((err: any) => {
      console.log(err)
    })
    // TODO: set up event listeners
    const canvas = new fabric.Canvas('c', {
      containerClass: "bg-white"
    });
    canvas.defaultCursor = "crosshair";
    canvas.setWidth(800);
    canvas.setHeight(600);
    canvas.on("mouse:down", this.mouseDownHandler)
    canvas.on("mouse:move", this.mouseMoveHandler)
    canvas.on("mouse:up", (e: fabric.IEvent) => {
      this.setState({ startPos: null, newObj: null })
    })

    // canvas.on("object:moving", (e: fabric.IEvent) => {
    //   const target = e.target!;
    //   const angle = target.get('angle');
    //   const angle_2 = 180 - ((180 - angle! - 90) + 90);

    //   let modified = false, height = (Math.cos(((2 * Math.PI) / 360) * angle!) * target.getScaledHeight()!) , left = target.left!,
    //     canvasHeight = canvas.height!, canvasWidth = canvas.width!, top = target?.top!,
    //     width =  (Math.sin(((2 * Math.PI) / 360) * angle!) * target.getScaledHeight()!) + (Math.cos(((2 * Math.PI) / 360) * angle_2!) * target.getScaledWidth()!)
    //   console.log(width)
    //   console.log(target.getBoundingRect())
    //   if (top < 0) {
    //     top = 0;
    //     modified = true
    //   }
    //   if ((top + height) > canvasHeight) {
    //     top = canvasHeight - Math.abs(height);
    //     modified = true
    //   }
    //   if (left < 0) {
    //     left = 0;
    //     modified = true;
    //   }
    //   if ((left + width) > canvasWidth) {
    //     left = canvasWidth - Math.abs(width);
    //     modified = true;
    //   }
    //   if (modified) {
    //     target.setPositionByOrigin(new fabric.Point(left, top), "left", "top");
    //   }

    // })
    this.setState({ canvas })
  }
  
  componentDidUpdate(prevProps: any, prevState: AppState) {
    const { socket } = this.state;
    if(prevState.sessionType !== this.state.sessionType) {
      switch(this.state.sessionType) {
        case Session.Collaborative:
          if(socket) {
            socket.emit("create", {sessionId: this.state.sessionId}) 
          }
          break;
        case Session.Active:
          if(socket) {
            socket.emit("join", {sessionId: this.state.sessionId})
          }
          break;
      }
    }
  }
  changeSessionType = (type: Session, id: string | null) => {
    this.setState({sessionType: type, sessionId: id})
  }
  mouseDownHandler = (e: fabric.IEvent) => {
    if (e.target) {
      this.setState({ startPos: null, newObj: null })
      this.props.setActiveTool!(shapes.Pointer);
      return;
    }
    if (this.props.active && (this.props.active !== shapes.Pointer)) {
      let obj: fabric.Object;
      const { fill, stroke, fontStyle, font, strokeWidth} = this.state
      switch (this.props.active) {
        case shapes.Arrow:
          obj = this.createArrow();
          break;
        case shapes.Rect:
          obj = new fabric.Rect({
            stroke: stroke,
            strokeWidth: strokeWidth,
            fill: fill,
            width: 60,
            height: 60
          });
          break;
        case shapes.Triangle:
          obj = new fabric.Triangle({
            width: 20,
            height: 30,
            stroke: stroke,
            strokeWidth: strokeWidth,
            fill: fill,
          });
          break;
        case shapes.Line:
          obj = new fabric.Line([100, 100, 300, 300], {
            stroke: stroke,
            strokeWidth: strokeWidth,
          });
          break;
        case shapes.Textbox:
          obj = new fabric.Textbox("Click to add text", {
            stroke: stroke,
            cursorColor: "black",
            cursorWidth: 1.5,
            fontFamily: "Comic sans",
            fontSize: font,
            fontStyle: fontStyle,
            fontWeight: "normal"
          })
          break;
        case shapes.Circle:
          obj = new fabric.Circle({
            radius: 20,
            stroke: stroke,
            strokeWidth: strokeWidth,
            fill: fill,
          });
          break;
      }
      this.setState({ startPos: e.pointer! as fabric.Point, newObj: obj! as fabric.Object })
    }
  }
  mouseMoveHandler = (e: fabric.IEvent) => {
    if (!this.state.startPos && !this.state.newObj) return
    if (this.state.newObj) {
      this.state.canvas?.remove(this.state.newObj);
      this.state.newObj.setPositionByOrigin(this.state.startPos! as fabric.Point, 'left', 'top');
      this.state.newObj.scaleToHeight(e.pointer?.y! as number - (this.state.startPos! as fabric.Point).y, true);
      this.state.canvas?.add(this.state.newObj);
    }
  }
  createArrow = () => {
    const {stroke} = this.state
    const line = new fabric.Line([50, 50, 100, 100], {
      stroke: stroke,
      selectable: true,
      strokeWidth: 2,
      padding: 5,
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      lockScalingX: true,
      lockScalingY: true
    }! as fabric.Line & Extra)! as fabric.Line & Extra;

    const centerX = (line.x1! + line.x2!) / 2,
      centerY = (line.y1! + line.y2!) / 2;
    const deltaX = line.left! - centerX, deltaY = line.top! - centerY;

    const arrow = new fabric.Triangle({
      left: line.get('x1')! + deltaX,
      top: line.get('y1')! + deltaY,
      originX: 'center',
      originY: 'center',
      hasBorders: false,
      hasControls: false,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      pointType: 'arrow_start',
      angle: -45,
      width: 20,
      height: 20,
      stroke: stroke,
      fill: "black"
    }! as fabric.Triangle & Extra)! as fabric.Triangle & Extra;
    const group = new fabric.Group([line, arrow])
    return group;
  }
  addLocalFile = (file: File) => {
    const self = this;
    if (file && file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        self.state.canvas?.add(new fabric.Image(img, {
          left: 100,
          top: 100
        }))
      }
      

    }
  }
  browseMondayFiles = () => {

  }
  setProperty = (key: keyof AppState, value: string | number) => {
    if (key in this.state){
      this.setState({[key]: value})
    }
    const objs = this.state.canvas?.getActiveObjects();
    if(objs && objs.length > 0) {
      objs.map((obj: fabric.Object) => {
        switch(key) {
          case 'font':
            if(obj instanceof fabric.Textbox){
              obj.set("fontSize", value as number)
            }
            break;
          case 'stroke':
            obj.set("stroke", value as string)
            break;
          case 'strokeWidth':
            obj.set("strokeWidth", value as number);
            break;
          case 'fill':
            obj.set("fill", value as string)
            break;
          case 'fontStyle':
            if(obj instanceof fabric.Textbox){
              obj.set("fontStyle", value as "");
            }
            break;
          case 'fontWeight':
            if(obj instanceof fabric.Textbox){
              obj.set("fontWeight", value)
            }
            break;
        }
        this.state.canvas?.renderAll();
        this.state.canvas?.setActiveObject(obj);
        return obj;
      })
    }
  } 
  deleteSelection = () => {
    const obj = this.state.canvas?.getActiveObjects();
    if(obj) this.state.canvas?.remove(...obj);
  }
  switchCanvasSize = (e: React.MouseEvent) => {
    const value = (e.target as HTMLInputElement).getAttribute("data-value")?.trim();
    switch(value) {
      case "xs":
        this.state.canvas?.setHeight(480);
        this.state.canvas?.setWidth(640);
        break;
      case "sm":
        this.state.canvas?.setHeight(600);
        this.state.canvas?.setWidth(800);
        break;
      case "md":
        this.state.canvas?.setHeight(768);
        this.state.canvas?.setWidth(1024);
        break;
      case "lg":
        this.state.canvas?.setHeight(720);
        this.state.canvas?.setWidth(1280);
        break;
    } 
  }
  createSessionId = () => {
    const id = `${Date.now()}${this.state.userId}${this.state.accountId}`;
    return id;
  }
  addSessionDataToCanvas = (annotations: string) => {
    const annotationArr = JSON.parse(annotations);
    this.state.canvas?.add(...annotationArr as fabric.Object[]);
  }
  loadAnnotation = (annotation: string) => {
    this.state.canvas?.loadFromJSON(annotation, () => {
      console.log("Canvas Loaded")
    })
  }
  render() {
    return (
      <React.Fragment>
        {this.state.sessionType? null : <Dialog loadSession={this.addSessionDataToCanvas} loadAnnotation={this.loadAnnotation} createSessionId={this.createSessionId} setSessionType={this.changeSessionType} accountId={this.state.accountId} userId={this.state.userId}/>}
        <Menubar addLocalFile={this.addLocalFile} deleteSelection={this.deleteSelection} browseMondayFiles={this.browseMondayFiles} switchCanvasSize={this.switchCanvasSize} />
        <Toolbar stroke={this.state.stroke} strokeWidth={this.state.strokeWidth}  canvas={this.state.canvas! as fabric.Canvas} />
        <div className="canvas-container bg-gray-800 relative top-16 left-16 flex justify-center">
          <canvas className="overflow-auto z-10" id="c"></canvas>
        </div>
        <FloatingToolbar
        setProperty={this.setProperty} 
        fontStyle={this.state.fontStyle} 
        font={this.state.font} 
        fontWeight={this.state.fontWeight}
        stroke={this.state.stroke}
        fill={this.state.fill}
        strokeWidth={this.state.strokeWidth} />
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state: IState) => ({
  active: state.active
})

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => ({
  setActiveTool: (name: string) => dispatch(actions.setActiveTool(name))
})
export default connect(mapStateToProps, mapDispatchToProps)(App);
