import React from 'react';

export function cutter(string, cutLength) {
  if (string.length < cutLength) {
    return string;
  }

  return string.substring(0, cutLength) + '..';
}

export function formatLabel(label, value) {
  if (!value) {
    return label;
  }
  return (<span>
    {label.split(value)
      .reduce((prev, current, i) => {
        if (!i) {
          return [current];
        }
        return prev.concat(<span className="match" key={value + current}>{value}</span>, current);
      }, [])
    }
  </span>);
}

export function defaultLabelName(labelName) {
  return labelName ? labelName : '새로운 Label';
}