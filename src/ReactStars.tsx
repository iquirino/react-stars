import React, { useState, useEffect } from "react";

const parentStyles: React.CSSProperties = {
  overflow: "hidden",
  position: "relative",
};

const defaultStyles: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  cursor: "pointer",
  display: "block",
  float: "left",
};

const getHalfStarStyles = (color: string, uniqueness: string) => {
  return `
    .react-stars-${uniqueness}:before {
      position: absolute;
      overflow: hidden;
      display: block;
      z-index: 1;
      top: 0; left: 0;
      width: 50%;
      content: attr(data-forhalf);
      color: ${color};
  }`;
};

/** ReactStars component */
export interface ReactStarsProps {
  /** Class name */
  className?: string;
  /** Editable
   * @default true
   */
  edit?: boolean;
  /** Half
   * @default true
   */
  half?: boolean;
  /** Value
   * @default 0
   */
  value?: number;
  /** Count
   * @default 5
   */
  count?: number;
  /** Character
   * @default "★"
   */
  char?: string;
  /** Size
   * @default 15
   */
  size?: number;
  /** Color 1
   * @default "gray"
   */
  color1?: string;
  /** Color 2
   * @default "#ffd700
   */
  color2?: string;
  /** On change event */
  onChange?: (value: number) => void;
}

type StarState = {
  active: boolean;
};

export const ReactStars: React.FC<ReactStarsProps> = ({
  className,
  edit = true,
  half = true,
  value = 0,
  count = 5,
  char = "★",
  size = 15,
  color1 = "gray",
  color2 = "#ffd700",
  onChange = (value: number) => {},
}) => {
  const [uniqueness] = useState((Math.random() + "").replace(".", ""));
  const [currentValue, setCurrentValue] = useState(value);
  const [stars, setStars] = useState<StarState[]>([]);
  const [halfStar, setHalfStar] = useState({
    at: Math.floor(value),
    hidden: half && value % 1 < 0.5,
  });
  const [config, setConfig] = useState({
    count,
    size,
    char,
    color1,
    color2,
    half,
    edit,
  });

  useEffect(() => {
    setStars(getStars(currentValue));
  }, [currentValue, config]);

  useEffect(() => {
    setStars(getStars(value));
    setCurrentValue(value);
    setHalfStar({
      at: Math.floor(value),
      hidden: config.half && value % 1 < 0.5,
    });
    setConfig({
      count,
      size,
      char,
      color1,
      color2,
      half,
      edit,
    });
  }, [value, count, size, char, color1, color2, half, edit]);

  const isDecimal = (value: number) => value % 1 !== 0;

  const getRate = () => {
    let stars: number;
    if (config.half) {
      stars = Math.floor(currentValue);
    } else {
      stars = Math.round(currentValue);
    }
    return stars;
  };

  const getStars = (activeCount?: number) => {
    if (activeCount === undefined) {
      activeCount = getRate();
    }
    let stars: StarState[] = [];
    for (let i = 0; i < config.count; i++) {
      stars.push({
        active: i <= activeCount! - 1,
      });
    }
    return stars;
  };

  const mouseOver = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (!config.edit) return;
    let index = Number(event.currentTarget.getAttribute("data-index"));
    if (config.half) {
      const isAtHalf = moreThanHalf(event, config.size);
      setHalfStar({
        ...halfStar,
        hidden: isAtHalf,
        at: isAtHalf ? index + 1 : index,
      });
      index = isAtHalf ? index + 1 : index;
    } else {
      index = index + 1;
    }
    setStars(getStars(index));
  };

  const moreThanHalf = (
    event: React.MouseEvent<HTMLSpanElement>,
    size: number
  ) => {
    let { target } = event;
    var mouseAt =
      event.clientX - (target as HTMLElement).getBoundingClientRect().left;
    mouseAt = Math.round(Math.abs(mouseAt));
    return mouseAt > size / 2;
  };

  const mouseLeave = () => {
    if (!config.edit) return;
    if (config.half) {
      setHalfStar({
        ...halfStar,
        hidden: !isDecimal(currentValue),
        at: Math.floor(currentValue),
      });
    }
    setStars(getStars());
  };

  const clicked = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (!config.edit) return;
    let index = Number(event.currentTarget.getAttribute("data-index"));
    let value;
    if (config.half) {
      const isAtHalf = moreThanHalf(event, config.size);
      setHalfStar({
        ...halfStar,
        hidden: isAtHalf,
        at: isAtHalf ? index + 1 : index,
      });
      value = isAtHalf ? index : index + 0.5;
    } else {
      value = index = index + 1;
    }
    setCurrentValue(value);
    setStars(getStars(index));
    onChange && onChange(value);
  };

  const renderHalfStarStyleElement = () => {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: getHalfStarStyles(config.color2, uniqueness),
        }}
      ></style>
    );
  };

  const renderStars = () => {
    return stars.map((star, i) => {
      let starClass = "";
      if (config.half && !halfStar.hidden && halfStar.at === i) {
        starClass = `react-stars-${uniqueness}`;
      }
      const style = Object.assign({}, defaultStyles, {
        color: star.active ? config.color2 : config.color1,
        cursor: config.edit ? "pointer" : "default",
        fontSize: `${config.size}px`,
      });
      return (
        <span
          className={starClass}
          style={style}
          key={i}
          data-index={i}
          data-forhalf={config.char}
          onMouseOver={mouseOver}
          onMouseMove={mouseOver}
          onMouseLeave={mouseLeave}
          onClick={clicked}
        >
          {config.char}
        </span>
      );
    });
  };

  return (
    <div className={className} style={parentStyles}>
      {config.half ? renderHalfStarStyleElement() : ""}
      {renderStars()}
    </div>
  );
};
