import React, { useState, useEffect, useCallback, useRef } from "react";
import SquareButton from "../SquareButton/SquareButton";
import { Stage, Layer } from "react-konva";
import RectangleROI from "../AllShapes/RectangleROI/RectangleROI";
import LineROI from "../AllShapes/LineROI/LineROI";
import CircleROI from "../AllShapes/CircleROI/CircleROI";
import classes from "./VisionPanel.module.css";
import { v4 as uuidv4 } from "uuid";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

function VisionPanel() {
  const orignImgRef = useRef();
  const cropImgRef = useRef();
  const canvasRef = useRef();
  const [image, setImage] = useState(null);
  const [cropimage, setcropimage] = useState(null);
  const [count, setCount] = useState(0);
  const [shapes, setshapes] = useState([]);
  const [selectID, setSelectID] = useState(null);
  const [cropAttr, setcropAttr] = useState({});

  useEffect(() => {
    const onGetImage = (event, data) => {
      setImage(data.image);
      setCount(data.count);
    };
    ipcRenderer.on("reply_image", onGetImage);
    return () => {
      ipcRenderer.removeListener("reply_image", onGetImage);
    };
  }, [image]);

  const snap = () => {
    ipcRenderer.send("snap");
  };
  const grab = () => {
    ipcRenderer.send("grab");
  };
  const grabStop = () => {
    ipcRenderer.send("grabStop");
  };
  const clickHandler = useCallback(
    (label) => {
      const curShapes = [...shapes];
      let s = null;
      switch (label) {
        case "rect":
          s = {
            x: 10,
            y: 10,
            width: 100,
            height: 100,
            rotation: 0,
            fill: "transparent",
            stroke: "rgb(8, 223, 8)",
            id: uuidv4(),
            type: label,
          };
          break;

        case "line":
          s = {
            x: 10,
            y: 10,
            width: 100,
            height: 100,
            points: [10, 10, 100, 100],
            rotation: 0,
            fill: "transparent",
            stroke: "rgb(8, 223, 8)",
            id: uuidv4(),
            type: label,
            strokeWidth: 3,
          };
          break;

        case "circle":
          s = {
            x: 45,
            y: 45,
            width: 100,
            height: 100,
            radius: 45,
            strokeWidth: 3,
            rotation: 0,
            fill: "transparent",
            stroke: "rgb(8, 223, 8)",
            id: uuidv4(),
            type: label,
          };
          break;
        default:
          break;
      }
      if (s !== null) {
        curShapes.push(s);
        setshapes(curShapes);
      }
    },
    [shapes]
  );

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectID(null);
    }
  };

  const cropImageOnLoad = useCallback(
    (attr) => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(
        orignImgRef.current,
        attr.x,
        attr.y,
        attr.width,
        attr.height,
        0,
        0,
        attr.width,
        attr.height
      );
    },
    [canvasRef]
  );

  const crop = useCallback(
    (attr) => {
      cropImageOnLoad(attr);
      setcropimage(image);
      setcropAttr({ ...attr });
    },
    [image, cropImageOnLoad]
  );

  return (
    <div className={classes.VisionPanel}>
      <div className={classes.Buttons}>
        <button className={classes.Button} type="button" onClick={grab}>
          Grab
        </button>
        <button className={classes.Button} type="button" onClick={snap}>
          Snap
        </button>
        <button className={classes.Button} type="button" onClick={grabStop}>
          Stop
        </button>
      </div>
      <div className={classes.shpaeButtons}>
        <SquareButton label="line" clicked={clickHandler} />
        <SquareButton label="rect" clicked={clickHandler} />
        <SquareButton label="circle" clicked={clickHandler} />
      </div>
      <div className={classes.drawContainer}>
        <Stage
          className={classes.roiContainer}
          width={800}
          height={800}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            {shapes.map((shape, i) => {
              let s = null;
              switch (shape.type) {
                case "rect":
                  s = (
                    <RectangleROI
                      key={i}
                      shapeProps={shape}
                      isSelected={shape.id === selectID}
                      onSelect={() => {
                        setSelectID(shape.id);
                      }}
                      onChange={(newAttrs) => {
                        const rects = shapes.slice();
                        rects[i] = newAttrs;
                        setshapes(rects);
                        crop(newAttrs);
                      }}
                    />
                  );
                  break;
                case "line":
                  s = (
                    <LineROI
                      key={i}
                      shapeProps={shape}
                      isSelected={shape.id === selectID}
                      onSelect={() => {
                        setSelectID(shape.id);
                      }}
                      onChange={(newAttrs) => {
                        const rects = shapes.slice();
                        rects[i] = newAttrs;
                        setshapes(rects);
                      }}
                    />
                  );
                  break;
                case "circle":
                  s = (
                    <CircleROI
                      key={i}
                      shapeProps={shape}
                      isSelected={shape.id === selectID}
                      onSelect={() => {
                        setSelectID(shape.id);
                      }}
                      onChange={(newAttrs) => {
                        const rects = shapes.slice();
                        rects[i] = newAttrs;
                        setshapes(rects);
                        crop(newAttrs);
                      }}
                    />
                  );
                  break;
                default:
                  break;
              }
              return s;
            })}
          </Layer>
        </Stage>
        <div className={classes.imgContainer}>
          <img
            ref={orignImgRef}
            src={`data:image/jpeg;base64,${image}`}
            alt="myimg"
          />
        </div>
        <div className={classes.imgCropContainer}>
          <canvas ref={canvasRef} width={800} height={800} />
        </div>
        <h4>{count}</h4>
        <img
          ref={cropImgRef}
          src={`data:image/jpeg;base64,${cropimage}`}
          alt="mycropimg"
          style={{ display: "none" }}
          onLoad={cropImageOnLoad}
        />
      </div>
    </div>
  );
}

export default VisionPanel;
